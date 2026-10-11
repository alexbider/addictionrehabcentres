import type { Metadata } from 'next';
import { desc, eq } from 'drizzle-orm';
import { requireDb, schema } from '@/db';
import AdminShell from '../AdminShell';
import { Card, Table, fmtDate } from '@/components/backend/ui';

export const metadata: Metadata = { title: 'Subscriptions · Admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <AdminShell current="subscriptions" title="Subscriptions">
      {async () => {
        const db = await requireDb();
        const rows = await db.select({ plan: schema.subscriptions.planKey, status: schema.subscriptions.status, centre: schema.subscriptions.centreSlug, end: schema.subscriptions.currentPeriodEnd, stripe: schema.subscriptions.stripeSubscriptionId, email: schema.users.email }).from(schema.subscriptions).innerJoin(schema.users, eq(schema.users.id, schema.subscriptions.userId)).orderBy(desc(schema.subscriptions.createdAt)).limit(300);
        return <Card><Table head={['Owner', 'Plan', 'Centre', 'Status', 'Renews', 'Stripe id']} empty="No subscriptions yet (payments are not connected)." rows={rows.map((r) => [r.email, r.plan, r.centre ?? '', r.status, fmtDate(r.end), r.stripe ?? ''])} /></Card>;
      }}
    </AdminShell>
  );
}
