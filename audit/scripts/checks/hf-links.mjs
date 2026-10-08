// Collect every header and footer link (incl. each header menu opened by hover) and its status on :3100.  usage: node hf-links.mjs <out.csv>
import fs from 'node:fs';
const tab = (await (await fetch('http://localhost:9333/json/new?about:blank', { method: 'PUT' })).json());
const ws = new WebSocket(tab.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = {}; ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m.result); delete pend[m.id]; } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (x) => (await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true })).result.value;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1 });
await send('Page.navigate', { url: 'http://localhost:3100/' }); await wait(3500);
const rows = new Map();
const add = (where, label, href) => { if (!href) return; const k = where + '|' + label + '|' + href; if (!rows.has(k)) rows.set(k, { where, label: label.replace(/\s+/g, ' ').trim(), href }); };
const grabHeader = async (where) => { const l = await ev(`[...document.querySelectorAll('[data-sc-name=SiteHeader] a[href]')].map(a=>[a.textContent,a.getAttribute('href')])`); for (const [t, h] of l) add(where, t || '(icon/logo)', h); };
await grabHeader('header');
// open each nav item (hover/click) and collect the menu links
const n = await ev(`document.querySelectorAll('[data-sc-name=SiteHeader] nav button, [data-sc-name=SiteHeader] nav [role=button]').length`);
const labels = await ev(`[...document.querySelectorAll('[data-sc-name=SiteHeader] nav button, [data-sc-name=SiteHeader] nav [role=button]')].map(b=>b.textContent.trim())`);
for (let i = 0; i < n; i++) {
  await ev(`(()=>{const b=document.querySelectorAll('[data-sc-name=SiteHeader] nav button, [data-sc-name=SiteHeader] nav [role=button]')[${i}];b.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));b.dispatchEvent(new MouseEvent('mouseenter',{bubbles:true}));b.click();})()`);
  await wait(400);
  await grabHeader('header menu: ' + labels[i]);
}
const f = await ev(`[...document.querySelectorAll('footer[data-screen-label=Footer] a[href]')].map(a=>[a.textContent,a.getAttribute('href')])`);
for (const [t, h] of f) add('footer', t || '(icon)', h);
const out = [];
for (const r of rows.values()) {
  let status = 'external/other', target = '';
  const h = r.href;
  if (/^(tel:|mailto:)/.test(h)) status = 'tel/mailto';
  else if (h.startsWith('#')) status = 'anchor';
  else if (/^https?:\/\//.test(h) && !h.includes('localhost')) status = 'external (not checked)';
  else {
    const u = new URL(h, 'http://localhost:3100'); const res = await fetch(u, { redirect: 'manual' });
    status = res.status === 200 ? '200' : res.status >= 300 && res.status < 400 ? `redirect ${res.status} -> ${res.headers.get('location')}` : String(res.status);
    if (res.status === 404) target = suggest(u.pathname);
  }
  out.push({ ...r, status, suggested: target });
}
function suggest(p) {
  const m = { '/rehab/search/': 'unlink (no such page) or point to /blog/ search; owner decision', '/rehab/yukon-drug-rehab-treatments/': '/yukon-drug-rehab-treatments/', '/prince-edward-island-rehabs/': 'plain text until a PEI page exists', '/rehab/': '/alberta-rehabs/ … (no index page); owner decision', '/dui-lawyers-in-canada/': 'page not built (out-of-scope centres); owner decision', '/drugs-and-alcohol-intervention/': 'page not built yet (intervention group)', '/drug-intervention-treatment-centres/': 'page not built yet', '/faqs/': 'page not built yet (FAQs, 1,987 words)', '/addiction-by-alcohol/': 'page not built yet (Alcohol page)', '/alcohol-rehab/': 'page not built yet' };
  return m[p] || m[p + '/'] || 'page not built yet';
}
const csv = ['label,href,where,status on localhost:3100,suggested target'].concat(out.map((r) => [r.label, r.href, r.where, r.status, r.suggested].map((x) => `"${String(x).replace(/"/g, '""')}"`).join(','))).join('\n');
fs.writeFileSync(process.argv[2], csv + '\n');
console.log('links', out.length, '404:', out.filter((r) => r.status === '404').length);
process.exit(0);
