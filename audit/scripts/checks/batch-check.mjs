// Text fidelity (vs scraped source), overflow at 320/390/768/1440, broken images, H1 count for a list of published routes.
// usage: node batch-check.mjs <types comma list | slugs.json> <out.json>     (Chrome on 9333, site on 3100; 6 parallel tabs)
import fs from 'node:fs';
const R = '/Users/mac/Downloads/arc-next';
const arg = process.argv[2]; const OUT = process.argv[3];
const idx = JSON.parse(fs.readFileSync(`${R}/content/_index.json`, 'utf8')).filter((e) => e.published);
const list = arg.endsWith('.json') ? idx.filter((e) => JSON.parse(fs.readFileSync(arg, 'utf8')).includes(e.slug)) : idx.filter((e) => arg.split(',').includes(e.type));
const words = (t) => t.toLowerCase().replace(/[‘’]/g, "'").split(/[^a-z0-9']+/).filter(Boolean);
const strip = (h) => (h || '').replace(/<\/?(sup|sub|strong|em|b|i|a|span|u|mark|font|small)\b[^>]*>/gi, '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;|&rsquo;/g, "'").replace(/&nbsp;/g, ' ');
function expected(d, e) {
  const out = [d.h1]; const live = JSON.parse(fs.readFileSync(`${R}/content/${e.slug}.json`, 'utf8'));
  const walk = (bl) => { for (const b of bl || []) { if (b.type === 'ul' || b.type === 'ol') b.items.forEach((i) => out.push(strip(i.html))); else if (['image', 'iframe', 'video', 'cards', 'centre-cards'].includes(b.type)) { if (b.type === 'centre-cards') b.items.forEach((i) => out.push(i.name, i.address || '', i.excerpt || '')); continue; } else if (b.type === 'link') out.push(b.text); else if (b.type === 'tabs') b.tabs.forEach((t) => { out.push(t.title); walk(t.blocks); }); else if (b.type === 'accordion') b.items.forEach((t) => { out.push(t.title); walk(t.blocks); }); else out.push(strip(b.html ?? b.text ?? '')); } };
  if (d.page_type === 'blog-post') { const bl = d.blocks; walk(bl.slice(bl.findIndex((b) => b.type === 'h1') + 1)); }
  else {
    for (const r of live.rows || []) { if (r.kind === 'hero-banner' || r.kind === 'listing-banner') { if (r.kind === 'listing-banner') for (const c of r.columns) walk(c.blocks.filter((b) => b.type !== 'h1')); continue; } for (const c of r.columns) walk(c.blocks); }
    if (live.blocks && !(live.rows || []).length) walk(live.blocks.filter((b) => b.type !== 'h1'));
    for (const c of live.listing?.cards || []) out.push(c.name, c.address, c.excerpt.replace(/…$/, '').replace(/\s+$/, ''), c.category);
  }
  return out.join(' ');
}
async function newTab() {
  const t = await (await fetch('http://localhost:9333/json/new?about:blank', { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
  let id = 0; const pend = {}; const waiters = [];
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m.result); delete pend[m.id]; } else if (m.method === 'Page.loadEventFired') waiters.splice(0).forEach((f) => f()); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Page.enable');
  const ev = async (x) => (await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true })).result.value;
  const go = async (url, w) => { await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 500 }); const p = new Promise((r) => waiters.push(r)); await send('Page.navigate', { url }); await Promise.race([p, new Promise((r) => setTimeout(r, 20000))]); await new Promise((r) => setTimeout(r, 700)); };
  return { ev, go };
}
const results = []; let next = 0;
async function worker() {
  const { ev, go } = await newTab();
  while (true) {
    const e = list[next++]; if (!e) break;
    const d = JSON.parse(fs.readFileSync(`${R}/audit/content/${e.slug}.json`, 'utf8'));
    const r = { slug: e.slug, route: e.route, type: e.type, overflow: [], missing: 0, missingWords: '', h1: 0, broken: '' };
    for (const w of [320, 390, 768, 1440]) {
      await go('http://localhost:3100' + e.route, w);
      const o = await ev('[document.documentElement.scrollWidth, document.documentElement.clientWidth]'); if (o[0] > o[1]) r.overflow.push(`${w}px:${o[0]}>${o[1]}`);
      if (w === 1440) {
        await ev('(async()=>{for(let y=0;y<document.body.scrollHeight;y+=1400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,20));}window.scrollTo(0,0)})()'); await new Promise((r) => setTimeout(r, 400));
        const all = await ev('document.body.textContent'); const cnt = {}; for (const x of words(all)) cnt[x] = (cnt[x] || 0) + 1; const miss = [];
        for (const x of words(expected(d, e))) { if (cnt[x] > 0) cnt[x]--; else miss.push(x); }
        r.missing = miss.length; r.missingWords = miss.slice(0, 8).join(',');
        r.h1 = await ev('document.querySelectorAll("h1").length');
        r.broken = await ev('[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src.slice(-50)).join(" | ")');
      }
    }
    results.push(r); if (results.length % 25 === 0) { fs.writeFileSync(OUT, JSON.stringify(results)); console.log('progress', results.length, '/', list.length, flush); }
  }
}
const flush = '';
await Promise.all(Array.from({ length: 6 }, worker));
fs.writeFileSync(OUT, JSON.stringify(results, null, 1));
const bad = results.filter((r) => r.overflow.length || r.missing || r.h1 !== 1 || r.broken);
console.log(`pages checked ${results.length}; with problems ${bad.length}; missing words total ${results.reduce((a, r) => a + r.missing, 0)}; overflow pages ${results.filter((r) => r.overflow.length).length}; broken-image pages ${results.filter((r) => r.broken).length}`);
for (const r of bad.slice(0, 25)) console.log('PROBLEM', JSON.stringify(r));
process.exit(0);
