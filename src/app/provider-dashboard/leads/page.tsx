import type { Metadata } from 'next';
import { dbConfigured } from '@/db';
import { requireRole } from '@/server/auth';
import { centreTitle, leadsFor, myCentres } from '@/server/dashboard';
import { Card, Notice, Shell, Table, fmtDate } from '@/components/backend/ui';
import { NAV } from '../page';

export const metadata: Metadata = { title: 'Enquiries', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function Page() {
  if (!dbConfigured()) return <Shell title="Enquiries"><Notice kind="error">The dashboard is not available yet.</Notice></Shell>;
  const u = await requireRole(['provider'], '/provider-dashboard/leads/');
  const centres = await myCentres(u.id);
  const leads = await leadsFor(centres.map((c) => c.slug));
  return (
    <Shell title="Enquiries" subtitle="Callback requests and messages sent from your centre pages" nav={NAV('leads')}>
      <Card>
        <Table head={['Received', 'Centre', 'Name', 'Contact', 'Message']} empty="No enquiries yet."
          rows={leads.map((l) => [fmtDate(l.createdAt), centreTitle(l.centreSlug ?? ''), l.name ?? '', [l.phone, l.email].filter(Boolean).join(' · '), l.message ?? ''])} />
      </Card>
    </Shell>
  );
}
