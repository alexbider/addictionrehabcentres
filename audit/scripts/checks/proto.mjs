// Prototype pages: fidelity vs scraped source, overflow at 4 widths, side-by-side with the client's design file (:3300). usage: node proto.mjs <outdir>
import fs from 'node:fs'; import { createRequire } from 'node:module';
const sharp = createRequire('/Users/mac/Downloads/arc-next/package.json')('sharp');
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const pages = [
  ['drug-heroin', 'heroin-addiction', 'Drug'], ['drug-cocaine', 'cocaine-addiction', 'Drug'], ['province-yukon-text-only', 'yukon-drug-rehab-treatments', 'Drug'],
  ['treatment-aa-support-group', 'aa-support-group', 'Intervention'], ['treatment-drug-alcohol-helpline', 'drug-alcohol-helpline', 'Intervention'],
  ['post-short-drug-abuse-explained', 'drug-abuse-explained', 'BlogPost'], ['post-long-what-is-smart-recovery', 'what-is-smart-recovery', 'BlogPost'],
];
const tab = (await (await fetch('http://localhost:9333/json/new?about:blank', { method: 'PUT' })).json());
const ws = new WebSocket(tab.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = {}; ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m.result); delete pend[m.id]; } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (x) => (await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true })).result.value;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
async function open(url, w) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 500 });
  await send('Page.navigate', { url }); await wait(3800);
  await ev('(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,40));}window.scrollTo(0,0)})()'); await wait(600);
}
async function shot(file, w) {
  const h = await ev('document.documentElement.scrollHeight'); const parts = [];
  for (let y = 0; y < h; y += 2500) { const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y, width: w, height: Math.min(2500, h - y), scale: 1 } }); parts.push({ input: Buffer.from(s.data, 'base64'), left: 0, top: y }); }
  await sharp({ create: { width: w, height: h, channels: 3, background: '#fff' } }).composite(parts).png().toFile(file); return h;
}
const words = (t) => t.toLowerCase().replace(/[‘’]/g, "'").split(/[^a-z0-9']+/).filter(Boolean);
const strip = (h) => (h || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;|&rsquo;/g, "'").replace(/&nbsp;/g, ' ');
function expected(d) {
  const out = [d.h1];
  const walk = (bl) => { for (const b of bl) { if (b.type === 'ul' || b.type === 'ol') b.items.forEach((i) => out.push(strip(i.html))); else if (['image', 'iframe', 'video'].includes(b.type)) continue; else if (b.type === 'link') out.push(b.text); else out.push(strip(b.html ?? b.text ?? '')); } };
  if (d.page_type === 'blog-post') { const bl = d.blocks; const i = bl.findIndex((b) => b.type === 'h1'); walk(bl.slice(i + 1)); }
  else for (const r of d.rows) { if (r.kind === 'hero-banner') continue; for (const c of r.columns) walk(c.blocks); }
  return out.join(' ');
}
const idx = JSON.parse(fs.readFileSync('/Users/mac/Downloads/arc-next/content/_index.json', 'utf8'));
const only = process.argv[3];
const res = fs.existsSync(`${OUT}/proto.json`) ? JSON.parse(fs.readFileSync(`${OUT}/proto.json`, 'utf8')) : {};
for (const [name, slug, design] of pages) {
  if (only && only !== name) continue;
  const route = idx.find((e) => e.slug === slug).route; const d = JSON.parse(fs.readFileSync(`/Users/mac/Downloads/arc-next/audit/content/${slug}.json`, 'utf8'));
  const r = { route, design };
  await open('http://localhost:3100' + route, 1440);
  const all = await ev('document.body.textContent'); const cnt = {}; for (const w of words(all)) cnt[w] = (cnt[w] || 0) + 1;
  const miss = []; for (const w of words(expected(d))) { if (cnt[w] > 0) cnt[w]--; else miss.push(w); }
  r.missingWords = miss.length; r.missingSample = miss.slice(0, 10).join(',');
  r.h1 = await ev('document.querySelectorAll("h1").length'); r.brokenImgs = await ev('[...document.images].filter(i=>i.complete&&i.naturalWidth===0).length');
  r.overflow = [];
  for (const w of [320, 390, 768, 1440]) { await open('http://localhost:3100' + route, w); const o = await ev('[document.documentElement.scrollWidth, document.documentElement.clientWidth]'); if (o[0] > o[1]) r.overflow.push(`${w}px:${o[0]}>${o[1]}`); }
  for (const w of [1440, 390]) {
    await open(`http://localhost:3300/${design}.dc.html`, w); r['designH' + w] = await shot(`${OUT}/${name}-design-${w}.png`, w);
    await open('http://localhost:3100' + route, w); r['builtH' + w] = await shot(`${OUT}/${name}-built-${w}.png`, w);
    const A = sharp(`${OUT}/${name}-design-${w}.png`), B = sharp(`${OUT}/${name}-built-${w}.png`); const ma = await A.metadata(), mb = await B.metadata(); const W = w === 1440 ? 720 : 390;
    const Ab = await A.resize(W).png().toBuffer(), Bb = await B.resize(W).png().toBuffer(); const ha = Math.round(ma.height * W / ma.width), hb = Math.round(mb.height * W / mb.width);
    await sharp({ create: { width: W * 2 + 20, height: Math.max(ha, hb), channels: 3, background: '#888' } }).composite([{ input: Ab, left: 0, top: 0 }, { input: Bb, left: W + 20, top: 0 }]).png().toFile(`${OUT}/${name}-side-${w}.png`);
  }
  res[name] = r; console.log(name, JSON.stringify(r)); fs.writeFileSync(`${OUT}/proto.json`, JSON.stringify(res, null, 1));
}
process.exit(0);
