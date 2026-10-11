import type { Metadata } from 'next';
import { desc } from 'drizzle-orm';
import { requireDb, schema } from '@/db';
import AdminShell from '../AdminShell';
import { Card, Table, btn, fmtDate } from '@/components/backend/ui';
import { markLead } from '../actions';

export const metadata: Metadata = { title: 'Leads · Admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <AdminShell current="leads" title="Leads and enquiries">
      {async () => {
        const db = await requireDb();
        const rows = await db.select().from(schema.leads).orderBy(desc(schema.leads.createdAt)).limit(300);
        return (
          <Card>
            <p style={{ marginTop: 0 }}><a href="/admin/leads/export" style={{ ...btn('ghost'), display: 'inline-flex', alignItems: 'center' }} download>Export all leads (CSV)</a></p>
            <Table head={['Received', 'Type', 'Centre', 'Name', 'Contact', 'Message', 'Status']} empty="No leads yet."
              rows={rows.map((l) => [fmtDate(l.createdAt), l.type, l.centreSlug ?? '', l.name ?? '', [l.email, l.phone].filter(Boolean).join(' · '), l.message ?? '',
                <form key="s" action={markLead}><input type="hidden" name="id" value={l.id} /><input type="hidden" name="status" value={l.status === 'new' ? 'handled' : 'new'} /><button style={btn('ghost')}>{l.status === 'new' ? 'Mark handled' : 'Reopen'}</button></form>])} />
          </Card>
        );
      }}
    </AdminShell>
  );
}
