import type { Metadata } from 'next';
import { assertDesignRoute } from '@/lib/design-routes';
import { Root } from '@/views/MenuOptions';

// Draft page (internal header design board): hidden from search and navigation.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Page() {
  assertDesignRoute(); // design sample page: 404 in production
  return <Root />;
}
