import type { Page } from '@/lib/content';
import { getIndex, getPage, getPublished, isPublishedRoute } from '@/lib/content';
import { provinceNav } from '@/lib/provinces';
import { realCentres, PROVINCE_NAMES } from '@/lib/centres';

/** Crawlable internal links that the WordPress sidebar used to provide (SEO audit 1H): related articles, province hubs, cities, topic archives.
 *  Every link is a real published page; nothing here is invented. Rendered by the shared footer via BeforeFooterProvider. */

const STOP = new Set('a an the and or of to in on for with by is are how what why when can do does your you our from at as it its vs best canada canadian guide'.split(' '));
const clean = (t: string) => t.replace(/\s*[-|–]\s*Addiction Rehab Cent(?:er|re)s?.*$/i, '').replace(/&amp;/g, '&').trim();
const tokens = (t: string) => new Set(clean(t).toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w)));
const ARTICLE_TYPES = new Set(['blog-post', 'drug', 'alcohol', 'treatment-support', 'support-service', 'intervention', 'about-info']);
const GUIDES: [string, string][] = [['Overcoming treatment myths', '/overcoming-treatment-myths/'], ['Choosing a facility', '/choosing-a-facility/'], ['Getting started', '/getting-started/']];

const slugify = (t: string) => t.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function related(page: Page, n = 6) {
  const me = tokens(page.h1 || page.seo.meta_title);
  const pool = getPublished().filter((e) => ARTICLE_TYPES.has(e.type) && e.route !== page.route && !e.noindex);
  const first = (page.head?.related ?? []).map((r) => new URL(r.href, 'https://x').pathname).filter((p) => isPublishedRoute(p) && p !== page.route);
  const scored = pool.map((e) => { const t = tokens(e.title); let s = 0; t.forEach((w) => { if (me.has(w)) s++; }); return { e, s: s / Math.sqrt(t.size * me.size || 1) }; }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s || a.e.route.localeCompare(b.e.route));
  const out: { href: string; label: string }[] = [];
  const add = (href: string, label: string) => { if (!out.some((o) => o.href === href) && out.length < n) out.push({ href, label }); };
  for (const p of first) { const e = pool.find((x) => x.route === p); if (e) add(e.route, clean(e.title)); }
  for (const x of scored) add(x.e.route, clean(x.e.title));
  return out;
}

function topCities(n = 8) {
  const count = new Map<string, { city: string; province: string; n: number }>();
  for (const c of realCentres()) { if (!c.city) continue; const k = c.city + '|' + c.province; const r = count.get(k) ?? { city: c.city, province: c.province, n: 0 }; r.n++; count.set(k, r); }
  return [...count.values()].sort((a, b) => b.n - a.n || a.city.localeCompare(b.city)).map((r) => ({ label: `${r.city}, ${r.province}`, href: `/listing-location/${slugify(r.city)}/` })).filter((x) => isPublishedRoute(x.href)).slice(0, n);
}

let cityIndex: { href: string; label: string; code: string }[] | null = null;
/** Every published city archive, with the province its centres are in (read from the archive's own centre addresses). */
function cityArchives() {
  if (cityIndex) return cityIndex;
  cityIndex = getPublished().filter((e) => e.type === 'city-archive').flatMap((e) => {
    const pg = getPage(e.slug);
    const code = (pg?.listing?.cards ?? []).map((c) => c.address.match(/,\s*([A-Z]{2})\b/)?.[1]).find((x) => x && PROVINCE_NAMES[x]);
    return code ? [{ href: e.route, label: clean(e.title).replace(/\s*Archives?$/i, ''), code }] : [];
  });
  return cityIndex;
}
/** Every published city archive in a province (code) — includes archives no card on the hub page links to (e.g. Vaughan). */
const provinceCities = (code: string) => cityArchives().filter((c) => c.code === code).map(({ href, label }) => ({ href, label })).sort((a, b) => a.label.localeCompare(b.label));

let looseCentres: { href: string; label: string; code: string }[] | null = null;
/** Centres whose city has no published archive page (the archive was too thin and now redirects): the hub is the only place that can link them. */
function centresWithoutCityArchive(code: string) {
  looseCentres ??= getPublished().filter((e) => e.type === 'centre').flatMap((e) => {
    const c = getPage(e.slug)?.centre;
    const m = (c?.address ?? '').replace(/,?\s*Canada\s*$/i, '').match(/,\s*([^,]+?),\s*([A-Z]{2}|Newfoundland and Labrador)(?:\s+[A-Z]\d[A-Z]\s?\d[A-Z]\d)?\s*$/);
    if (!c || !m) return [];
    const cc = m[2] === 'Newfoundland and Labrador' ? 'NL' : m[2];
    return isPublishedRoute(`/listing-location/${slugify(m[1])}/`) ? [] : [{ href: e.route, label: c.name, code: cc }];
  });
  return looseCentres.filter((c) => c.code === code).map(({ href, label }) => ({ href, label })).sort((a, b) => a.label.localeCompare(b.label));
}

function Block({ title, items }: { title: string; items: { href: string; label: string }[] }) {
  if (!items.length) return null;
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ font: "600 22px/1.25 Jost,sans-serif", color: '#10233a', margin: '0 0 14px' }}>{title}</h2>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {items.map((i) => (
          <li key={i.href}>
            <a href={i.href} style={{ display: 'inline-block', font: '500 14px Figtree,sans-serif', color: '#1f3550', background: '#f7fafd', border: '1px solid #e3ecf4', padding: '10px 14px', borderRadius: 999, textDecoration: 'none' }}>{i.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const wrap = (children: React.ReactNode) => (
  <section data-screen-label="Related links" aria-label="Related links" style={{ background: '#fff', padding: '8px 0 24px' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>{children}</div>
  </section>
);

export function RelatedLinks({ page }: { page: Page }) {
  const t = page.page_type;
  if (page.route === '/intervention/') return null; // the hand-built landing page is the approved design as is
  if (page.route === '/blog/' || t === 'category') {
    const cats = getPublished().filter((e) => e.type === 'category' && !/\/page\/\d+\/$/.test(e.route) && e.route !== page.route).map((e) => ({ href: e.route, label: clean(e.title).replace(/\s*Archives?$/i, '') }));
    const paged = getPublished().filter((e) => e.type === 'category' && /\/page\/\d+\/$/.test(e.route) && e.route.startsWith((page.route.match(/^\/category\/[^/]+\//) ?? ['@'])[0]) && e.route !== page.route).map((e) => ({ href: e.route, label: 'Page ' + e.route.match(/page\/(\d+)/)![1] }));
    return wrap(<><Block title="Browse articles by topic" items={cats} /><Block title="More pages in this topic" items={paged} /></>);
  }
  if (t === 'province' && page.listing?.cards?.length) {
    const code = Object.entries(PROVINCE_NAMES).find(([, n]) => page.h1.replace(/ Rehabs?$/i, '') === n)?.[0] ?? '';
    return wrap(<><Block title="Cities with listed centres" items={code ? provinceCities(code) : []} /><Block title={`More centres in ${page.h1.replace(/ Rehabs?$/i, '')}`} items={code ? centresWithoutCityArchive(code) : []} /></>);
  }
  if (ARTICLE_TYPES.has(t) && !['legal'].includes(t)) {
    const prov = provinceNav.links.filter(([, h]) => isPublishedRoute(h)).map(([label, href]) => ({ label, href }));
    return wrap(
      <>
        <Block title="Related articles" items={related(page)} />
        <Block title="Find rehab by province" items={prov} />
        <Block title="Popular cities" items={topCities()} />
        <Block title="Start here" items={GUIDES.filter(([, h]) => h !== page.route && isPublishedRoute(h)).map(([label, href]) => ({ label, href }))} />
      </>,
    );
  }
  return null;
}
void getIndex;
