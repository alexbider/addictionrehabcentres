// Compare a design file (designs/<Name>.dc.html) with the live page, at 1440 / 1024 / 768 / 390.
//
//   node audit/scripts/compare-design.mjs --design Promote --sample /promote-design/ --real /promote/ [--widths 1440,1024,768,390] [--base http://localhost:3217] [--name promote]
//
//   --sample  a route that renders the view with the DESIGN'S OWN sample text (e.g. /city/, /centre/, /promote-design/).
//             It is compared with the design section by section; heights must match within 2px (at widths above the stacking breakpoint).
//   --real    one or more comma-separated routes with REAL content. Checked for the same section order and styles, no sideways scroll,
//             no broken images, no placeholder boxes, no empty cards, no console errors; heights are not compared (real text is longer).
//
// The design is served over http from designs/ (a file:// load cannot resolve <dc-import name="SiteHeader">, so the header would render as an empty box).
// Output: audit/shots/<name>-<width>.png (design | live sample | pixel diff) and audit/shots/<name>-real-<n>-<width>.png. Exit code 1 on any difference.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const sharp = createRequire(path.join(ROOT, 'package.json'))('sharp');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > -1 ? process.argv[i + 1] : d; };
const DESIGN = arg('design'); const SAMPLE = arg('sample'); const REAL = (arg('real', '') || '').split(',').filter(Boolean);
const WIDTHS = arg('widths', '1440,1024,768,390').split(',').map(Number);
const BASE = arg('base', 'http://localhost:3217'); const NAME = arg('name', (DESIGN || 'page').toLowerCase());
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SKIP = (arg('skip', 'SiteHeader,Footer') || '').split(',').filter(Boolean); // blocks compared separately in the final header/footer pass (site-wide, identical on every page by design)
const EXTRA_OK = (arg('allow-extra', '') || '').split(',').filter(Boolean); // live-only sections the design defines but does not render in its sample state (e.g. the unclaimed 'Claim this listing' block)
// Below 1200px a changed section shifts the page, and sticky elements (captured at their scroll position in a full-page screenshot) then sit differently, so per-section pixel diffs after it are informational there.
const CHANGED = (arg('changed', '') || '').split(',').filter(Boolean); // sections whose content was changed on purpose (e.g. invented reviews removed): height, grid and pixels are not compared, order, heading and fonts still are
const SKIP_GRID = (arg('skip-grid', '') || '').split(',').filter(Boolean); // blocks whose grid adapts to the amount of real data (e.g. a photo gallery with fewer than 5 photos)
const STACK_BP = 1000; // below this the live layout stacks (the design itself has no mobile layout): heights and column counts are not compared
if (!DESIGN) { console.error('usage: --design <Name> [--sample route] [--real r1,r2]'); process.exit(2); }
const SHOTS = path.join(ROOT, 'audit/shots'); fs.mkdirSync(SHOTS, { recursive: true });

// static server for designs/
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, 'designs', decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(path.join(ROOT, 'designs')) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const DESIGN_URL = `http://127.0.0.1:${server.address().port}/${encodeURIComponent(DESIGN + '.dc.html')}`;

// ---- measured inside the page ----
const measure = () => {
  const cs = (e) => getComputedStyle(e);
  const top = [...document.querySelectorAll('section, footer, header, [data-sc-name="SiteHeader"]')].filter((e) => !e.parentElement.closest('section, footer, header, [data-sc-name="SiteHeader"]'));
  // a <header> that sits inside the SiteHeader wrapper is not a separate block
  const blocks = top.map((e) => {
    const r = e.getBoundingClientRect();
    const h = e.querySelector('h1,h2,h3');
    const hs = h && cs(h);
    const grids = [...e.querySelectorAll('*')].filter((x) => cs(x).display === 'grid').map((x) => cs(x).gridTemplateColumns.split(' ').filter((t) => /px|fr|%/.test(t)).length).filter((n) => n > 1);
    const btn = [...e.querySelectorAll('a,button')].find((b) => { const s = cs(b); return parseFloat(s.borderTopLeftRadius) > 4 && b.getBoundingClientRect().width > 60 && (s.backgroundColor !== 'rgba(0, 0, 0, 0)' || parseFloat(s.borderTopWidth) > 0); });
    const bs = btn && cs(btn); const br = btn && btn.getBoundingClientRect();
    return {
      label: e.getAttribute('data-screen-label') || e.getAttribute('data-sc-name') || e.tagName.toLowerCase(),
      top: Math.round(r.top + scrollY), height: Math.round(r.height * 10) / 10,
      heading: h ? h.textContent.replace(/\s+/g, ' ').trim() : '',
      hstyle: hs ? [hs.fontFamily.split(',')[0].replace(/["']/g, ''), hs.fontSize, hs.fontWeight, hs.color, hs.letterSpacing].join(' | ') : '',
      grids: grids.slice(0, 6).join(','),
      button: btn ? [Math.round(br.width), Math.round(br.height), bs.backgroundColor, bs.color, bs.borderRadius, bs.fontSize, bs.fontWeight].join(' | ') : '',
    };
  });
  const imgs = [...document.images].map((i) => ({ src: i.currentSrc || i.src, ok: i.complete && i.naturalWidth > 0, alt: i.getAttribute('alt'), w: Math.round(i.getBoundingClientRect().width) })).filter((i) => i.w > 0 || !i.ok);
  const placeholders = [...document.querySelectorAll('*')].filter((e) => cs(e).backgroundImage.includes('repeating-linear-gradient') && !e.querySelector('img') && e.getBoundingClientRect().width > 30).length;
  const emptyCards = [...document.querySelectorAll('a[href], article, li')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 80 && r.height > 60 && !e.textContent.trim() && !e.querySelector('img,svg,video,iframe,canvas'); }).length;
  const pr = window.__probe ? document.querySelector(window.__probe) : null;
  return { blocks, imgs, placeholders, emptyCards, scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth, docH: document.documentElement.scrollHeight, probe: pr ? getComputedStyle(pr).gridTemplateColumns + ' @' + Math.round(pr.getBoundingClientRect().width) : null };
};

const browser = await chromium.launch({ executablePath: CHROME });
const problems = []; const note = (m) => { problems.push(m); console.log('  ✗ ' + m); };

async function load(url, width, { listen } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
  const page = await ctx.newPage(); const errors = [];
  if (listen) { page.on('console', (m) => { if (['error', 'warning'].includes(m.type()) && !/favicon|Download the React DevTools|Failed to load resource|WebGPU|compute-pressure|Turnstile|OTS parsing|font-size:0;color:transparent|vimeo|youtube|cloudflare|maps\.g|Error with Permissions-Policy header/i.test(m.text())) errors.push(m.type() + ': ' + m.text().slice(0, 160)); }); page.on('pageerror', (e) => errors.push('pageerror: ' + e.message.slice(0, 160))); page.on('response', (r) => { if (r.status() >= 400 && r.url().startsWith(BASE)) errors.push(`${r.status()} ${r.url().slice(0, 140)}`); }); }
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await page.addStyleTag({ content: 'nextjs-portal,[data-nextjs-toast],#__next-build-watcher{display:none!important}' });
  await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } scrollTo(0, 0); });
  // lazy images off-screen (e.g. cards in a horizontal slider) must be loaded before they are checked
  await page.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; }));
  await page.evaluate(() => document.fonts.ready);
  for (let i = 0; i < 40; i++) { if (await page.evaluate(() => [...document.images].every((m) => m.complete))) break; await page.waitForTimeout(250); }
  // a <select> laid out before its web font arrived keeps the fallback font's height until it is re-styled (the design file loads its fonts late): re-flow them
  await page.evaluate(() => document.querySelectorAll('select').forEach((el) => { const f = el.style.font; el.style.font = '400 1px sans-serif'; void el.offsetHeight; el.style.font = f; }));
  await page.waitForTimeout(3000); // count-up and entrance animations settle
  if (arg('probe')) await page.evaluate((q) => { window.__probe = q; }, arg('probe'));
  return { ctx, page, errors };
}

const cmpStyle = (a, b) => a === b;
async function diffImage(aBuf, bBuf, out, w) {
  const A = await sharp(aBuf).raw().toBuffer({ resolveWithObject: true }); const B = await sharp(bBuf).raw().toBuffer({ resolveWithObject: true });
  const h = Math.max(A.info.height, B.info.height); const ch = A.info.channels; const d = Buffer.alloc(w * h * 3, 255); let bad = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const o = (y * w + x) * 3; const ia = (y * A.info.width + x) * ch; const ib = (y * B.info.width + x) * ch;
    if (y >= A.info.height || y >= B.info.height) { d[o] = 255; d[o + 1] = 0; d[o + 2] = 0; bad++; continue; }
    const delta = Math.abs(A.data[ia] - B.data[ib]) + Math.abs(A.data[ia + 1] - B.data[ib + 1]) + Math.abs(A.data[ia + 2] - B.data[ib + 2]);
    if (delta > 30) { d[o] = 255; d[o + 1] = 0; d[o + 2] = 0; bad++; } else { const g = 235 + (A.data[ia] - 235) * 0.1; d[o] = g; d[o + 1] = g; d[o + 2] = g; }
  }
  const diff = await sharp(d, { raw: { width: w, height: h, channels: 3 } }).png().toBuffer();
  const pad = async (buf) => sharp(buf).extend({ bottom: h - (await sharp(buf).metadata()).height, background: '#ff00ff' }).png().toBuffer();
  await sharp({ create: { width: w * 3 + 40, height: h, channels: 3, background: '#ff00ff' } }).composite([{ input: await pad(aBuf), left: 0, top: 0 }, { input: await pad(bBuf), left: w + 20, top: 0 }, { input: diff, left: 2 * w + 40, top: 0 }]).png().toFile(out);
  return (100 * bad) / (w * h);
}

function compare(D, L, w, mode) {
  const stacked = w < STACK_BP;
  const keep = (b) => !SKIP.includes(b.label) && !(mode === 'real' && EXTRA_OK.includes(b.label));
  D = { ...D, blocks: D.blocks.filter(keep) }; L = { ...L, blocks: L.blocks.filter(keep) };
  const lbl = (b) => b.label;
  const dl = D.blocks.map(lbl); const ll = L.blocks.map(lbl);
  if (dl.join('|') !== ll.join('|')) {
    note(`[${w}] section order/count differs\n      design: ${dl.join(' > ')}\n      live:   ${ll.join(' > ')}`);
    for (const m of dl.filter((x) => !ll.includes(x))) note(`[${w}] design section not found on live page: ${m}`);
  }
  D.blocks.forEach((d, i) => {
    const l = L.blocks.find((b) => b.label === d.label); if (!l) return;
    if (mode === 'sample' && d.label !== 'SiteHeader' && d.heading !== l.heading) note(`[${w}] ${d.label}: heading "${d.heading}" vs "${l.heading}"`);
    if (!stacked || d.hstyle.split(' | ')[0] === l.hstyle.split(' | ')[0]) {
      const [df, ds, dw, dc, dls] = d.hstyle.split(' | '), [lf, ls, lw, lc, lls] = l.hstyle.split(' | ');
      // heading font size may legitimately shrink when stacked; family, weight and colour never change
      if (d.hstyle && l.hstyle && (df !== lf || dw !== lw || dc !== lc || (!stacked && (ds !== ls || dls !== lls)))) note(`[${w}] ${d.label}: heading style "${d.hstyle}" vs "${l.hstyle}"`);
    }
    if (!stacked) {
      if (mode === 'sample' && Math.abs(d.height - l.height) > 0.4) console.log(`    (height) ${d.label}: ${d.height} vs ${l.height} (${(l.height - d.height).toFixed(1)})`);
      if (mode === 'sample' && !CHANGED.includes(d.label) && Math.abs(d.height - l.height) > 2) note(`[${w}] ${d.label}: height ${d.height} vs ${l.height}`);
      if (d.grids !== l.grids && !CHANGED.includes(d.label) && !(mode === 'real' && SKIP_GRID.includes(d.label))) note(`[${w}] ${d.label}: grid columns [${d.grids}] vs [${l.grids}]`);
      if (d.button && l.button && mode === 'sample') {
        const [dw, dh, ...dr] = d.button.split(' | '), [lw, lh, ...lr] = l.button.split(' | '); // size within 1.5px (sub-pixel text widths), the rest exact
        if (Math.abs(dw - lw) > 1.5 || Math.abs(dh - lh) > 1.5 || dr.join('|') !== lr.join('|')) note(`[${w}] ${d.label}: button "${d.button}" vs "${l.button}"`);
      }
    }
  });
}
function health(L, w, tag, errors) {
  if (L.scrollW > L.innerW) note(`[${w}] ${tag}: horizontal scroll (${L.scrollW} > ${L.innerW})`);
  for (const i of L.imgs.filter((x) => !x.ok)) note(`[${w}] ${tag}: broken image ${i.src}`);
  for (const i of L.imgs.filter((x) => x.alt === null)) note(`[${w}] ${tag}: image without alt attribute ${i.src}`);
  if (L.placeholders && tag.startsWith('real')) note(`[${w}] ${tag}: ${L.placeholders} placeholder box(es) (striped gradient without an image)`);
  if (L.emptyCards) note(`[${w}] ${tag}: ${L.emptyCards} empty card slot(s)`);
  for (const e of errors) note(`[${w}] ${tag}: console ${e}`);
}

for (const w of WIDTHS) {
  console.log(`\n== ${NAME} @ ${w}px`);
  const d = await load(DESIGN_URL, w); const D = await d.page.evaluate(measure); const dShot = await d.page.screenshot({ fullPage: true }); await d.ctx.close();
  if (D.scrollW > D.innerW) console.log(`  (note) the design itself scrolls sideways at ${w}px (${D.scrollW}px wide): it has no layout for this width`);
  if (SAMPLE) {
    const s = await load(BASE + SAMPLE, w, { listen: true }); const S = await s.page.evaluate(measure); const sShot = await s.page.screenshot({ fullPage: true }); await s.ctx.close();
    if (arg('probe')) console.log(`  probe ${arg('probe')}: design ${D.probe} | live ${S.probe}`);
    compare(D, S, w, 'sample'); health(S, w, 'sample ' + SAMPLE, s.errors);
    // pixel diff over the page body only: skipped blocks (the site-wide footer) are cut off at the bottom
    const cut = SKIP.includes('Footer') ? Math.min(...[D, S].map((m) => (m.blocks.find((x) => x.label === 'Footer') || { top: m.docH }).top)) : Math.min(D.docH, S.docH);
    const hdr = SKIP.includes('SiteHeader') ? Math.max(0, ...[D, S].map((m) => { const h = m.blocks.find((x) => x.label === 'SiteHeader'); return h ? Math.round(h.top + h.height) : 0; })) : 0;
    const crop = async (buf) => sharp(buf).extract({ left: 0, top: hdr, width: w, height: Math.min(cut, (await sharp(buf).metadata()).height) - hdr }).png().toBuffer();
    // per-section pixel diff (sections of equal height are compared row for row)
    if (w >= STACK_BP) {
      const rd = async (buf) => sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      const [RD, RS] = [await rd(dShot), await rd(sShot)];
      for (const d of D.blocks.filter((x) => !SKIP.includes(x.label))) {
        const l = S.blocks.find((x) => x.label === d.label); if (!l || Math.abs(l.height - d.height) > 2) continue;
        let bad = 0; const rows = Math.round(Math.min(d.height, l.height)); const ch = RD.info.channels;
        for (let y = 0; y < rows; y++) for (let x = 0; x < w; x += 2) { const ia = ((Math.round(d.top) + y) * RD.info.width + x) * ch, ib = ((Math.round(l.top) + y) * RS.info.width + x) * ch; if (Math.abs(RD.data[ia] - RS.data[ib]) + Math.abs(RD.data[ia + 1] - RS.data[ib + 1]) + Math.abs(RD.data[ia + 2] - RS.data[ib + 2]) > 30) bad++; }
        const pc = (100 * bad) / (rows * (w / 2)); if (pc > 0.6) console.log(`    (pixels) ${d.label}: ${pc.toFixed(2)}% differ`);
        if (SKIP.length > 2 || CHANGED.length) { if (pc > 2 && !CHANGED.includes(d.label) && w >= 1200) note(`[${w}] ${d.label}: section pixel diff ${pc.toFixed(2)}% (limit 2%)`); }
      }
    }
    const pct = await diffImage(await crop(dShot), await crop(sShot), path.join(SHOTS, `${NAME}-${w}.png`), w);
    console.log(`  design vs ${SAMPLE}: heights ${D.docH} / ${S.docH}, pixel diff ${pct.toFixed(2)}%${w < STACK_BP ? ' (informational: the live layout stacks below ' + STACK_BP + 'px)' : ''}  -> audit/shots/${NAME}-${w}.png`);
    if (w >= STACK_BP && pct > 1 && !(CHANGED.length || SKIP.length > 2)) note(`[${w}] pixel diff ${pct.toFixed(2)}% (limit 1%)`);
  }
  let n = 0;
  for (const r of REAL) {
    n++; const l = await load(BASE + r, w, { listen: true }); const L = await l.page.evaluate(measure);
    await l.page.screenshot({ path: path.join(SHOTS, `${NAME}-real-${n}-${w}.png`), fullPage: true }); await l.ctx.close();
    compare(D, L, w, 'real'); health(L, w, 'real ' + r, l.errors);
    console.log(`  real ${r}: ${L.blocks.length} sections, ${L.imgs.length} images, height ${L.docH}`);
  }
}
await browser.close(); server.close();
console.log(problems.length ? `\nFAIL: ${problems.length} difference(s)` : '\nPASS: zero differences');
process.exit(problems.length ? 1 : 0);
