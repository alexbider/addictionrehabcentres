import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { dbConfigured } from '@/db';
import { requireRole } from '@/server/auth';
import { centreDashboard } from '@/server/dashboard-data';
import { Notice, Shell } from '@/components/backend/ui';
import { Root as Dashboard } from '@/views/ProviderDashboard';

export const metadata: Metadata = { title: 'Centre dashboard', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

/** The centre (provider) dashboard: the Provider Dashboard design with real data. Therapists are sent to their own dashboard. */
export default async function Page({ searchParams }: { searchParams: Promise<{ centre?: string }> }) {
  if (!dbConfigured()) return <Shell title="Centre dashboard"><Notice kind="error">The dashboard needs the database to be connected (DATABASE_URL). It is not available yet.</Notice></Shell>;
  const u = await requireRole(['provider', 'therapist'], '/provider-dashboard/');
  if (u.role === 'therapist') redirect('/therapist-dashboard/');
  const data = await centreDashboard(u, (await searchParams).centre);
  return <Dashboard providerType="centre" initial={data} />;
}
