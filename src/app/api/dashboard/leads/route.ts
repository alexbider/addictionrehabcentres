import { NextRequest } from 'next/server';
import { and, eq, sql } from 'drizzle-orm';
import { dbConfigured, requireDb, schema } from '@/db';
import { currentUser } from '@/server/auth';
import { myCentres } from '@/server/dashboard';
import { isJson, json, readJson, sameOrigin } from '@/server/request';
import { rateLimit } from '@/server/ratelimit';
import { sendEmail } from '@/server/email';
import { audit } from '@/server/audit';
import { z } from 'zod';

const STAGES = ['new', 'contacted', 'booked', 'admitted', 'lost'] as const;
const body = z.discriminatedUnion('action', [
  z.object({ action: z.literal('stage'), id: z.string().uuid(), stage: z.enum(STAGES), why: z.string().max(200).optional() }),
  z.object({ action: z.literal('note'), id: z.string().uuid(), text: z.string().trim().min(1).max(2000) }),
  z.object({ action: z.literal('reply'), id: z.string().uuid(), text: z.string().trim().min(1).max(6000) }),
  z.object({ action: z.literal('book'), id: z.string().uuid(), label: z.string().max(200) }),
  z.object({ action: z.literal('create'), centreSlug: z.string().max(160).optional(), name: z.string().trim().min(1).max(120), phone: z.string().trim().max(40).optional(), email: z.string().trim().max(200).optional(), interest: z.string().trim().max(160).optional(), message: z.string().trim().max(3000).optional() }),
]);

type Tl = { k: string; t: string; at: number };

/** Lead actions from the provider / therapist dashboard. Every action is checked against the leads the user is allowed to see. */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req) || !isJson(req)) return json({ ok: false, error: 'Request blocked.' }, 403);
  if (!dbConfigured()) return json({ ok: false, error: 'The dashboard is not available yet.' }, 503);
  const u = await currentUser();
  if (!u || !['provider', 'therapist', 'master_admin'].includes(u.role)) return json({ ok: false, error: 'Please sign in again.' }, 401);
  if (!(await rateLimit(`leads:${u.id}`, 120, 600))) return json({ ok: false, error: 'Too many changes. Please wait a moment.' }, 429);
  let raw: unknown;
  try { raw = await readJson(req, 32 * 1024); } catch { return json({ ok: false, error: 'Invalid request.' }, 400); }
  const parsed = body.safeParse(raw);
  if (!parsed.success) return json({ ok: false, error: 'Please check what you entered.' }, 400);
  const b = parsed.data;
  const db = await requireDb();

  // which leads may this user touch?
  const slugs = u.role === 'therapist' ? [] : (await myCentres(u.id)).map((c) => c.slug);
  const [ther] = u.role === 'therapist' ? await db.select({ slug: schema.therapists.slug }).from(schema.therapists).where(eq(schema.therapists.userId, u.id)).limit(1) : [];

  if (b.action === 'create') {
    if (!u.verified) return json({ ok: false, error: 'Confirm your email address first.' }, 403);
    const centreSlug = u.role === 'therapist' ? null : (b.centreSlug && slugs.includes(b.centreSlug) ? b.centreSlug : slugs[0]);
    if (u.role !== 'therapist' && !centreSlug) return json({ ok: false, error: 'You need an approved listing before adding leads.' }, 400);
    if (u.role === 'therapist' && !ther) return json({ ok: false, error: 'Your profile is not set up yet.' }, 400);
    const [l] = await db.insert(schema.leads).values({ type: u.role === 'therapist' ? 'enquiry' : 'callback', centreSlug, name: b.name, phone: b.phone || null, email: b.email || null, message: b.message || null, payload: { manual: true, interest: b.interest || '', stage: 'new', timeline: [], ...(ther ? { therapistSlug: ther.slug } : {}) }, sourcePath: null, status: 'new' }).returning({ id: schema.leads.id, createdAt: schema.leads.createdAt });
    await audit(u.id, 'lead.created', 'lead', l.id);
    return json({ ok: true, id: l.id, at: new Date(l.createdAt).getTime() });
  }

  const [lead] = await db.select().from(schema.leads).where(eq(schema.leads.id, b.id)).limit(1);
  const allowed = lead && (u.role === 'master_admin' || (lead.centreSlug && slugs.includes(lead.centreSlug)) || (ther && (lead.payload as { therapistSlug?: string })?.therapistSlug === ther.slug));
  if (!lead || !allowed) return json({ ok: false, error: 'This lead is not available.' }, 404);
  const payload = { ...(lead.payload as Record<string, unknown>) } as Record<string, unknown> & { stage?: string; timeline?: Tl[] };
  const tl: Tl[] = Array.isArray(payload.timeline) ? payload.timeline : [];
  const now = Date.now();
  let sent: boolean | undefined;

  if (b.action === 'stage') { payload.stage = b.stage; tl.unshift({ k: 'move', t: 'Moved to ' + b.stage + (b.why ? ' · ' + b.why : ''), at: now }); }
  if (b.action === 'note') tl.unshift({ k: 'note', t: b.text, at: now });
  if (b.action === 'book') { payload.stage = 'booked'; tl.unshift({ k: 'cal', t: b.label, at: now }); }
  if (b.action === 'reply') {
    if (!u.verified) return json({ ok: false, error: 'Confirm your email address first.' }, 403);
    if (!lead.email) return json({ ok: false, error: 'This lead has no email address. Call them instead.' }, 400);
    const from = u.role === 'therapist' ? 'your therapist enquiry' : 'your enquiry';
    sent = await sendEmail(lead.email, `Re: ${from}`, `${b.text}\n\n--\nSent through Addiction Rehab Centres Canada. Reply to this email to answer ${u.name || 'the provider'} directly.`, undefined, u.email);
    tl.unshift({ k: 'mail', t: (sent ? 'Email sent to ' : 'Email saved (sending not configured) for ') + lead.email, at: now });
    if (!payload.stage || payload.stage === 'new') payload.stage = 'contacted';
  }
  payload.timeline = tl.slice(0, 100);
  const stage = String(payload.stage || 'new');
  await db.update(schema.leads).set({ payload, status: stage === 'new' ? 'new' : 'handled' }).where(and(eq(schema.leads.id, lead.id), sql`true`));
  await audit(u.id, 'lead.' + b.action, 'lead', lead.id, b.action === 'stage' ? { stage: b.stage } : {});
  return json({ ok: true, sent, at: now });
}
