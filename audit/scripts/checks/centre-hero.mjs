// Centre hero measurement for all published centres: hero height, info-row left/right heights, empty area of the info row, page overflow.
// usage: node centre-hero.mjs <out.json> [widths comma list]
import fs from 'node:fs';
const R = '/Users/mac/Downloads/arc-next';
const OUT = process.argv[2]; const W = (process.argv[3] || '1440').split(',').map(Number);
const urls = JSON.parse(fs.readFileSync(`${R}/content/_index.json`, 'utf8')).filter((e) => e.published && e.type === 'centre').map((e) => e.route);
async function tab() {
  const t = await (await fetch('http://localhost:9333/json/new?about:blank', { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
  let id = 0; const pend = {}; const waiters = [];
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m.result); delete pend[m.id]; } else if (m.method === 'Page.loadEventFired') waiters.splice(0).forEach((f) => f()); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Page.enable');
  return { send, ev: async (x) => (await send('Runtime.evaluate', { expression: x, returnByValue: true })).result.value,
    go: async (url, w) => { await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 500 }); const p = new Promise((r) => waiters.push(r)); await send('Page.navigate', { url }); await Promise.race([p, new Promise((r) => setTimeout(r, 20000))]); await new Promise((r) => setTimeout(r, 600)); } };
}
const PROBE = `(()=>{const s=document.querySelector('[data-screen-label="Centre Hero"]');if(!s)return null;const rect=e=>e.getBoundingClientRect();
const mosaic=s.querySelector('[data-cols="2fr 1fr 1fr"]');const g=[...s.querySelectorAll('div')].find(d=>d.getAttribute('data-cols')==='minmax(0,1fr) minmax(300px,380px)');
const out={hero:Math.round(rect(s).height),mosaic:!!mosaic,over:document.documentElement.scrollWidth-innerWidth};
if(g){const k=[...g.children];const gr=rect(g);const sum=k.reduce((a,c)=>a+rect(c).width*rect(c).height,0);out.info={w:Math.round(gr.width),h:Math.round(gr.height),left:Math.round(rect(k[0]).height),right:k[1]?Math.round(rect(k[1]).height):0,cols:getComputedStyle(g).gridTemplateColumns.split(' ').length,emptyPct:Math.round(100*Math.max(0,1-sum/(gr.width*gr.height)))};}
return out})()`;
const res = {}; let next = 0;
async function worker() { const t = await tab(); while (next < urls.length) { const u = urls[next++]; res[u] = {}; for (const w of W) { try { await t.go('http://localhost:3100' + u, w); res[u][w] = await t.ev(PROBE); } catch (e) { res[u][w] = { error: String(e) }; } } } }
await Promise.all(Array.from({ length: 6 }, worker));
fs.writeFileSync(OUT, JSON.stringify(res));
const agg = {}; for (const w of W) { const rows = Object.values(res).map((r) => r[w]).filter((r) => r && r.info); agg[w] = { pages: rows.length, noMosaic: rows.filter((r) => !r.mosaic).length, over: rows.filter((r) => r.over > 1).length, emptyOver40: rows.filter((r) => r.info.emptyPct > 40).length, avgEmpty: Math.round(rows.reduce((a, r) => a + r.info.emptyPct, 0) / rows.length), maxHero: Math.max(...rows.map((r) => r.hero)) }; }
console.log(JSON.stringify(agg));
