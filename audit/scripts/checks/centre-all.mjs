// All-centres check with parallel tabs. usage: node centre-all.mjs <outfile.json> [slugFilterRegex]
// For every published centre: overflow at 320/390/768/1440, text fidelity at 1440 (FAQ opened), broken images, review leaks, H1 count,
// sticky-sidebar check (About aside stays at header+24 while scrolling when the column is long enough).
import fs from 'node:fs';
const OUT = process.argv[2]; const filt = process.argv[3] ? new RegExp(process.argv[3]) : null;
const R = '/Users/mac/Downloads/arc-next';
const idx = JSON.parse(fs.readFileSync(`${R}/content/_index.json`, 'utf8')).filter((e) => e.type === 'centre' && e.published && (!filt || filt.test(e.slug)));
const words = (t) => t.toLowerCase().replace(/[‘’]/g, "'").split(/[^a-z0-9']+/).filter(Boolean);
const strip = (h) => (h || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;|&rsquo;/g, "'").replace(/&nbsp;/g, ' ');
function expected(d) {
  const c = d.centre; const exp = [c.name, c.address, c.phone_text, c.email, ...c.categories, c.hours.heading, ...c.hours.rows.flat(), c.tags.heading, ...c.tags.items, ...c.info_items.map((i) => i.value || i.label), c.faq_heading];
  for (const g of c.specialty_groups) exp.push(g.heading, ...g.items, g.text || '');
  const walk = (bl) => { for (const b of bl) { if (b.type === 'ul' || b.type === 'ol') b.items.forEach((i) => exp.push(strip(i.html))); else exp.push(strip(b.html ?? b.text ?? '')); } };
  walk(c.about_blocks); for (const q of c.faqs) { exp.push(q.question); walk(q.answer_blocks); }
  return exp.join(' ');
}
async function newTab() {
  const t = await (await fetch('http://localhost:9333/json/new?about:blank', { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
  let id = 0; const pend = {}; const waiters = [];
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m.result); delete pend[m.id]; } else if (m.method === 'Page.loadEventFired') waiters.splice(0).forEach((f) => f()); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Page.enable');
  const ev = async (x) => (await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true })).result.value;
  const go = async (url, w) => { await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 500 }); const p = new Promise((r) => waiters.push(r)); await send('Page.navigate', { url }); await Promise.race([p, new Promise((r) => setTimeout(r, 15000))]); await new Promise((r) => setTimeout(r, 700)); };
  return { ev, go };
}
const results = []; let next = 0;
async function worker() {
  const { ev, go } = await newTab();
  while (true) {
    const e = idx[next++]; if (!e) break;
    const d = JSON.parse(fs.readFileSync(`${R}/audit/content/${e.slug}.json`, 'utf8')); const c = d.centre;
    const r = { slug: e.slug.replace('centre__', ''), overflow: [], missing: 0, missingWords: '', gr: 0, countPat: false, h1: 0, broken: '', sticky: '' };
    for (const w of [320, 390, 768, 1440]) {
      await go('http://localhost:3100' + e.route, w);
      const o = await ev('[document.documentElement.scrollWidth, document.documentElement.clientWidth]'); if (o[0] > o[1]) r.overflow.push(`${w}px:${o[0]}>${o[1]}`);
      if (w === 1440) {
        await ev('(async()=>{for(let y=0;y<document.body.scrollHeight;y+=1400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,20));}window.scrollTo(0,0)})()');
        await ev('for(const b of document.querySelectorAll("#faq button")){b.click();}');
        await new Promise((r) => setTimeout(r, 500));
        const body = await ev('document.body.innerText'); const all = await ev('document.body.textContent');
        const cnt = {}; for (const x of words(all)) cnt[x] = (cnt[x] || 0) + 1; const miss = [];
        for (const x of words(expected(d))) { if (cnt[x] > 0) cnt[x]--; else miss.push(x); }
        r.missing = miss.length; r.missingWords = miss.slice(0, 8).join(',');
        r.gr = (c.google_reviews?.items || []).filter((q) => q.text && body.includes(q.text.slice(0, 40))).length;
        r.countPat = /\b\d+\s+(google\s+)?reviews?\b/i.test(body);
        r.h1 = await ev('document.querySelectorAll("h1").length');
        r.broken = await ev('[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src.slice(-50)).join(" | ")');
        // sticky: if the about aside exists and the page is long, scroll 600px into the body and check the aside top ≈ header+24
        r.sticky = await ev(`(async()=>{const a=document.querySelector('#about aside.ctr-side');if(!a)return 'no-aside';const art=document.querySelector('#about article');const room=art.getBoundingClientRect().height-a.getBoundingClientRect().height;if(room<500)return 'short-column';const top=a.getBoundingClientRect().top+window.scrollY;window.scrollTo(0,top+Math.min(400,room/2));await new Promise(r=>setTimeout(r,200));const t=Math.round(a.getBoundingClientRect().top);const h=Math.round(document.querySelector('[data-sc-name=SiteHeader]').getBoundingClientRect().height);return Math.abs(t-(h+24))<=2?'sticky-ok':'NOT-STICKY top='+t+' hdr='+h})()`);
      }
    }
    results.push(r);
    if (results.length % 25 === 0) { fs.writeFileSync(OUT, JSON.stringify(results)); console.log('progress', results.length, '/', idx.length); }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
fs.writeFileSync(OUT, JSON.stringify(results, null, 1));
const bad = results.filter((r) => r.overflow.length || r.missing || r.gr || r.countPat || r.h1 !== 1 || r.broken || r.sticky.startsWith('NOT'));
console.log(`pages checked ${results.length}; with problems ${bad.length}; missing words total ${results.reduce((a, r) => a + r.missing, 0)}; overflow pages ${results.filter((r) => r.overflow.length).length}; sticky-ok ${results.filter((r) => r.sticky === 'sticky-ok').length}, short-column ${results.filter((r) => r.sticky === 'short-column').length}, no-aside ${results.filter((r) => r.sticky === 'no-aside').length}`);
for (const r of bad.slice(0, 30)) console.log('PROBLEM', JSON.stringify(r));
process.exit(0);
