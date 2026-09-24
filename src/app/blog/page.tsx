import type { Metadata } from 'next';
import { Root } from '@/views/Blog';

export const metadata: Metadata = {
  title: { absolute: "Addiction & Recovery Blog | Addiction Rehab Centres Canada" },
  description: "Evidence-based guides on alcohol and drug addiction, detox, treatment options, intervention and recovery in Canada. Written and reviewed by addiction professionals.",
  alternates: { canonical: "https://addictionrehabcenters.ca/blog/" }
};

export default function Page() {
  return <Root />;
}
