import type { Metadata } from 'next';
import { Root } from '@/views/Centre';

// Design sample route (template with placeholder content): not part of the launch, hidden from search.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Page() {
  return <Root />;
}
