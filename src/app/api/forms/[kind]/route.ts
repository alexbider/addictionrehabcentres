import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { dbConfigured, getDb, schema } from '@/db';
import { formSchemas, type FormKind } from '@/server/schemas';
import { sendEmail, notifyAdmin } from '@/server/email';
import { rateLimit } from '@/server/ratelimit';
import { audit } from '@/server/audit';
import { hmac, sha256 } from '@/server/crypto';
import { currentUser } from '@/server/auth';
import { isJson, json, readJson, sameOrigin } from '@/server/request';
import { verifyTurnstile } from '@/server/turnstile';
import { getPageByRoute } from '@/lib/content';
import { getTherapist } from '@/server/therapists';
import { slugToRoute } from '@/lib/slug';

const UNAVAILABLE = { ok: false, error: 'This form is temporarily unavailable, so nothing was sent. Please call 1-855-885-4747.' };
const ip = (req: NextRequest) => (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
const fieldErrors = (e: { issues: { path: PropertyKey[]; message: string }[] }) => Object.fromEntries(e.issues.map((i) => [String(i.path[0] ?? 'form'), i.message]));

/** A real, published centre page for this slug (claims and callbacks must point at one). */
function centreFor(slug: string) {
  const page = getPageByRoute(slugToRoute(slug));
  return page?.page_type === 'centre' && page.centre ? page : null;
}

async function ensureCentre(slug: string) {
  const db = (await getDb())!;
  const page = centreFor(slug);
  if (!page) return null;
  const [row] = await db.select().from(schema.centres).where(eq(schema.centres.slug, slug)).limit(1);
  if (!row) await db.insert(schema.centres).values({ slug, name: page.centre!.name, source: 'static', status: 'published' }).onConflictDoNothing();
  return page;
}

/** E-mails a new callback request to the people who manage the centre (unless they switched "Email me new leads" off in their dashboard). */
async function notifyCentreOwners(slug: string, d: { name?: string; phone?: string; email?: string; message?: string; when?: unknown; setting?: unknown; substance?: unknown }) {
  try {
    const db = (await getDb())!;
    const rows = await db.select({ email: schema.users.email, ws: schema.providerWorkspaces.data }).from(schema.centreMembers)
      .innerJoin(schema.users, eq(schema.users.id, schema.centreMembers.userId))
      .leftJoin(schema.providerWorkspaces, eq(schema.providerWorkspaces.userId, schema.users.id))
      .where(eq(schema.centreMembers.centreSlug, slug));
    const name = getPageByRoute(slugToRoute(slug))?.centre?.name ?? slug;
    for (const r of rows) {
      const n = (r.ws as { notifs?: { email?: boolean } } | null)?.notifs;
      if (n && n.email === false) continue;
      const details = [d.setting, d.substance, d.when].filter(Boolean).join(' · ');
      await sendEmail(r.email, `New callback request for ${name}`, `${d.name ?? 'Someone'} asked ${name} to call them back.\n\nPhone: ${d.phone ?? ''}${d.email ? '\nEmail: ' + d.email : ''}${details ? '\nLooking for: ' + details : ''}\n\nOpen your dashboard to reply and track this lead: ${process.env.APP_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL || ''}/provider-dashboard/?view=leads`);
    }
  } catch (e) { console.error('[forms] owner notify', e); }
}

const thanks = (to: string, what: string) => sendEmail(to, `We received your ${what}`, `Thank you. We received your ${what} and will follow up by email or phone.\n\nIf this was not you, you can ignore this message.\n\nAddiction Rehab Centres Canada\n1-855-885-4747`);

/** Public forms. Nothing is reported as sent unless the database write succeeded. */
export async function POST(req: NextRequest, ctx: { params: Promise<{ kind: string }> }) {
  const { kind } = await ctx.params;
  if (!(kind in formSchemas)) return json({ ok: false }, 404);
  if (!sameOrigin(req) || !isJson(req)) return json({ ok: false, error: 'Request blocked.' }, 403);
  if (!dbConfigured()) return json(UNAVAILABLE, 503);
  const db = await getDb();
  if (!db) return json(UNAVAILABLE, 503);

  let body: unknown;
  try { body = await readJson(req, 128 * 1024); } catch { return json({ ok: false, error: 'That message is too large or invalid.' }, 400); }
  const parsed = formSchemas[kind as FormKind].safeParse(body);
  if (!parsed.success) return json({ ok: false, error: 'Please check the highlighted fields.', fields: fieldErrors(parsed.error) }, 400);
  const d = parsed.data as Record<string, unknown> & { email?: string; name?: string; phone?: string; message?: string; centreSlug?: string; sourcePath?: string; company_website?: string; turnstile?: string };
  if (d.company_website) return json({ ok: true }); // honeypot filled: a bot, silently dropped
  if (!(await verifyTurnstile(d.turnstile, ip(req)))) return json({ ok: false, error: 'Verification failed. Please try again.' }, 400);
  if (!(await rateLimit(`form:${kind}:ip:${ip(req)}`, 6, 600))) return json({ ok: false, error: 'Too many submissions. Please wait a few minutes or call 1-855-885-4747.' }, 429, { 'retry-after': '600' });

  const ipHash = hmac(ip(req)).slice(0, 24);
  const { company_website: _h, turnstile: _t, ...clean } = d;
  void _h; void _t;
  const user = await currentUser();

  try {
    if (kind === 'claim') {
      const page = await ensureCentre(d.centreSlug!);
      if (!page) return json({ ok: false, error: 'We could not find that centre.', fields: { centreSlug: 'Unknown centre' } }, 400);
      const [c] = await db.insert(schema.claims).values({ centreSlug: d.centreSlug!, userId: user?.id ?? null, claimantName: d.name!, email: d.email!, phone: d.phone || null, roleTitle: (d.roleTitle as string) || null, message: d.message || null }).returning({ id: schema.claims.id });
      await audit(user?.id ?? null, 'claim.submitted', 'claim', c.id, { centre: d.centreSlug });
      await notifyAdmin(`New claim: ${page.centre!.name}`, `${d.name} (${d.email}) asks to manage ${page.centre!.name}.\nReview it in the admin: /admin/claims/`);
      await thanks(d.email!, 'claim request');
      return json({ ok: true, id: c.id, message: 'Claim received. We will verify it and email you.' });
    }

    if (kind === 'centreOnboarding' || kind === 'therapistOnboarding') {
      const k = kind === 'centreOnboarding' ? 'centre' : 'therapist';
      const [s] = await db.insert(schema.onboardingSubmissions).values({ kind: k, userId: user?.id ?? null, email: d.email!, payload: d.payload as Record<string, unknown> }).returning({ id: schema.onboardingSubmissions.id });
      if (typeof d.invite === 'string' && d.invite) await db.update(schema.invites).set({ usedAt: new Date() }).where(eq(schema.invites.tokenHash, sha256(d.invite)));
      await audit(user?.id ?? null, 'onboarding.submitted', 'onboarding', s.id, { kind: k });
      await notifyAdmin(`New ${k} submission`, `${d.email} submitted a ${k} profile. Review it in the admin: /admin/onboarding/`);
      await thanks(d.email!, `${k} submission`);
      return json({ ok: true, id: s.id });
    }

    if (kind === 'enquiry') {
      const t = await getTherapist(d.therapistSlug as string);
      if (!t) return json({ ok: false, error: 'This profile is not available.' }, 404);
      const [l] = await db.insert(schema.leads).values({ type: 'enquiry', name: d.name ?? null, email: d.email ?? null, phone: d.phone || null, message: d.message ?? null, payload: { therapistSlug: t.slug }, sourcePath: d.sourcePath ?? null, ipHash }).returning({ id: schema.leads.id });
      // Delivered to the therapist's own e-mail address (never shown on the page); the lead row is the record if e-mail is not configured.
      if (t.data.email) await sendEmail(t.data.email, `New message from ${d.name} via Addiction Rehab Centres Canada`, `${d.name} (${d.email}${d.phone ? ', ' + d.phone : ''}) wrote:\n\n${d.message}\n\nReply to ${d.email}. Please do not share health information by e-mail.`);
      await notifyAdmin('Therapist enquiry', `Enquiry for ${t.slug} from ${d.email}. Open /admin/leads/`);
      await thanks(d.email!, 'message');
      return json({ ok: true, id: l.id });
    }

    if (kind === 'removal') {
      await db.insert(schema.removalRequests).values({ therapistSlug: d.therapistSlug as string, name: (d.name as string) || null, email: d.email!, reason: (d.reason as string) || null });
      await notifyAdmin('Therapist profile removal request', `${d.email} asks to remove the profile "${d.therapistSlug}".`);
      await thanks(d.email!, 'removal request');
      return json({ ok: true });
    }

    // contact / callback / promote / subscribe → leads
    if (kind === 'callback' && d.centreSlug && !(await ensureCentre(d.centreSlug))) return json({ ok: false, error: 'We could not find that centre.' }, 400);
    const [l] = await db.insert(schema.leads).values({ type: kind, centreSlug: d.centreSlug ?? null, name: d.name ?? null, email: d.email ?? null, phone: d.phone || null, message: d.message ?? null, payload: clean, sourcePath: d.sourcePath ?? null, ipHash }).returning({ id: schema.leads.id });
    if (kind === 'callback' && d.centreSlug) await notifyCentreOwners(d.centreSlug, d);
    await notifyAdmin(`New ${kind} request`, `${d.name ?? ''} ${d.email ?? ''} ${d.phone ?? ''}\n${d.message ?? ''}\nFrom: ${d.sourcePath ?? ''}\nOpen /admin/leads/`);
    if (d.email && kind !== 'subscribe') await thanks(d.email, kind === 'callback' ? 'callback request' : 'message');
    return json({ ok: true, id: l.id });
  } catch (e) {
    console.error('[forms]', kind, e);
    return json({ ok: false, error: 'Something went wrong and your request was not saved. Please try again or call 1-855-885-4747.' }, 500);
  }
}
