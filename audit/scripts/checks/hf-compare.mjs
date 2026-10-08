// Header and footer regions of Home vs one page of each type, at 1440 and 390, scrollY 0 and 600. usage: node hf-compare.mjs <out.json>
import fs from 'node:fs'; import { createRequire } from 'node:module';
const sharp = createRequire('/Users/mac/Downloads/arc-next/package.json')('sharp');
const OUT = process.argv[2];
const routes = ['/', '/alberta-rehabs/', '/toronto-rehabs/', '/irecover-alberta/', '/blog/', '/what-is-smart-recovery/', '/am-i-an-addict/', '/heroin-addiction/', '/aa-support-group/', '/yukon-drug-rehab-treatments/', '/privacy-policy/', '/alcohol', '/auth', '/centre', '/centre-onboarding', '/city', '/claim-listing', '/claim-therapist', '/contact', '/drug', '/intervention', '/join-directory', '/menu-options', '/promote', '/provider-dashboard', '/province', '/therapist-onboarding', '/therapist-profile', '/therapists', '/therapists-city', '/therapists-province'];
const tab = (await (await fetch('http://localhost:9333/json/new?about:blank', { method: 'PUT' })).json());
const ws = new WebSocket(tab.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = {}; ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m.result); delete pend[m.id]; } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (x) => (await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true })).result.value;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
async function clip(x, y, w, h) { const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x, y, width: w, height: h, scale: 1 } }); return Buffer.from(s.data, 'base64'); }
async function grab(route, w) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 500 });
  await send('Page.navigate', { url: 'http://localhost:3100' + route }); await wait(2500);
  await ev('window.scrollTo(0,document.body.scrollHeight)'); await wait(700); await ev('window.scrollTo(0,0)'); await wait(300);
  const r = {};
  const hdr = await ev('(()=>{const h=document.querySelector("[data-sc-name=SiteHeader]");if(!h)return null;const b=h.getBoundingClientRect();return [b.width,b.height]})()');
  const ft = await ev('(()=>{const f=document.querySelector("footer[data-screen-label=Footer]");if(!f)return null;const b=f.getBoundingClientRect();return [b.left,b.top+scrollY,b.width,b.height]})()');
  if (hdr) { for (const sy of [0, 600]) { await ev(`window.scrollTo(0,${sy})`); await wait(350); r['hdr' + sy] = await clip(0, sy, w, Math.round(hdr[1])); } }
  if (ft) r.ftr = await clip(0, Math.round(ft[1]), w, Math.round(ft[3]));
  r.hdrH = hdr && hdr[1]; r.ftrH = ft && ft[3];
  return r;
}
async function diff(a, b) {
  if (!a || !b) return null;
  const A = await sharp(a).raw().toBuffer({ resolveWithObject: true }), B = await sharp(b).raw().toBuffer({ resolveWithObject: true });
  if (A.info.width !== B.info.width || A.info.height !== B.info.height) return `size ${A.info.width}x${A.info.height} vs ${B.info.width}x${B.info.height}`;
  let d = 0; for (let i = 0; i < A.data.length; i += 3) if (Math.abs(A.data[i] - B.data[i]) + Math.abs(A.data[i + 1] - B.data[i + 1]) + Math.abs(A.data[i + 2] - B.data[i + 2]) > 24) d++;
  return +(100 * d / (A.data.length / 3)).toFixed(4);
}
const res = {};
for (const w of [1440, 390]) {
  const home = await grab('/', w);
  for (const route of routes) {
    const g = route === '/' ? home : await grab(route, w);
    res[`${route}@${w}`] = { header0: await diff(home.hdr0, g.hdr0), header600: await diff(home.hdr600, g.hdr600), footer: await diff(home.ftr, g.ftr), hdrH: g.hdrH, ftrH: g.ftrH, hasHeader: !!g.hdr0, hasFooter: !!g.ftr };
    console.log(route, w, JSON.stringify(res[`${route}@${w}`]));
    fs.writeFileSync(OUT, JSON.stringify(res, null, 1));
  }
}
process.exit(0);
