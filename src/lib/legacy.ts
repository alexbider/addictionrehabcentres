import type { Block, Page } from '@/lib/content';
import { getPage, getPublished, isPublishedRoute, routeExists } from '@/lib/content';
import { provinceNavItems } from '@/lib/provinces';

export type LegacyData = {
  h1: string;
  bannerImage: { src: string; alt: string; width: number | null; height: number | null } | null;
  article: Block[];
  helpHeading: string;
  helpBlocks: Block[];
  helpLinks: { label: string; href: string }[];
  provinces: { label: string; href: string | null; heading: boolean }[];
  otherDrugs: { label: string; href: string }[];
};

const strip = (h: string) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

/** WPBakery-style source page (hero banner, text+image rows, CTA banner, help block, "Let Us Help You" list) →
 *  props for the Drug / Intervention views. Source text, images and links only, in source order. */
const normT = (t: string) => t.replace(/[\u2018\u2019]/g, "'").replace(/\s+/g, ' ').trim().toLowerCase();

/** The scraper reads some WPBakery headings (<h2> in a text column) as paragraphs. When a paragraph is exactly a heading of the live source outline
 *  it is rendered as that heading (same text, same level); nothing else changes. */
/** Centre cards only link to centres that have a page; others (out of scope or thin) are shown as text. */
function unlinkMissing(blocks: Block[]): Block[] {
  return blocks.map((b) => (b.type === 'centre-cards' ? { ...b, items: b.items.map((it) => (isPublishedRoute(it.href) ? it : { ...it, href: '' })) } : b));
}

function promote(blocks: Block[], page: Page): Block[] {
  const outline = (page.head?.headings ?? []).filter(([l]) => l !== 'h1').map(([l, t]) => [l, normT(t)] as [string, string]);
  const used = new Set<number>();
  const present = new Set(blocks.filter((b) => /^h[2-6]$/.test(b.type)).map((b) => normT((b as { text: string }).text)));
  return unlinkMissing(blocks).map((b) => {
    if (b.type !== 'p' || !('html' in b)) return b;
    const t = normT(strip(b.html));
    if (!t || present.has(t)) return b;
    const k = outline.findIndex(([, x], i) => x === t && !used.has(i));
    if (k < 0) return b;
    used.add(k);
    return { type: outline[k][0] as 'h2', text: strip(b.html), html: b.html } as Block;
  });
}

export function legacyData(page: Page): LegacyData {
  const rows = page.rows;
  const hero = rows.find((r) => r.kind === 'hero-banner');
  const article: Block[] = [];
  const helpBlocks: Block[] = [];
  let helpHeading = '';
  const helpLinks: { label: string; href: string }[] = [];
  for (const r of rows) {
    if (r === hero) continue;
    const flat = r.columns.flatMap((c) => c.blocks);
    if (r.kind === 'help-block') {
      article.push(...promote(flat, page));
      continue;
    }
    // trailing "Let Us Help You" row: H3 + list of links
    if (r.kind === 'row' && flat[0]?.type === 'h3' && flat.some((b) => b.type === 'ul') && flat.every((b) => b.type === 'h3' || b.type === 'ul')) {
      helpHeading = (flat[0] as { text: string }).text;
      for (const b of flat) if (b.type === 'ul') for (const it of b.items) { const m = it.html.match(/href="([^"]+)"/); helpLinks.push({ label: strip(it.html), href: m ? m[1] : '' }); }
      continue;
    }
    article.push(...promote(flat, page));
  }
  if (!rows.length && page.blocks?.length) article.push(...promote(page.blocks.filter((b, i) => !(i === 0 && b.type === 'h1')), page));
  const bg = hero?.background_image ?? null;
  const drugs = getPublished().filter((e) => e.type === 'drug' && e.route !== page.route);
  return {
    h1: page.h1,
    bannerImage: bg ? { src: bg, alt: '', width: hero?.background_dims?.[0] ?? null, height: hero?.background_dims?.[1] ?? null } : null,
    article,
    helpHeading,
    helpBlocks,
    helpLinks: helpLinks.filter((l) => l.href),
    provinces: provinceNavItems(routeExists, page.route),
    otherDrugs: drugs.map((e) => ({ label: getPage(e.slug)?.h1 ?? e.title, href: e.route })).filter((d) => isPublishedRoute(d.href)),
  };
}

/** Drug view: the 24 drug pages and the text-only province pages (no centre cards). Intervention view: treatment / support pages. */
export const isDrugView = (p: Page) => p.page_type === 'drug' || (p.page_type === 'province' && !(p.listing?.cards?.length));
export const isAlcoholView = (p: Page) => p.page_type === 'alcohol';
export const isInterventionView = (p: Page) => p.page_type === 'treatment-support' || p.page_type === 'support-service' || p.page_type === 'intervention' || p.page_type === 'about-info' || p.page_type === 'legal';
