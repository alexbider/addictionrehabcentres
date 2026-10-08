import type { Metadata } from 'next';
import { Root } from '@/views/MenuOptions';

// Draft page (internal header design board): hidden from search and navigation.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Page() {
  return <Root />;
}
