// Slim search index for /search/ (loaded only there): one record per published centre, real data only.
// usage: node scripts/build-search-index.mjs   -> public/assets/search-index.json (+ audit/data/search-index-stats.json)
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const C = path.join(root, 'content');
const idx = JSON.parse(fs.readFileSync(path.join(C, '_index.json'), 'utf8')).filter((e) => e.published);
const PROV = { 'Alberta': 'AB', 'British Columbia': 'BC', 'Manitoba': 'MB', 'New Brunswick': 'NB', 'Newfoundland and Labrador': 'NL', 'Northwest Territories': 'NT', 'Nova Scotia': 'NS', 'Nunavut': 'NU', 'Ontario': 'ON', 'Prince Edward Island': 'PE', 'Quebec': 'QC', 'Saskatchewan': 'SK', 'Yukon': 'YT' };
const read = (slug) => JSON.parse(fs.readFileSync(path.join(C, slug + '.json'), 'utf8'));
const strip = (h) => (h || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;|&rsquo;/g, "'").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
// whole-word excerpt: cut at a word boundary and add an ellipsis (same rule as the card excerpts everywhere else)
const excerpt = (t, max = 150) => { t = strip(t); if (t.length <= max) return t; const cut = t.slice(0, max).replace(/\s+\S*$/, '').replace(/[,;:\-–—(]+$/, ''); return cut + '…'; };
// card image + source excerpt + city from the listing pages that already show each centre
const cardByRoute = new Map();
const cityByRoute = new Map();
for (const e of idx) {
  if (!['province', 'city', 'city-archive'].includes(e.type)) continue;
  const d = read(e.slug);
  for (const c of d.listing?.cards ?? []) {
    const r = new URL(c.href).pathname;
    if (c.image && !cardByRoute.has(r)) cardByRoute.set(r, c);
    if (e.type === 'city-archive' && !e.route.includes('/page/') && !cityByRoute.has(r)) cityByRoute.set(r, d.h1);
  }
}
const cityFromAddress = (a) => {
  const parts = (a || '').split(',').map((x) => x.trim()).filter((x) => x && x !== 'Canada');
  const iProv = parts.findIndex((p) => /^[A-Z]{2}(\s|$)/.test(p));
  return iProv > 0 ? parts[iProv - 1] : parts.length >= 2 ? parts[parts.length - 2] : '';
};
const RX = {
  alcohol: /alcohol/i,
  drugs: /drug|substance|opioid|cocaine|meth\b|methamphetamine|fentanyl|heroin/i,
  prescription: /prescription|opioid|benzodiazepine|methadone|suboxone|pharmaceutical/i,
  dual: /dual diagnosis|concurrent|co-occurring|mental health|trauma|depression|anxiety/i,
  intervention: /intervention/i,
  detox: /detox|withdrawal/i,
};
const out = [];
for (const e of idx.filter((x) => x.type === 'centre')) {
  const d = read(e.slug); const c = d.centre; if (!c) continue;
  const cat = (c.categories || []).find((x) => /Rehabs$/.test(x)) || (c.categories || [])[0] || '';
  const pName = cat.replace(/ Rehabs$/, '');
  const p = PROV[pName] || '';
  const tags = [...new Set([...((c.tags || {}).items || []), ...(c.specialty_groups || []).flatMap((g) => g.items || [])].map((t) => t.replace(/al,/g, ',').trim()).flatMap((t) => t.split(',')).map((t) => t.trim()).filter(Boolean))];
  const aboutP = strip((c.about_blocks || []).find((b) => b.type === 'p' && b.html)?.html || '');
  const card = cardByRoute.get(e.route);
  const desc = excerpt(card?.excerpt_source || card?.excerpt || aboutP || '');
  const hay = tags.join(' ') + ' ' + c.name + ' ' + aboutP.slice(0, 300);
  const ty = Object.entries(RX).filter(([, rx]) => rx.test(hay)).map(([k]) => k);
  const g = card?.image || (c.gallery?.[0] ? { local_path: c.gallery[0].src, alt: c.gallery[0].alt, width: c.gallery[0].width, height: c.gallery[0].height } : null);
  const address = (c.address || '').replace(new RegExp('^' + c.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ',\\s*', 'i'), '');
  const rec = { n: c.name, u: e.route, c: cityByRoute.get(e.route) || cityFromAddress(address), p, a: address, g: tags.slice(0, 8).join('|'), d: desc, ty: ty.join(',') };
  if (g) { rec.i = g.local_path; if (g.width) rec.w = Number(g.width); if (g.height) rec.h = Number(g.height); if (g.alt) rec.t = g.alt; }
  if (c.phone_href) rec.k = c.phone_href.replace(/^tel:/, '');
  out.push(rec);
}
out.sort((a, b) => a.n.localeCompare(b.n));
const json = JSON.stringify(out);
fs.mkdirSync(path.join(root, 'public/assets'), { recursive: true });
fs.writeFileSync(path.join(root, 'public/assets/search-index.json'), json);
const stat = { centres: out.length, bytes: Buffer.byteLength(json), gzip: zlib.gzipSync(json).length, brotli: zlib.brotliCompressSync(json).length,
  byProvince: Object.fromEntries(Object.keys(PROV).map((n) => [PROV[n], out.filter((r) => r.p === PROV[n]).length])),
  byType: Object.fromEntries(Object.keys(RX).map((k) => [k, out.filter((r) => r.ty.split(',').includes(k)).length])),
  noImage: out.filter((r) => !r.i).length, noCity: out.filter((r) => !r.c).length, noProvince: out.filter((r) => !r.p).length };
fs.writeFileSync(path.join(root, 'audit/data/search-index-stats.json'), JSON.stringify(stat, null, 1));
// Options for the Home form and the /search/ filters: only options that return results (Yukon, Nunavut and Prince Edward Island have no centres).
const TYPE_LABEL = { alcohol: 'Alcohol', drugs: 'Drugs', prescription: 'Prescription drugs', dual: 'Dual diagnosis', intervention: 'Intervention', detox: 'Detox' };
const slug = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const options = {
  provinces: Object.keys(PROV).filter((n) => stat.byProvince[PROV[n]] > 0).map((n) => ({ value: slug(n), label: n, code: PROV[n], n: stat.byProvince[PROV[n]] })),
  types: Object.keys(TYPE_LABEL).filter((k) => stat.byType[k] > 0).map((k) => ({ value: k, label: TYPE_LABEL[k], n: stat.byType[k] })),
  cities: idx.filter((e) => e.type === 'city-archive' && !e.route.includes('/page/')).map((e) => ({ label: read(e.slug).h1, href: e.route, n: (read(e.slug).listing?.cards ?? []).length })).sort((a, b) => b.n - a.n).slice(0, 30),
  hidden: { provinces: Object.keys(PROV).filter((n) => !stat.byProvince[PROV[n]]), types: Object.keys(TYPE_LABEL).filter((k) => !stat.byType[k]) },
};
fs.writeFileSync(path.join(root, 'src/lib/search-options.json'), JSON.stringify(options, null, 1));
console.log(JSON.stringify(stat));
