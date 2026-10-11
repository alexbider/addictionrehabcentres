import type { Metadata } from 'next';
import { assertDesignRoute } from '@/lib/design-routes';
import { Root } from '@/views/Alcohol';

export const metadata: Metadata = {
  title: { absolute: "Alcohol Addiction | Addiction Treatment Centres for Alcohol in Canada" },
  description: "Find the best Alcohol Addiction Treatment Centres in Canada. If you or someone you know is struggling with this Alcohol addiction please call us today at 1-855-885-4747",
  robots: { index: false, follow: false }
};

export default function Page() {
  assertDesignRoute(); // design sample page: 404 in production
  return <Root />;
}
