import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Root } from '@/views/Blog';
import { getPageByRoute, getPublished } from '@/lib/content';
import { blogListPosts, categoryChips } from '@/lib/blogposts';
import { JsonLd, pageMetadata } from '@/lib/metadata';

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublished().flatMap((e) => {
    const m = e.route.match(/^\/category\/([^/]+)\/page\/(\d+)\/$/);
    return m ? [{ slug: m[1], n: m[2] }] : [];
  });
}

const routeOf = async (params: Promise<{ slug: string; n: string }>) => {
  const { slug, n } = await params;
  return `/category/${slug}/page/${n}/`;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string; n: string }> }): Promise<Metadata> {
  const page = getPageByRoute(await routeOf(params));
  return page ? pageMetadata(page) : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string; n: string }> }) {
  const page = getPageByRoute(await routeOf(params));
  if (!page?.category) notFound();
  const all = blogListPosts();
  const want = new Set(page.category.posts);
  const posts = all.filter((p) => want.has(p.href));
  return (
    <>
      <JsonLd page={page} />
      <Root posts={posts} cats={categoryChips(all)} heading={page.h1} />
    </>
  );
}
