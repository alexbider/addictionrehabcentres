import { and, desc, eq, gte, inArray, sql } from 'drizzle-orm';
import { requireDb, schema } from '@/db';
import type { SessionUser } from './auth';
import { myCentres, myClaims, mySubscriptions, staticCentre } from './dashboard';
import { getApprovedProfile, getModerationMode } from './profile';
import { PLANS, paymentsConfigured, planAvailable, priceIdFor } from '@/config/plans';
import { stripe } from './stripe';
import { slugToRoute } from '@/lib/slug';
import type { CentreProfile } from './schemas';
import type { TherapistData } from './therapists';

/** A lead as the dashboard sees it. `stage` and `timeline` live in leads.payload (dashboard-owned keys). */
export type DashLead = {
  id: string; name: string; stage: string; interest: string; source: string; at: number; score: number;
  phone: string; email: string; message: string; who: string; insurance: string; urgency: string;
  timeline: { k: string; t: string; at: number }[];
};

type Payload = Record<string, unknown> & { stage?: string; timeline?: { k: string; t: string; at: number }[]; setting?: string; substance?: string; who?: string; payment?: string; when?: string; interest?: string; therapistSlug?: string; manual?: boolean };

const STAGES = ['new', 'contacted', 'booked', 'admitted', 'lost'];

/** Where a lead came from, in words a provider understands (from the page the form was sent on). */
export function sourceLabel(path: string | null, type: string, ownRoutes: string[]): string {
  const p = (path || '').toLowerCase();
  if (type === 'manual') return 'Added manually';
  if (ownRoutes.some((r) => r && p === r.toLowerCase())) return type === 'enquiry' ? 'Profile message' : 'Your listing page';
  if (p.startsWith('/therapists')) return 'Therapist pages';
  if (p.includes('listing-location') || /-rehabs?\/?$/.test(p) || p.startsWith('/category/')) return 'City & province pages';
  if (/addiction|alcohol|drug|detox|treatment/.test(p)) return 'Substance pages';
  if (p.startsWith('/search')) return 'Site search';
  return p ? 'Other pages' : 'Website form';
}

/** A simple, explainable priority score (0-100): reachable by phone, wants help soon, recent. */
export function leadScore(l: { phone?: string | null; email?: string | null; when?: string; who?: string; at: number }) {
  let s = 50;
  if (l.phone) s += 15;
  if (l.email) s += 8;
  const w = (l.when || '').toLowerCase();
  if (/today|asap|immediately|now/.test(w)) s += 22; else if (/week/.test(w)) s += 14; else if (/month/.test(w)) s += 6;
  if (/self|myself/.test((l.who || '').toLowerCase())) s += 3;
  s -= Math.min(20, Math.floor((Date.now() - l.at) / 864e5));
  return Math.max(20, Math.min(99, s));
}

function mapLead(r: typeof schema.leads.$inferSelect, ownRoutes: string[]): DashLead {
  const p = (r.payload ?? {}) as Payload;
  const at = new Date(r.createdAt).getTime();
  const interest = p.interest || [p.setting, p.substance].filter(Boolean).join(' · ') || (r.type === 'enquiry' ? 'Profile enquiry' : r.type === 'callback' ? 'Callback request' : 'Enquiry');
  const stage = STAGES.includes(String(p.stage)) ? String(p.stage) : r.status === 'handled' ? 'contacted' : 'new';
  const source = sourceLabel(r.sourcePath, p.manual ? 'manual' : r.type, ownRoutes);
  const timeline = Array.isArray(p.timeline) ? p.timeline.slice(0, 100) : [];
  return {
    id: r.id, name: r.name || 'Unnamed enquiry', stage, interest, source, at,
    score: leadScore({ phone: r.phone, email: r.email, when: p.when, who: p.who, at }),
    phone: r.phone || '', email: r.email || '', message: r.message || (p.manual ? 'Added manually from the dashboard.' : ''),
    who: p.who || '', insurance: p.payment || '', urgency: p.when || '',
    timeline: [...timeline, { k: 'in', t: p.manual ? 'Lead added manually' : 'Enquiry received via ' + source, at }],
  };
}

/** Daily listing counters for the last 180 days, plus the referring pages and search terms. */
async function listingStats(entity: 'centre' | 'therapist', slugs: string[]) {
  if (!slugs.length) return { daily: {} as Record<string, { view: number; call: number; click: number }>, refs: [] as { key: string; n: number }[], terms: [] as { key: string; n: number }[] };
  const db = await requireDb();
  const since = new Date(Date.now() - 180 * 864e5).toISOString().slice(0, 10);
  const rows = await db.select({ kind: schema.listingStats.kind, key: schema.listingStats.key, day: schema.listingStats.day, n: sql<number>`sum(${schema.listingStats.count})` })
    .from(schema.listingStats)
    .where(and(eq(schema.listingStats.entity, entity), inArray(schema.listingStats.slug, slugs), gte(schema.listingStats.day, since)))
    .groupBy(schema.listingStats.kind, schema.listingStats.key, schema.listingStats.day);
  const daily: Record<string, { view: number; call: number; click: number }> = {};
  const refs = new Map<string, number>(); const terms = new Map<string, number>();
  for (const r of rows) {
    const n = Number(r.n) || 0;
    if (r.kind === 'ref') { refs.set(r.key, (refs.get(r.key) || 0) + n); continue; }
    if (r.kind === 'term') { terms.set(r.key, (terms.get(r.key) || 0) + n); continue; }
    const d = (daily[r.day] ??= { view: 0, call: 0, click: 0 });
    if (r.kind === 'view' || r.kind === 'call' || r.kind === 'click') d[r.kind] += n;
  }
  const top = (m: Map<string, number>) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([key, n]) => ({ key, n }));
  return { daily, refs: top(refs), terms: top(terms) };
}

async function stripeExtras(customerId: string | null | undefined, planKeys: string[]) {
  const s = stripe();
  const prices: Record<string, string> = {};
  const invoices: { date: string; desc: string; amt: string; url: string }[] = [];
  if (!s) return { prices, invoices };
  const fmt = (cents: number | null | undefined, cur: string) => cents == null ? '' : new Intl.NumberFormat('en-CA', { style: 'currency', currency: cur.toUpperCase(), maximumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);
  try {
    await Promise.all(planKeys.filter((k) => priceIdFor(k)).map(async (k) => {
      const p = await s.prices.retrieve(priceIdFor(k));
      prices[k] = fmt(p.unit_amount, p.currency) + (p.recurring ? '/' + (p.recurring.interval === 'year' ? 'yr' : 'mo') : '');
    }));
    if (customerId) {
      const list = await s.invoices.list({ customer: customerId, limit: 12 });
      for (const i of list.data) invoices.push({ date: new Date(i.created * 1000).toLocaleDateString('en-CA', { month: 'long', year: 'numeric' }), desc: i.lines.data[0]?.description || 'Subscription', amt: fmt(i.total, i.currency), url: i.hosted_invoice_url || i.invoice_pdf || '' });
    }
  } catch (e) { console.error('[dashboard] stripe', e instanceof Error ? e.message : e); }
  return { prices, invoices };
}

const firstLine = (blocks: { type: string; text?: string }[] | undefined) => (blocks || []).filter((b) => b.type === 'p' && b.text).map((b) => b.text).join('\n\n');

/** Everything the centre dashboard needs on first paint. */
export async function centreDashboard(u: SessionUser, wantSlug?: string) {
  const db = await requireDb();
  const [centres, claims, subs, mode] = await Promise.all([myCentres(u.id), myClaims(u.id, u.email), mySubscriptions(u.id), getModerationMode()]);
  const slugs = centres.map((c) => c.slug);
  const current = centres.find((c) => c.slug === wantSlug) ?? centres[0] ?? null;
  const routes = slugs.map(slugToRoute);
  const [leadRows, [ws], stats, statusRows] = await Promise.all([
    slugs.length ? db.select().from(schema.leads).where(inArray(schema.leads.centreSlug, slugs)).orderBy(desc(schema.leads.createdAt)).limit(300) : Promise.resolve([]),
    db.select().from(schema.providerWorkspaces).where(eq(schema.providerWorkspaces.userId, u.id)).limit(1),
    listingStats('centre', slugs),
    slugs.length ? db.select({ slug: schema.centres.slug, status: schema.centres.status, city: schema.centres.city, province: schema.centres.province }).from(schema.centres).where(inArray(schema.centres.slug, slugs)) : Promise.resolve([]),
  ]);

  let profile = null as null | { slug: string; name: string; href: string; status: string; city: string; raw: CentreProfile; pending: boolean; rejectedNote: string | null; fallback: { phone: string; email: string; website: string; description: string; photos: number } };
  if (current) {
    const [approved, [rev]] = await Promise.all([
      getApprovedProfile(current.slug),
      db.select().from(schema.centreProfileRevisions).where(eq(schema.centreProfileRevisions.centreSlug, current.slug)).orderBy(desc(schema.centreProfileRevisions.submittedAt)).limit(1),
    ]);
    const pending = rev?.status === 'pending';
    const raw = ((pending ? rev.data : approved?.data) ?? {}) as CentreProfile;
    const st = staticCentre(current.slug)?.centre;
    const row = statusRows.find((r) => r.slug === current.slug);
    profile = {
      slug: current.slug, name: current.name, href: row?.status === 'draft' ? '' : slugToRoute(current.slug), status: row?.status ?? 'published',
      city: [row?.city, row?.province].filter(Boolean).join(', ') || (st?.address ?? '').split(',').slice(-3, -1).join(',').trim(),
      raw, pending, rejectedNote: rev?.status === 'rejected' ? rev.reviewNote || '' : null,
      fallback: { phone: st?.phone_text ?? '', email: st?.email ?? '', website: st?.website ?? '', description: firstLine(st?.about_blocks as { type: string; text?: string }[]), photos: st?.gallery?.length ?? 0 },
    };
  }

  const team = slugs.length
    ? await db.selectDistinct({ id: schema.users.id, name: schema.users.name, email: schema.users.email, role: schema.centreMembers.role }).from(schema.centreMembers).innerJoin(schema.users, eq(schema.users.id, schema.centreMembers.userId)).where(inArray(schema.centreMembers.centreSlug, slugs))
    : [];
  const sub = subs.find((s) => ['active', 'trialing', 'past_due'].includes(s.status)) ?? null;
  const { prices, invoices } = await stripeExtras(sub?.stripeCustomerId, PLANS.map((p) => p.key));

  return {
    type: 'centre' as const,
    user: { name: u.name, email: u.email, verified: u.verified },
    centres: centres.map((c) => ({ slug: c.slug, name: c.name })),
    claims: claims.map((c) => ({ centre: staticCentre(c.centreSlug)?.centre?.name ?? c.centreSlug, status: c.status, at: new Date(c.createdAt).getTime() })),
    profile, moderation: mode,
    leads: leadRows.map((r) => mapLead(r, routes)),
    workspace: (ws?.data ?? null) as Record<string, unknown> | null,
    stats,
    team: team.map((t) => ({ name: t.name || t.email, email: t.email, role: t.id === u.id ? 'Owner' : t.role === 'owner' ? 'Manager' : t.role })),
    billing: {
      paymentsOn: paymentsConfigured(),
      sub: sub ? { planKey: sub.planKey, plan: PLANS.find((p) => p.key === sub.planKey)?.name ?? sub.planKey, status: sub.status, renews: sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).getTime() : null } : null,
      plans: PLANS.map((p) => ({ key: p.key, name: p.name, summary: p.summary, price: prices[p.key] || '', available: planAvailable(p.key) })),
      invoices,
    },
  };
}

/** Everything the therapist dashboard needs on first paint. */
export async function therapistDashboard(u: SessionUser) {
  const db = await requireDb();
  const [[t], [ws]] = await Promise.all([
    db.select({ t: schema.therapists, p: schema.therapistProfiles }).from(schema.therapists).leftJoin(schema.therapistProfiles, eq(schema.therapistProfiles.therapistId, schema.therapists.id)).where(eq(schema.therapists.userId, u.id)).limit(1),
    db.select().from(schema.providerWorkspaces).where(eq(schema.providerWorkspaces.userId, u.id)).limit(1),
  ]);
  const [pendingSub] = t ? [] : await db.select({ id: schema.onboardingSubmissions.id, status: schema.onboardingSubmissions.status }).from(schema.onboardingSubmissions).where(and(eq(schema.onboardingSubmissions.kind, 'therapist'), eq(schema.onboardingSubmissions.userId, u.id))).orderBy(desc(schema.onboardingSubmissions.createdAt)).limit(1);
  const route = t ? `/therapists/${t.t.slug}/` : '';
  const leadRows = t ? await db.select().from(schema.leads).where(and(eq(schema.leads.type, 'enquiry'), sql`${schema.leads.payload}->>'therapistSlug' = ${t.t.slug}`)).orderBy(desc(schema.leads.createdAt)).limit(300) : [];
  const stats = await listingStats('therapist', t ? [t.t.slug] : []);
  return {
    type: 'therapist' as const,
    user: { name: u.name, email: u.email, verified: u.verified },
    therapist: t ? { slug: t.t.slug, status: t.t.status, href: t.t.status === 'published' ? route : '', data: (t.p?.data ?? {}) as TherapistData } : null,
    onboarding: pendingSub ? pendingSub.status : null,
    leads: leadRows.map((r) => mapLead(r, [route])),
    workspace: (ws?.data ?? null) as Record<string, unknown> | null,
    stats,
  };
}

export type CentreDash = Awaited<ReturnType<typeof centreDashboard>>;
export type TherapistDash = Awaited<ReturnType<typeof therapistDashboard>>;
