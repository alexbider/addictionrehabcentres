import type { Metadata } from 'next';
import { count, eq } from 'drizzle-orm';
import { requireDb, schema } from '@/db';
import AdminShell from './AdminShell';
import { Card } from '@/components/backend/ui';

export const metadata: Metadata = { title: 'Admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <AdminShell current="" title="Admin">
      {async () => {
        const db = await requireDb();
        const n = async (q: Promise<{ n: number }[]>) => Number((await q)[0]?.n ?? 0);
        const stats: [string, number, string][] = [
          ['Pending claims', await n(db.select({ n: count() }).from(schema.claims).where(eq(schema.claims.status, 'pending'))), '/admin/claims/'],
          ['Edits waiting for review', await n(db.select({ n: count() }).from(schema.centreProfileRevisions).where(eq(schema.centreProfileRevisions.status, 'pending'))), '/admin/revisions/'],
          ['Onboarding submissions', await n(db.select({ n: count() }).from(schema.onboardingSubmissions).where(eq(schema.onboardingSubmissions.status, 'pending'))), '/admin/onboarding/'],
          ['New leads', await n(db.select({ n: count() }).from(schema.leads).where(eq(schema.leads.status, 'new'))), '/admin/leads/'],
          ['Users', await n(db.select({ n: count() }).from(schema.users)), '/admin/users/'],
        ];
        return (
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
            {stats.map(([label, v, href]) => <Card key={label}><a href={href} style={{ display: 'block' }}><div style={{ font: '600 36px Jost,sans-serif', color: '#10233a' }}>{v}</div><div style={{ color: '#5d7188' }}>{label}</div></a></Card>)}
          </div>
        );
      }}
    </AdminShell>
  );
}
