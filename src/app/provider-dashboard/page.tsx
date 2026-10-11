import type { Metadata } from 'next';
import { dbConfigured } from '@/db';
import { requireRole } from '@/server/auth';
import { myCentres, myClaims, mySubscriptions } from '@/server/dashboard';
import { Card, Notice, Shell, Table, btn, fmtDate } from '@/components/backend/ui';
import SignOut from '@/components/backend/SignOut';
import { slugToRoute } from '@/lib/slug';

export const metadata: Metadata = { title: 'Provider dashboard', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export const NAV = (current: string) => [
  { href: '/provider-dashboard/', label: 'Overview', current: current === 'overview' },
  { href: '/provider-dashboard/leads/', label: 'Enquiries', current: current === 'leads' },
  { href: '/provider-dashboard/billing/', label: 'Plan & billing', current: current === 'billing' },
];

export default async function Page() {
  if (!dbConfigured()) return <Shell title="Provider dashboard"><Notice kind="error">The dashboard needs the database to be connected (DATABASE_URL). It is not available yet.</Notice></Shell>;
  const u = await requireRole(['provider'], '/provider-dashboard/');
  const [centres, claims, subs] = await Promise.all([myCentres(u.id), myClaims(u.id, u.email), mySubscriptions(u.id)]);
  return (
    <Shell title="Provider dashboard" subtitle={`Signed in as ${u.email}`} nav={NAV('overview')}>
      {!u.verified ? <Notice kind="info">Confirm your email address to edit your centres. We sent a link to {u.email}.</Notice> : null}
      <div style={{ display: 'grid', gap: 22 }}>
        <Card title="Your centres">
          <Table head={['Centre', 'Public page', '']} empty="You do not manage a centre yet. Claim your listing to get started."
            rows={centres.map((c) => [<strong key="n">{c.name}</strong>, <a key="p" href={slugToRoute(c.slug)}>{slugToRoute(c.slug)}</a>, <a key="e" href={`/provider-dashboard/${c.slug}/`} style={{ ...btn('ghost'), display: 'inline-flex', alignItems: 'center' }}>Edit page</a>])} />
          <p style={{ marginTop: 14 }}><a href="/claim-listing/">Claim another listing</a> · <a href="/centre-onboarding/">Add a new centre</a></p>
        </Card>
        <Card title="Claims">
          <Table head={['Centre', 'Status', 'Submitted']} empty="No claims yet." rows={claims.map((c) => [c.centreSlug, c.status === 'pending' ? 'Waiting for review' : c.status === 'approved' ? 'Approved' : 'Not approved', fmtDate(c.createdAt)])} />
        </Card>
        <Card title="Subscription">
          <Table head={['Plan', 'Status', 'Renews']} empty="No active plan. Plans are not open for purchase yet." rows={subs.map((s) => [s.planKey, s.status, fmtDate(s.currentPeriodEnd)])} />
        </Card>
        <div><SignOut /></div>
      </div>
    </Shell>
  );
}
