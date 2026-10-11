import { and, asc, eq } from 'drizzle-orm';
import { getDb, schema } from '@/db';

/** What a therapist profile can contain (keys of the onboarding form). Only fields the therapist filled in are ever shown. */
export type TherapistData = {
  name?: string; email?: string; phone?: string; website?: string; desig?: string; reg?: string; years?: string; city?: string; prov?: string;
  modes?: string[]; langs?: string[]; clients?: string[]; concerns?: string[]; approaches?: string[]; accepting?: boolean; tagline?: string; bio?: string;
  fee?: string; couples?: string; sliding?: boolean; consult?: boolean; payments?: string[];
};

import { DESIGNATIONS, PROVINCES } from './therapists-constants';
export { DESIGNATIONS, PROVINCES };

export type PublicTherapist = { id: string; slug: string; data: TherapistData; descriptionStatus: string };

const clean = (d: unknown): TherapistData => (d && typeof d === 'object' ? (d as TherapistData) : {});

/** Published profiles only: status "published" AND the text is the therapist's own or approved by an admin. */
export async function getPublishedTherapists(): Promise<PublicTherapist[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const rows = await db.select({ id: schema.therapists.id, slug: schema.therapists.slug, data: schema.therapistProfiles.data, ds: schema.therapistProfiles.descriptionStatus }).from(schema.therapists).innerJoin(schema.therapistProfiles, eq(schema.therapistProfiles.therapistId, schema.therapists.id)).where(eq(schema.therapists.status, 'published')).orderBy(asc(schema.therapists.slug));
    return rows.filter((r) => r.ds !== 'needs_review').map((r) => ({ id: r.id, slug: r.slug, data: clean(r.data), descriptionStatus: r.ds }));
  } catch { return []; }
}

export async function getTherapist(slug: string): Promise<PublicTherapist | null> {
  try {
    const db = await getDb();
    if (!db) return null;
    const [r] = await db.select({ id: schema.therapists.id, slug: schema.therapists.slug, data: schema.therapistProfiles.data, ds: schema.therapistProfiles.descriptionStatus, status: schema.therapists.status }).from(schema.therapists).innerJoin(schema.therapistProfiles, eq(schema.therapistProfiles.therapistId, schema.therapists.id)).where(and(eq(schema.therapists.slug, slug), eq(schema.therapists.status, 'published'))).limit(1);
    if (!r || r.ds === 'needs_review') return null;
    return { id: r.id, slug: r.slug, data: clean(r.data), descriptionStatus: r.ds };
  } catch { return null; }
}

export const therapistLocation = (d: TherapistData) => [d.city, d.prov ? PROVINCES[d.prov] ?? d.prov : ''].filter(Boolean).join(', ');
export const therapistCredential = (d: TherapistData) => (d.desig ? DESIGNATIONS[d.desig] ?? d.desig : '');
/** "$150 per session" only when the therapist published a fee. */
export const therapistFee = (d: TherapistData) => (d.fee && /^\d{2,4}$/.test(d.fee.trim()) ? `$${d.fee.trim()} per session` : null);
