import { NextRequest } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { dbConfigured, requireDb, schema } from '@/db';
import { currentUser, normEmail } from '@/server/auth';
import { myCentres } from '@/server/dashboard';
import { isJson, json, readJson, sameOrigin } from '@/server/request';
import { rateLimit } from '@/server/ratelimit';
import { sendEmail } from '@/server/email';
import { audit } from '@/server/audit';
import { siteOrigin } from '@/server/site';
import { email as emailSchema } from '@/server/schemas';

/** A centre owner gives a colleague access to their centres. The access is recorded as an approved claim for that e-mail address,
 *  which the sign-in flow already turns into a membership once the colleague has an account with that confirmed address. */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req) || !isJson(req)) return json({ ok: false, error: 'Request blocked.' }, 403);
  if (!dbConfigured()) return json({ ok: false, error: 'Not available yet.' }, 503);
  const u = await currentUser();
  if (!u || u.role !== 'provider') return json({ ok: false, error: 'Only centre accounts can invite colleagues.' }, 401);
  if (!u.verified) return json({ ok: false, error: 'Confirm your email address first.' }, 403);
  if (!(await rateLimit(`team:${u.id}`, 10, 3600))) return json({ ok: false, error: 'Too many invitations. Try again later.' }, 429);
  let b: { email?: string };
  try { b = (await readJson(req, 4096)) as typeof b; } catch { return json({ ok: false, error: 'Invalid request.' }, 400); }
  const parsed = emailSchema.safeParse(b.email);
  if (!parsed.success) return json({ ok: false, error: 'Enter a valid email address.' }, 400);
  const to = normEmail(parsed.data);
  const centres = await myCentres(u.id);
  if (!centres.length) return json({ ok: false, error: 'You need an approved listing before inviting colleagues.' }, 400);
  const db = await requireDb();
  const [existing] = await db.select().from(schema.users).where(eq(schema.users.email, to)).limit(1);
  for (const c of centres) {
    const [dup] = await db.select({ id: schema.claims.id }).from(schema.claims).where(and(eq(schema.claims.centreSlug, c.slug), eq(schema.claims.email, to), eq(schema.claims.status, 'approved'))).limit(1);
    if (!dup) await db.insert(schema.claims).values({ centreSlug: c.slug, email: to, claimantName: to, status: 'approved', reviewedBy: u.id, reviewedAt: new Date(), reviewNote: `Invited by ${u.email}`, roleTitle: 'Team member', userId: existing?.id ?? null });
    if (existing?.emailVerifiedAt && existing.role === 'provider') await db.insert(schema.centreMembers).values({ userId: existing.id, centreSlug: c.slug, role: 'member' }).onConflictDoNothing();
  }
  const origin = siteOrigin(req);
  const names = centres.map((c) => c.name).join(', ');
  await sendEmail(to, `${u.name || u.email} invited you to manage ${names}`, `${u.name || u.email} gave you access to the provider dashboard for ${names} on Addiction Rehab Centres Canada.\n\n${existing ? `Sign in with this email address: ${origin}/login/` : `Create your account with this email address (choose "Treatment centre"): ${origin}/signup/`}\n\nIf you were not expecting this, you can ignore this message.`, undefined, u.email);
  await audit(u.id, 'team.invited', 'user', existing?.id ?? null, { email: to });
  return json({ ok: true, existing: !!existing });
}
