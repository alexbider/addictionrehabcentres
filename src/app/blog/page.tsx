import type { Metadata } from 'next';
import { Root } from '@/views/Blog';
import { getPage } from '@/lib/content';
import { blogListPosts, categoryChips } from '@/lib/blogposts';
import { JsonLd, pageMetadata } from '@/lib/metadata';

// Approved Blog design (src/views/Blog.jsx) filled with the real published posts. Title, description, canonical and
// JSON-LD are the source's. Sections of the design that have no source data are hidden by the view.
export function generateMetadata(): Metadata {
  const page = getPage('blog');
  return page ? pageMetadata(page) : {};
}

export default function BlogPage() {
  const page = getPage('blog')!;
  const posts = blogListPosts();
  return (
    <>
      <JsonLd page={page} />
      <Root posts={posts} cats={categoryChips(posts)} heading={page.h1} />
    </>
  );
}
