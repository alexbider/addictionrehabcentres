import type { Block, Page } from '@/lib/content';
import { getPage, getPublished, isPublishedRoute, routeExists } from '@/lib/content';
import { provinceNavItems } from '@/lib/provinces';

export type LegacyData = {
  h1: string;
  bannerImage: { src: string; alt: string } | null;
  article: Block[];
  helpHeading: string;
  helpParagraphs: string[];
  helpLinks: { label: string; href: string }[];
  provinces: { label: string; href: string | null }[];
  otherDrugs: { label: string; href: string }[];
};

const strip = (h: string) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

/** WPBakery-style source page (hero banner, text+image rows, CTA banner, help block, "Let Us Help You" list) →
 *  props for the Drug / Intervention views. Source text, images and links only, in source order. */
export function legacyData(page: Page): LegacyData {
  const rows = page.rows;
  const hero = rows.find((r) => r.kind === 'hero-banner');
  const article: Block[] = [];
  const helpParagraphs: string[] = [];
  let helpHeading = '';
  const helpLinks: { label: string; href: string }[] = [];
  for (const r of rows) {
    if (r === hero) continue;
    const flat = r.columns.flatMap((c) => c.blocks);
    if (r.kind === 'help-block') {
      for (const b of flat) if (b.type === 'p' && 'html' in b) helpParagraphs.push(b.html);
      continue;
    }
    // trailing "Let Us Help You" row: H3 + list of links
    if (r.kind === 'row' && flat[0]?.type === 'h3' && flat.some((b) => b.type === 'ul') && flat.every((b) => b.type === 'h3' || b.type === 'ul')) {
      helpHeading = (flat[0] as { text: string }).text;
      for (const b of flat) if (b.type === 'ul') for (const it of b.items) { const m = it.html.match(/href="([^"]+)"/); helpLinks.push({ label: strip(it.html), href: m ? m[1] : '' }); }
      continue;
    }
    article.push(...flat);
  }
  const bg = hero?.background_image ?? null;
  const drugs = getPublished().filter((e) => e.type === 'drug' && e.route !== page.route);
  return {
    h1: page.h1,
    bannerImage: bg ? { src: bg, alt: '' } : null,
    article,
    helpHeading,
    helpParagraphs,
    helpLinks: helpLinks.filter((l) => l.href),
    provinces: provinceNavItems(routeExists, page.route),
    otherDrugs: drugs.map((e) => ({ label: getPage(e.slug)?.h1 ?? e.title, href: e.route })).filter((d) => isPublishedRoute(d.href)),
  };
}

/** Pages rendered on the Drug view (drug pages + the text-only Yukon province page) and on the Intervention view (treatment/support pages)
 *  so far — prototype set; everything else still uses the old component until its batch. */
export const DRUG_VIEW_SLUGS = new Set(['heroin-addiction', 'cocaine-addiction', 'yukon-drug-rehab-treatments']);
export const INTERVENTION_VIEW_SLUGS = new Set(['aa-support-group', 'drug-alcohol-helpline']);
