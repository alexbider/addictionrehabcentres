import type { Metadata } from 'next';
import { desc } from 'drizzle-orm';
import { requireDb, schema } from '@/db';
import AdminShell from '../AdminShell';
import { Card, Table, btn, fmtDate } from '@/components/backend/ui';
import { approveOnboarding, rejectOnboarding } from '../actions';

export const metadata: Metadata = { title: 'Onboarding · Admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <AdminShell current="onboarding" title="Onboarding submissions">
      {async () => {
        const db = await requireDb();
        const rows = await db.select().from(schema.onboardingSubmissions).orderBy(desc(schema.onboardingSubmissions.createdAt)).limit(200);
        return (
          <Card>
            <Table head={['Submitted', 'Type', 'From', 'Details', 'Status', 'Decision']} empty="No submissions yet."
              rows={rows.map((s) => [fmtDate(s.createdAt), s.kind, s.email ?? '', <pre key="p" style={{ margin: 0, maxWidth: 480, maxHeight: 200, overflow: 'auto', whiteSpace: 'pre-wrap', fontSize: 12.5 }}>{JSON.stringify(s.payload, null, 2)}</pre>, s.status + (s.centreSlug ? ` → ${s.centreSlug}` : ''),
                s.status === 'pending' ? <div key="d" style={{ display: 'flex', gap: 6 }}><form action={approveOnboarding}><input type="hidden" name="id" value={s.id} /><button style={btn('primary')}>Approve (as draft)</button></form><form action={rejectOnboarding}><input type="hidden" name="id" value={s.id} /><button style={btn('danger')}>Reject</button></form></div> : ''])} />
          </Card>
        );
      }}
    </AdminShell>
  );
}
