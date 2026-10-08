import { getPage, getPublished } from '@/lib/content';
import { categorySlug } from '@/lib/blog';

export type BlogListPost = { title: string; excerpt: string; category: string; categories: string[]; date: string; href: string; image: { src: string; alt: string; width: number | null; height: number | null } | null };

/** Published blog posts in the source's order, with the data the Blog view lists (shared by /blog/ and the /category/ archives). */
export function blogListPosts(): BlogListPost[] {
  const page = getPage('blog')!;
  const published = getPublished();
  const seen = new Set<string>();
  const posts: BlogListPost[] = [];
  for (const c of page.blog_cards ?? []) {
    const e = published.find((x) => x.route === c.path);
    if (!e || seen.has(c.path)) continue;
    seen.add(c.path);
    const post = e.type === 'blog-post' ? getPage(e.slug)?.post : undefined;
    const categories = post?.categories ?? [];
    posts.push({ title: c.title, excerpt: c.excerpt, category: categories[0] ?? '', categories, date: post?.date_label ?? '', href: c.path, image: c.image ? { src: c.image.local_path, alt: c.image.alt, width: c.image.width ?? null, height: c.image.height ?? null } : null });
  }
  return posts;
}

export function categoryChips(posts: BlogListPost[]) {
  const count = new Map<string, { slug: string; label: string; count: number }>();
  for (const p of posts) for (const label of p.categories) { const slug = categorySlug(label); const e = count.get(slug) ?? { slug, label, count: 0 }; e.count++; count.set(slug, e); }
  return [...count.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
