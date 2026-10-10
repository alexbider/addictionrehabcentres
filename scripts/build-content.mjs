// Builds content/ (slim JSON per page + _index.json) from audit/content and publishes only the images used by
// published pages into public/assets/img/<page-slug>/ (hash-deduplicated, WebP, max 1600px wide).
// Also repairs mojibake (UTF-8 text that was stored as Windows-1252) and logs every fix to audit/08-mojibake-fixes.json.
// Run: node scripts/build-content.mjs
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const SRC = path.join(root, 'audit/content');
const OUT = path.join(root, 'content');
const IMG_SRC = path.join(root, 'audit');
const IMG_OUT = path.join(root, 'public/assets/img');
const MAX_W = 1000; // approved: all images WebP, max 1000 px wide, quality 75
const QUALITY = 75;
const CARD_W = 800; // listing / blog-card thumbnails (shown at <= 420 css px): a lighter copy, same quality
const BATCH = process.env.CENTRE_BATCH ? Number(process.env.CENTRE_BATCH) : Infinity; // publish centres in batches of ~100 (sorted by route)
const IMG_SRC2 = path.join(root, 'audit/images-phase4'); // images downloaded after the audit/images freeze

// Card excerpts the source cuts at a fixed length: when the cut is mid-word, drop the partial word and add "…" (rule in
// audit/08-source-issues.md §17; decisions per card in audit/data/excerpt_cuts.json, made by audit/scripts/excerpt_cuts.py).
const CUTS = JSON.parse(fs.readFileSync(path.join(root, 'audit/data/excerpt_cuts.json'), 'utf8'));
const SOURCE_HEAD = JSON.parse(fs.readFileSync(path.join(root, 'audit/data/source-head.json'), 'utf8')); // live <head> of every source page (audit/scripts/head_pull.py)
let CUTS_R = null; // keys/values go through the same mojibake repair as the page text (page data is already repaired when cards are read)
const fixExcerpt = (slug, ex) => {
  if (!CUTS_R) { const n = fixes.length; CUTS_R = {}; for (const [k, v] of Object.entries(CUTS)) CUTS_R[fixText(k)] = fixText(v.fixed); fixes.length = n; }
  return CUTS_R[`${slug}|${ex}`] ?? ex;
};
// Card excerpts: the source cuts them at ~100 characters (sometimes mid-sentence, sometimes at "[…]"). Rule used everywhere:
// 1) already a finished sentence -> unchanged; 2) the centre's own first sentence when the card text is the start of it (and it is short) -> that sentence;
// 3) otherwise cut at a whole word and end with "…" (a partial last word is dropped when the full text shows the word continues).
const CENTRE_ABOUT = new Map(); // centre route -> first about paragraph (plain text)
const plainText = (h) => String(h || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;|&rsquo;/g, '\u2019').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const nk = (t) => t.toLowerCase().replace(/[\u2018\u2019']/g, "'").replace(/\s+/g, ' ');
// An excerpt from a centre's own text: its first sentence when it is short enough, else a whole-word cut with an ellipsis.
function aboutExcerpt(full, max = 160) {
  const f = plainText(full);
  if (!f) return '';
  const sent = f.match(/^[^.!?]*[.!?]/);
  if (sent && sent[0].length >= 40 && sent[0].length <= max + 40) return sent[0].trim();
  if (f.length <= max) return f;
  return f.slice(0, max).replace(/\s+\S*$/, '').replace(/[,;:\-\u2013\u2014(]+$/, '') + '\u2026';
}
function finishExcerpt(ex, full = '') {
  let t = plainText(ex).replace(/\s*\[\u2026\]\s*$/, '').replace(/\s*\u2026\s*$/, ' \u2026').trim();
  if (!t) return ex;
  const cut = / \u2026$/.test(t);
  t = t.replace(/ \u2026$/, '');
  if (!cut && /[.!?]["')\u201d]?$/.test(t)) return t;
  if (full) {
    const f = plainText(full), i = nk(f).indexOf(nk(t));
    if (i === 0 || i > 0) {
      const sent = f.slice(i).match(/^[^.!?]*[.!?]/);
      const whole = sent && sent[0].length >= t.length && sent[0].length <= 220 ? sent[0].trim() : '';
      if (whole && !/\s[A-Z]\.$/.test(whole)) return f.slice(0, i) === '' ? whole : t + '\u2026';
      if (/\w/.test(f[i + t.length] || '')) t = t.replace(/\s*\S+$/, '');
    }
  }
  return t.replace(/[,;:\-\u2013\u2014(]+$/, '').trim() + '\u2026';
}
const hrefSlug = (h) => new URL(h).pathname.split('/').filter(Boolean).pop();

// Page types that have a view today.
const LIVE_TYPES = new Set(['drug', 'treatment-support', 'support-service', 'province', 'city', 'city-archive', 'blog-post', 'legal', 'centre', 'alcohol', 'intervention', 'about-info', 'category', 'promote', 'claim']);
const OUT_OF_SCOPE = new Set(['DUI Lawyers Ontario', 'Mexico', 'Prince Edward Island Rehabs']); // approved: skipped (listed in audit/08-source-issues.md)
const LIVE_SLUGS = new Set(['blog', 'home']);
// SEO migration audit (audit/seo/): pages that rank on the old site are published even though they are short (audit/data/restore-keep.json,
// "RESTORE" and "OPTIONAL" rows); old duplicates that must 301 are unpublished and their links point straight at the target (audit/data/superseded.json).
const RESTORE = new Set(JSON.parse(fs.readFileSync(path.join(root, 'audit/data/restore-keep.json'), 'utf8')).restore);
const SUPERSEDED = JSON.parse(fs.readFileSync(path.join(root, 'audit/data/superseded.json'), 'utf8'));
// Old WordPress image URLs that Google has indexed (audit/seo/ARC_old_image_urls.csv): their files are always published so /wp-content/uploads/... can redirect to them.
const OLD_IMAGES = new Set(fs.readFileSync(path.join(root, 'audit/seo/ARC_old_image_urls.csv'), 'utf8').split('\n').slice(1).map((l) => l.split(',')[0].trim()).filter(Boolean));
const IMG_URL_MAP = {}; // original image URL -> published WebP path (written to audit/data/img-url-map.json)
// SEO audit 1H: image alt "[Centre name] in [City], [Province]"; casing fixes for names the source stored badly; 2025 -> 2026 in the three "best of" titles.
const PROV_NAMES = { AB: 'Alberta', BC: 'British Columbia', MB: 'Manitoba', NB: 'New Brunswick', NL: 'Newfoundland and Labrador', NS: 'Nova Scotia', NT: 'Northwest Territories', NU: 'Nunavut', ON: 'Ontario', PE: 'Prince Edward Island', QC: 'Quebec', SK: 'Saskatchewan', YT: 'Yukon' };
const altFor = (name, address) => {
  const m = String(address || '').replace(/,?\s*Canada\s*$/i, '').match(/,\s*([^,]+?),\s*([A-Z]{2})(?:\s+[A-Z]\d[A-Z]\s?\d[A-Z]\d)?\s*$/);
  return m && PROV_NAMES[m[2]] ? `${name} in ${m[1].trim()}, ${PROV_NAMES[m[2]]}` : name;
};
const CASEFIX = [["St John'S Inter Group", "St John's Inter Group"], ["Bear'S Paw", "Bear's Paw"], ['Clearview Aa Meeting', 'Clearview AA Meeting'], ['Mb Counselling Services', 'MB Counselling Services'], ["Neville'S Counselling", "Neville's Counselling"], ['Old Fashioned Aa Group', 'Old Fashioned AA Group'], ["Ruth And Naomi'S Mission", "Ruth And Naomi's Mission"], ['Teen Challenge Bc', 'Teen Challenge BC'], ["Women'S Centre", "Women's Centre"], ['Women\u2019S Centre', 'Women\u2019s Centre'], ['Naomi\u2019S Mission', 'Naomi\u2019s Mission'], ['St John\u2019S Inter', 'St John\u2019s Inter'], ['Bear\u2019S Paw', 'Bear\u2019s Paw'], ['Neville\u2019S', 'Neville\u2019s']];
const fixCasing = (json) => CASEFIX.reduce((j, [a, b]) => j.split(a).join(b), json);
const TITLE_YEAR = new Set(['/7-best-drug-alcohol-rehab-centres-in-vancouver-2025/', '/toronto-rehabs/', '/ottawa-rehabs/']);
const yearUp = (v) => JSON.parse(JSON.stringify(v ?? null).replace(/(?<![\d/-])2025(?![\d/-])/g, '2026'));
const rewriteSuperseded = (json) => {
  for (const [from, to] of Object.entries(SUPERSEDED)) {
    const re = new RegExp('(["\\\\(\']|https://addictionrehabcenters\\.ca)' + from.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&') + '(?=["#?\\\\\']|$)', 'g');
    json = json.replace(re, (m, pre) => (pre.startsWith('http') ? pre : pre) + to);
  }
  return json;
};
const SKIP_PAGES = new Set(); // (dui-lawyers-in-canada is published: real source content; its lawyer cards are unlinked, their pages are out of scope) // the real blog index
// Thin-page rules (see audit/07-thin-pages.md) — thin pages are never published until you decide.
const isThin = (d) => {
  if (RESTORE.has(d.new_route)) return false;
  if (d.page_type === 'centre') return d.word_count < 60;
  if (d.page_type === 'province') return (d.cards || []).length > 0 && d.cards.length <= 2;
  if (d.page_type === 'city-archive') return (d.cards || []).length <= 1;
  if (d.page_type === 'legal') return false; // required before launch: built regardless of length
  if (d.page_type === 'blog-post' || LIVE_TYPES.has(d.page_type)) return d.word_count < 300;
  return false;
};

/* ───────── mojibake repair ───────── */
const CP1252 = { 0x20ac: 0x80, 0x201a: 0x82, 0x0192: 0x83, 0x201e: 0x84, 0x2026: 0x85, 0x2020: 0x86, 0x2021: 0x87, 0x02c6: 0x88, 0x2030: 0x89, 0x0160: 0x8a, 0x2039: 0x8b, 0x0152: 0x8c, 0x017d: 0x8e, 0x2018: 0x91, 0x2019: 0x92, 0x201c: 0x93, 0x201d: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97, 0x02dc: 0x98, 0x2122: 0x99, 0x0161: 0x9a, 0x203a: 0x9b, 0x0153: 0x9c, 0x017e: 0x9e, 0x0178: 0x9f };
const MOJI = /[Â-ô][\u0080-¿ŒœŠšŸŽžƒˆ˜–—‘’‚“”„†‡•…‰‹›€™]+/g;
const dec = new TextDecoder('utf-8', { fatal: true });
const fixes = [];
let currentPage = '';
function fixText(s) {
  // "Â" + space: the source stored a no-break space as UTF-8 read as Windows-1252 ("Â" + NBSP); whitespace was normalised to a plain space when extracting
  s = s.replace(/\u00c2 /g, (m, off) => {
    fixes.push({ page: currentPage, before: s.slice(Math.max(0, off - 18), off + 14), after: s.slice(Math.max(0, off - 18), off) + ' ' + s.slice(off + 2, off + 14) });
    return ' ';
  });
  return s.replace(MOJI, (m, off) => {
    try {
      const bytes = Uint8Array.from([...m].map((c) => CP1252[c.codePointAt(0)] ?? c.codePointAt(0)));
      const out = dec.decode(bytes);
      fixes.push({ page: currentPage, before: s.slice(Math.max(0, off - 18), off + m.length + 12), after: s.slice(Math.max(0, off - 18), off) + out + s.slice(off + m.length, off + m.length + 12) });
      return out;
    } catch {
      return m;
    }
  });
}
const fixDeep = (v) => (typeof v === 'string' ? fixText(v) : Array.isArray(v) ? v.map(fixDeep) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fixDeep(x)])) : v);

/* ───────── image publishing (dedupe by content hash, WebP ≤ 1600px) ───────── */
for (const e of fs.existsSync(IMG_OUT) ? fs.readdirSync(IMG_OUT, { withFileTypes: true }) : []) {
  if (e.isDirectory()) fs.rmSync(path.join(IMG_OUT, e.name), { recursive: true, force: true }); // generated folders only; design JPGs at the top level are untouched
}
const corrupt = [];
const store = new Map(); // sha1 -> { web, width, height }
const names = new Set();
let filesWritten = 0;
async function publishImage(rel, folder, maxW = MAX_W) {
  let abs = path.join(IMG_SRC, rel);
  if (!fs.existsSync(abs)) abs = path.join(IMG_SRC2, rel.replace(/^images\//, ''));
  const buf = fs.readFileSync(abs);
  const h = crypto.createHash('sha1').update(buf).digest('hex') + (maxW === MAX_W ? '' : ':' + maxW);
  if (store.has(h)) return store.get(h);
  const ext = path.extname(rel).toLowerCase();
  const base = path.basename(rel, path.extname(rel));
  const keep = ext === '.svg' || ext === '.gif';
  let name = base + (maxW === MAX_W ? '' : '-w' + maxW) + (keep ? ext : '.webp');
  if (names.has(folder + '/' + name)) name = base + '-' + h.slice(0, 6).replace(':', '') + (keep ? ext : '.webp');
  names.add(folder + '/' + name);
  const dst = path.join(IMG_OUT, folder, name);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  let width = null, height = null;
  if (keep) fs.copyFileSync(abs, dst);
  else {
    try {
      const info = await sharp(buf).rotate().resize({ width: maxW, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(dst);
      width = info.width; height = info.height;
    } catch (e) {
      corrupt.push({ file: rel, error: String(e.message).slice(0, 80) });
      names.delete(folder + '/' + name); store.set(h, null);
      return null;
    }
  }
  filesWritten++;
  const rec = { web: '/assets/img/' + folder + '/' + name, width, height };
  store.set(h, rec);
  return rec;
}

/* ───────── inline <img> in HTML fragments → local WebP (images missing locally are omitted) ───────── */
const fullSize = (u) => u.replace(/-\d{2,4}x\d{2,4}(\.[A-Za-z0-9]+)$/, '$1').split('?')[0];
const attr = (tag, n) => (tag.match(new RegExp('\\s' + n + '="([^"]*)"', 'i')) || [])[1];
async function rewriteImgs(html, imgMap, folder, live, omitted) {
  if (!html || !html.includes('<img')) return html;
  let out = '', last = 0;
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    out += html.slice(last, m.index); last = m.index + m[0].length;
    const src = attr(m[0], 'src') || '';
    const rel = live ? imgMap[fullSize(src)] : null;
    if (!rel) { omitted.push(src); continue; }
    const im = await publishImage(rel, folder);
    if (!im) { omitted.push(src); continue; }
    const alt = attr(m[0], 'alt');
    out += `<img src="${im.web}" alt="${alt ?? ''}"${im.width ? ` width="${im.width}" height="${im.height}"` : ''} loading="lazy">`;
  }
  return out + html.slice(last);
}
async function procBlocks(blocks, imgMap, folder, live, omitted, local) {
  const res = [];
  for (const b of blocks || []) {
    if (b.type === 'image') {
      const im = await local(b.src);
      if (im) res.push({ ...b, src: im.web, width: im.width ? String(im.width) : b.width, height: im.height ? String(im.height) : b.height });
      else omitted.push(b.src);
      continue;
    }
    if (b.type === 'tabs') { res.push({ ...b, tabs: await Promise.all(b.tabs.map(async (x) => ({ ...x, blocks: await procBlocks(x.blocks, imgMap, folder, live, omitted, local) }))) }); continue; }
    if (b.type === 'accordion') { res.push({ ...b, items: await Promise.all(b.items.map(async (x) => ({ ...x, blocks: await procBlocks(x.blocks, imgMap, folder, live, omitted, local) }))) }); continue; }
    if (b.type === 'centre-cards') {
      const items = [];
      for (const it of b.items) {
        const im = it.image ? await local(it.image.original_url) : null;
        items.push({ name: it.name, href: it.href.replace(/^https?:\/\/[^/]+/, ''), address: it.address, excerpt: finishExcerpt(fixExcerpt(hrefSlug(it.href), it.excerpt), CENTRE_ABOUT.get(it.href.replace(/^https?:\/\/[^/]+/, ''))), category: it.category, image: im ? { src: im.web, alt: it.image.alt, width: im.width, height: im.height } : null });
      }
      res.push({ type: 'centre-cards', items }); continue;
    }
    const nb = { ...b };
    if (typeof nb.html === 'string') nb.html = await rewriteImgs(nb.html, imgMap, folder, live, omitted);
    if (nb.items) nb.items = await Promise.all(nb.items.map(async (it) => ({ ...it, html: await rewriteImgs(it.html, imgMap, folder, live, omitted) })));
    res.push(nb);
  }
  return res;
}
const omittedAll = [];

/* ───────── pages ───────── */
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const index = [];
const published = new Set();
const PROVINCE = { 'British Columbia Rehabs': '/british-columbia-rehabs/', 'Ontario Rehabs': '/ontario-rehabs/', 'Nova Scotia Rehabs': '/nova-scotia-rehabs/', 'Alberta Rehabs': '/alberta-rehabs/', 'New Brunswick Rehabs': '/new-brunswick-rehabs/', 'Manitoba Rehabs': '/manitoba-rehabs/', 'Newfoundland and Labrador Rehabs': '/newfoundland-and-labrador-rehabs/', 'Quebec Rehabs': '/drug-alcohol-rehabs-in-quebec/', 'Saskatchewan Rehabs': '/saskatchewan-rehabs/', 'Northwest Territories Rehabs': '/northwest-territories-rehabs/' };
const thinRedirects = [];
const googleReviewCentres = [];
let reviewSchemaRemoved = 0;
const stripReviews = (v) => {
  if (Array.isArray(v)) return v.map(stripReviews).filter((x) => x !== undefined);
  if (v && typeof v === 'object') {
    const ty = [].concat(v['@type'] || []);
    if (ty.some((x) => /^(Review|AggregateRating|Rating)$/.test(x))) { reviewSchemaRemoved++; return undefined; }
    const o = {};
    for (const [k, x] of Object.entries(v)) {
      if (/^(aggregateRating|review|reviews|reviewRating)$/.test(k)) { reviewSchemaRemoved++; continue; }
      const y = stripReviews(x);
      if (y !== undefined) o[k] = y;
    }
    return o;
  }
  return v;
};
// Approved: links to the two thin (unpublished) blog posts are removed everywhere; the link text stays.
const THIN_POSTS = ['/7-things-people-recovering-from-an-addiction-wish-you-knew/', '/the-seven-cs-for-helping-your-child-heal-during-your-recovery/'];
const thinPostLinksRemoved = [];
const hrefIsThinPost = (h) => THIN_POSTS.some((p) => h === p || h.startsWith(p + '#') || h.startsWith(p + '?') || h.includes('addictionrehabcenters.ca' + p));
function unlinkThinPosts(v, page) {
  if (Array.isArray(v)) return v.map((x) => unlinkThinPosts(x, page));
  if (v && typeof v === 'object') {
    if (v.type === 'link' && typeof v.new_href === 'string' && hrefIsThinPost(v.new_href)) { thinPostLinksRemoved.push({ page, text: v.text }); return { type: 'text', text: v.text, was_link: true }; }
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, k === 'links' ? x : unlinkThinPosts(x, page)]));
  }
  if (typeof v === 'string' && v.includes('<a')) {
    return v.replace(/<a\b[^>]*\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, (m, h, inner) => { if (!hrefIsThinPost(h)) return m; thinPostLinksRemoved.push({ page, text: inner.replace(/<[^>]+>/g, '') }); return inner; });
  }
  return v;
}
/* ───────── Open Graph / Twitter / schema images: self-hosted (no wp-content URL anywhere in the head) ───────── */
const CENTRE_NAME = new Map(); // centre url -> name
const FIRST_IMG = new Map(); // route -> first real image (card fallback)
const fallbackLog = [];
const ORIG2REL = new Map(); // source image URL (no query) -> local_path in audit/images(-phase4)
for (const f of fs.readdirSync(SRC).filter((x) => x.endsWith('.json'))) {
  const d = JSON.parse(fs.readFileSync(path.join(SRC, f), 'utf8'));
  if (d.page_type === 'centre' && d.centre?.name) CENTRE_NAME.set(d.source.url, d.centre.name);
  // first real image of a post / centre (fallback for cards whose own thumbnail is missing)
  if (d.page_type === 'blog-post') {
    const b0 = (d.blocks || []).find((b) => b.type === 'image');
    const r0 = b0 && (d.images || []).find((im) => im.original_url && im.original_url.split('?')[0] === (b0.src || '').split('?')[0] && im.local_path && im.download !== 'failed');
    if (r0) FIRST_IMG.set(d.new_route, { local_path: r0.local_path, alt: b0.alt || '', width: r0.width, height: r0.height, original_url: r0.original_url });
  }
  if (d.page_type === 'centre') {
    const g0 = (d.centre?.gallery || [])[0];
    const r0 = g0 && (d.images || []).find((im) => im.original_url && im.original_url.split('?')[0] === (g0.src_original || '').split('?')[0] && im.local_path && im.download !== 'failed');
    if (r0) FIRST_IMG.set(d.new_route, { local_path: r0.local_path, alt: g0.alt || d.centre.name || '', width: r0.width, height: r0.height, original_url: r0.original_url });
  }
  if (d.page_type === 'centre') CENTRE_ABOUT.set(d.new_route, ((d.centre?.about_blocks || []).find((b) => b.type === 'p' && b.html) || {}).html || '');
  for (const im of d.images || []) if (im.local_path && im.original_url && im.download !== 'failed') ORIG2REL.set(im.original_url.split('?')[0], im.local_path);
}
const OG_EXTRA = path.join(root, 'audit/data/og-extra.json');
if (fs.existsSync(OG_EXTRA)) for (const [u, rel] of Object.entries(JSON.parse(fs.readFileSync(OG_EXTRA, 'utf8')))) ORIG2REL.set(u, rel);
const WP_URL = /https:\/\/addictionrehabcenters\.ca\/wp-content\/[^"'\s\\)<>]*/g;
const ogCache = new Map(); // wp url -> { url, width, height, type } | null
async function selfHost(u) {
  if (ogCache.has(u)) return ogCache.get(u);
  const base = u.split('?')[0];
  const cands = [base, base.replace(/\.webp$/, ''), base.replace(/-\d+x\d+(\.[a-z]+)$/i, '$1'), base.replace(/\.webp$/, '').replace(/-\d+x\d+(\.[a-z]+)$/i, '$1')];
  let rec = null;
  for (const c of cands) {
    const rel = ORIG2REL.get(c);
    if (rel) { try { const r = await publishImage(rel, 'og'); if (r) { rec = { url: SOURCE_ORIGIN + r.web, width: r.width, height: r.height, type: r.web.endsWith('.webp') ? 'image/webp' : r.web.endsWith('.gif') ? 'image/gif' : 'image/svg+xml' }; break; } } catch {} }
  }
  if (!rec && /logo/i.test(base)) rec = { url: SOURCE_ORIGIN + '/assets/logo.png', width: null, height: null, type: 'image/png' };
  ogCache.set(u, rec);
  return rec;
}
const SOURCE_ORIGIN = 'https://addictionrehabcenters.ca';
const DEFAULT_OG_SRC = 'https://addictionrehabcenters.ca/wp-content/uploads/2021/11/addiction-rehab-centers-canada-1.jpg'; // the source Home's own og image
const unmappedOg = [];
/** Rewrites one page's meta tags + JSON-LD so every image URL is a self-hosted copy; unmapped og/twitter images fall back to the site default, unmapped schema images are dropped. */
async function selfHostHead(key, meta, jsonld) {
  const def = await selfHost(DEFAULT_OG_SRC);
  let outMeta = [];
  let pendingDims = null;
  for (const m of meta || []) {
    const [kind, n, c] = m;
    if (/^(og:image|twitter:image)$/.test(n) && WP_URL.test(c)) {
      WP_URL.lastIndex = 0;
      let r = await selfHost(c);
      if (!r) { unmappedOg.push({ page: key, url: c }); r = def; }
      if (r) { outMeta.push([kind, n, r.url]); if (n === 'og:image') pendingDims = r; }
      continue;
    }
    WP_URL.lastIndex = 0;
    if (pendingDims && n === 'og:image:width') { if (pendingDims.width) outMeta.push([kind, n, String(pendingDims.width)]); continue; }
    if (pendingDims && n === 'og:image:height') { if (pendingDims.height) outMeta.push([kind, n, String(pendingDims.height)]); continue; }
    if (pendingDims && n === 'og:image:type') { outMeta.push([kind, n, pendingDims.type]); pendingDims = null; continue; }
    outMeta.push(m);
  }
  let txt = JSON.stringify(jsonld ?? []);
  const urls = [...new Set(txt.match(WP_URL) || [])].sort((a, b) => b.length - a.length); // longest first (logo.png.webp before logo.png)
  for (const u of urls) {
    const r = await selfHost(u);
    txt = txt.split(u).join(r ? r.url : '');
  }
  return { meta: outMeta, jsonld: JSON.parse(txt) };
}
const files = fs.readdirSync(SRC).filter((x) => x.endsWith('.json')).sort();
const eligible = [];
for (const f of files) {
  const d = JSON.parse(fs.readFileSync(path.join(SRC, f), 'utf8'));
  if (d.page_type === 'centre' && !isThin(d) && !OUT_OF_SCOPE.has(d.centre?.categories?.[0])) eligible.push({ key: f.replace(/\.json$/, ''), route: d.new_route });
}
eligible.sort((a, b) => a.route.localeCompare(b.route));
const batchSet = new Set(eligible.slice(0, BATCH).map((x) => x.key));

for (const f of files) {
  let d = JSON.parse(fs.readFileSync(path.join(SRC, f), 'utf8'));
  const key = f.replace(/\.json$/, '');
  if (d.page_type === 'city-archive' && d.cards && !d.listing) {
    // City archive (/listing-location/<city>/): H1 + "More Rehab Centres in <city> Results" + centre cards, modelled like a province listing.
    const byUrl = {};
    for (const im of d.images || []) byUrl[(im.original_url || '').split('?')[0]] = im;
    const seenHref = new Set();
    const cards = [];
    // The scraped card category is the tag texts run together; the raw markup has them as separate <span>s -> "A · B · C".
    const tagsByHref = new Map();
    for (const blk of (d.raw_html || '').split('class="place-item').slice(1)) {
      const href = (blk.match(/class="place-title"[\s\S]*?href="([^"]+)"/) || blk.match(/itemprop="url" href="([^"]+)"/) || [])[1];
      const tags = [...((blk.match(/class="place-type[^"]*">([\s\S]*?)<\/div>/) || [])[1] || '').matchAll(/<span>([^<]*)<\/span>/g)].map((m) => m[1].trim()).filter(Boolean);
      if (href && tags.length) tagsByHref.set(href, tags.join(' \u00b7 '));
    }
    for (const c of d.cards) {
      if (seenHref.has(c.href)) continue;
      seenHref.add(c.href);
      const im = c.image ? byUrl[(c.image.src_original || '').split('?')[0]] : null;
      cards.push({ name: c.name, href: c.href, slug: new URL(c.href).pathname.split('/').filter(Boolean).pop(), address: c.address, excerpt: aboutExcerpt(CENTRE_ABOUT.get(new URL(c.href).pathname)), category: tagsByHref.get(c.href) ?? c.category, reviews: 0,
        image: c.image && im?.local_path ? { local_path: im.local_path, alt: altFor(c.name, c.address), width: c.image.width, height: c.image.height, original_url: c.image.src_original } : null });
    }
    const h2 = (d.blocks || []).find((b) => b.type === 'h2');
    d.listing = { cards, source_listing_count: d.cards.length, duplicates_removed: d.cards.length - cards.length };
    d.rows = [
      { kind: 'listing-banner', classes: [], background_image: null, columns: [{ classes: [], blocks: [{ type: 'h1', text: d.h1, html: d.h1 }] }] },
      { kind: 'listing', classes: [], background_image: null, columns: [{ classes: [], blocks: [...(h2 ? [{ type: 'h2', text: h2.text, html: h2.html ?? h2.text }] : []), { type: 'cards', hrefs: cards.map((c) => c.href) }] }] },
    ];
  }
  if (key === 'saskatchewan-rehabs') {
    // Same province, same URL as the old ranking page: its 2 centre cards plus the text of the (now redirected) Saskatchewan text page.
    const t = JSON.parse(fs.readFileSync(path.join(SRC, 'saskatchewan-drug-rehab-treatment.json'), 'utf8'));
    d.rows.push(...t.rows.filter((r) => r.kind !== 'hero-banner' && !(r.classes || []).includes('bottomWidget')));
    d.images = [...(d.images || []), ...(t.images || [])];
    d.word_count += t.word_count;
  }
  if (d.page_type !== 'city-archive' && !d.listing && Array.isArray(d.rows) && d.cards?.length && /cards/.test(JSON.stringify(d.rows))) {
    // Pages that embed centre cards (e.g. /drug-intervention-treatment-centres/): the cards become a centre-cards block (name from the centre page, source order)
    const byH = new Map(d.cards.map((c) => [c.href, c]));
    for (const r of d.rows) for (const c of r.columns) c.blocks = c.blocks.map((b) => {
      if (b.type !== 'cards') return b;
      return { type: 'centre-cards', items: b.hrefs.map((h) => byH.get(h)).filter(Boolean).map((c) => ({ name: c.name || CENTRE_NAME.get(c.href) || '', href: c.href, address: c.address, excerpt: c.excerpt, category: c.category, image: c.image ? { original_url: c.image.src_original, alt: altFor(c.name || CENTRE_NAME.get(c.href) || '', c.address) } : null })) };
    });
  }
  const thin = isThin(d);
  const hasCards = /eltdf-ll-item/.test(d.raw_html || '') && !d.listing && !JSON.stringify(d.rows || []).includes('"centre-cards"'); // card pages need the listing data
  const isCentre = d.page_type === 'centre';
  const oos = isCentre && OUT_OF_SCOPE.has(d.centre?.categories?.[0]);
  const batchOk = !isCentre || batchSet.has(key);
  const live = (LIVE_TYPES.has(d.page_type) || LIVE_SLUGS.has(key)) && !thin && !hasCards && !oos && !SKIP_PAGES.has(key) && batchOk && !SUPERSEDED[d.new_route];
  const folder = key.replace(/^(centre|city)__/, '');
  if (isCentre && d.centre?.google_reviews?.items?.length) googleReviewCentres.push({ route: d.new_route, name: d.centre.name, reviews: d.centre.google_reviews.items.length });
  if (isCentre && thin) thinRedirects.push({ old: d.new_route, name: d.centre.name, province: d.centre.categories?.[0] || '', target: PROVINCE[d.centre.categories?.[0]] || '/', words: d.word_count });
  currentPage = d.new_route;
  const raw = d.raw_html; delete d.raw_html;
  d = fixDeep(d);
  if (!live) d.__nofix = true;
  const imgMap = {};
  for (const im of d.images || []) if (im.local_path && im.download === 'ok') imgMap[im.original_url.split('?')[0]] = im.local_path;
  const cache = {};
  const local = async (u, fold = folder) => {
    const rel = u ? imgMap[u.split('?')[0]] ?? ORIG2REL.get(u.split('?')[0]) : null;
    const ok = u ? u.split('?')[0] : '';
    if (!rel || !(live || SUPERSEDED[d.new_route] || OLD_IMAGES.has(ok))) return null;
    const k = rel + '|' + fold;
    const r = (cache[k] ??= await publishImage(rel, fold));
    if (r && OLD_IMAGES.has(ok)) IMG_URL_MAP[ok] = r.web;
    return r;
  };
  const rows = [];
  const omitted = [];
  for (const r of d.rows || []) {
    const bg = await local(r.background_image);
    const columns = [];
    for (const c of r.columns) columns.push({ classes: c.classes, blocks: await procBlocks(c.blocks, imgMap, folder, live, omitted, local) });
    rows.push({ kind: r.kind, classes: r.classes, background_image: bg?.web ?? null, background_dims: bg && bg.width ? [bg.width, bg.height] : null, columns });
  }
  const useBlocks = d.page_type === 'blog-post' || (!(d.rows || []).length && !isCentre);
  const blocks = useBlocks ? await procBlocks(d.blocks, imgMap, folder, live, omitted, local) : undefined;
  if (live && omitted.length) omittedAll.push({ page: d.new_route, images: [...new Set(omitted)] });
  let blogCards;
  if (d.blog_cards) {
    blogCards = [];
    for (const c of d.blog_cards) {
      let image = null;
      const src0 = c.image?.local_path ? c.image : FIRST_IMG.get(c.path); if (!c.image?.local_path && src0) fallbackLog.push({ page: d.new_route, element: 'blog card', name: c.title, target: c.path, source_image: src0.original_url, cause: 'source index card has no thumbnail; the post\'s own first image is used' });
      if (src0?.local_path && live) { const im = await publishImage(src0.local_path, c.path.replace(/\//g, ''), CARD_W); if (im) image = { alt: src0.alt, local_path: im.web, width: im.width, height: im.height }; }
      blogCards.push({ path: c.path, title: c.title, excerpt: finishExcerpt(c.excerpt), image });
    }
  }
  let listing = d.listing;
  if (listing) {
    const cards = [];
    for (const c of listing.cards) {
      let image = null;
      const cimg = c.image?.local_path ? c.image : (FIRST_IMG.get(new URL(c.href).pathname) ? { ...FIRST_IMG.get(new URL(c.href).pathname) } : null);
      if (!c.image?.local_path && cimg) fallbackLog.push({ page: d.new_route, element: 'listing card', name: c.name, target: new URL(c.href).pathname, source_image: cimg.original_url, cause: 'source listing card has no thumbnail; the centre\'s first gallery image is used' });
      if (cimg?.local_path && live) {
        const im = await publishImage(cimg.local_path, c.slug, CARD_W);
        if (im) image = { ...cimg, alt: altFor(c.name, c.address), local_path: im.web, width: im.width ? String(im.width) : cimg.width, height: im.height ? String(im.height) : cimg.height };
      }
      cards.push({ ...c, excerpt: finishExcerpt(fixExcerpt(c.slug, c.excerpt), CENTRE_ABOUT.get('/' + c.slug + '/') || CENTRE_ABOUT.get(new URL(c.href).pathname)), excerpt_source: c.excerpt, image });
    }
    listing = { ...listing, cards };
  }
  let centre;
  if (isCentre && live) {
    const c = d.centre;
    const gallery = [];
    for (const g of c.gallery || []) { const im = await local(g.src_original); if (im) gallery.push({ src: im.web, alt: altFor(c.name, c.address), width: im.width, height: im.height }); else omitted.push(g.src_original); }
    const faqs = [];
    for (const q of c.faqs || []) faqs.push({ question: q.question, answer_blocks: await procBlocks(q.answer_blocks, imgMap, folder, live, omitted, local) });
    let sponsor = null;
    if (c.sponsor) {
      const im = c.sponsor.image ? await local(c.sponsor.image.src_original) : null;
      sponsor = { label: c.sponsor.label, title: c.sponsor.title, text: c.sponsor.text, href: c.sponsor.href, image: im ? { src: im.web, alt: c.sponsor.image.alt || '', width: im.width, height: im.height } : null };
    }
    centre = {
      name: c.name, categories: c.categories, reviews_count: c.reviews_count,
      phone_text: c.phone_text, phone_href: c.phone_href, email: c.email, website: c.website, website_text: c.website_text, address: c.address,
      social: c.social, social_title: c.social_title, gallery,
      about_blocks: await procBlocks(c.about_blocks, imgMap, folder, live, omitted, local),
      specialty_groups: c.specialty_groups, info_items: c.info_items, faq_heading: c.faq_heading, faqs, hours: c.hours, tags: c.tags, sponsor,
    };
    if (omitted.length) omittedAll.push({ page: d.new_route, images: [...new Set(omitted)] });
  }
  const og = isCentre ? null : await local(d.seo.og?.image);
  const hosted = live ? await selfHostHead(key, SOURCE_HEAD[key]?.meta, stripReviews(SOURCE_HEAD[key]?.jsonld ?? d.seo.jsonld_source)) : { meta: SOURCE_HEAD[key]?.meta, jsonld: stripReviews(SOURCE_HEAD[key]?.jsonld ?? d.seo.jsonld_source) };
  // The page lives at a new route (e.g. /promote-your-centre/ -> /promote/): canonical, og:url and schema urls point at the new route
  const srcPath = new URL(d.source.url).pathname;
  if (srcPath !== d.new_route) {
    const sw = (x) => JSON.parse(JSON.stringify(x ?? null).split(srcPath).join(d.new_route));
    hosted.meta = sw(hosted.meta); hosted.jsonld = sw(hosted.jsonld);
    if (SOURCE_HEAD[key]) SOURCE_HEAD[key] = { ...SOURCE_HEAD[key], canonical: SOURCE_ORIGIN + d.new_route };
  }
  const slim = {
    slug: key, route: d.new_route, page_type: d.page_type, template: d.template,
    seo: { ...d.seo, jsonld_source: hosted.jsonld, og: { ...d.seo.og, image: og?.web ?? null } },
    head: SOURCE_HEAD[key] ? { title: SOURCE_HEAD[key].title, canonical: SOURCE_HEAD[key].canonical, meta: hosted.meta, links: SOURCE_HEAD[key].links, ext_links: SOURCE_HEAD[key].ext_links, headings: SOURCE_HEAD[key].headings, related: SOURCE_HEAD[key].related, nav: SOURCE_HEAD[key].nav } : undefined,
    h1: d.h1, word_count: d.word_count, source: d.source,
    rows, listing, centre, post: d.post, faqs: isCentre ? undefined : d.faqs,
    blocks, blog_cards: blogCards, category: d.category,
  };
  if (TITLE_YEAR.has(d.new_route)) { slim.seo = yearUp(slim.seo); slim.head = yearUp(slim.head) ?? undefined; slim.h1 = slim.h1.replace(/(?<![\d/-])2025(?![\d/-])/g, '2026'); }
  fs.writeFileSync(path.join(OUT, key + '.json'), fixCasing(rewriteSuperseded(JSON.stringify(live ? unlinkThinPosts(slim, d.new_route) : slim))));
  if (live) published.add(key);
  index.push({ slug: key, route: d.new_route, type: d.page_type, title: d.seo.meta_title, published: live, reason: live ? '' : thin ? 'thin' : oos ? 'out-of-scope (approved: skipped)' : !batchOk ? 'batch pending' : SUPERSEDED[d.new_route] ? 'redirected duplicate (SEO audit: 301 to ' + SUPERSEDED[d.new_route] + ')' : hasCards ? 'embeds centre cards - needs card component' : 'no view yet', modified: d.source.wp_items?.[0]?.modified ?? null, noindex: /noindex/.test(d.source.robots || '') });
}
// Old indexed image URLs not reached through a page (thin / redirected pages, card thumbnails …): publish their file too so the URL can redirect.
for (const u of OLD_IMAGES) {
  if (IMG_URL_MAP[u]) continue;
  const rel = ORIG2REL.get(u);
  if (!rel) continue;
  try { const r = await publishImage(rel, 'old-uploads'); if (r) IMG_URL_MAP[u] = r.web; } catch {}
}
index.sort((a, b) => a.route.localeCompare(b.route));
fs.writeFileSync(path.join(OUT, '_index.json'), JSON.stringify(index, null, 1));
const pubFixes = fixes.filter((x) => published.has(index.find((i) => i.route === x.page)?.slug));
fs.writeFileSync(path.join(root, 'audit/08-mojibake-fixes.json'), JSON.stringify({ published_pages: pubFixes, other_pages_count: fixes.length - pubFixes.length }, null, 1));
fs.writeFileSync(path.join(root, 'audit/10-omitted-images.json'), JSON.stringify(omittedAll, null, 1));
const baseRedirects = []; // redirects.json is owned by audit/scripts/make_redirects.py
if (BATCH === Infinity || process.env.WRITE_REDIRECTS) {
  const tr = thinRedirects.map((x) => ({ source: x.old.replace(/\/$/, ''), destination: x.target, note: 'thin centre (' + x.words + ' words) -> province page; pending client approval' }));
  // redirects.json is now owned by audit/scripts/make_redirects.py (all source URLs, city/province targets)
  //  fs.writeFileSync(path.join(root, 'src/lib/redirects.json'), JSON.stringify([...baseRedirects, ...tr], null, 1));
  const q = (s) => '"' + String(s).replace(/"/g, '""') + '"';
  fs.writeFileSync(path.join(root, 'audit/thin-centre-redirects.csv'), ['old_url,target,word_count,centre,province', ...thinRedirects.sort((a, b) => a.old.localeCompare(b.old)).map((x) => [q('https://addictionrehabcenters.ca' + x.old), q(x.target), x.words, q(x.name), q(x.province)].join(','))].join('\n') + '\n');
}
fs.writeFileSync(path.join(root, 'audit/data/img-url-map.json'), JSON.stringify(IMG_URL_MAP, null, 1));
fs.writeFileSync(path.join(root, 'audit/11-google-review-centres.json'), JSON.stringify(googleReviewCentres, null, 1));
fs.writeFileSync(path.join(root, 'audit/11-corrupt-images.json'), JSON.stringify(corrupt, null, 1));
fs.writeFileSync(path.join(root, 'audit/12-thin-post-links-removed.json'), JSON.stringify(thinPostLinksRemoved, null, 1));
console.log(`review/aggregateRating schema nodes removed: ${reviewSchemaRemoved}; google-review centres: ${googleReviewCentres.length}; corrupt images: ${corrupt.length}; thin redirects: ${thinRedirects.length}`);
// audit/20-missing-images.csv: every card that had no image of its own, the source image now used, and the cause
{
  const q = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const rows = [['page', 'element', 'name', 'target', 'source_image', 'status', 'cause'].join(',')];
  const seen = new Set();
  for (const r of fallbackLog) { const k = r.page + '|' + r.element + '|' + r.target; if (seen.has(k)) continue; seen.add(k); rows.push([r.page, r.element, r.name, r.target, r.source_image, 'fixed (published)', r.cause].map(q).join(',')); }
  fs.writeFileSync(path.join(root, 'audit/20-missing-images.csv'), rows.join('\n') + '\n');
}
console.log(`content: ${index.length} files, ${published.size} published, ${filesWritten} image files written, ${store.size} unique; mojibake fixes: ${pubFixes.length} (+${fixes.length - pubFixes.length} on unpublished pages)`);
