import type { Block, Card, Page } from '@/lib/content';
import { isPublishedRoute, routeExists } from '@/lib/content';
import { categoryRoute, provinceNav } from '@/lib/provinces';

export type CityData = {
  h1: string;
  h2: string;
  listHeading: string;
  listIntro: string[];
  cards: { name: string; href: string | null; address: string; excerpt: string; category: string; catHref: string | null; image: { src: string; alt: string } | null }[];
  guide: Block[];
  provinceLabel: string;
  provinceHref: string | null;
  othersHeading: string;
  others: { label: string; href: string }[];
  popular: { label: string; href: string }[];
};

// The design's "Popular types of rehab" links (design copy); only pages that exist on the site are linked.
const POPULAR: [string, string][] = [
  ['Detox Centres', '/detox-centres-in-canada/'], ['Residential Rehabs', '/residential-drug-rehabs-in-canada/'], ['Outpatient Rehab', '/outpatient-drug-rehab-centers/'],
  ['Medical Detox', '/medical-detox-in-canada/'], ['12 Step Programs', '/12-steps-programs/'], ['Men Only Rehabs', '/men-only-drug-rehabs-in-canada/'],
  ['Women Only Rehabs', '/women-only-rehab-centers-in-canada/'], ['Adolescent Rehab', '/adolescent-drug-rehab-center/'], ['Holistic Services', '/holistic-services-in-canada/'], ['Alcohol Addiction', '/addiction-by-alcohol/'],
];

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
        cards.push({ name: c.name, href: isPublishedRoute(path) ? path : null, address: c.address, excerpt: c.excerpt, category: c.category, catHref: cat && isPublishedRoute(cat) ? cat : null, image: c.image ? { src: c.image.local_path, alt: c.image.alt } : null });
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
  const cat = cards[0]?.category ?? '';
  const provinceHref = categoryRoute[cat] && isPublishedRoute(categoryRoute[cat]) ? categoryRoute[cat] : null;
  const links = provinceNav.links.filter(([, h]) => routeExists(h) && h !== page.route);
  return {
    h1: page.h1, h2: h2 && 'text' in h2 ? h2.text : '', listHeading, listIntro, cards, guide,
    provinceLabel: cat.replace(/ Rehabs$/, ''), provinceHref,
    othersHeading: provinceNav.heading, others: links.map(([label, href]) => ({ label, href })),
    popular: POPULAR.filter(([, h]) => isPublishedRoute(h)).map(([label, href]) => ({ label, href })),
  };
}
