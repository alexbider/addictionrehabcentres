import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Root } from '@/views/Blog';
import { getPageByRoute, getPublished } from '@/lib/content';
import { blogListPosts, categoryChips } from '@/lib/blogposts';
import { JsonLd, pageMetadata } from '@/lib/metadata';

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublished().flatMap((e) => (/^\/category\/[^/]+\/$/.test(e.route) ? [{ slug: e.route.split('/')[2] }] : []));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = getPageByRoute(`/category/${(await params).slug}/`);
  return page ? pageMetadata(page) : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const page = getPageByRoute(`/category/${(await params).slug}/`);
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
