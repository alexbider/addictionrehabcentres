import type { Metadata } from 'next';
import { Root } from '@/views/Contact';

export const metadata: Metadata = {
  title: { absolute: "Contact Us - Addiction Rehab Centres Canada" },
  description: "Contact Addiction Rehab Centres Canada. Call our free 24/7 helpline, email our team, or send a message about treatment, listings or partnerships.",
  alternates: { canonical: "https://addictionrehabcenters.ca/contact/" }
};

export default function Page() {
  return <Root />;
}
