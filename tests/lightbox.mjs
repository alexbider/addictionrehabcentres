// Playwright check of the centre gallery lightbox. Usage: node tests/lightbox.mjs http://localhost:3300
import { chromium } from 'playwright-core';
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const base = process.argv[2] || 'http://localhost:3300';
const browser = await chromium.launch({ executablePath: CHROME });
let failed = 0;
const check = (name, ok, extra = '') => { console.log((ok ? 'PASS ' : 'FAIL ') + name + (extra ? ' — ' + extra : '')); if (!ok) failed++; };
const counter = (page) => page.locator('[role=dialog] [data-counter]').innerText();

// 1. many photos
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, hasTouch: true });
  await page.goto(base + '/canadawide-mobile/', { waitUntil: 'load' });
  const total = await page.locator('[data-gallery] button[aria-label^="Open photo"]').count();
  const trigger = page.locator('[data-gallery] button[aria-label^="Open photo"]').first();
  await trigger.click();
  await page.waitForSelector('[role=dialog]');
  const c0 = await counter(page);
  check('click a photo opens the dialog with counter', /^1 \/ \d+$/.test(c0), c0);
  const n = Number(c0.split('/')[1]);
  await page.click('[data-next]'); check('next button → 2 / N', (await counter(page)) === `2 / ${n}`);
  await page.click('[data-prev]'); check('previous button → 1 / N', (await counter(page)) === `1 / ${n}`);
  await page.keyboard.press('ArrowRight'); check('ArrowRight → 2 / N', (await counter(page)) === `2 / ${n}`);
  await page.keyboard.press('ArrowLeft'); await page.keyboard.press('ArrowLeft'); check('ArrowLeft wraps to last', (await counter(page)) === `${n} / ${n}`);
  const hasAlt = await page.locator('[role=dialog] img[alt]').first().getAttribute('alt');
  check('image has alt text', !!hasAlt && hasAlt.length > 3, hasAlt);
  const src = await page.locator('[role=dialog] img').first().getAttribute('src');
  check('image is served through next/image', /_next\/image/.test(src ?? ''), src?.slice(0, 60));
  // focus trap
  let inside = true;
  for (let k = 0; k < 8; k++) { await page.keyboard.press('Tab'); inside &&= await page.evaluate(() => !!document.activeElement?.closest('[role=dialog]')); }
  check('focus stays inside the dialog while tabbing', inside);
  // swipe (touch events)
  const before = await counter(page);
  await page.evaluate(() => { const d = document.querySelector('[role=dialog]'); const mk = (type, x) => new TouchEvent(type, { bubbles: true, cancelable: true, touches: type === 'touchend' ? [] : [new Touch({ identifier: 1, target: d, clientX: x, clientY: 300 })], changedTouches: [new Touch({ identifier: 1, target: d, clientX: x, clientY: 300 })] }); d.dispatchEvent(mk('touchstart', 400)); d.dispatchEvent(mk('touchend', 200)); });
  check('swipe left goes to the next photo', (await counter(page)) !== before, `${before} → ${await counter(page)}`);
  await page.keyboard.press('Escape');
  await page.waitForSelector('[role=dialog]', { state: 'detached' });
  check('Escape closes the dialog', true);
  check('focus returns to the photo that opened it', await page.evaluate(() => !!document.activeElement?.closest('[data-gallery]')));
  await page.locator('[data-show-all]').click(); await page.waitForSelector('[role=dialog]');
  check('"Show all N photos" opens it', (await counter(page)).startsWith('1 /'), `${total} tiles shown, ${n} photos in total`);
  await page.click('[data-close]'); await page.waitForSelector('[role=dialog]', { state: 'detached' });
  check('close button closes it', true);
  await page.close();
}
// 2. one photo
{
  const page = await browser.newPage();
  await page.goto(base + '/tdcss-adult-addiction-day-treatment-program/', { waitUntil: 'load' });
  await page.locator('[data-gallery] button[aria-label^="Open photo"]').first().click();
  await page.waitForSelector('[role=dialog]');
  check('single photo: opens', (await counter(page)) === '1 / 1');
  check('single photo: no next/previous buttons', (await page.locator('[data-next],[data-prev]').count()) === 0);
  await page.keyboard.press('Escape');
  await page.close();
}
// 3. centre whose own gallery is empty: its listing photo is used (single-photo lightbox); a centre with no photo at all renders no gallery
//    (src/views/Centre.jsx: galleryNode is null when M.images is empty; GalleryGrid returns null for []). The data has no such centre today.
{
  const page = await browser.newPage();
  await page.goto(base + '/healing-therapy-alliance/', { waitUntil: 'load' });
  check('empty own gallery: falls back to the listing photo', (await page.locator('[data-show-all]').innerText()) === 'View photo');
  await page.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
