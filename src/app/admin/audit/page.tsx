import type { Metadata } from 'next';
import { desc } from 'drizzle-orm';
import { requireDb, schema } from '@/db';
import AdminShell from '../AdminShell';
import { Card, Table, fmtDate } from '@/components/backend/ui';

export const metadata: Metadata = { title: 'Audit log · Admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <AdminShell current="audit" title="Audit log">
      {async () => {
        const db = await requireDb();
        const rows = await db.select().from(schema.auditLog).orderBy(desc(schema.auditLog.createdAt)).limit(300);
        return <Card><Table head={['When', 'Action', 'Entity', 'Id', 'Actor', 'Data']} empty="Nothing logged yet." rows={rows.map((r) => [fmtDate(r.createdAt), r.action, r.entity, r.entityId ?? '', r.actorUserId?.slice(0, 8) ?? '', <code key="d" style={{ fontSize: 12 }}>{JSON.stringify(r.data).slice(0, 160)}</code>])} /></Card>;
      }}
    </AdminShell>
  );
}
