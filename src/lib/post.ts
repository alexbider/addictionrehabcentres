import type { Block, Page } from '@/lib/content';
import { getPage, getPublished } from '@/lib/content';
import { categorySlug } from '@/lib/blog';

/** Posts rendered with the approved BlogPost view so far (prototype); all other posts keep PostPage until their batch. */


const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const label = (iso: string) => { const d = new Date(iso); return isNaN(+d) ? '' : `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`; };

export type PostLink = { title: string; href: string | null; image: { src: string; alt: string; width: number | string | null; height: number | string | null } | null; category: string; excerpt: string; date: string };

export type PostData = {
  title: string;
  url: string;
  categories: { label: string; href: string }[];
  catHref: string;
  published: string;
  publishedLabel: string;
  modified: string;
  modifiedLabel: string;
  hero: { src: string; alt: string; width: number | string | null; height: number | string | null } | null;
  body: Block[];
  related: PostLink[];
  prev: PostLink | null;
  next: PostLink | null;
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
  // Related posts and previous/next are the ones the live source shows (title, link, thumbnail alt, date); the picture is the
  // target post's own featured image. A target that is not published (thin post) is shown without a link.
  const published = getPublished();
  const route = (h: string) => { try { return new URL(h).pathname; } catch { return h; } };
  const heroOf = (slug: string) => {
    const bl = getPage(slug)?.blocks ?? [];
    const k = bl.findIndex((x) => x.type === 'h1');
    return (k > 0 ? bl.slice(0, k) : []).find((x): x is Extract<Block, { type: 'image' }> => x.type === 'image') ?? null;
  };
  const resolve = (r: { title: string; href: string; alt: string | null; date?: string }) => {
    const rt = route(r.href);
    const e = published.find((x) => x.route === rt && x.type === 'blog-post');
    const hero = e ? heroOf(e.slug) : null;
    const target = e ? getPage(e.slug) : null;
    const card = (getPage('blog')?.blog_cards ?? []).find((c) => c.path === rt);
    const excerpt = card?.excerpt ?? '';
    // the picture the source shows is the post's blog-index thumbnail; fall back to the post's own first image
    const pic = card?.image ? { src: card.image.local_path, width: card.image.width ?? null, height: card.image.height ?? null } : hero ? { src: hero.src, width: hero.width ?? null, height: hero.height ?? null } : null;
    return { title: r.title, href: e ? rt : null, image: pic ? { src: pic.src, alt: r.alt ?? '', width: pic.width, height: pic.height } : null, category: target?.post?.categories?.[0] ?? '', excerpt, date: r.date ?? target?.post?.date_label ?? '' };
  };
  const related = (page.head?.related ?? []).map(resolve);
  const prev = page.head?.nav?.prev ? resolve(page.head.nav.prev) : null;
  const next = page.head?.nav?.next ? resolve(page.head.nav.next) : null;
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
    hero: hero ? { src: hero.src, alt: hero.alt, width: hero.width ?? null, height: hero.height ?? null } : null,
    body,
    related,
    prev,
    next,
  };
}
