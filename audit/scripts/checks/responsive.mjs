// Responsive audit: per URL and width (320/390/768/1024/1440): sideways scroll, overflowing elements, clipped text, small tap targets, small text on phones, distorted images.
// usage: node responsive.mjs <urls.json> <out.json>     (Chrome on 9333, site on 3100; 6 parallel tabs)
import fs from 'node:fs';
const urls = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')); const OUT = process.argv[3];
const WIDTHS = [320, 390, 768, 1024, 1440];
async function newTab() {
  const t = await (await fetch('http://localhost:9333/json/new?about:blank', { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
  let id = 0; const pend = {}; const waiters = [];
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m.result); delete pend[m.id]; } else if (m.method === 'Page.loadEventFired') waiters.splice(0).forEach((f) => f()); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Page.enable');
  const ev = async (x) => (await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true })).result.value;
  const go = async (url, w) => { await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 500 }); const p = new Promise((r) => waiters.push(r)); await send('Page.navigate', { url }); await Promise.race([p, new Promise((r) => setTimeout(r, 20000))]); await new Promise((r) => setTimeout(r, 900)); };
  const close = async () => { try { await fetch('http://localhost:9333/json/close/' + t.id); } catch {} };
  return { ev, go, close };
}
const PROBE = `(() => {
  const W = window.innerWidth, out = { scroll: document.documentElement.scrollWidth - W, over: [], clip: [], tap: [], small: [], img: [] };
  const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0'; };
  const label = (e) => e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : '') + ':' + (e.innerText || e.alt || e.getAttribute('aria-label') || '').trim().slice(0, 24);
  const header = document.querySelector('[data-sc-name=SiteHeader]');
  for (const e of document.querySelectorAll('body *')) {
    if (!vis(e)) continue;
    const r = e.getBoundingClientRect();
    // anything poking out of the viewport (ignore absolutely positioned decorative / off-canvas ancestors that are clipped)
    if (r.right > W + 1 || r.left < -1) {
      let clipped = false;
      for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) { const o = getComputedStyle(p); if (/(hidden|clip|auto|scroll)/.test(o.overflowX) && p.getBoundingClientRect().right <= W + 1 && p.getBoundingClientRect().left >= -1) { clipped = true; break; } }
      if (!clipped && e.tagName !== 'HTML') out.over.push(label(e) + ' ' + Math.round(r.left) + '..' + Math.round(r.right));
    }
    const cs = getComputedStyle(e);
    // clipped text
    if (e.scrollWidth > e.clientWidth + 2 && /(hidden|clip)/.test(cs.overflowX) && cs.textOverflow !== 'ellipsis' && (e.innerText || '').trim() && e.children.length === 0 && cs.whiteSpace !== 'normal') out.clip.push(label(e));
    // tap targets (phones/tablets): buttons, inputs, and links that are not inline text links
    if (W <= 1024) {
      const isCtl = e.tagName === 'BUTTON' || e.tagName === 'SELECT' || (e.tagName === 'INPUT' && !['hidden', 'checkbox', 'radio'].includes(e.type)) || e.tagName === 'TEXTAREA' || (e.tagName === 'A' && e.hasAttribute('href'));
      if (isCtl) {
        const inline = cs.display === 'inline' && e.closest('p,li,h1,h2,h3,h4,h5,h6,span,div') && e.parentElement && /^(P|LI|SPAN|STRONG|EM|H[1-6])$/.test(e.parentElement.tagName);
        if (!inline && (r.height < 43.5 || r.width < 43.5)) out.tap.push(label(e) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
      }
    }
    // text size on phones
    if (W <= 480) {
      const t = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
      if (t && parseFloat(cs.fontSize) < 13.95) out.small.push(label(e) + ' ' + cs.fontSize);
    }
    // images keep their ratio
    if (e.tagName === 'IMG' && e.naturalWidth > 0 && e.complete) {
      const fit = cs.objectFit;
      if (fit === 'fill' || fit === 'none' || fit === '') { const a = e.naturalWidth / e.naturalHeight, b = r.width / r.height; if (Math.abs(a - b) / a > 0.06 && r.width > 40) out.img.push(label(e) + ' ' + a.toFixed(2) + ' vs ' + b.toFixed(2)); }
    }
  }
  for (const k of ['over', 'clip', 'tap', 'small', 'img']) out[k + 'N'] = out[k].length, out[k] = [...new Set(out[k])].slice(0, 6);
  return out;
})()`;
const results = {};
let next = 0;
async function worker() {
  const tab = await newTab();
  while (next < urls.length) {
    const u = urls[next++];
    results[u] = {};
    for (const w of WIDTHS) {
      try { await tab.go('http://localhost:3100' + u, w); results[u][w] = await tab.ev(PROBE); } catch (e) { results[u][w] = { error: String(e) }; }
    }
    if (next % 10 === 0) console.log('progress', next, '/', urls.length);
  }
  await tab.close();
}
await Promise.all(Array.from({ length: 6 }, worker));
fs.writeFileSync(OUT, JSON.stringify(results, null, 1));
// summary
const agg = {};
for (const [u, byW] of Object.entries(results)) for (const [w, r] of Object.entries(byW)) {
  if (r.error) continue;
  const a = (agg[w] ??= { pages: 0, scroll: 0, over: 0, clip: 0, tap: 0, small: 0, img: 0 });
  a.pages++; if (r.scroll > 1) a.scroll++; for (const k of ['over', 'clip', 'tap', 'small', 'img']) if (r[k + 'N'] > 0) a[k]++;
}
console.log(JSON.stringify(agg, null, 1));
