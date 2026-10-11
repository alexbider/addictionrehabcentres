import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getDb, requireDb, schema } from '@/db';
import { profileSchema, type CentreProfile } from './schemas';
import { audit } from './audit';
import { slugToRoute } from '@/lib/slug';

export type ModerationMode = 'review' | 'instant';

export async function getModerationMode(): Promise<ModerationMode> {
  const db = await getDb();
  if (!db) return 'review';
  const [row] = await db.select().from(schema.settings).where(eq(schema.settings.key, 'moderation')).limit(1);
  return row?.value === 'instant' ? 'instant' : 'review';
}

export async function setModerationMode(mode: ModerationMode, adminId: string) {
  const db = await requireDb();
  await db.insert(schema.settings).values({ key: 'moderation', value: mode }).onConflictDoUpdate({ target: schema.settings.key, set: { value: mode } });
  await audit(adminId, 'settings.moderation', 'settings', 'moderation', { mode });
}

export type ApprovedProfile = { data: CentreProfile; pricingUpdatedAt: Date | null };

/** The approved, public overrides for a centre page (null when there are none or no database). Used by the static pages at build / ISR time. */
export async function getApprovedProfile(slug: string): Promise<ApprovedProfile | null> {
  try {
    const db = await getDb();
    if (!db) return null;
    const [row] = await db.select().from(schema.centreProfiles).where(eq(schema.centreProfiles.centreSlug, slug)).limit(1);
    if (!row) return null;
    const parsed = profileSchema.safeParse(row.data);
    return parsed.success ? { data: parsed.data, pricingUpdatedAt: row.pricingUpdatedAt } : null;
  } catch (e) { console.error('[profile] read failed', e); return null; }
}

/** Drops empty strings / empty lists so "not filled in" is represented as "absent". */
export function compact(p: CentreProfile): CentreProfile {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(p)) {
    if (v == null || v === '') continue;
    if (Array.isArray(v)) { if (v.length) out[k] = v; continue; }
    if (typeof v === 'object') { const o = Object.fromEntries(Object.entries(v).filter(([, x]) => x)); if (Object.keys(o).length) out[k] = o; continue; }
    out[k] = v;
  }
  return out as CentreProfile;
}

const samePricing = (a: CentreProfile['pricing'], b: CentreProfile['pricing']) => JSON.stringify(a ?? []) === JSON.stringify(b ?? []);

/** Makes a revision the live profile, then refreshes the static page (on-demand ISR). */
export async function applyRevision(revisionId: string, reviewerId: string | null, note?: string) {
  const db = await requireDb();
  const [rev] = await db.select().from(schema.centreProfileRevisions).where(eq(schema.centreProfileRevisions.id, revisionId)).limit(1);
  if (!rev || rev.status === 'approved') return false;
  const data = compact(profileSchema.parse(rev.data));
  const [cur] = await db.select().from(schema.centreProfiles).where(eq(schema.centreProfiles.centreSlug, rev.centreSlug)).limit(1);
  const pricingChanged = !samePricing(cur ? (cur.data as CentreProfile).pricing : undefined, data.pricing);
  const pricingUpdatedAt = data.pricing?.length ? (pricingChanged || !cur?.pricingUpdatedAt ? new Date() : cur.pricingUpdatedAt) : null;
  await db.insert(schema.centreProfiles).values({ centreSlug: rev.centreSlug, data, pricingUpdatedAt, updatedBy: rev.submittedBy, updatedAt: new Date() })
    .onConflictDoUpdate({ target: schema.centreProfiles.centreSlug, set: { data, pricingUpdatedAt, updatedBy: rev.submittedBy, updatedAt: new Date() } });
  await db.update(schema.centreProfileRevisions).set({ status: 'approved', reviewedBy: reviewerId, reviewedAt: new Date(), reviewNote: note ?? null }).where(eq(schema.centreProfileRevisions.id, revisionId));
  await db.update(schema.centreProfileRevisions).set({ status: 'superseded' }).where(and(eq(schema.centreProfileRevisions.centreSlug, rev.centreSlug), eq(schema.centreProfileRevisions.status, 'pending')));
  await audit(reviewerId, 'profile.applied', 'centre', rev.centreSlug, { revision: revisionId });
  revalidatePath(slugToRoute(rev.centreSlug).replace(/\/$/, ''));
  return true;
}

export async function rejectRevision(revisionId: string, reviewerId: string, note?: string) {
  const db = await requireDb();
  await db.update(schema.centreProfileRevisions).set({ status: 'rejected', reviewedBy: reviewerId, reviewedAt: new Date(), reviewNote: note ?? null }).where(eq(schema.centreProfileRevisions.id, revisionId));
  await audit(reviewerId, 'profile.rejected', 'revision', revisionId, { note });
}

/** A provider (or admin) saves their changes. Returns whether they went live at once or are waiting for review. */
export async function submitProfile(userId: string, isAdmin: boolean, slug: string, input: unknown): Promise<{ ok: true; live: boolean; revisionId: string } | { ok: false; fields: Record<string, string> }> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, fields: Object.fromEntries(parsed.error.issues.map((i) => [i.path.join('.') || 'form', i.message])) };
  const db = await requireDb();
  const data = compact(parsed.data);
  const [rev] = await db.insert(schema.centreProfileRevisions).values({ centreSlug: slug, data, submittedBy: userId }).returning({ id: schema.centreProfileRevisions.id });
  await audit(userId, 'profile.submitted', 'centre', slug, { revision: rev.id });
  const live = isAdmin || (await getModerationMode()) === 'instant';
  if (live) await applyRevision(rev.id, isAdmin ? userId : null);
  return { ok: true, live, revisionId: rev.id };
}
