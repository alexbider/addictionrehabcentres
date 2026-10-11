import type { Block, Page } from '@/lib/content';
import { categoryRoute } from '@/lib/provinces';
import { getPublished, isPublishedRoute } from '@/lib/content';
import { centreByRoute, realCentres, PROVINCE_NAMES, type RealCentre } from '@/lib/centres';
import { SHOW_SAMPLE_DATA } from '@/lib/rollout';
import type { PlaceReviews } from '@/lib/reviews';

/** Centres on the approved Centre view: the 4 prototypes plus the batches built so far (alphabetical by slug, `centre__` removed). */
const PROTOTYPES = ['another-road-addiction-recovery-centre', 'peace-country-wilderness-program', 'canadawide-mobile', 'blue-skies-recovery'];
export const BATCH_SIZE = 391; // batch 1 = first 100 published centres; raise to 200, 300, 391 for the next batches
let viewSlugs: Set<string> | null = null;
export function centreOnView(slug: string): boolean {
  if (!viewSlugs) {
    const all = getPublished().filter((e) => e.type === 'centre').map((e) => e.slug.replace(/^centre__/, '')).sort();
    viewSlugs = new Set([...PROTOTYPES, ...all.slice(0, BATCH_SIZE)]);
  }
  return viewSlugs.has(slug.replace(/^centre__/, ''));
}

const linkKey = (h: string) => { try { const u = new URL(h); return u.host.replace(/^www\./, '').toLowerCase() + u.pathname.replace(/\/$/, '') + u.search; } catch { return h; } };
export const centreLinkKey = linkKey;

export type CentreData = {
  name: string;
  categories: string[];
  catHref: string | null;
  phoneText: string;
  phoneHref: string;
  website: string;
  address: string;
  gallery: { src: string; alt: string; width: number | null; height: number | null }[];
  linkAttrs: Record<string, { rel: string; target: string }>;
  body: Block[];
  specs: { heading: string; items: string[]; text: string }[];
  email: string;
  social: Record<string, string>;
  tags: { heading: string; items: string[] };
  hours: { heading: string; rows: [string, string][] };
  info: string[];
  faqHeading: string;
  faqs: { question: string; answerBlocks: Block[] }[];
  m: CentreModel;
};

/** Centre page JSON → props for the approved Centre view. Only real source fields: name, address, phone, website, category,
 *  email, social, tags, hours, FAQ, info items, specialties/amenities, about body, gallery, videos. Ratings, review counts, Google review
 *  text and the sponsor ad are never passed. */
export function centreData(page: Page, live: PlaceReviews | null = null): CentreData {
  const c = page.centre!;
  const cat = c.categories[0];
  const catRoute = cat ? categoryRoute[cat] : undefined;
  return {
    name: c.name,
    categories: c.categories,
    catHref: catRoute && isPublishedRoute(catRoute) ? catRoute : null,
    phoneText: c.phone_text,
    phoneHref: c.phone_href ? 'tel:' + c.phone_href.replace(/^tel:/, '').replace(/[^\d+]/g, '') : '',
    website: c.website,
    address: c.address,
    gallery: c.gallery.map((g) => ({ src: g.src, alt: g.alt, width: g.width ?? null, height: g.height ?? null })),
    // rel / target of each external link exactly as the source page has them
    linkAttrs: Object.fromEntries((page.head?.ext_links ?? []).map(([h, rel, target]) => [linkKey(h), { rel, target }])),
    body: c.about_blocks,
    specs: c.specialty_groups,
    email: c.email,
    social: c.social,
    tags: c.tags,
    hours: c.hours,
    info: [...new Set(c.info_items.map((i) => i.value || i.label))],
    faqHeading: c.faq_heading,
    faqs: c.faqs.map((q) => ({ question: q.question, answerBlocks: q.answer_blocks })),
    m: centreModel(page, live),
  };
}

/* ───────────────────────── view model: every design section filled, real data first ───────────────────────── */
type Img = { src: string; alt: string; width: number | null; height: number | null };
export type CentreModel = {
  showSample: boolean;
  city: string; provinceName: string;
  provinceCrumb: { label: string; href: string } | null; cityCrumb: { label: string; href: string } | null;
  catLine: string;
  images: Img[]; photoCount: number; logo: Img | null;
  glance: { k: string; v: string }[];
  fromPrice: string | null;
  facility: { icon: string; k: string; v: string }[];
  serviceGroups: { title: string; color: string; items: { label: string; icon: string }[] }[]; serviceCount: number;
  pillars: { n: string; kicker: string; title: string; body: string; photo: Img | null }[];
  video: { provider: string; id: string; url: string } | null;
  intro: Block[]; overviewFirst: Block[]; rest: Block[];
  location: { heading: string; intro: string; cells: { k: string; v: string; href?: string }[]; serving: { label: string; href: string }[]; mapQuery: string; directionsHref: string };
  faqs: { question: string; answerBlocks: Block[] | null; answer: string | null }[];
  othersHeading: string;
  /** Real Google data only (null = the reviews section, rating chip and review count are hidden). */
  reviews: PlaceReviews | null;
  others: { name: string; href: string; category: string; catHref: string | null; address: string; excerpt: string; image: Img | null; phone: string; rating: string; googleReviews: number; featured: boolean; verified: boolean }[];
};

const HELPLINE = '1-855-885-4747';
const strip = (h: string) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#8217;|&rsquo;/g, '\u2019').replace(/\s+/g, ' ').trim();
const bullet = (t: string) => t.replace(/^[\u2022\u00b7\-\*]\s*/, '').trim();
const slugify = (t: string) => t.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const wholeWords = (t: string, max: number) => { t = t.replace(/\s+/g, ' ').trim(); if (t.length <= max) return t; return t.slice(0, max).replace(/\s+\S*$/, '').replace(/[,;:\-\u2013\u2014(]+$/, '') + '\u2026'; };
const textOf = (b: Block) => ('text' in b ? (b as { text: string }).text : '');
// the design's own sample ratings for the "other centres" cards (sample values, behind SHOW_SAMPLE_DATA)
const SAMPLE_RATINGS: [string, number, boolean, boolean][] = [['4.9', 128, true, true], ['4.8', 64, false, false], ['5.0', 92, false, false], ['4.9', 41, false, true], ['4.7', 57, false, false], ['4.8', 33, false, false], ['4.9', 48, false, true], ['4.8', 26, false, false], ['5.0', 71, false, false]];

const GROUPS: { title: string; color: string; re: RegExp; icons: string[] }[] = [
  { title: 'Clinical care', color: '#0890E8', re: /detox|medical|nurse|withdraw|assessment|intervention|dual|mental|psych|therap|counsel|medic|treatment|clinic/i, icons: ['hands', 'rx', 'pill', 'dual'] },
  { title: 'Family & continuity', color: '#D82028', re: /family|aftercare|after-care|alumni|continuing|follow|support|12[\s-]?step|case manag|education|prevention|peer/i, icons: ['heart', 'shield', 'doc', 'person'] },
  { title: 'Living well', color: '#2fb46b', re: /holistic|yoga|meditat|fitness|nutrition|amenit|luxury|equine|art|recreat|sober living|accommod|residential|outdoor|wellness/i, icons: ['leaf', 'glass'] },
];

export function centreModel(page: Page, live: PlaceReviews | null = null): CentreModel {
  const c = page.centre!;
  const rec: RealCentre | null = centreByRoute(page.route);
  const city = rec?.city ?? '';
  const provinceName = rec ? rec.provinceName : '';
  const provRoute = categoryRoute[provinceName + ' Rehabs'];
  const provinceCrumb = provinceName ? { label: provinceName + ' Rehabs', href: provRoute && isPublishedRoute(provRoute) ? provRoute : '' } : null;
  const cityRoute = city ? [`/listing-location/${slugify(city)}/`, `/${slugify(city)}-rehabs/`].find((r) => isPublishedRoute(r)) : undefined;
  const cityCrumb = city && cityRoute ? { label: city + ' Rehabs', href: cityRoute } : null;

  // ---- images: own gallery, then images inside the article, then the listing card photo
  const seen = new Set<string>(); const images: Img[] = [];
  const push = (x: { src: string; alt?: string; width?: number | string | null; height?: number | string | null } | null | undefined) => {
    if (!x || !x.src || seen.has(x.src)) return; seen.add(x.src);
    images.push({ src: x.src, alt: x.alt || c.name, width: Number(x.width) || null, height: Number(x.height) || null });
  };
  c.gallery.forEach(push);
  c.about_blocks.forEach((b) => { if (b.type === 'image') push(b); });
  if (!images.length) push(rec?.image);
  const logo = images[0] ?? null;

  // ---- article: intro paragraph(s), video, overview heading, the rest
  let blocks = c.about_blocks.filter((b) => b.type !== 'image');
  const vIdx = blocks.findIndex((b) => b.type === 'video');
  const vb = vIdx > -1 ? (blocks[vIdx] as { provider: string; id: string; url: string }) : null;
  blocks = blocks.filter((b) => b.type !== 'video');
  while (blocks.length && /^h[1-6]$/.test(blocks[0].type) && /^about( this)?( centre| center)?$/i.test(textOf(blocks[0]).trim())) blocks.shift();
  const intro: Block[] = [];
  while (blocks.length && (blocks[0].type === 'p' || blocks[0].type === 'text') && !/^\u2022/.test(textOf(blocks[0]))) intro.push(blocks.shift()!);
  if (blocks.length && blocks[0].type === 'h2' && /overview/i.test(textOf(blocks[0]))) blocks.shift();
  let overviewFirst: Block[] = [];
  if (blocks.length && (blocks[0].type === 'p' || blocks[0].type === 'text') && !/^\u2022/.test(textOf(blocks[0]))) overviewFirst = [blocks.shift()!];

  // ---- services: tags + specialties/amenities (real); falls back to the article's bullet lists
  const chipSet: string[] = [];
  const addChip = (t: string) => { const v = bullet(strip(t)); if (v && v.length < 60 && !chipSet.some((x) => x.toLowerCase() === v.toLowerCase())) chipSet.push(v); };
  c.tags.items.forEach(addChip);
  c.specialty_groups.forEach((g) => g.items.forEach(addChip));
  if (!chipSet.length) blocks.forEach((b) => { if (b.type === 'ul') b.items.forEach((it) => addChip(it.text)); });
  // an article list that only repeats the chips is not shown twice
  const have = new Set(chipSet.map((x) => x.toLowerCase()));
  const rest: Block[] = [];
  blocks.forEach((b, i) => {
    if (b.type === 'ul' && b.items.length && b.items.every((it) => have.has(bullet(strip(it.text)).toLowerCase()))) { if (rest.length && /^h[1-6]$/.test(rest[rest.length - 1].type)) rest.pop(); return; }
    rest.push(b);
  });
  const groups = GROUPS.map((g) => ({ title: g.title, color: g.color, items: [] as { label: string; icon: string }[], re: g.re, icons: g.icons }));
  const other = { title: 'Programs & services', color: '#516378', items: [] as { label: string; icon: string }[] };
  chipSet.forEach((label) => { const g = groups.find((x) => x.re.test(label)); const t = g ?? null; if (t) t.items.push({ label, icon: t.icons[t.items.length % t.icons.length] }); else other.items.push({ label, icon: 'check' }); });
  const serviceGroups = [...groups.map(({ title, color, items }) => ({ title, color, items })), other].filter((g) => g.items.length);

  // ---- design copy that needs the centre's name: neutral, factual text
  const name = c.name; const where = [city, provinceName].filter(Boolean).join(', ');
  const hasAftercare = chipSet.some((x) => /aftercare|after-care|continuing/i.test(x));
  const pillar = (i: number) => (images.length ? images[(i + 1) % images.length] : null);
  const pillars = [
    { n: '01', kicker: 'The setting', title: `Where ${name} is located`, body: `${name} is in ${where || 'Canada'}. Use the address and map further down this page to plan your visit, and call ahead to confirm admission hours and what to bring.`, photo: pillar(0) },
    { n: '02', kicker: 'After you leave', title: 'Aftercare and ongoing support', body: hasAftercare ? `${name} lists aftercare among its services. Ask the centre how follow-up care and ongoing support are arranged once your program ends.` : `Recovery continues after a program ends. Ask ${name} about aftercare, follow-up and support groups, or call our free helpline for help finding ongoing support.`, photo: pillar(1) },
    { n: '03', kicker: 'The people', title: `Talk to the team at ${name}`, body: `The best way to find out whether a centre is right for you is to speak with the people who run it. Call ${name} or request a callback, and ask about the care team and their approach.`, photo: pillar(2) },
  ];

  // ---- at a glance
  const info = [...new Set(c.info_items.map((i) => i.value || i.label))];
  const len = info.find((v) => /day|week|month|year/i.test(v));
  const cost = info.find((v) => /\$/.test(v));
  const typeTag = chipSet.find((x) => /residential|outpatient|detox|holistic|private|sober living|12[\s-]?step/i.test(x));
  const phone = c.phone_text;
  const glanceAll: { k: string; v: string }[] = [
    { k: 'Level of care', v: typeTag || '' }, { k: 'Program length', v: len || '' }, { k: 'Cost', v: cost || '' },
    { k: 'Location', v: where }, { k: 'Services listed', v: chipSet.length ? String(chipSet.length) : '' }, { k: 'Phone', v: phone || '' }, { k: 'Listing', v: c.categories[0] || '' },
  ].filter((g) => g.v);
  const glance = glanceAll.slice(0, 4);

  // ---- facility at a glance (aside): real contact details, hours, social
  const hoursAll24 = c.hours.rows.length > 0 && c.hours.rows.every((r) => /24/.test(r[1]));
  const social = Object.keys(c.social || {}).filter((k) => c.social[k]);
  const facility: { icon: string; k: string; v: string }[] = [];
  if (c.address) facility.push({ icon: 'pin', k: 'Address', v: c.address });
  if (c.phone_text) facility.push({ icon: 'phone', k: 'Phone', v: c.phone_text });
  if (c.website) facility.push({ icon: 'doc', k: 'Website', v: c.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') });
  if (c.email) facility.push({ icon: 'mail', k: 'Email', v: c.email });
  if (c.hours.rows.length) facility.push({ icon: 'check', k: 'Hours', v: hoursAll24 ? 'Open 24 hours, 7 days a week' : c.hours.rows.slice(0, 3).map((r) => r[0] + ' ' + r[1]).join(' · ') });
  if (social.length) facility.push({ icon: 'heart', k: 'Social', v: social.map((k) => k[0].toUpperCase() + k.slice(1)).join(', ') });
  if (provinceName && facility.length < 6) facility.push({ icon: 'leaf', k: 'Region', v: provinceName + (city ? ' · ' + city : '') });
  if (facility.length < 6) facility.push({ icon: 'shield', k: 'Free helpline', v: HELPLINE + ' (24/7, confidential)' });

  // ---- location block
  const cells: { k: string; v: string; href?: string }[] = [];
  if (c.address) cells.push({ k: 'Address', v: c.address });
  if (c.phone_text) cells.push({ k: 'Phone', v: c.phone_text, href: 'tel:' + c.phone_href.replace(/^tel:/, '').replace(/[^\d+]/g, '') });
  if (c.website) cells.push({ k: 'Website', v: c.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''), href: c.website });
  if (c.email) cells.push({ k: 'Email', v: c.email, href: 'mailto:' + c.email });
  if (cells.length < 4 && provinceName) cells.push({ k: 'Province', v: provinceName });
  if (cells.length < 4 && city) cells.push({ k: 'City', v: city });
  if (cells.length < 4) cells.push({ k: 'Free helpline', v: HELPLINE, href: 'tel:+18558854747' });
  const serving: { label: string; href: string }[] = [];
  if (cityCrumb) serving.push({ label: city, href: cityCrumb.href });
  if (provinceCrumb && provinceCrumb.href) serving.push({ label: provinceName, href: provinceCrumb.href });
  serving.push({ label: 'Across Canada', href: '/' });
  const q = encodeURIComponent(c.address || name);
  const location = {
    heading: `${name} in ${where || 'Canada'}`,
    intro: c.address ? `${name} is located at ${c.address}. Use the details and map to plan your visit or call ahead to confirm admission hours.` : `Contact ${name} for its location and admission details.`,
    cells: cells.slice(0, 4), serving, mapQuery: c.address || name,
    directionsHref: 'https://www.google.com/maps/dir/?api=1&destination=' + q,
  };

  // ---- FAQ: the source's own FAQ; centres without one get neutral, factual questions
  const faqs: CentreModel['faqs'] = c.faqs.length
    ? c.faqs.map((f) => ({ question: f.question, answerBlocks: f.answer_blocks, answer: null }))
    : [
        { question: `How do I contact ${name}?`, answerBlocks: null, answer: [c.phone_text ? `Call ${c.phone_text}` : '', c.website ? `visit ${c.website}` : '', c.email ? `or email ${c.email}` : ''].filter(Boolean).join(', ').replace(/^(.)/, (m) => m.toUpperCase()) + (c.phone_text || c.website || c.email ? '.' : `The centre has not published contact details here yet. Call our free helpline on ${HELPLINE} and we will help you reach it.`) },
        { question: `Where is ${name} located?`, answerBlocks: null, answer: c.address ? `${name} is at ${c.address}.` : `${name} is in ${where || 'Canada'}.` },
        { question: `How do I know if ${name} is the right fit?`, answerBlocks: null, answer: `Every person and every situation is different. Speak with the centre about its programs, availability and approach, and compare it with other options. Our helpline can talk through your situation for free, any time, on ${HELPLINE}.` },
        { question: 'Can you help me compare other centres?', answerBlocks: null, answer: `Yes. Our free, confidential helpline (${HELPLINE}) can help you weigh options near you, and the centres listed further down this page are other treatment providers in ${provinceName || 'Canada'}.` },
        { question: 'What if I need help right away?', answerBlocks: null, answer: `Call ${HELPLINE} any time. If someone is in immediate danger or having a medical emergency, call 911.` },
      ];

  // ---- other centres: same province (same city first), real photo, real link
  const pool = realCentres({ province: rec?.province, withImage: true, exclude: [page.route] });
  let ordered = [...pool.filter((x) => x.city === city), ...pool.filter((x) => x.city !== city)].slice(0, 9);
  let othersHeading = `Other Rehab Centres in ${provinceName || 'Canada'}`;
  if (ordered.length < 3) {
    // very small province: add real centres from elsewhere (never repeating one) so the slider is not empty
    const more = realCentres({ withImage: true, exclude: [page.route, ...ordered.map((x) => x.href)] }).filter((x) => x.province !== rec?.province);
    const start = Math.abs([...page.route].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) | 0, 7)) % Math.max(1, more.length);
    ordered = [...ordered, ...more.slice(start, start + 6 - ordered.length), ...more.slice(0, Math.max(0, start + 6 - ordered.length - more.length))].slice(0, 6);
    othersHeading = 'Other Rehab Centres in Canada';
  }
  const others = ordered.map((x, i) => {
    const cat = x.provinceName + ' Rehabs'; const cr = categoryRoute[cat];
    const [rating, googleReviews, featured, verified] = SAMPLE_RATINGS[i % SAMPLE_RATINGS.length];
    return { name: x.name, href: x.href, category: cat, catHref: cr && isPublishedRoute(cr) ? cr : null, address: x.address, excerpt: wholeWords(x.excerpt, 110), image: x.image, phone: x.phone, rating, googleReviews, featured, verified };
  });

  return {
    showSample: SHOW_SAMPLE_DATA, city, provinceName, provinceCrumb, cityCrumb,
    catLine: [c.categories[0], typeTag].filter(Boolean).join(' \u00b7 '),
    images, photoCount: images.length, logo, glance, fromPrice: cost ?? null, facility, serviceGroups, serviceCount: chipSet.length, pillars,
    video: vb ? { provider: vb.provider, id: vb.id, url: vb.url } : null, intro, overviewFirst, rest, location, faqs, othersHeading, others,
    // Google reviews are shown only when they come from the Places API (src/lib/reviews.ts); the old scraped counts are not displayed.
    reviews: live,
  };
}
