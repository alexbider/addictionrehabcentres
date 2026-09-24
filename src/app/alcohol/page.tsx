import type { Metadata } from 'next';
import { Root } from '@/views/Alcohol';

export const metadata: Metadata = {
  title: { absolute: "Alcohol Addiction | Addiction Treatment Centres for Alcohol in Canada" },
  description: "Find the best Alcohol Addiction Treatment Centres in Canada. If you or someone you know is struggling with this Alcohol addiction please call us today at 1-855-885-4747",
  alternates: { canonical: "https://addictionrehabcenters.ca/addiction-by-alcohol/" }
};

export default function Page() {
  return <Root />;
}
