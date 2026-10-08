import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ContentPage from '@/components/ContentPage';
import ListingPage from '@/components/ListingPage';
import PostPage from '@/components/PostPage';
import CentrePage from '@/components/CentrePage';
import { Root as ProvinceView } from '@/views/Province';
import { provinceData } from '@/lib/province';
import { getPageByRoute, getPublished } from '@/lib/content';
import { JsonLd, pageMetadata } from '@/lib/metadata';

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublished().filter((e) => /^\/[^/]+\/$/.test(e.route) && e.route !== '/blog/').map((e) => ({ slug: e.route.slice(1, -1) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = getPageByRoute(`/${(await params).slug}/`);
  return page ? pageMetadata(page) : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const page = getPageByRoute(`/${(await params).slug}/`);
  if (!page) notFound();
  return (
    <>
      <JsonLd page={page} />
      {page.page_type === 'centre' ? <CentrePage page={page} /> : page.page_type === 'blog-post' ? <PostPage page={page} /> : page.listing && page.page_type === 'province' ? <ProvinceView data={provinceData(page)} /> : page.listing ? <ListingPage page={page} /> : <ContentPage page={page} />}
    </>
  );
}
