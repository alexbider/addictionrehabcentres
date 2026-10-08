import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ListingPage from '@/components/ListingPage';
import { Root as ProvinceView } from '@/views/Province';
import { provinceData } from '@/lib/province';
import { ROLLOUT } from '@/lib/rollout';
import { getPageByRoute, getPublished } from '@/lib/content';
import { JsonLd, pageMetadata } from '@/lib/metadata';

export const dynamicParams = false;

const PREFIX = '/listing-location/';

export function generateStaticParams() {
  return getPublished().filter((e) => e.route.startsWith(PREFIX) && /^\/listing-location\/[^/]+\/$/.test(e.route)).map((e) => ({ slug: e.route.slice(PREFIX.length, -1) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = getPageByRoute(`${PREFIX}${(await params).slug}/`);
  return page ? pageMetadata(page) : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const page = getPageByRoute(`${PREFIX}${(await params).slug}/`);
  if (!page) notFound();
  return (
    <>
      <JsonLd page={page} />
      {ROLLOUT.cityArchives && page.listing ? <ProvinceView data={provinceData(page)} /> : <ListingPage page={page} />}
    </>
  );
}
