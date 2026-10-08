import type { Metadata } from 'next';
import { Root } from '@/views/Blog';
import { getPage, getPublished } from '@/lib/content';
import { categorySlug } from '@/lib/blog';
import { JsonLd, pageMetadata } from '@/lib/metadata';

// Approved Blog design (src/views/Blog.jsx) filled with the real published posts. Title, description, canonical and
// JSON-LD are the source's. Sections of the design that have no source data are hidden by the view.
export function generateMetadata(): Metadata {
  const page = getPage('blog');
  return page ? pageMetadata(page) : {};
}

export default function BlogPage() {
  const page = getPage('blog')!;
  const published = getPublished();
  const seen = new Set<string>();
  const posts: { title: string; excerpt: string; category: string; categories: string[]; date: string; href: string; image: { src: string; alt: string; width: number | null; height: number | null } | null }[] = [];
  for (const c of page.blog_cards ?? []) {
    const e = published.find((x) => x.route === c.path);
    if (!e || seen.has(c.path)) continue;
    seen.add(c.path);
    const post = e.type === 'blog-post' ? getPage(e.slug)?.post : undefined;
    const categories = post?.categories ?? [];
    posts.push({ title: c.title, excerpt: c.excerpt, category: categories[0] ?? '', categories, date: post?.date_label ?? '', href: c.path, image: c.image ? { src: c.image.local_path, alt: c.image.alt, width: c.image.width ?? null, height: c.image.height ?? null } : null });
  }
  const count = new Map<string, { slug: string; label: string; count: number }>();
  for (const p of posts) for (const label of p.categories) { const slug = categorySlug(label); const e = count.get(slug) ?? { slug, label, count: 0 }; e.count++; count.set(slug, e); }
  const cats = [...count.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  return (
    <>
      <JsonLd page={page} />
      <Root posts={posts} cats={cats} heading={page.h1} />
    </>
  );
}
