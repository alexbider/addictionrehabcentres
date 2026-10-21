import type { Metadata } from 'next';
import { eq } from 'drizzle-orm';
import { dbConfigured, requireDb, schema } from '@/db';
import { requireRole } from '@/server/auth';
import { Card, Notice, Shell } from '@/components/backend/ui';
import TherapistEditor from '../TherapistEditor';
import type { TherapistData } from '@/server/therapists';

export const metadata: Metadata = { title: 'Edit your therapist profile', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

/** Every field of the therapist profile (the dashboard's Profile screen edits the main ones). */
export default async function Page() {
  if (!dbConfigured()) return <Shell title="Your profile"><Notice kind="error">This area is not available yet.</Notice></Shell>;
  const u = await requireRole(['therapist'], '/therapist-dashboard/edit/');
  const db = await requireDb();
  const [t] = await db.select({ t: schema.therapists, p: schema.therapistProfiles }).from(schema.therapists).leftJoin(schema.therapistProfiles, eq(schema.therapistProfiles.therapistId, schema.therapists.id)).where(eq(schema.therapists.userId, u.id)).limit(1);
  const nav = [{ href: '/therapist-dashboard/', label: 'Dashboard' }, { href: '/therapist-dashboard/edit/', label: 'All profile fields', current: true }];
  return (
    <Shell title="Your therapist profile" subtitle={`Signed in as ${u.email}`} nav={nav}>
      {!u.verified ? <Notice kind="info">Confirm your email address to edit your profile. We sent a link to {u.email}.</Notice> : null}
      {!t ? <Card><p style={{ marginTop: 0 }}>You do not have a profile yet. <a href="/therapist-onboarding/">Create your profile</a>.</p></Card>
        : t.t.status !== 'removed' ? <TherapistEditor initial={(t.p?.data ?? {}) as TherapistData} /> : <Notice kind="info">Your profile has been removed and is not public.</Notice>}
    </Shell>
  );
}
