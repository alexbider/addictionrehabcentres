import type { Metadata } from 'next';
import { dbConfigured } from '@/db';
import { requireRole } from '@/server/auth';
import { myCentres, mySubscriptions } from '@/server/dashboard';
import { PLANS, paymentsConfigured, planAvailable } from '@/config/plans';
import { Card, Notice, Shell, Table, fmtDate } from '@/components/backend/ui';
import PlanButtons from './PlanButtons';
import { NAV } from '../page';

export const metadata: Metadata = { title: 'Plan & billing', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }: { searchParams: Promise<{ success?: string; canceled?: string }> }) {
  if (!dbConfigured()) return <Shell title="Plan & billing"><Notice kind="error">The dashboard is not available yet.</Notice></Shell>;
  const u = await requireRole(['provider'], '/provider-dashboard/billing/');
  const q = await searchParams;
  const [centres, subs] = await Promise.all([myCentres(u.id), mySubscriptions(u.id)]);
  return (
    <Shell title="Plan & billing" nav={NAV('billing')}>
      {q.success ? <Notice kind="ok">Thank you. Your subscription will appear below as soon as Stripe confirms it.</Notice> : null}
      {q.canceled ? <Notice kind="info">Checkout was cancelled. Nothing was charged.</Notice> : null}
      {!paymentsConfigured() ? <Notice kind="info">Plans are coming soon. Purchasing is switched off until the payment account is connected, so no plan can be bought yet.</Notice> : null}
      <div style={{ display: 'grid', gap: 22 }}>
        <Card title="Your subscriptions">
          <Table head={['Plan', 'Centre', 'Status', 'Renews']} empty="No subscription yet." rows={subs.map((s) => [s.planKey, s.centreSlug ?? '', s.status, fmtDate(s.currentPeriodEnd)])} />
          {subs.length ? <PlanButtons mode="portal" /> : null}
        </Card>
        <Card title="Plans">
          <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
            {PLANS.map((p) => (
              <div key={p.key} style={{ border: '1px solid #e3ecf4', borderRadius: 16, padding: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h3 style={{ fontSize: 20 }}>{p.name}</h3>
                <p style={{ color: '#5d7188', fontSize: 14.5, margin: 0 }}>{p.summary}</p>
                <PlanButtons mode="buy" plan={p.key} available={planAvailable(p.key)} centres={centres} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Shell>
  );
}
