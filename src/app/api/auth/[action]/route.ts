import { NextRequest, NextResponse } from 'next/server';
import { and, eq, gt, isNull } from 'drizzle-orm';
import { dbConfigured, getDb, schema } from '@/db';
import { authSchemas } from '@/server/schemas';
import { hashPassword, randomToken, sha256, verifyPassword } from '@/server/crypto';
import { createSession, destroySession, normEmail, syncMemberships } from '@/server/auth';
import { sendEmail } from '@/server/email';
import { rateLimit } from '@/server/ratelimit';
import { audit } from '@/server/audit';
import { isJson, json, readJson, sameOrigin } from '@/server/request';
import { verifyTurnstile } from '@/server/turnstile';
import { siteOrigin } from '@/server/site';

const UNAVAILABLE = { ok: false, error: 'Accounts are temporarily unavailable. Please call 1-855-885-4747.' };
const GENERIC_LOGIN = { ok: false, error: 'Incorrect email or password.' };

const ip = (req: NextRequest) => (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
const fieldErrors = (e: { issues: { path: PropertyKey[]; message: string }[] }) => Object.fromEntries(e.issues.map((i) => [String(i.path[0] ?? 'form'), i.message]));

async function issueToken(userId: string, kind: 'verify' | 'reset', hours: number) {
  const db = (await getDb())!;
  const token = randomToken();
  await db.insert(schema.emailTokens).values({ userId, kind, tokenHash: sha256(token), expiresAt: new Date(Date.now() + hours * 36e5) });
  return token;
}

async function sendVerify(userId: string, email: string, name: string, origin: string) {
  const token = await issueToken(userId, 'verify', 48);
  const link = `${origin}/api/auth/verify?token=${token}`;
  await sendEmail(email, 'Confirm your email address', `Hi ${name || 'there'},\n\nConfirm your email address to finish setting up your Addiction Rehab Centres Canada account:\n${link}\n\nThe link works for 48 hours. If you did not create an account you can ignore this message.`);
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ action: string }> }) {
  const { action } = await ctx.params;
  if (action !== 'verify') return json({ ok: false }, 404);
  const db = await getDb();
  const token = req.nextUrl.searchParams.get('token') || '';
  const dest = (q: string) => NextResponse.redirect(new URL(`/login/?${q}`, siteOrigin(req)), 303);
  if (!db || token.length < 20) return dest('verify=invalid');
  const [t] = await db.select().from(schema.emailTokens).where(and(eq(schema.emailTokens.tokenHash, sha256(token)), eq(schema.emailTokens.kind, 'verify'), isNull(schema.emailTokens.usedAt), gt(schema.emailTokens.expiresAt, new Date()))).limit(1);
  if (!t) return dest('verify=invalid');
  await db.update(schema.emailTokens).set({ usedAt: new Date() }).where(eq(schema.emailTokens.id, t.id));
  await db.update(schema.users).set({ emailVerifiedAt: new Date() }).where(eq(schema.users.id, t.userId));
  await audit(t.userId, 'email.verified', 'user', t.userId);
  const [vu] = await db.select({ email: schema.users.email }).from(schema.users).where(eq(schema.users.id, t.userId)).limit(1);
  if (vu) await syncMemberships(t.userId, vu.email);
  return dest('verified=1');
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ action: string }> }) {
  const { action } = await ctx.params;
  if (!sameOrigin(req) || !isJson(req)) return json({ ok: false, error: 'Request blocked.' }, 403);
  if (!dbConfigured()) return json(UNAVAILABLE, 503);
  const db = await getDb();
  if (!db) return json(UNAVAILABLE, 503);
  let body: unknown;
  try { body = await readJson(req, 16 * 1024); } catch { return json({ ok: false, error: 'Invalid request.' }, 400); }

  if (action === 'logout') { await destroySession(); return json({ ok: true }); }

  const schemaFor = (authSchemas as Record<string, import('zod').ZodType>)[action];
  if (!schemaFor) return json({ ok: false }, 404);
  const parsed = schemaFor.safeParse(body);
  if (!parsed.success) return json({ ok: false, error: 'Please check the highlighted fields.', fields: fieldErrors(parsed.error) }, 400);
  const data = parsed.data as Record<string, string>;
  if (data.company_website) return json({ ok: true }); // honeypot: bots get a silent no-op
  if (!(await verifyTurnstile(data.turnstile, ip(req)))) return json({ ok: false, error: 'Verification failed. Please try again.' }, 400);

  if (!(await rateLimit(`auth:${action}:ip:${ip(req)}`, 20, 600))) return json({ ok: false, error: 'Too many attempts. Please wait a few minutes.' }, 429, { 'retry-after': '600' });
  if (data.email && !(await rateLimit(`auth:${action}:email:${normEmail(data.email)}`, 8, 600))) return json({ ok: false, error: 'Too many attempts. Please wait a few minutes.' }, 429, { 'retry-after': '600' });

  if (action === 'signup') {
    const email = normEmail(data.email);
    const [existing] = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, email)).limit(1);
    if (!existing) {
      const [u] = await db.insert(schema.users).values({ email, name: data.name, passwordHash: await hashPassword(data.password), role: (data.role as 'provider' | 'therapist') ?? 'provider' }).returning({ id: schema.users.id });
      await sendVerify(u.id, email, data.name, siteOrigin(req));
      await audit(u.id, 'user.signup', 'user', u.id, { role: data.role }, ip(req));
      await createSession(u.id); // signed in straight away; edits need the verified email
    }
    // same answer whether or not the address already had an account (no account enumeration)
    return json({ ok: true, message: 'Account created. Check your inbox to confirm your email address.' });
  }

  if (action === 'login') {
    const email = normEmail(data.email);
    const [u] = await db.select().from(schema.users).where(and(eq(schema.users.email, email), isNull(schema.users.disabledAt))).limit(1);
    const ok = u ? await verifyPassword(data.password, u.passwordHash) : (await verifyPassword(data.password, 'scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA==$' + 'A'.repeat(86) + '=='), false);
    if (!u || !ok) { await audit(null, 'login.failed', 'user', null, { email }, ip(req)); return json(GENERIC_LOGIN, 401); }
    await createSession(u.id);
    if (u.emailVerifiedAt) await syncMemberships(u.id, u.email);
    await audit(u.id, 'login', 'user', u.id, {}, ip(req));
    return json({ ok: true, role: u.role, verified: !!u.emailVerifiedAt, redirect: u.role === 'master_admin' ? '/admin/' : u.role === 'therapist' ? '/therapist-dashboard/' : '/provider-dashboard/' });
  }

  if (action === 'forgot') {
    const email = normEmail(data.email);
    const [u] = await db.select().from(schema.users).where(and(eq(schema.users.email, email), isNull(schema.users.disabledAt))).limit(1);
    if (u) {
      const token = await issueToken(u.id, 'reset', 2);
      await sendEmail(email, 'Reset your password', `Use this link to choose a new password (valid for 2 hours):\n${siteOrigin(req)}/reset-password/?token=${token}\n\nIf you did not ask for this, you can ignore this message.`);
    }
    return json({ ok: true, message: 'If an account exists for that email, a reset link is on its way.' });
  }

  if (action === 'reset') {
    const [t] = await db.select().from(schema.emailTokens).where(and(eq(schema.emailTokens.tokenHash, sha256(data.token)), eq(schema.emailTokens.kind, 'reset'), isNull(schema.emailTokens.usedAt), gt(schema.emailTokens.expiresAt, new Date()))).limit(1);
    if (!t) return json({ ok: false, error: 'This reset link is invalid or has expired.' }, 400);
    await db.update(schema.emailTokens).set({ usedAt: new Date() }).where(eq(schema.emailTokens.id, t.id));
    await db.update(schema.users).set({ passwordHash: await hashPassword(data.password), emailVerifiedAt: new Date() }).where(eq(schema.users.id, t.userId));
    await db.delete(schema.sessions).where(eq(schema.sessions.userId, t.userId)); // every other session is signed out
    await audit(t.userId, 'password.reset', 'user', t.userId, {}, ip(req));
    return json({ ok: true, message: 'Password updated. You can sign in now.' });
  }

  if (action === 'resend') {
    const [u] = await db.select().from(schema.users).where(and(eq(schema.users.email, normEmail(data.email)), isNull(schema.users.emailVerifiedAt))).limit(1);
    if (u) await sendVerify(u.id, u.email, u.name, siteOrigin(req));
    return json({ ok: true, message: 'If that address needs confirming, a new link is on its way.' });
  }
  return json({ ok: false }, 404);
}
