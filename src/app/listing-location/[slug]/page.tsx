import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Root as CityView } from '@/views/City';
import { cityData } from '@/lib/city';
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
      <CityView data={cityData(page)} />
    </>
  );
}
