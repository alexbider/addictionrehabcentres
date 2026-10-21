import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Root as CentreView } from '@/views/Centre';
import { centreData } from '@/lib/centre';
import { getPageByRoute, getPublished } from '@/lib/content';
import { JsonLd, pageMetadata } from '@/lib/metadata';
import TrackListing from '@/components/TrackListing';
import { routeToSlug } from '@/lib/slug';

// The 15 centres the source serves under /search-listing/<slug>/ keep that URL.
export const dynamicParams = false;
const route = (slug: string) => `/search-listing/${slug}/`;

export function generateStaticParams() {
  return getPublished().filter((e) => e.route.startsWith('/search-listing/')).map((e) => ({ slug: e.route.split('/')[2] }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = getPageByRoute(route((await params).slug));
  return page ? pageMetadata(page) : {};
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const page = getPageByRoute(route((await params).slug));
  if (!page) notFound();
  return (<><JsonLd page={page} /><TrackListing entity="centre" slug={routeToSlug(page.route)} /><CentreView data={centreData(page)} /></>);
}
