import type { Metadata } from 'next';
import { assertDesignRoute } from '@/lib/design-routes';
import { Root } from '@/views/Drug';

// Design sample route (template with placeholder content): not part of the launch, hidden from search.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Page() {
  assertDesignRoute(); // design sample page: 404 in production
  return <Root />;
}
