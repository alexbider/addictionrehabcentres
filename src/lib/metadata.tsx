import type { Metadata } from 'next';
import type { Page } from './content';
import { SITE_URL, toSite } from './site';
import { routeExists } from './content';
import type { PlaceReviews } from './reviews';

const metaOf = (page: Page, name: string) => page.head?.meta.find((m) => m[1] === name)?.[2];

/** Title, description, canonical and robots exactly as the live source publishes them (domain from NEXT_PUBLIC_SITE_URL).
 *  Open Graph / Twitter / article tags are emitted verbatim by <SeoHead>, so they are not set here (no duplicates). */
export function pageMetadata(page: Page): Metadata {
  const { seo, source } = page;
  const robotsSrc = metaOf(page, 'robots') ?? source.robots ?? '';
  const index = !/noindex/.test(robotsSrc);
  // The old source carried "index, nofollow" on a few pages (SEO audit: it stopped link equity flowing out); links are always followed.
  const follow = true;
  const description = page.head ? metaOf(page, 'description') : seo.meta_description;
  return {
    title: { absolute: page.head?.title ?? seo.meta_title },
    ...(description ? { description } : {}),
    // Canonical of every page = production origin + its own path (SEO audit 1C), whatever the old source declared.
    alternates: { canonical: SITE_URL + page.route },
    robots: index ? { index, follow, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } : { index, follow },
  };
}

/** The source's Open Graph, article, Twitter tags and rel=next/prev links, verbatim (React hoists them into <head>). */
export function SeoHead({ page }: { page: Page }) {
  const h = page.head;
  if (!h) return null;
  return (
    <>
      {h.meta
        .filter(([, n]) => /^(og:|article:|twitter:)/.test(n))
        .map(([kind, n, c], i) => (kind === 'property' ? <meta key={i} property={n} content={toSite(c)} /> : <meta key={i} name={n} content={toSite(c)} />))}
      {h.links.filter(([rel, , href]) => (rel === 'next' || rel === 'prev') && routeExists(new URL(href).pathname)).map(([rel, , href], i) => (
        <link key={'l' + i} rel={rel} href={toSite(href)} />
      ))}
    </>
  );
}

const HEALTH_TYPES = new Set(['drug', 'alcohol', 'treatment-support', 'support-service', 'intervention', 'blog-post']);

/** "7:00am - 11:00pm" → { opens: '07:00', closes: '23:00' } (null when it is not a plain time range, e.g. "Closed"). */
function parseRange(v: string) {
  const m = v.match(/^\s*(\d{1,2})(?::(\d{2}))?\s*([ap]m)\s*[-–to]+\s*(\d{1,2})(?::(\d{2}))?\s*([ap]m)\s*$/i);
  if (!m) return /^\s*(open\s*)?24\s*hours?\s*$/i.test(v) ? { opens: '00:00', closes: '23:59' } : null;
  const h = (hh: string, mm: string | undefined, ap: string) => { let n = Number(hh) % 12; if (/p/i.test(ap)) n += 12; return String(n).padStart(2, '0') + ':' + (mm ?? '00'); };
  return { opens: h(m[1], m[2], m[3]), closes: h(m[4], m[5], m[6]) };
}

/** MedicalBusiness JSON-LD for a centre page: only fields the centre page really has (no rating, no geo — the export has neither). */
export function centreSchema(page: Page, live: PlaceReviews | null = null) {
  const c = page.centre;
  if (!c || !c.name) return null;
  const phone = (c.phone_text || c.phone_href || '').replace(/^tel:/, '');
  const digits = phone.replace(/\D/g, '');
  const telephone = digits.length === 11 && digits[0] === '1' ? '+' + digits : digits.length === 10 ? '+1' + digits : '';
  const addr = (c.address || '').replace(/,?\s*Canada\s*$/i, '');
  const m = addr.match(/^(.*?),\s*([^,]+?),\s*([A-Z]{2})(?:\s+([A-Z]\d[A-Z]\s?\d[A-Z]\d))?\s*$/);
  const address = addr ? { '@type': 'PostalAddress', ...(m ? { streetAddress: m[1], addressLocality: m[2], addressRegion: m[3], ...(m[4] ? { postalCode: m[4] } : {}) } : { streetAddress: addr }), addressCountry: 'CA' } : null;
  const hours = (c.hours?.rows ?? []).flatMap(([day, v]) => { const r = parseRange(v); return r && /^(mon|tues|wednes|thurs|fri|satur|sun)day$/i.test(day) ? [{ '@type': 'OpeningHoursSpecification', dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1).toLowerCase(), opens: r.opens, closes: r.closes }] : []; });
  const sameAs = [c.website, ...Object.values(c.social ?? {})].filter((u): u is string => typeof u === 'string' && /^https?:\/\//.test(u));
  const img = c.gallery?.[0]?.src;
  return toSite({
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': SITE_URL + page.route + '#organization',
    name: c.name,
    url: SITE_URL + page.route,
    ...(address ? { address } : {}),
    ...(telephone ? { telephone } : {}),
    ...(c.email ? { email: c.email } : {}),
    ...(hours.length ? { openingHoursSpecification: hours } : {}),
    ...(sameAs.length ? { sameAs: [...new Set(sameAs)] } : {}),
    ...(img ? { image: img.startsWith('http') ? img : SITE_URL + img } : {}),
    // Only real Google data (Places API); never the old scraped counts.
    ...(live ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: live.rating, reviewCount: live.count, bestRating: 5, worstRating: 1 }, review: live.reviews.map((r) => ({ '@type': 'Review', author: { '@type': 'Person', name: r.author }, reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 }, reviewBody: r.text, ...(r.published ? { datePublished: r.published.slice(0, 10) } : {}) })) } : {}),
  });
}

/** Health guides: WebPage → MedicalWebPage with lastReviewed (the page's last modified date). */
function medicalize(node: unknown, page: Page): unknown {
  if (Array.isArray(node)) return node.map((n) => medicalize(n, page));
  if (!node || typeof node !== 'object') return node;
  const o = node as Record<string, unknown>;
  if (Array.isArray(o['@graph'])) return { ...o, '@graph': medicalize(o['@graph'], page) };
  if (o['@type'] === 'WebPage' && HEALTH_TYPES.has(page.page_type)) {
    const d = typeof o.dateModified === 'string' ? o.dateModified.slice(0, 10) : '';
    return { ...o, '@type': ['WebPage', 'MedicalWebPage'], ...(d ? { lastReviewed: d } : {}) };
  }
  return o;
}

/** The structured data the live source page carries (Article, BreadcrumbList, FAQPage, …), unchanged apart from the domain variable. */
export function JsonLd({ page, reviews = null }: { page: Page; reviews?: PlaceReviews | null }) {
  return (
    <>
      <SeoHead page={page} />
      {page.seo.jsonld_source.map((g, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toSite(medicalize(g, page))).replace(/</g, '\\u003c') }} />
      ))}
      {(() => { const b = centreSchema(page, reviews); return b ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(b).replace(/</g, '\\u003c') }} /> : null; })()}
    </>
  );
}
