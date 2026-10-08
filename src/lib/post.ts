import type { Block, Page } from '@/lib/content';
import { getPage, getPublished } from '@/lib/content';
import { categorySlug } from '@/lib/blog';

/** Posts rendered with the approved BlogPost view so far (prototype); all other posts keep PostPage until their batch. */
export const POST_VIEW_SLUGS = new Set(['drug-abuse-explained', 'what-is-smart-recovery']);

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const label = (iso: string) => { const d = new Date(iso); return isNaN(+d) ? '' : `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`; };

export type PostData = {
  title: string;
  url: string;
  categories: { label: string; href: string }[];
  catHref: string;
  published: string;
  publishedLabel: string;
  modified: string;
  modifiedLabel: string;
  hero: { src: string; alt: string } | null;
  body: Block[];
  related: { title: string; href: string; image: { src: string; alt: string } | null; category: string; excerpt: string; date: string }[];
  prev: { title: string; href: string } | null;
  next: { title: string; href: string } | null;
};

/** Blog post JSON → props for the approved BlogPost view. Source fields only: category, date, title, featured image, body.
 *  No author, reviewer, read time, key takeaways, FAQ block, tags, sources or featured centres (the source has none of them). */
export function postData(page: Page): PostData {
  const blocks = page.blocks ?? [];
  const h1 = blocks.findIndex((b) => b.type === 'h1');
  const lead = h1 > 0 ? blocks.slice(0, h1) : [];
  const hero = lead.find((b): b is Extract<Block, { type: 'image' }> => b.type === 'image');
  const body = blocks.slice(h1 >= 0 ? h1 + 1 : 0).map((b) => (b.type === 'h1' ? ({ ...b, type: 'h2' } as Block) : b));
  const cats = page.post?.categories ?? [];
  const catHref = cats[0] ? `/blog/?category=${categorySlug(cats[0])}` : '/blog/';
  // Related / adjacent: real posts of the same (first) category, in blog-index order (newest first).
  const cards = getPage('blog')?.blog_cards ?? [];
  const published = getPublished();
  const sameCat = cards
    .map((c) => { const e = published.find((x) => x.route === c.path && x.type === 'blog-post'); const p = e ? getPage(e.slug) : null; return { c, p }; })
    .filter((x) => x.p && cats[0] && x.p.post?.categories?.includes(cats[0]));
  const i = sameCat.findIndex((x) => x.c.path === page.route);
  const others = sameCat.filter((x) => x.c.path !== page.route);
  const related = others.slice(0, 3).map(({ c, p }) => ({ title: c.title, href: c.path, image: c.image ? { src: c.image.local_path, alt: c.image.alt } : null, category: cats[0], excerpt: c.excerpt, date: p!.post?.date_label ?? '' }));
  const prev = i >= 0 && sameCat[i + 1] ? { title: sameCat[i + 1].c.title, href: sameCat[i + 1].c.path } : null; // older
  const next = i > 0 ? { title: sameCat[i - 1].c.title, href: sameCat[i - 1].c.path } : null; // newer
  const pub = page.post?.published ?? '';
  const mod = page.post?.modified ?? '';
  return {
    title: page.h1,
    url: `https://addictionrehabcenters.ca${page.route}`,
    categories: cats.map((c) => ({ label: c, href: `/blog/?category=${categorySlug(c)}` })),
    catHref,
    published: pub.slice(0, 10),
    publishedLabel: page.post?.date_label ?? label(pub),
    modified: mod.slice(0, 10),
    modifiedLabel: mod && mod.slice(0, 10) !== pub.slice(0, 10) ? label(mod) : '',
    hero: hero ? { src: hero.src, alt: hero.alt } : null,
    body,
    related,
    prev,
    next,
  };
}
