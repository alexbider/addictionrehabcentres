// Centre batch check. usage: node centre-batch.mjs <outdir> <batchFile.json> [shots]
// batchFile: {slugs:[...], overflow:[...], shots:[...]}  (slugs without the centre__ prefix; route taken from content/_index.json)
// Chrome on 9333, new site on 3100, original clone on 3200.
import fs from 'node:fs'; import { createRequire } from 'node:module';
const sharp = createRequire('/Users/mac/Downloads/arc-next/package.json')('sharp');
const OUT = process.argv[2]; const B = JSON.parse(fs.readFileSync(process.argv[3], 'utf8')); const mode = process.argv[4] || 'all';
const idx = JSON.parse(fs.readFileSync('/Users/mac/Downloads/arc-next/content/_index.json', 'utf8'));
const routeOf = (s) => idx.find((e) => e.slug === 'centre__' + s).route;
const tabs = await (await fetch('http://localhost:9333/json')).json();
const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = {};
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m.result); delete pend[m.id]; } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (x) => (await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true })).result.value;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function open(url, w, scroll = true) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 500 });
  await send('Page.navigate', { url }); await wait(2200);
  if (scroll) { await ev('(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,25));}window.scrollTo(0,0)})()'); await wait(300); }
}
async function shot(file, w) {
  const h = await ev('document.documentElement.scrollHeight'); const T = 2500, parts = [];
  for (let y = 0; y < h; y += T) { const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y, width: w, height: Math.min(T, h - y), scale: 1 } }); parts.push({ input: Buffer.from(s.data, 'base64'), left: 0, top: y }); }
  await sharp({ create: { width: w, height: h, channels: 3, background: '#fff' } }).composite(parts).png().toFile(file); return h;
}
const words = (t) => t.toLowerCase().replace(/[‘’]/g, "'").split(/[^a-z0-9']+/).filter(Boolean);
const strip = (h) => (h || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;|&rsquo;/g, "'").replace(/&nbsp;/g, ' ');
function expected(d) {
  const c = d.centre; const exp = [c.name, c.address, c.phone_text, c.email, ...c.categories, c.hours.heading, ...c.hours.rows.flat(), c.tags.heading, ...c.tags.items, ...c.info_items.map((i) => i.value || i.label), c.faq_heading];
  for (const g of c.specialty_groups) exp.push(g.heading, ...g.items, g.text || '');
  const walk = (bl) => { for (const b of bl) { if (b.type === 'ul' || b.type === 'ol') b.items.forEach((i) => exp.push(strip(i.html))); else exp.push(strip(b.html ?? b.text ?? '')); } };
  walk(c.about_blocks); for (const q of c.faqs) { exp.push(q.question); walk(q.answer_blocks); }
  return exp.join(' ');
}
let bad = 0, tot = 0, totMissing = 0;
if (mode === 'all' || mode === 'fidelity') {
  console.log('--- text fidelity (all pages in the batch, 1440)');
  for (const s of B.slugs) {
    const d = JSON.parse(fs.readFileSync(`/Users/mac/Downloads/arc-next/audit/content/centre__${s}.json`, 'utf8')); const c = d.centre;
    await open('http://localhost:3100' + routeOf(s), 1440);
    // open every FAQ so answers are in the DOM
    await ev('for(const b of document.querySelectorAll("#faq button")){b.click();}'); await wait(150);
    const body = await ev('document.body.innerText');
    const cnt = {}; for (const w of words(body)) cnt[w] = (cnt[w] || 0) + 1;
    const exp = words(expected(d)); const missing = [];
    // FAQ accordion shows one answer at a time: count answers separately via textContent
    const all = await ev('document.body.textContent'); const cnt2 = {}; for (const w of words(all)) cnt2[w] = (cnt2[w] || 0) + 1;
    for (const w of exp) { if (cnt2[w] > 0) cnt2[w]--; else missing.push(w); }
    const gr = (c.google_reviews?.items || []).filter((r) => r.text && body.includes(r.text.slice(0, 40))).length;
    const countPat = /\b\d+\s+(google\s+)?reviews?\b/i.test(body);
    const h1 = await ev('document.querySelectorAll("h1").length');
    tot++; totMissing += missing.length; if (missing.length || gr || countPat || h1 !== 1) bad++;
    if (missing.length || gr || countPat || h1 !== 1) console.log('PROBLEM', s, 'missing', missing.length, missing.slice(0, 8).join(','), '| google text', gr, '| review count shown', countPat, '| h1', h1);
  }
  console.log(`pages checked: ${tot}, pages with problems: ${bad}, total missing words: ${totMissing}`);
}
if (mode === 'all' || mode === 'overflow') {
  console.log('--- overflow 320/390/768/1440');
  let ob = 0;
  for (const s of B.overflow) {
    const ov = [];
    for (const w of [320, 390, 768, 1440]) { await open('http://localhost:3100' + routeOf(s), w); const o = await ev('[document.documentElement.scrollWidth, document.documentElement.clientWidth]'); if (o[0] > o[1]) ov.push(`${w}px: ${o[0]}>${o[1]}`); }
    if (ov.length) ob++;
    console.log(s.padEnd(60), ov.join('; ') || 'ok');
  }
  console.log(`overflow pages: ${B.overflow.length}, with sideways scroll: ${ob}`);
}
if (mode === 'all' || mode === 'shots') {
  for (const w of [1440, 390]) { await open('http://localhost:3200/centre', w); if (!fs.existsSync(`${OUT}/orig-${w}.png`)) await shot(`${OUT}/orig-${w}.png`, w); }
  for (const s of B.shots) for (const w of [1440, 390]) {
    await open('http://localhost:3100' + routeOf(s), w); const n = s.slice(0, 24); await shot(`${OUT}/${n}-${w}.png`, w);
    const a = sharp(`${OUT}/orig-${w}.png`), b = sharp(`${OUT}/${n}-${w}.png`);
    const W = w === 1440 ? 720 : 390, ma = await a.metadata(), mb = await b.metadata();
    const A = await a.resize(W).png().toBuffer(), Bb = await b.resize(W).png().toBuffer();
    const ha = Math.round(ma.height * W / ma.width), hb = Math.round(mb.height * W / mb.width);
    await sharp({ create: { width: W * 2 + 20, height: Math.max(ha, hb), channels: 3, background: '#888' } }).composite([{ input: A, left: 0, top: 0 }, { input: Bb, left: W + 20, top: 0 }]).png().toFile(`${OUT}/side-${n}-${w}.png`);
    console.log('side-by-side', n, w);
  }
}
process.exit(0);
