import type { Metadata } from 'next';
import { desc, eq } from 'drizzle-orm';
import { requireDb, schema } from '@/db';
import AdminShell from '../AdminShell';
import { Card, Table, btn, fmtDate } from '@/components/backend/ui';
import { setTherapistStatus } from '../therapist-actions';

export const metadata: Metadata = { title: 'Therapists · Admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <AdminShell current="therapists" title="Therapists">
      {async () => {
        const db = await requireDb();
        const rows = await db.select({ t: schema.therapists, p: schema.therapistProfiles }).from(schema.therapists).leftJoin(schema.therapistProfiles, eq(schema.therapistProfiles.therapistId, schema.therapists.id)).orderBy(desc(schema.therapists.createdAt)).limit(300);
        const removals = await db.select().from(schema.removalRequests).orderBy(desc(schema.removalRequests.createdAt)).limit(50);
        return (
          <div style={{ display: 'grid', gap: 22 }}>
            <Card title="Profiles">
              <p style={{ marginTop: 0, color: '#3b4d63' }}>A therapist page is public only when its status is “published”, which needs the profile text to be the therapist&apos;s own or approved by you.</p>
              <Table head={['Slug', 'Source', 'Status', 'Text status', 'Created', 'Actions']} empty="No therapist profiles yet."
                rows={rows.map(({ t, p }) => [t.slug, t.source, t.status, p?.descriptionStatus ?? '', fmtDate(t.createdAt),
                  <div key="a" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {(['published', 'draft', 'removed'] as const).filter((s) => s !== t.status).map((s) => <form key={s} action={setTherapistStatus}><input type="hidden" name="id" value={t.id} /><input type="hidden" name="status" value={s} /><button style={btn(s === 'removed' ? 'danger' : 'ghost')}>{s === 'published' ? 'Publish' : s === 'draft' ? 'Unpublish' : 'Remove'}</button></form>)}
                  </div>])} />
            </Card>
            <Card title="Removal requests"><Table head={['Profile', 'From', 'Reason', 'When']} empty="None." rows={removals.map((r) => [r.therapistSlug, r.email, r.reason ?? '', fmtDate(r.createdAt)])} /></Card>
          </div>
        );
      }}
    </AdminShell>
  );
}
