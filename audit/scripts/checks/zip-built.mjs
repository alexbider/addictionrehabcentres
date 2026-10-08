// Built page vs the client's design file (served on :3300), side by side at 1440 and 390. usage: node zip-built.mjs <outdir> <out.json>
import fs from 'node:fs'; import { createRequire } from 'node:module';
const sharp = createRequire('/Users/mac/Downloads/arc-next/package.json')('sharp');
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const pairs = [
  ['province', '/alberta-rehabs/', 'Province'],
  ['city', '/toronto-rehabs/', 'City'],
  ['centre', '/irecover-alberta/', 'Centre'],
  ['blog-index', '/blog/', 'Blog'],
  ['blog-post-old', '/am-i-an-addict/', 'BlogPost'],      // how most posts are rendered today (old component)
  ['blog-post-view', '/what-is-smart-recovery/', 'BlogPost'], // prototype on the BlogPost view
];
const tabs = await (await fetch('http://localhost:9333/json')).json();
const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = {}; ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m.result); delete pend[m.id]; } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (x) => (await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true })).result.value;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
async function grab(url, w, file) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 500 });
  await send('Page.navigate', { url }); await wait(4500);
  await ev('(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,50));}window.scrollTo(0,0)})()'); await wait(800);
  const info = await ev(`({h:document.documentElement.scrollHeight,sw:document.documentElement.scrollWidth,text:document.body.innerText.replace(/\\s+/g,' ').trim(),labels:[...document.querySelectorAll('[data-screen-label]')].map(e=>e.getAttribute('data-screen-label')),h2:[...document.querySelectorAll('h1,h2')].map(e=>e.textContent.trim().slice(0,70)),imgs:document.images.length,buttons:document.querySelectorAll('button').length,sticky:[...document.querySelectorAll('*')].filter(e=>getComputedStyle(e).position==='sticky').length,anim:[...document.querySelectorAll('*')].filter(e=>/animation/.test(e.getAttribute('style')||'')).length})`);
  const parts = []; for (let y = 0; y < info.h; y += 2500) { const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y, width: w, height: Math.min(2500, info.h - y), scale: 1 } }); parts.push({ input: Buffer.from(s.data, 'base64'), left: 0, top: y }); }
  await sharp({ create: { width: w, height: info.h, channels: 3, background: '#fff' } }).composite(parts).png().toFile(file); return info;
}
const res = {};
for (const [type, route, design] of pairs) for (const w of [1440, 390]) {
  const base = design === 'BlogPost' ? `${OUT}/${type}` : `${OUT}/${type}`;
  const d = await grab(`http://localhost:3300/${design}.dc.html`, w, `${base}-design-${w}.png`);
  const b = await grab('http://localhost:3100' + route, w, `${base}-built-${w}.png`);
  const W = w === 1440 ? 720 : 390; const A = sharp(`${base}-design-${w}.png`), B = sharp(`${base}-built-${w}.png`); const ma = await A.metadata(), mb = await B.metadata();
  const Ab = await A.resize(W).png().toBuffer(), Bb = await B.resize(W).png().toBuffer(); const ha = Math.round(ma.height * W / ma.width), hb = Math.round(mb.height * W / mb.width);
  await sharp({ create: { width: W * 2 + 20, height: Math.max(ha, hb), channels: 3, background: '#888' } }).composite([{ input: Ab, left: 0, top: 0 }, { input: Bb, left: W + 20, top: 0 }]).png().toFile(`${base}-side-${w}.png`);
  const dw = new Set(d.text.toLowerCase().split(/[^a-z0-9$%']+/).filter(Boolean)); const bw = new Set(b.text.toLowerCase().split(/[^a-z0-9$%']+/).filter(Boolean));
  res[`${type}-${w}`] = { route, design, designH: d.h, builtH: b.h, designLabels: d.labels, builtLabels: b.labels, designHeadings: d.h2, builtHeadings: b.h2, designImgs: d.imgs, builtImgs: b.imgs, designButtons: d.buttons, builtButtons: b.buttons, designSticky: d.sticky, builtSticky: b.sticky, designAnim: d.anim, builtAnim: b.anim, designSW: d.sw, builtSW: b.sw, designTextLen: d.text.length, builtTextLen: b.text.length, wordsOnlyInDesign: [...dw].filter((x) => !bw.has(x)).length };
  console.log(type, w, 'design', d.h, 'built', b.h);
  fs.writeFileSync(process.argv[3], JSON.stringify(res, null, 1));
}
process.exit(0);
