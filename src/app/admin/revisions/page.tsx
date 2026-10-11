import type { Metadata } from 'next';
import { desc, eq } from 'drizzle-orm';
import { requireDb, schema } from '@/db';
import AdminShell from '../AdminShell';
import { Card, Table, btn, fmtDate, input } from '@/components/backend/ui';
import { approveRevision, rejectRevisionAction } from '../actions';
import { centreTitle } from '@/server/dashboard';

export const metadata: Metadata = { title: 'Moderation queue · Admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <AdminShell current="revisions" title="Moderation queue">
      {async () => {
        const db = await requireDb();
        const rows = await db.select().from(schema.centreProfileRevisions).where(eq(schema.centreProfileRevisions.status, 'pending')).orderBy(desc(schema.centreProfileRevisions.submittedAt)).limit(100);
        return (
          <Card>
            <Table head={['Centre', 'Submitted', 'Changes', 'Decision']} empty="Nothing is waiting for review."
              rows={rows.map((r) => [
                <a key="c" href={`/${r.centreSlug}/`}>{centreTitle(r.centreSlug)}</a>,
                fmtDate(r.submittedAt),
                <pre key="p" style={{ margin: 0, maxWidth: 520, maxHeight: 220, overflow: 'auto', whiteSpace: 'pre-wrap', fontSize: 12.5 }}>{JSON.stringify(r.data, null, 2)}</pre>,
                <div key="d" style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 190 }}>
                  <form action={approveRevision}><input type="hidden" name="id" value={r.id} /><button style={btn('primary')} data-approve-revision>Approve and publish</button></form>
                  <form action={rejectRevisionAction} style={{ display: 'flex', gap: 6 }}><input type="hidden" name="id" value={r.id} /><input name="note" placeholder="Reason" style={{ ...input, padding: 8 }} /><button style={btn('danger')}>Reject</button></form>
                </div>,
              ])} />
          </Card>
        );
      }}
    </AdminShell>
  );
}
