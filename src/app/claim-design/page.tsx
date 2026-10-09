import type { Metadata } from 'next';
import { Root } from '@/views/ClaimListing';

// Design sample route (the Claim design with its own sample directory, used by audit/scripts/compare-design.mjs): hidden from search and the sitemap.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Page() {
  return <Root />;
}
