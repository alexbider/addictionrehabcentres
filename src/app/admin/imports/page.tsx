import type { Metadata } from 'next';
import { desc, eq } from 'drizzle-orm';
import { requireDb, schema } from '@/db';
import AdminShell from '../AdminShell';
import { Card, Table, fmtDate } from '@/components/backend/ui';

export const metadata: Metadata = { title: 'Imports · Admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <AdminShell current="imports" title="Data sources and imports">
      {async () => {
        const db = await requireDb();
        const sources = await db.select().from(schema.dataSources).orderBy(desc(schema.dataSources.createdAt));
        const runs = await db.select({ id: schema.importRuns.id, status: schema.importRuns.status, counts: schema.importRuns.counts, started: schema.importRuns.startedAt, source: schema.dataSources.name }).from(schema.importRuns).leftJoin(schema.dataSources, eq(schema.dataSources.id, schema.importRuns.sourceId)).orderBy(desc(schema.importRuns.startedAt)).limit(50);
        return (
          <div style={{ display: 'grid', gap: 22 }}>
            <Card title="Sources"><p style={{ marginTop: 0, color: '#3b4d63' }}>Nothing is imported from a source that is not classified “allowed”. See audit/import/SOURCES.md for the research.</p><Table head={['Source', 'Licence', 'Classification', 'Notes']} empty="No sources recorded yet." rows={sources.map((s) => [s.name, s.licence ?? '', s.classification, s.notes ?? ''])} /></Card>
            <Card title="Import runs"><Table head={['Source', 'Status', 'Counts', 'Started']} empty="No imports have been run." rows={runs.map((r) => [r.source ?? '', r.status, <code key="c">{JSON.stringify(r.counts)}</code>, fmtDate(r.started)])} /></Card>
          </div>
        );
      }}
    </AdminShell>
  );
}
