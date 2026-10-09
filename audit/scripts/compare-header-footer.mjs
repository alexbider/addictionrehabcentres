// Header and footer check (the footer limit allows for sub-pixel text positioning; the markup itself is compared exactly across pages): the design (designs/Home.dc.html: the site-wide footer and the header every design imports) against several live pages,
// and every live page against the first one (the header and footer must be identical on every page).
//
//   node audit/scripts/compare-header-footer.mjs [--base http://localhost:3217] [--routes /,/promote/,...]
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const sharp = createRequire(path.join(ROOT, 'package.json'))('sharp');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg('base', 'http://localhost:3217');
const ROUTES = arg('routes', '/,/promote/,/alberta-rehabs/,/1000-islands-addiction-rehab/,/7-best-drug-alcohol-rehab-centres-in-vancouver-2025/,/benzodiazepine-addiction/,/intervention/,/claim-listing/,/centre-onboarding/,/blog/,/contact/').split(',');
const WIDTHS = [1440, 390];
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SHOTS = path.join(ROOT, 'audit/shots'); fs.mkdirSync(SHOTS, { recursive: true });
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, 'designs', decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(path.join(ROOT, 'designs')) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  const t = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' }[path.extname(p)] || 'application/octet-stream';
  res.writeHead(200, { 'content-type': t }); fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const DESIGN = `http://127.0.0.1:${server.address().port}/Home.dc.html`;

const probe = () => {
  const cs = (e) => getComputedStyle(e);
  const hdr = document.querySelector('[data-sc-name="SiteHeader"]');
  const ftr = document.querySelector('footer');
  const items = (root, sel) => [...root.querySelectorAll(sel)].filter((e) => e.getBoundingClientRect().width > 0 && (e.textContent || '').trim()).map((e) => {
    const r = e.getBoundingClientRect(); const c = cs(e);
    return { t: e.textContent.replace(/\s+/g, '').slice(0, 40), f: c.fontFamily.split(',')[0].replace(/["']/g, ''), s: c.fontSize, w: c.fontWeight, c: c.color, h: Math.round(r.height), href: e.getAttribute('href') || '' };
  });
  return {
    header: hdr ? { h: Math.round(hdr.getBoundingClientRect().height), items: items(hdr, 'a,button') } : null,
    footer: ftr ? { h: Math.round(ftr.getBoundingClientRect().height), items: items(ftr, 'a,h4,p,span') } : null,
    headerHtml: hdr ? hdr.outerHTML.replace(/\s+data-[a-z-]+="[^"]*"/g, '') : '', footerHtml: ftr ? ftr.outerHTML.replace(/\s+data-[a-z-]+="[^"]*"/g, '') : '',
  };
};
const browser = await chromium.launch({ executablePath: CHROME });
const out = []; const note = (m) => { out.push(m); console.log('  ✗ ' + m); };
async function grab(url, w, tag) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' }); const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } scrollTo(0, 0); });
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(2500);
  const data = await page.evaluate(probe);
  let shot = null;
  const f = page.locator('footer').first();
  if (await f.count()) shot = await f.screenshot();
  const h = page.locator('[data-sc-name="SiteHeader"]').first();
  const hshot = (await h.count()) ? await h.screenshot() : null;
  await ctx.close(); return { ...data, shot, hshot, tag };
}
const diffPct = async (a, b, mask) => {
  if (!a || !b) return 100;
  const A = await sharp(a).removeAlpha().raw().toBuffer({ resolveWithObject: true }); const B = await sharp(b).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const h = Math.min(A.info.height, B.info.height) - (mask?.bottom ?? 0), w = Math.min(A.info.width, B.info.width); let bad = 0, n = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x += 2) { if (mask?.cols && !mask.cols.some(([a0, a1]) => x >= (a0 < 0 ? w + a0 : a0) && x < (a1 <= 0 ? w + a1 : a1))) continue; n++; const i = (y * A.info.width + x) * 3, j = (y * B.info.width + x) * 3; if (Math.abs(A.data[i] - B.data[j]) + Math.abs(A.data[i + 1] - B.data[j + 1]) + Math.abs(A.data[i + 2] - B.data[j + 2]) > 30) bad++; }
  return (100 * bad) / Math.max(1, n);
};
for (const w of WIDTHS) {
  console.log(`\n== header + footer @ ${w}px`);
  const d = await grab(DESIGN, w, 'design');
  const live = [];
  for (const r of ROUTES) live.push({ r, ...(await grab(BASE + r, w, r)) });
  // 1. live pages against each other: identical markup
  const hash = (s) => crypto.createHash('md5').update(s).digest('hex').slice(0, 8);
  const hh = new Set(live.map((l) => hash(l.headerHtml))); const fh = new Set(live.map((l) => hash(l.footerHtml)));
  console.log(`  header markup variants across ${live.length} pages: ${hh.size}; footer markup variants: ${fh.size}`);
  if (hh.size > 1) note(`[${w}] header differs between pages: ${[...hh].join(', ')}`);
  if (fh.size > 1) note(`[${w}] footer differs between pages`);
  // 2. the first live page against the design
  const L = live[0];
  const dl = new Map(d.header.items.map((i) => [i.t, i])); const ll = new Map(L.header.items.map((i) => [i.t, i]));
  for (const [t, a] of dl) { const b = ll.get(t); if (!b) { note(`[${w}] header: "${t}" is in the design but not on the live page`); continue; } if (a.f !== b.f || a.s !== b.s || a.w !== b.w || a.c !== b.c || Math.abs(a.h - b.h) > 1) note(`[${w}] header "${t}": ${a.f} ${a.s} ${a.w} ${a.c} h${a.h} vs ${b.f} ${b.s} ${b.w} ${b.c} h${b.h}`); }
  for (const [t] of ll) if (!dl.has(t)) note(`[${w}] header: "${t}" is on the live page but not in the design`);
  console.log(`  header height: design ${d.header.h} / live ${L.header.h}`);
  const fd = new Map(d.footer.items.map((i) => [i.t, i])); const fl = new Map(L.footer.items.map((i) => [i.t, i]));
  for (const [t, a] of fd) { if (/©/.test(t)) continue; const b = fl.get(t); if (!b) { note(`[${w}] footer: "${t}" is in the design but not on the live page`); continue; } if (a.f !== b.f || a.s !== b.s || a.w !== b.w || a.c !== b.c) note(`[${w}] footer "${t}": ${a.f} ${a.s} ${a.w} ${a.c} vs ${b.f} ${b.s} ${b.w} ${b.c}`); }
  for (const [t] of fl) if (!fd.has(t) && !/©/.test(t)) note(`[${w}] footer: "${t}" is on the live page but not in the design`);
  const pf = await diffPct(d.shot, L.shot, { bottom: 70 }); const ph = await diffPct(d.hshot, L.hshot, w > 700 ? { cols: [[0, 280], [-300, 0]] } : { cols: [[0, 200]] });
  console.log(`  footer pixel diff vs design ${pf.toFixed(2)}% (bottom bar excluded: the © year is 2026 on purpose); header pixel diff vs design ${ph.toFixed(2)}% (logo and call-button regions: the two omitted nav items shift the middle); footer height design ${d.footer.h} / live ${L.footer.h}`);
  if (d.shot) fs.writeFileSync(path.join(SHOTS, `footer-design-${w}.png`), d.shot);
  if (L.shot) fs.writeFileSync(path.join(SHOTS, `footer-live-${w}.png`), L.shot);
  if (d.hshot) fs.writeFileSync(path.join(SHOTS, `header-design-${w}.png`), d.hshot);
  if (L.hshot) fs.writeFileSync(path.join(SHOTS, `header-live-${w}.png`), L.hshot);
  if (pf > 4) note(`[${w}] footer pixel diff ${pf.toFixed(2)}% (limit 4%: sub-pixel text positioning between the design file's fonts and the bundled fonts)`);
  if (ph > 3) note(`[${w}] header pixel diff ${ph.toFixed(2)}% (limit 3%)`);
}
await browser.close(); server.close();
console.log(out.length ? `\nFAIL: ${out.length} difference(s)` : '\nPASS: header and footer match the design and are identical on every page');
process.exit(out.length ? 1 : 0);
