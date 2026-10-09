// Article images check: no two images back to back in the article flow, and no image displayed wider than its own pixels (blurry upscale).
//   node audit/scripts/check-article-images.mjs --routes /cocaine-addiction/,/heroin-addiction/ [--base http://localhost:3217] [--widths 1440,390]
import { chromium } from 'playwright-core';
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg('base', 'http://localhost:3217');
const ROUTES = arg('routes', '').split(',').filter(Boolean);
const WIDTHS = arg('widths', '1440,390').split(',').map(Number);
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ executablePath: CHROME });
let fails = 0;
for (const r of ROUTES) for (const w of WIDTHS) {
  const page = await (await browser.newContext({ viewport: { width: w, height: 900 } })).newPage();
  await page.goto(BASE + r, { waitUntil: 'networkidle', timeout: 90000 });
  await page.evaluate(() => document.querySelectorAll('img[loading=lazy]').forEach((i) => { i.loading = 'eager'; }));
  await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } });
  await page.waitForTimeout(1200);
  const res = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('main img, [data-screen-label] img')].filter((i) => i.getBoundingClientRect().width > 0 && !i.closest('header,footer,aside,[data-sc-name="SiteHeader"],[data-screen-label$="Hero"],[data-screen-label="Hero"],[data-screen-label="Hero Image"],[data-screen-label="Sponsored Centres"],[data-screen-label="Other Drugs"]') && !i.closest('a'));
    const adjacent = [], blurry = [];
    for (const i of imgs) if (i.naturalWidth && i.getBoundingClientRect().width > i.naturalWidth + 1) blurry.push(i.src.split('/').pop() + ` shown ${Math.round(i.getBoundingClientRect().width)} natural ${i.naturalWidth}`);
    for (let k = 1; k < imgs.length; k++) {
      const r = document.createRange(); r.setStartAfter(imgs[k - 1]); r.setEndBefore(imgs[k]);
      if (!r.toString().trim()) adjacent.push(imgs[k - 1].src.split('/').pop() + ' + ' + imgs[k].src.split('/').pop());
    }
    return { count: imgs.length, adjacent, blurry };
  });
  const bad = res.adjacent.length + res.blurry.length;
  console.log(`${bad ? '✗' : '✓'} ${r} @${w}: ${res.count} article images; adjacent ${JSON.stringify(res.adjacent)} blurry ${JSON.stringify(res.blurry)}`);
  fails += bad; await page.context().close();
}
await browser.close();
console.log(fails ? `FAIL: ${fails}` : 'PASS: no adjacent or blurry article images');
process.exit(fails ? 1 : 0);
