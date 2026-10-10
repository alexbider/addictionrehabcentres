import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Root } from '@/views/ClaimListing';

// Design sample route (the Claim design with its own sample directory, used by audit/scripts/compare-design.mjs): hidden from search and the sitemap.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Page() {
  // Test route for audit/scripts/compare-design.mjs: only served by `next dev` (or ENABLE_DESIGN_ROUTES=1), a 404 in production.
  if (process.env.NODE_ENV === 'production' && process.env.ENABLE_DESIGN_ROUTES !== '1') notFound();
  return <Root />;
}
