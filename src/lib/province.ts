import type { Block, Card, Page } from '@/lib/content';
import { getIndex, isPublishedRoute, routeExists } from '@/lib/content';
import { provinceNav, provinceNavItems } from '@/lib/provinces';

export type ProvinceData = {
  h1: string;
  h2: string;
  intro: string[];
  cards: { name: string; href: string | null; address: string; excerpt: string; category: string; image: { src: string; alt: string; width: string | number | null; height: string | number | null } | null }[];
  guide: Block[];
  othersHeading: string;
  others: { label: string; href: string | null; heading: boolean }[];
  provinceName: string;
  updated: string;
  archive: boolean;
};

/** Province / city-archive page JSON → props for the approved Province view (src/views/Province.jsx). Source content only. */
export function provinceData(page: Page): ProvinceData {
  const rows = page.rows.filter((r) => r.columns.some((c) => c.blocks.length) && !r.classes.includes('bottomWidget'));
  const banner = rows.find((r) => r.kind === 'listing-banner');
  const bannerBlocks = banner?.columns.flatMap((c) => c.blocks) ?? [];
  const h2 = bannerBlocks.find((b) => b.type === 'h2');
  const rest = rows.filter((r) => r !== banner).flatMap((r) => r.columns.flatMap((c) => c.blocks));
  const byHref = new Map((page.listing?.cards ?? []).map((c) => [c.href, c]));
  const seen = new Set<string>();
  const cards: ProvinceData['cards'] = [];
  const before: Block[] = [];
  const guide: Block[] = [];
  let sawCards = false;
  for (const b of rest) {
    if (b.type === 'cards') {
      sawCards = true;
      for (const h of b.hrefs) {
        const c: Card | undefined = byHref.get(h);
        if (!c || seen.has(h)) continue;
        seen.add(h);
        const path = new URL(c.href).pathname;
        cards.push({ name: c.name, href: isPublishedRoute(path) ? path : null, address: c.address, excerpt: c.excerpt, category: c.category, image: c.image ? { src: c.image.local_path, alt: c.image.alt, width: c.image.width ?? null, height: c.image.height ?? null } : null });
      }
    } else (sawCards ? guide : before).push(b);
  }
  // Text before the cards is the page intro (hero paragraph) when it is plain paragraphs; anything else stays in the guide, in order.
  const introOnly = before.every((b) => b.type === 'p' && 'html' in b);
  const intro = introOnly ? before.map((b) => (b as { html: string }).html) : [];
  if (!introOnly) guide.unshift(...before);
  const others = provinceNavItems(routeExists, page.route);
  const cat = cards.length ? (page.listing?.cards ?? [])[0]?.category ?? '' : '';
  const mod = getIndex().find((e) => e.route === page.route)?.modified;
  const updated = mod ? new Date(mod).toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }) : '';
  const archive = page.page_type === 'city-archive';
  return { archive, provinceName: archive ? page.h1 : cat.replace(/ Rehabs$/, '') || page.h1.replace(/ Rehabs$/, ''), updated, h1: page.h1, h2: h2 && 'text' in h2 ? h2.text : '', intro, cards, guide, othersHeading: provinceNav.heading, others };
}
