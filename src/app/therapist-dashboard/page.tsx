import type { Metadata } from 'next';
import { eq } from 'drizzle-orm';
import { dbConfigured, requireDb, schema } from '@/db';
import { requireRole } from '@/server/auth';
import { Card, Notice, Shell } from '@/components/backend/ui';
import SignOut from '@/components/backend/SignOut';
import TherapistEditor from './TherapistEditor';
import type { TherapistData } from '@/server/therapists';

export const metadata: Metadata = { title: 'Your therapist profile', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function Page() {
  if (!dbConfigured()) return <Shell title="Your profile"><Notice kind="error">This area is not available yet.</Notice></Shell>;
  const u = await requireRole(['therapist'], '/therapist-dashboard/');
  const db = await requireDb();
  const [t] = await db.select({ t: schema.therapists, p: schema.therapistProfiles }).from(schema.therapists).leftJoin(schema.therapistProfiles, eq(schema.therapistProfiles.therapistId, schema.therapists.id)).where(eq(schema.therapists.userId, u.id)).limit(1);
  return (
    <Shell title="Your therapist profile" subtitle={`Signed in as ${u.email}`}>
      {!u.verified ? <Notice kind="info">Confirm your email address to edit your profile. We sent a link to {u.email}.</Notice> : null}
      {!t ? (
        <Card><p style={{ marginTop: 0 }}>You do not have a profile yet. <a href="/therapist-onboarding/">Create your profile</a>. After our team has looked at it you can edit it here.</p></Card>
      ) : (
        <>
          <Notice kind={t.t.status === 'published' ? 'ok' : 'info'}>{t.t.status === 'published' ? <>Your profile is public: <a href={`/therapists/${t.t.slug}/`}>view it</a>.</> : t.t.status === 'removed' ? 'Your profile has been removed and is not public.' : 'Your profile is not public yet. Our team publishes it after a review.'}</Notice>
          {t.t.status !== 'removed' ? <TherapistEditor initial={(t.p?.data ?? {}) as TherapistData} /> : null}
        </>
      )}
      <div style={{ marginTop: 26 }}><SignOut /></div>
    </Shell>
  );
}
