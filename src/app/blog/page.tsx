import type { Metadata } from 'next';
import BlogIndex, { type BlogCat, type BlogItem } from '@/components/BlogIndex';
import PageShell from '@/components/PageShell';
import SiteFooter from '@/components/SiteFooter';
import { getPage, getPublished, getRoutes } from '@/lib/content';
import { categorySlug } from '@/lib/blog';
import { JsonLd, pageMetadata } from '@/lib/metadata';

export function generateMetadata(): Metadata {
  const page = getPage('blog');
  return page ? pageMetadata(page) : {};
}

export default function BlogPage() {
  const page = getPage('blog')!;
  const seen = new Set<string>();
  const items: BlogItem[] = [];
  for (const c of page.blog_cards ?? []) {
    const post = getPublished().find((e) => e.route === c.path);
    if (!post || seen.has(c.path)) continue; // unpublished (thin) posts are not listed
    seen.add(c.path);
    const meta = post.type === 'blog-post' ? getPage(post.slug)?.post : undefined;
    const categories = meta?.categories ?? [];
    items.push({ path: c.path, title: c.title, excerpt: c.excerpt, categories, categorySlugs: categories.map(categorySlug), image: c.image ? { alt: c.image.alt, src: c.image.local_path, width: c.image.width, height: c.image.height } : null });
  }
  const count = new Map<string, BlogCat>();
  for (const i of items) i.categories.forEach((label, k) => { const slug = i.categorySlugs[k]; const e = count.get(slug) ?? { slug, label, count: 0 }; e.count++; count.set(slug, e); });
  const cats = [...count.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  return (
    <>
      <JsonLd page={page} />
      <PageShell routes={getRoutes()}>
        <main>
          <section style={{ background: 'radial-gradient(1000px 500px at 85% -10%,#dbeefb 0%,rgba(219,238,251,0) 60%),#f7fafd', borderBottom: '1px solid #e9eff5' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '72px 32px 48px' }} data-rc-wrap="1">
              <h1 style={{ fontSize: '54px', lineHeight: 1.05, color: '#10233a' }} data-rc-lg="1">{page.h1}</h1>
            </div>
          </section>
          <BlogIndex items={items} cats={cats} />
        </main>
        <SiteFooter />
      </PageShell>
    </>
  );
}
