import fs from 'node:fs';
import path from 'node:path';

const DIR = path.join(process.cwd(), 'content');
import { SITE_URL } from './site';
export const SITE = SITE_URL;

export type Block =
  | { type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; text: string; html: string }
  | { type: 'p' | 'blockquote'; text: string; html: string }
  | { type: 'ul' | 'ol'; ordered: boolean; items: { text: string; html: string }[] }
  | { type: 'table'; text: string; html: string }
  | { type: 'image'; src: string; alt: string; width?: string | null; height?: string | null }
  | { type: 'link'; text: string; href: string; new_href: string }
  | { type: 'text'; text: string; was_link?: boolean }
  | { type: 'iframe'; src: string; title: string; width?: string | null; height?: string | null }
  | { type: 'video'; provider: string; url: string; id: string }
  | { type: 'tabs'; tabs: { title: string; blocks: Block[] }[] }
  | { type: 'accordion'; items: { title: string; blocks: Block[] }[] }
  | { type: 'centre-cards'; items: { name: string; href: string; address: string; excerpt: string; category: string; image: { src: string; alt: string; width?: number | null; height?: number | null } | null }[] }
  | { type: 'cards'; hrefs: string[] };

export type Row = {
  kind: 'hero-banner' | 'listing-banner' | 'content' | 'cta-banner' | 'help-block' | 'listing' | 'row';
  classes: string[];
  background_image: string | null;
  columns: { classes: string[]; blocks: Block[] }[];
};

export type Page = {
  slug: string;
  route: string;
  page_type: string;
  template: string;
  seo: {
    meta_title: string;
    meta_description: string;
    canonical_source: string;
    og: { title: string; description: string; image: string | null; type: string };
    jsonld_source: unknown[];
  };
  h1: string;
  word_count: number;
  source: { url: string; path: string; robots: string };
  rows: Row[];
  blocks?: Block[];
  post?: { published: string; modified: string; date_label: string; categories: string[]; featured_image: string };
  blog_cards?: { path: string; title: string; excerpt: string; image: { alt: string; local_path: string; width?: number; height?: number } | null }[];
  centre?: CentreData;
  listing?: { cards: Card[]; source_listing_count: number; duplicates_removed: number };
};

export type CentreData = {
  name: string; categories: string[]; reviews_count: string;
  phone_text: string; phone_href: string; email: string; website: string; website_text: string; address: string;
  social: Record<string, string>; social_title: string;
  gallery: { src: string; alt: string; width?: number | null; height?: number | null }[];
  about_blocks: Block[];
  specialty_groups: { heading: string; items: string[]; text: string }[];
  info_items: { label: string; value: string }[];
  faq_heading: string; faqs: { question: string; answer_blocks: Block[] }[];
  hours: { heading: string; rows: [string, string][] };
  tags: { heading: string; items: string[] };
  sponsor: { label: string; title: string; text: string; href: string; image: { src: string; alt: string; width?: number | null; height?: number | null } | null } | null;
};

export type Card = {
  name: string; href: string; slug: string; address: string; excerpt: string; category: string; reviews: number;
  image: { local_path: string; alt: string; width?: string | null; height?: string | null } | null;
};

export type IndexEntry = { slug: string; route: string; type: string; title: string; published: boolean; reason: string; modified: string | null; noindex?: boolean };

let cache: IndexEntry[] | null = null;
export function getIndex(): IndexEntry[] {
  if (!cache) cache = JSON.parse(fs.readFileSync(path.join(DIR, '_index.json'), 'utf8'));
  return cache!;
}
export const getPublished = () => getIndex().filter((e) => e.published);
export function getPage(slug: string): Page | null {
  const e = getIndex().find((x) => x.slug === slug && x.published);
  if (!e) return null;
  return JSON.parse(fs.readFileSync(path.join(DIR, slug + '.json'), 'utf8'));
}
export function getPageByRoute(route: string): Page | null {
  const e = getIndex().find((x) => x.route === route && x.published);
  return e ? getPage(e.slug) : null;
}
/** Routes that exist in the app: published content pages + the few hand-built static routes. */
import redirects from './redirects.json';

const STATIC_ROUTES = new Set(['/', '/contact/', '/blog/', '/intervention/']);
let routes: Set<string> | null = null;
const routeSet = () => (routes ??= new Set([...STATIC_ROUTES, ...getPublished().map((e) => e.route), ...redirects.map((r) => r.source + '/')]));
export function routeExists(route: string): boolean {
  const p = route.split('#')[0].split('?')[0];
  return routeSet().has(p.endsWith('/') ? p : p + '/');
}
/** Published pages and hand-built static routes only (redirect sources excluded) — used so cards link to real pages, never to a 301. */
export function isPublishedRoute(route: string): boolean {
  const p = route.split('#')[0].split('?')[0];
  const r = p.endsWith('/') ? p : p + '/';
  return STATIC_ROUTES.has(r) || getPublished().some((e) => e.route === r);
}
/** Every route that resolves (published pages, hand-built static pages, approved redirects) — passed to the header so it can hide dead links. */
export const getRoutes = () => [...routeSet()];
