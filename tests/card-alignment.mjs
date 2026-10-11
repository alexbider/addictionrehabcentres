// Measures the "Call now" / "View centre" buttons of every <CentreCard> row at 1440 / 1024 / 768 / 390 and prints the y offsets.
// Usage: node tests/card-alignment.mjs http://localhost:3300 /alberta-rehabs/ /toronto-rehabs/ ...
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const [base, ...paths] = process.argv.slice(2);
const widths = [1440, 1024, 768, 390];
const browser = await chromium.launch({ executablePath: CHROME });
let bad = 0;
for (const path of paths) {
  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto(base + path, { waitUntil: 'load' });
    const rows = await page.evaluate(() => {
      const cards = [...document.querySelectorAll('[data-centre-card]')].filter((c) => c.offsetParent !== null);
      const info = cards.map((c) => { const r = c.getBoundingClientRect(); const call = c.querySelector('.cc-btn-call'); const view = c.querySelector('.cc-btn-view'); return { top: Math.round(r.top + scrollY), h: Math.round(r.height), w: Math.round(r.width), call: call && Math.round(call.getBoundingClientRect().top + scrollY), view: view && Math.round(view.getBoundingClientRect().top + scrollY), bottom: Math.round(r.bottom + scrollY) }; });
      const byRow = new Map(); info.forEach((i) => { const k = i.top; (byRow.get(k) ?? byRow.set(k, []).get(k)).push(i); });
      return [...byRow.entries()].map(([top, list]) => ({ top, n: list.length, heights: [...new Set(list.map((l) => l.h))], widths: [...new Set(list.map((l) => l.w))], callY: [...new Set(list.map((l) => l.call))], viewY: [...new Set(list.map((l) => l.view).filter((v) => v != null))] }));
    });
    const fails = rows.filter((r) => r.heights.length > 1 || r.callY.length > 1 || r.viewY.length > 1);
    bad += fails.length;
    console.log(`${path} @${w}: ${rows.length} rows, ${rows.reduce((a, r) => a + r.n, 0)} cards; ${fails.length ? 'MISALIGNED ' + JSON.stringify(fails.slice(0, 2)) : 'aligned'}; sample row: ${JSON.stringify(rows[0])}`);
    if (process.env.SHOTS) { fs.mkdirSync('audit/shots', { recursive: true }); { const g = await page.$('[data-centre-card]'); if (g) { await g.scrollIntoViewIfNeeded(); await page.screenshot({ path: `audit/shots/cards-${path.replace(/\W+/g, '_')}-${w}.png`, clip: { x: 0, y: Math.max(0, (await g.boundingBox()).y - 20), width: w, height: 640 } }); } } }
    await page.close();
  }
}
await browser.close();
process.exit(bad ? 1 : 0);
