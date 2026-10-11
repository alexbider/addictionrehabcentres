import type { Metadata } from 'next';
import { desc } from 'drizzle-orm';
import { requireDb, schema } from '@/db';
import AdminShell from '../AdminShell';
import { Card, Table, btn, fmtDate, input } from '@/components/backend/ui';
import { approveClaim, rejectClaim } from '../actions';
import { centreTitle } from '@/server/dashboard';

export const metadata: Metadata = { title: 'Claims · Admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <AdminShell current="claims" title="Claims">
      {async () => {
        const db = await requireDb();
        const claims = await db.select().from(schema.claims).orderBy(desc(schema.claims.createdAt)).limit(200);
        return (
          <Card>
            <Table head={['Centre', 'Claimant', 'Contact', 'Message', 'Status', 'Submitted', 'Decision']} empty="No claims yet."
              rows={claims.map((c) => [
                <a key="c" href={`/${c.centreSlug}/`}>{centreTitle(c.centreSlug)}</a>,
                <>{c.claimantName}<br /><span style={{ color: '#5d7188' }}>{c.roleTitle}</span></>,
                <>{c.email}<br />{c.phone}</>,
                c.message ?? '',
                c.status,
                fmtDate(c.createdAt),
                c.status === 'pending' ? (
                  <div key="d" style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 190 }}>
                    <form action={approveClaim} style={{ display: 'flex', gap: 6 }}><input type="hidden" name="id" value={c.id} /><button style={btn('primary')} data-approve-claim>Approve</button></form>
                    <form action={rejectClaim} style={{ display: 'flex', gap: 6 }}><input type="hidden" name="id" value={c.id} /><input name="note" placeholder="Reason (sent to them)" style={{ ...input, padding: 8 }} /><button style={btn('danger')}>Reject</button></form>
                  </div>
                ) : fmtDate(c.reviewedAt),
              ])} />
          </Card>
        );
      }}
    </AdminShell>
  );
}
