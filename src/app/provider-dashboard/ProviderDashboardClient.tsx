'use client';
import dynamic from 'next/dynamic';

// Client-only: this view reads the clock and the signed-in user while rendering.
const Root = dynamic(() => import('@/views/ProviderDashboard').then((mod) => mod.Root), { ssr: false });

export default function ProviderDashboardClient() {
  return <Root />;
}
