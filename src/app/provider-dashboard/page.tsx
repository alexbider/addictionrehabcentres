import type { Metadata } from 'next';
import Client from './ProviderDashboardClient';

export const metadata: Metadata = {
  title: { absolute: "Provider Dashboard" },
  robots: { index: false }
};

export default function Page() {
  return <Client />;
}
