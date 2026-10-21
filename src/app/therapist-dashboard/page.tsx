import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { dbConfigured } from '@/db';
import { requireRole } from '@/server/auth';
import { therapistDashboard } from '@/server/dashboard-data';
import { Notice, Shell } from '@/components/backend/ui';
import { Root as Dashboard } from '@/views/ProviderDashboard';

export const metadata: Metadata = { title: 'Therapist dashboard', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

/** The therapist dashboard: the therapist variant of the Provider Dashboard design with real data. Centre accounts are sent to theirs. */
export default async function Page() {
  if (!dbConfigured()) return <Shell title="Therapist dashboard"><Notice kind="error">This area is not available yet.</Notice></Shell>;
  const u = await requireRole(['therapist', 'provider'], '/therapist-dashboard/');
  if (u.role === 'provider') redirect('/provider-dashboard/');
  const data = await therapistDashboard(u);
  return <Dashboard providerType="therapist" initial={data} />;
}
