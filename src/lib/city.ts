import type { Block, Card, Page } from '@/lib/content';
import { getPageByRoute, getPublished, isPublishedRoute, routeExists } from '@/lib/content';
import { centreByRoute, realCentres, PROVINCE_NAMES } from '@/lib/centres';
import { SHOW_SAMPLE_DATA } from '@/lib/rollout';
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
  m?: CityModel;
};

export type CityModel = {
  showSample: boolean; city: string; provinceName: string; year: string; updated: string; updatedLong: string;
  rankedLabel: string; isRanking: boolean; h1: string; h2: string; intro: string;
  cardExtra: { tags: string[]; price: string; length: string; slug: string }[];
  faqs: { question: string; answer: string }[];
  nearby: { label: string; href: string; code: string }[];
  sources: { text: string; links?: { label: string; href: string }[] }[];
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
    m: cityModel(page, { cards, cat, listHeading, listIntro, provinceHref }),
  };
}

/* ───────────────────────── view model: every design section filled, real data first ───────────────────────── */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const titleCase = (t: string) => t.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const stripHtml = (h: string) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#8217;|&rsquo;/g, '\u2019').replace(/\s+/g, ' ').trim();
const PROV_CODE: Record<string, string> = Object.fromEntries(Object.entries(PROVINCE_NAMES).map(([c, n]) => [n, c]));
let archiveCache: { route: string; city: string; province: string; count: number }[] | null = null;
/** Every published city archive page 1 with its province (read from the real centres of that city). */
function archives() {
  if (archiveCache) return archiveCache;
  archiveCache = getPublished()
    .filter((e) => /^\/listing-location\/[^/]+\/$/.test(e.route))
    .map((e) => { const city = titleCase(e.route.split('/')[2]); const cs = realCentres({ city }); return { route: e.route, city, province: cs[0]?.province ?? '', count: cs.length }; })
    .filter((a) => a.province);
  return archiveCache;
}
const RANKING_CITIES = [{ route: '/toronto-rehabs/', city: 'Toronto', province: 'ON' }, { route: '/ottawa-rehabs/', city: 'Ottawa', province: 'ON' }, { route: '/montreal-rehabs/', city: 'Montreal', province: 'QC' }, { route: '/7-best-drug-alcohol-rehab-centres-in-vancouver-2025/', city: 'Vancouver', province: 'BC' }];

export function cityModel(page: Page, d: { cards: CityData['cards']; cat: string; listHeading: string; listIntro: string[]; provinceHref: string | null }): CityModel {
  const isRanking = page.page_type === 'city';
  const city = isRanking ? page.h1.replace(/^Addiction Rehab(?:s| Centres)?\s+/i, '').trim() : page.h1.trim();
  const provinceName = d.cat.replace(/ Rehabs$/, '') || (d.cards[0] ? centreByRoute(d.cards[0].href ?? '')?.provinceName ?? '' : '');
  const provCode = PROV_CODE[provinceName] ?? '';
  const entry = getPublished().find((e) => e.route === page.route);
  const dt = entry?.modified ? new Date(entry.modified) : null;
  const year = String(dt ? dt.getFullYear() : new Date().getFullYear());
  const updated = dt ? `${MONTHS[dt.getMonth()]} ${dt.getFullYear()}` : `${MONTHS[new Date().getMonth()]} ${year}`;
  const updatedLong = dt ? `${MONTHS_LONG[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}` : updated;
  const intro = d.listIntro.length ? stripHtml(d.listIntro[0]) : `Browse ${d.cards.length} treatment ${d.cards.length === 1 ? 'centre' : 'centres'} in ${city}${provinceName ? ', ' + provinceName : ''}, with the address, description and photos from each centre\u2019s listing. Call our free helpline if you would like help choosing.`;
  const cardExtra = d.cards.map((c) => {
    const slug = c.href ?? '';
    const rec = slug ? centreByRoute(slug) : null;
    const cp = slug ? getPageByRoute(slug) : null;
    const info = [...new Set((cp?.centre?.info_items ?? []).map((i) => i.value || i.label))];
    return { tags: (rec?.tags ?? []).slice(0, 3), price: info.find((v) => /\$/.test(v)) ?? 'Contact for pricing', length: info.find((v) => /day|week|month|year/i.test(v)) ?? 'Varies', slug };
  });
  const faqs = [
    { question: `How many rehab centres are in ${city}?`, answer: `This page lists ${d.cards.length} ${d.cards.length === 1 ? 'centre' : 'centres'} serving ${city}${provinceName ? ', ' + provinceName : ''}. Our ${provinceName || 'Canadian'} directory lists many more \u2014 call us if none of these fit.` },
    { question: `How much does rehab cost in ${city}?`, answer: 'Costs depend on the centre, the program and the length of stay. Each centre sets its own fees, so call the centre or our free helpline for current pricing and to ask what your benefits plan may cover.' },
    { question: `Is there free or publicly funded rehab in ${city}?`, answer: 'Publicly funded detox and treatment exist in every province, often with wait times. Private centres are paid for by self-pay, extended health benefits or employer plans. Our helpline can point you to your provincial intake line and free resources.' },
    { question: 'How long does rehab last?', answer: `Most residential programs run 30 to 90 days; detox alone is usually 3 to 10 days. Several ${city} centres also offer outpatient and aftercare programs that continue for months after residential treatment.` },
    { question: 'What is the difference between detox and rehab?', answer: 'Detox is the medically supervised first step of clearing substances from the body and managing withdrawal. Rehab is the treatment that follows \u2014 therapy, education, relapse prevention and aftercare planning. Some centres offer both; others focus on one stage.' },
    { question: `Can you help me get into a ${city} centre today?`, answer: 'Often, yes. Call 1-855-885-4747 any time. We will talk through your circumstances and contact centres with immediate availability on your behalf. The service is free and confidential.' },
  ];
  // nearby: the province page, then other cities of the same province that have a page
  const near: { label: string; href: string; code: string }[] = [];
  if (provinceName) near.push({ label: provinceName + ' Rehabs', href: d.provinceHref ?? '', code: provCode });
  const cands = [
    ...RANKING_CITIES.filter((r) => r.province === provCode && r.route !== page.route).map((r) => ({ label: r.city + ' Rehabs', href: r.route, code: r.city.slice(0, 3).toUpperCase(), n: 99 })),
    ...archives().filter((a) => a.province === provCode && a.route !== page.route.replace(/page\/\d+\/$/, '') && !RANKING_CITIES.some((r) => r.city === a.city)).map((a) => ({ label: a.city + ' Rehabs', href: a.route, code: a.city.slice(0, 3).toUpperCase(), n: a.count })),
  ].sort((a, b) => b.n - a.n || a.label.localeCompare(b.label));
  for (const c of cands) { if (near.length >= 4) break; near.push({ label: c.label, href: c.href, code: c.code }); }
  if (near.length < 4) for (const r of RANKING_CITIES) { if (near.length >= 4) break; if (r.route !== page.route && !near.some((x) => x.href === r.route)) near.push({ label: r.city + ' Rehabs', href: r.route, code: r.city.slice(0, 3).toUpperCase() }); }
  const sources = provCode === 'ON'
    ? [{ text: 'CAMH (Centre for Addiction and Mental Health), Toronto \u2014 addiction services and access' }, { text: 'ConnexOntario \u2014 24/7 provincial mental health and addiction navigation' }]
    : [{ text: 'Health Canada \u2014 substance use and addiction information' }, { text: 'Canadian Centre on Substance Use and Addiction (CCSA) \u2014 national research and guidance' }];
  return {
    showSample: SHOW_SAMPLE_DATA, city, provinceName, year, updated, updatedLong,
    rankedLabel: isRanking ? `Ranked list \u00b7 ${year}` : `Local directory \u00b7 ${year}`, isRanking,
    h1: isRanking && d.listHeading ? d.listHeading : `Rehab Centres in ${city}`, h2: isRanking ? page.h1 : `Addiction Rehab Centres ${city}`, intro,
    cardExtra, faqs, nearby: near, sources,
  };
}
