import type { Block, Card, Page } from '@/lib/content';
import { getIndex, isPublishedRoute, routeExists } from '@/lib/content';
import { provinceNav, provinceNavItems } from '@/lib/provinces';
import { stripName } from '@/lib/city';
import { centreByRoute, PROVINCE_NAMES } from '@/lib/centres';
import { SHOW_SAMPLE_DATA } from '@/lib/rollout';
import { categoryRoute } from '@/lib/provinces';

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
  m: ProvinceModel;
};

export type ProvinceModel = {
  showSample: boolean; route: string; province: string; code: string; count: number; topCity: string;
  updatedLong: string; heroImage: { src: string; alt: string; width: number | null; height: number | null } | null;
  filters: string[]; cardExtra: { tags: string[]; city: string; phone: string }[];
  cities: { name: string; n: number; href: string }[];
  faqs: { question: string; answer: string }[]; sources: string[];
  others: { label: string; href: string; code: string }[]; intro: string;
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
        cards.push({ name: c.name, href: isPublishedRoute(path) ? path : null, address: stripName(c.address, c.name), excerpt: c.excerpt, category: c.category, image: c.image ? { src: c.image.local_path, alt: c.image.alt, width: c.image.width ?? null, height: c.image.height ?? null } : null });
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
  const provinceName = archive ? page.h1 : cat.replace(/ Rehabs$/, '') || page.h1.replace(/ Rehabs$/, '');
  return { archive, provinceName, updated, h1: page.h1, h2: h2 && 'text' in h2 ? h2.text : '', intro, cards, guide, othersHeading: provinceNav.heading, others, m: provinceModel(page, provinceName, cards, intro, mod ?? null) };
}

/* ───────────────────────── view model: every design section filled, real data first ───────────────────────── */
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const slug = (t: string) => t.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const strip = (h: string) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#8217;|&rsquo;/g, '\u2019').replace(/\s+/g, ' ').trim();
const GENERIC_TAGS = /^(private rehab|substance abuse treatment|assessment)$/i;

export function provinceModel(page: Page, province: string, cards: ProvinceData['cards'], intro: string[], modified: string | null): ProvinceModel {
  const code = Object.entries(PROVINCE_NAMES).find(([, n]) => n === province)?.[0] ?? '';
  const dt = modified ? new Date(modified) : new Date();
  const cityOf = (addr: string) => { const parts = String(addr || '').split(',').map((x) => x.trim()); for (let i = 1; i < parts.length; i++) if (/^[A-Z]{2}(\s+[A-Z]\d[A-Z]\s?\d[A-Z]\d)?$/.test(parts[i])) return parts[i - 1]; return ''; };
  const cardExtra = cards.map((c) => { const r = c.href ? centreByRoute(c.href) : null; const tags = (r?.tags ?? []).filter((t) => !GENERIC_TAGS.test(t)).slice(0, 2); return { tags: tags.length ? tags : r?.tags.slice(0, 2) ?? [], city: r?.city || cityOf(c.address), phone: r?.phone ?? '' }; });
  // filters: the most common service tags among this province's centres
  const freq = new Map<string, number>();
  cardExtra.forEach((x) => x.tags.forEach((t) => freq.set(t, (freq.get(t) ?? 0) + 1)));
  const filters = ['All', ...[...freq.entries()].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 8).map(([t]) => t)];
  const cityCount = new Map<string, number>();
  cardExtra.forEach((x) => { if (x.city) cityCount.set(x.city, (cityCount.get(x.city) ?? 0) + 1); });
  const cities = [...cityCount.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([name, n]) => {
    const r = [`/listing-location/${slug(name)}/`, `/${slug(name)}-rehabs/`].find((x) => isPublishedRoute(x));
    return { name, n, href: r ?? '' };
  });
  const withImg = cards.find((c) => c.image);
  const faqs = [
    { question: `How many rehab centres are there in ${province}?`, answer: `We currently list ${cards.length} addiction treatment centres in ${province}, ranging from publicly funded detox and community programs to private residential rehab. Listings are updated as centres claim and verify their details.` },
    { question: `Are there free or publicly funded rehab programs in ${province}?`, answer: `Yes. Publicly funded detox, residential and community addiction programs exist in every province, run through the provincial health system, and several non-profit societies offer low-cost or subsidized beds. Private centres charge fees that vary by program length and level of care. Our helpline can help you understand which options you qualify for.` },
    { question: 'How long does rehab last?', answer: 'Most residential programs run 28 to 90 days; some long-term and faith-based programs run 6 to 12 months. Detox alone usually takes 3 to 10 days. The right length depends on the substance, how long you have been using, and whether there are co-occurring mental health conditions.' },
    { question: 'What is the difference between detox and rehab?', answer: `Detox is the medically supervised first step of clearing substances from the body and managing withdrawal. Rehab is the treatment that follows \u2014 therapy, education, relapse-prevention and aftercare planning. Many ${province} centres offer both under one roof; others focus on one stage.` },
    { question: `How do I choose the right centre in ${province}?`, answer: 'Consider the level of care you need (detox, inpatient, outpatient), the location, cost and funding, program length, and whether the centre specializes in your situation \u2014 for example men-only, women-only, youth, Indigenous or faith-based programs. Use the filters above, or call us and we will shortlist for you.' },
    { question: 'Can you help me get into a centre today?', answer: 'Often, yes. Call 1-855-885-4747 any time. We will talk through your circumstances and contact centres with immediate availability on your behalf. The service is free and confidential.' },
  ];
  const others = Object.entries(PROVINCE_NAMES).filter(([c]) => c !== code).map(([c, n]) => { const r = categoryRoute[n + ' Rehabs'] ?? ''; return { label: n + ' Rehabs', href: r && isPublishedRoute(r) ? r : '', code: c }; });
  return {
    showSample: SHOW_SAMPLE_DATA, route: page.route, province, code, count: cards.length, topCity: cities[0]?.name ?? province,
    updatedLong: `${MONTHS_LONG[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`,
    heroImage: withImg?.image ? { src: withImg.image.src, alt: withImg.image.alt || withImg.name, width: Number(withImg.image.width) || null, height: Number(withImg.image.height) || null } : null,
    filters, cardExtra, cities, faqs,
    sources: ['Your provincial health authority \u2014 addiction and mental health services (public programs, detox, community clinics)', 'Health Canada \u2014 Get help with substance use'],
    others, intro: intro.length ? strip(intro[0]) : '',
  };
}
