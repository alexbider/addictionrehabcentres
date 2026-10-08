import type { Block, Card, Page } from '@/lib/content';
import { isPublishedRoute, routeExists } from '@/lib/content';
import { categoryRoute, provinceNav, provinceNavItems } from '@/lib/provinces';

export type CityData = {
  h1: string;
  h2: string;
  listHeading: string;
  listIntro: string[];
  cards: { name: string; href: string | null; address: string; excerpt: string; category: string; catHref: string | null; image: { src: string; alt: string; width: string | number | null; height: string | number | null } | null }[];
  guide: Block[];
  provinceLabel: string;
  provinceHref: string | null;
  othersHeading: string;
  others: { label: string; href: string | null; heading: boolean }[];
  popular: { label: string; href: string }[];
  pager: { current: number; prev: string | null; next: string | null; pages: { n: number; href: string }[] } | null;
};

// The design's "Popular types of rehab" links (design copy); only pages that exist on the site are linked.
const POPULAR: [string, string][] = [
  ['Detox Centres', '/detox-centres-in-canada/'], ['Residential Rehabs', '/residential-drug-rehabs-in-canada/'], ['Outpatient Rehab', '/outpatient-drug-rehab-centers/'],
  ['Medical Detox', '/medical-detox-in-canada/'], ['12 Step Programs', '/12-steps-programs/'], ['Men Only Rehabs', '/men-only-drug-rehabs-in-canada/'],
  ['Women Only Rehabs', '/women-only-rehab-centers-in-canada/'], ['Adolescent Rehab', '/adolescent-drug-rehab-center/'], ['Holistic Services', '/holistic-services-in-canada/'], ['Alcohol Addiction', '/addiction-by-alcohol/'],
];

const CODES: Record<string, string> = { AB: 'Alberta', BC: 'British Columbia', MB: 'Manitoba', NB: 'New Brunswick', NL: 'Newfoundland and Labrador', NS: 'Nova Scotia', NT: 'Northwest Territories', NU: 'Nunavut', ON: 'Ontario', PE: 'Prince Edward Island', QC: 'Quebec', SK: 'Saskatchewan', YT: 'Yukon' };
/** City archives: the province is read from the card addresses (the source archive has no province field); the most common code wins. */
function archiveProvince(cards: { address: string }[]): string {
  const n: Record<string, number> = {};
  for (const c of cards) { const m = c.address.match(/,\s*([A-Z]{2})\b/); if (m && CODES[m[1]]) n[m[1]] = (n[m[1]] ?? 0) + 1; }
  const top = Object.entries(n).sort((a, b) => b[1] - a[1])[0];
  return top ? CODES[top[0]] : '';
}

/** The source prints the centre name again at the start of the address ("Name, Name, street…"): show the name once. */
export function stripName(address: string, name: string): string {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return address.replace(new RegExp('^\\s*' + esc + '\\s*[,;:-]?\\s*', 'i'), '').trim() || address;
}

/** City ranking page JSON → props for the approved City view (src/views/City.jsx). Source content only. */
export function cityData(page: Page): CityData {
  const rows = page.rows.filter((r) => r.columns.some((c) => c.blocks.length) && !r.classes.includes('bottomWidget'));
  const banner = rows.find((r) => r.kind === 'listing-banner');
  const h2 = banner?.columns.flatMap((c) => c.blocks).find((b) => b.type === 'h2');
  const rest = rows.filter((r) => r !== banner).flatMap((r) => r.columns.flatMap((c) => c.blocks));
  const byHref = new Map((page.listing?.cards ?? []).map((c) => [c.href, c]));
  const seen = new Set<string>();
  const cards: CityData['cards'] = [];
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
        const cat = categoryRoute[c.category];
        cards.push({ name: c.name, href: isPublishedRoute(path) ? path : null, address: stripName(c.address, c.name), excerpt: c.excerpt, category: c.category, catHref: cat && isPublishedRoute(cat) ? cat : null, image: c.image ? { src: c.image.local_path, alt: c.image.alt, width: c.image.width ?? null, height: c.image.height ?? null } : null });
      }
    } else (sawCards ? guide : before).push(b);
  }
  // Before the cards: an optional H2 (the list heading) followed by plain paragraphs (list intro); anything else goes to the guide, in order.
  let listHeading = '';
  let i = 0;
  if (before[0]?.type === 'h2') { listHeading = (before[0] as { text: string }).text; i = 1; }
  const tail = before.slice(i);
  const introOnly = tail.every((b) => b.type === 'p' && 'html' in b);
  const listIntro = introOnly ? tail.map((b) => (b as { html: string }).html) : [];
  if (!introOnly) guide.unshift(...before);
  const archive = page.page_type === 'city-archive';
  const cat = archive ? (archiveProvince(cards) ? archiveProvince(cards) + ' Rehabs' : '') : cards[0]?.category ?? '';
  const provinceHref = categoryRoute[cat] && isPublishedRoute(categoryRoute[cat]) ? categoryRoute[cat] : null;
  const others = provinceNavItems(routeExists, page.route);
  // Paginated archives (/listing-location/<city>/ + /page/N/): pager links only to pages that exist.
  const pm = page.route.match(/^(\/listing-location\/[^/]+\/)(?:page\/(\d+)\/)?$/);
  let pager: CityData['pager'] = null;
  if (archive && pm) {
    const base = pm[1];
    const cur = Number(pm[2] ?? 1);
    const pages = [{ n: 1, href: base }];
    for (let n = 2; routeExists(`${base}page/${n}/`); n++) pages.push({ n, href: `${base}page/${n}/` });
    if (pages.length > 1) pager = { current: cur, prev: cur > 1 ? pages[cur - 2].href : null, next: cur < pages.length ? pages[cur].href : null, pages };
  }
  return {
    pager,
    h1: page.h1, h2: h2 && 'text' in h2 ? h2.text : '', listHeading, listIntro, cards, guide,
    provinceLabel: cat.replace(/ Rehabs$/, ''), provinceHref,
    othersHeading: provinceNav.heading, others,
    popular: POPULAR.filter(([, h]) => isPublishedRoute(h)).map(([label, href]) => ({ label, href })),
  };
}
