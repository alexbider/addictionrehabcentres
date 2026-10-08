// Header and footer markup identical to Home's? usage: node hf-dom.mjs <out.json>
// Compares the outerHTML of the SiteHeader host (at scrollY 0 and 600) and of the Footer, plus the header's computed look at scrollY 600.
import fs from 'node:fs'; import crypto from 'node:crypto';
const routes = ['/', '/alberta-rehabs/', '/toronto-rehabs/', '/irecover-alberta/', '/blog/', '/what-is-smart-recovery/', '/am-i-an-addict/', '/heroin-addiction/', '/aa-support-group/', '/yukon-drug-rehab-treatments/', '/privacy-policy/', '/alcohol', '/auth', '/centre', '/centre-onboarding', '/city', '/claim-listing', '/claim-therapist', '/contact', '/drug', '/intervention', '/join-directory', '/menu-options', '/promote', '/provider-dashboard', '/province', '/therapist-onboarding', '/therapist-profile', '/therapists', '/therapists-city', '/therapists-province'];
const tab = (await (await fetch('http://localhost:9333/json/new?about:blank', { method: 'PUT' })).json());
const ws = new WebSocket(tab.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = {}; ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m.result); delete pend[m.id]; } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (x) => (await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true })).result.value;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const hash = (s) => (s ? crypto.createHash('md5').update(s).digest('hex').slice(0, 10) : null);
async function grab(route, w) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 500 });
  await send('Page.navigate', { url: 'http://localhost:3100' + route }); await wait(2500);
  await ev('window.scrollTo(0,document.body.scrollHeight)'); await wait(500); await ev('window.scrollTo(0,0)'); await wait(300);
  const norm = '.replace(/\\s+/g," ")';
  const o = {};
  o.h0 = await ev(`(document.querySelector('[data-sc-name=SiteHeader]')?.outerHTML||'')${norm}`);
  await ev('window.scrollTo(0,600)'); await wait(400);
  o.h600 = await ev(`(document.querySelector('[data-sc-name=SiteHeader]')?.outerHTML||'')${norm}`);
  o.look600 = await ev(`(()=>{const h=document.querySelector('[data-sc-name=SiteHeader]');if(!h)return '';const c=getComputedStyle(h),b=h.getBoundingClientRect();const inner=h.firstElementChild?getComputedStyle(h.firstElementChild):c;return [c.position,c.top,Math.round(b.top),Math.round(b.height),inner.backgroundColor,inner.boxShadow,inner.backdropFilter].join('|')})()`);
  o.f = await ev(`(document.querySelector('footer[data-screen-label=Footer]')?.outerHTML||'')${norm}`);
  // serialization-independent footer signature: markup without style attributes + computed look of every element
  o.fstruct = await ev(`(document.querySelector('footer[data-screen-label=Footer]')?.outerHTML||'').replace(/ style="[^"]*"/g,'').replace(/<img ([^>]*)>/g,(m,a)=>'<img '+(a.match(/[\\w-]+="[^"]*"/g)||[]).sort().join(' ')+'>')${norm}`);
  o.fsig = await ev(`(()=>{const f=document.querySelector('footer[data-screen-label=Footer]');if(!f)return '';let s='';for(const e of [f,...f.querySelectorAll('*')]){const c=getComputedStyle(e);s+=e.tagName+[c.color,c.backgroundColor,c.fontSize,c.fontFamily,c.fontWeight,c.paddingTop,c.paddingLeft,c.marginTop,c.borderRadius,c.display,c.width,c.height].join(',')+';'}return s})()`);
  return o;
}
const res = {}; let bad = 0;
const widths = (process.argv[3] || '1440,390').split(',').map(Number);
for (const w of widths) {
  const home = await grab('/', w);
  for (const route of routes) {
    const g = route === '/' ? home : await grab(route, w);
    const r = { header0: g.h0 ? (g.h0 === home.h0 ? 'identical' : 'DIFFERENT') : 'none', header600: g.h600 ? (g.h600 === home.h600 ? 'identical' : 'DIFFERENT') : 'none', look600: g.look600 ? (g.look600 === home.look600 ? 'identical' : 'DIFFERENT: ' + g.look600 + ' vs ' + home.look600) : 'none', footer: g.f ? (g.f === home.f ? 'identical' : g.fstruct === home.fstruct && g.fsig === home.fsig ? 'identical (same markup and computed styles; style attribute serialized differently)' : 'DIFFERENT') : 'none', hashes: [hash(g.h0), hash(g.f)] };
    if ([r.header0, r.header600, r.footer].includes('DIFFERENT') || r.look600.startsWith('DIFF')) bad++;
    res[`${route}@${w}`] = r; console.log(route, w, JSON.stringify(r));
    fs.writeFileSync(process.argv[2], JSON.stringify(Object.assign(fs.existsSync(process.argv[2]) ? JSON.parse(fs.readFileSync(process.argv[2], 'utf8')) : {}, res), null, 1));
  }
}
console.log('pages with a difference:', bad);
process.exit(0);
