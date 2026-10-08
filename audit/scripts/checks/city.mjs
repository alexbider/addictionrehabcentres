// Province view checks: text fidelity (all 15 + 2 thin), overflow at 4 widths, screenshots of Alberta vs the original design.
// usage: node province.mjs <outdir>   (Chrome on 9333, new site on 3100, original clone on 3200)
import fs from 'node:fs'; import { createRequire } from 'node:module';
const sharp = createRequire('/Users/mac/Downloads/arc-next/package.json')('sharp');
const OUT = process.argv[2];
const tabs = await (await fetch('http://localhost:9333/json')).json();
const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = {};
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m.result); delete pend[m.id]; } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (x) => (await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true })).result.value;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function open(url, w) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 500 });
  await send('Page.navigate', { url }); await wait(3500);
  await ev('(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,40));}window.scrollTo(0,0)})()');
  await wait(500);
}
async function shot(file, w) {
  const h = await ev('document.documentElement.scrollHeight'); const T = 2500, parts = [];
  for (let y = 0; y < h; y += T) {
    const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y, width: w, height: Math.min(T, h - y), scale: 1 } });
    parts.push({ input: Buffer.from(s.data, 'base64'), left: 0, top: y });
  }
  await sharp({ create: { width: w, height: h, channels: 3, background: '#fff' } }).composite(parts).png().toFile(file); return h;
}
const words = (t) => t.toLowerCase().replace(/[‘’]/g, "'").split(/[^a-z0-9']+/).filter(Boolean);
const built = (s) => { try { return JSON.parse(fs.readFileSync(`/Users/mac/Downloads/arc-next/content/${s}.json`, 'utf8')); } catch { return null; } };
const strip = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;|&rsquo;/g, "'").replace(/&nbsp;/g, ' ');
const slugs = ['toronto-rehabs', 'ottawa-rehabs', 'montreal-rehabs', '7-best-drug-alcohol-rehab-centres-in-vancouver-2025'];
const only = process.argv[3]; if (only && only !== 'shots') slugs.length = 0, slugs.push(...only.split(',')); if (only === 'shots') slugs.length = 0;
let bad = 0;
console.log('--- text fidelity + overflow');
for (const s of slugs) {
  const d = JSON.parse(fs.readFileSync(`/Users/mac/Downloads/arc-next/audit/content/${s}.json`, 'utf8'));
  const exp = [d.h1];
  const seen = new Set();
  for (const r of d.rows) for (const c of r.columns) for (const b of c.blocks) {
    if (b.type === 'cards') { for (const h of b.hrefs) { const k = d.listing.cards.find((x) => x.href === h); if (k && !seen.has(h)) { seen.add(h); { const bc = built(s)?.listing.cards.find((x) => x.href === h); const ex = bc ? bc.excerpt.replace(/…$/, '') : k.excerpt; if (!k.excerpt.startsWith(ex.replace(/\s+$/, ''))) console.log('EXCERPT CHANGED BEYOND CUT', s, k.excerpt, '->', bc.excerpt); exp.push(k.name, k.address, ex, k.category); } } } }
    else if (b.type === 'ul' || b.type === 'ol') b.items.forEach((i) => exp.push(strip(i.html)));
    else exp.push(strip(b.html ?? b.text ?? ''));
  }
  await open(`http://localhost:3100/${s}/`, 1440);
  const txt = await ev('[...document.querySelectorAll("main, section")].filter(e=>!e.closest("footer")&&!e.closest("header")).map(e=>e.innerText).join(" ")');
  const body = await ev('document.body.innerText');
  const cnt = {}; for (const w of words(body)) cnt[w] = (cnt[w] || 0) + 1;
  const missing = []; for (const w of words(exp.join(' '))) { if (cnt[w] > 0) cnt[w]--; else missing.push(w); }
  const rc = {}; for (const w of words(exp.join(' '))) rc[w] = (rc[w] || 0) + 1;
  const extra = {}; const seenSec = words(await ev('[...document.querySelectorAll("section")].filter(e=>!e.closest("footer")).map(e=>e.innerText).join(" ")'));
  for (const w of seenSec) { if (rc[w] > 0) rc[w]--; else extra[w] = (extra[w] || 0) + 1; }
  const ov = [];
  for (const w of [320, 390, 768, 1440]) { await open(`http://localhost:3100/${s}/`, w); const o = await ev('[document.documentElement.scrollWidth, document.documentElement.clientWidth]'); if (o[0] > o[1]) ov.push(`${w}px: ${o[0]}>${o[1]}`); }
  const alt = await ev('[...document.querySelectorAll("main img, section img")].filter(i=>!i.alt).length');
  if (missing.length || ov.length) bad++;
  console.log(s.padEnd(50), 'missing words:', missing.length, missing.slice(0, 8).join(','), '| UI-only words:', Object.keys(extra).join(' ').slice(0, 90), '| overflow:', ov.join(';') || 'none', '| imgs w/o alt:', alt);
}
console.log('pages with problems:', bad);
if (!only || only === 'shots') {
  const SH = ['toronto-rehabs', 'ottawa-rehabs', 'montreal-rehabs', '7-best-drug-alcohol-rehab-centres-in-vancouver-2025'];
  for (const w of [1440, 390]) { await open('http://localhost:3200/city', w); console.log('shot orig', w, await shot(`${OUT}/orig-${w}.png`, w)); }
  for (const s of SH) for (const w of [1440, 390]) { await open(`http://localhost:3100/${s}/`, w); console.log('shot', s, w, await shot(`${OUT}/${s.slice(0, 9)}-${w}.png`, w)); }
  for (const s of SH) for (const w of [1440, 390]) {
    const n = s.slice(0, 9), a = sharp(`${OUT}/orig-${w}.png`), b = sharp(`${OUT}/${n}-${w}.png`);
    const W = w === 1440 ? 720 : 390, ma = await a.metadata(), mb = await b.metadata();
    const A = await a.resize(W).png().toBuffer(), B = await b.resize(W).png().toBuffer();
    const ha = Math.round(ma.height * W / ma.width), hb = Math.round(mb.height * W / mb.width);
    await sharp({ create: { width: W * 2 + 20, height: Math.max(ha, hb), channels: 3, background: '#888' } }).composite([{ input: A, left: 0, top: 0 }, { input: B, left: W + 20, top: 0 }]).png().toFile(`${OUT}/side-${n}-${w}.png`);
  }
}
process.exit(0);
