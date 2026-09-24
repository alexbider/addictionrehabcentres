import type { Metadata } from 'next';
import { Root } from '@/views/Intervention';

export const metadata: Metadata = {
  title: { absolute: "How to Perform an Intervention: Drugs or Alcohol Addiction" },
  description: "Learn what an intervention is, advantages of trying interventions and procedures involved in performing an intervention for a substance abusing loved one.",
  alternates: { canonical: "https://addictionrehabcenters.ca/intervention/" }
};

export default function Page() {
  return <Root />;
}
