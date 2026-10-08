import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Root as CityView } from '@/views/City';
import { cityData } from '@/lib/city';
import { getPageByRoute, getPublished } from '@/lib/content';
import { JsonLd, pageMetadata } from '@/lib/metadata';

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublished().flatMap((e) => {
    const m = e.route.match(/^\/listing-location\/([^/]+)\/page\/(\d+)\/$/);
    return m ? [{ slug: m[1], n: m[2] }] : [];
  });
}

const routeOf = async (params: Promise<{ slug: string; n: string }>) => {
  const { slug, n } = await params;
  return `/listing-location/${slug}/page/${n}/`;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string; n: string }> }): Promise<Metadata> {
  const page = getPageByRoute(await routeOf(params));
  return page ? pageMetadata(page) : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string; n: string }> }) {
  const page = getPageByRoute(await routeOf(params));
  if (!page || !page.listing) notFound();
  return (
    <>
      <JsonLd page={page} />
      <CityView data={cityData(page)} />
    </>
  );
}
