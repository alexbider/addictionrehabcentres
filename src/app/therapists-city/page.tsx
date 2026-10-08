import type { Metadata } from 'next';
import { Root } from '@/views/TherapistsCity';

// Draft page (client design, no source content): hidden from search and navigation.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Page() {
  return <Root />;
}
