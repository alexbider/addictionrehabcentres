import type { Metadata } from 'next';
import { desc } from 'drizzle-orm';
import { requireDb, schema } from '@/db';
import AdminShell from '../AdminShell';
import { Card, Table, btn, fmtDate, input } from '@/components/backend/ui';
import { setUserRole, toggleUser } from '../actions';

export const metadata: Metadata = { title: 'Users · Admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <AdminShell current="users" title="Users">
      {async (me) => {
        const db = await requireDb();
        const rows = await db.select({ id: schema.users.id, email: schema.users.email, name: schema.users.name, role: schema.users.role, verified: schema.users.emailVerifiedAt, disabled: schema.users.disabledAt, created: schema.users.createdAt }).from(schema.users).orderBy(desc(schema.users.createdAt)).limit(300);
        return (
          <Card>
            <Table head={['Name', 'Email', 'Role', 'Email confirmed', 'Created', 'Actions']} empty="No users."
              rows={rows.map((u) => [u.name, u.email,
                <form key="r" action={setUserRole} style={{ display: 'flex', gap: 6 }}><input type="hidden" name="id" value={u.id} /><select name="role" defaultValue={u.role} disabled={u.id === me.id} style={{ ...input, width: 'auto', padding: 8 }}><option value="provider">provider</option><option value="therapist">therapist</option><option value="master_admin">master_admin</option></select><button style={btn('ghost')} disabled={u.id === me.id}>Set</button></form>,
                u.verified ? 'Yes' : 'No', fmtDate(u.created),
                <form key="d" action={toggleUser}><input type="hidden" name="id" value={u.id} /><input type="hidden" name="disable" value={u.disabled ? '0' : '1'} /><button style={btn(u.disabled ? 'ghost' : 'danger')} disabled={u.id === me.id}>{u.disabled ? 'Enable' : 'Disable'}</button></form>])} />
          </Card>
        );
      }}
    </AdminShell>
  );
}
