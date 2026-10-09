import type { Metadata } from 'next';
import { Root } from '@/views/CentreOnboarding';

// Live page (the Centre onboarding design): linked from the header ("List Your Centre") and the Claim page, in the sitemap.
export const metadata: Metadata = {
  title: 'List Your Centre | Addiction Rehab Centres Canada',
  description: 'Create a verified profile for your addiction treatment centre on Addiction Rehab Centres Canada: add your details, programs, photos and contact information.',
  alternates: { canonical: '/centre-onboarding/' },
  openGraph: { title: 'List Your Centre | Addiction Rehab Centres Canada', url: '/centre-onboarding/', type: 'website' },
};

export default function Page() {
  return <Root />;
}
