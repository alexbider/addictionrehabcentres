import type { Metadata } from 'next';
import { Root } from '@/views/Promote';

// Design sample route (the Promote design with its own sample text, used by audit/scripts/compare-design.mjs): hidden from search and the sitemap.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Page() {
  return <Root data={null} />;
}
