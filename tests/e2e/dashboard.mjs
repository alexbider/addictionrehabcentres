// End-to-end test of the provider + therapist dashboards (Provider Dashboard design) against a running server with the embedded database.
// Usage: start a server with ARC_LOCAL_DB, ENABLE_DEV_OUTBOX=1 and the seeded admin, then: node tests/e2e/dashboard.mjs http://localhost:3400
import { chromium } from 'playwright-core';

const BASE = process.argv[2] || 'http://localhost:3400';
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium';
const ADMIN = { email: 'admin@example.test', password: 'Admin-Passw0rd-123' };
const T = Date.now();
const C = { name: 'Casey Centre', email: `centre-${T}@example.test`, password: 'Correct-Horse-9-Battery' };
const P = { name: 'Taylor Therapist', email: `ther-${T}@example.test`, password: 'Correct-Horse-9-Battery' };
const SLUG = 'star-drug-testing-services';
let failed = 0;
const check = (name, ok, extra = '') => { console.log((ok ? 'PASS ' : 'FAIL ') + name + (extra ? ' — ' + extra : '')); if (!ok) failed++; };
const mail = async (to) => (await (await fetch(`${BASE}/api/dev/outbox?to=${encodeURIComponent(to)}`)).json());
const post = (page, url, data) => page.request.post(BASE + url, { headers: { origin: BASE, 'content-type': 'application/json' }, data }).then(async (r) => ({ status: r.status(), body: await r.json().catch(() => ({})) }));
const browser = await chromium.launch({ executablePath: CHROME });
const errors = [];
const newPage = async (w = 1440) => { const p = await (await browser.newContext({ viewport: { width: w, height: 900 } })).newPage(); p.on('pageerror', (e) => errors.push(e.message)); return p; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function signupVerify(page, u, role) {
  await page.goto(BASE + '/login/');
  const r = await post(page, '/api/auth/signup', { name: u.name, email: u.email, password: u.password, role });
  check(`${role}: sign-up`, r.status === 200, JSON.stringify(r.body));
  const v = (await mail(u.email)).find((m) => /Confirm your email/.test(m.subject));
  const link = v?.body.match(/\/api\/auth\/verify\?token=[\w-]+/)?.[0];
  await page.goto(BASE + link);
  check(`${role}: email confirmed`, /verified=1/.test(page.url()), page.url());
}
async function login(page, u) {
  await page.goto(BASE + '/login/');
  const r = await post(page, '/api/auth/login', { email: u.email, password: u.password });
  return r.body;
}
const text = (p) => p.evaluate(() => document.body.innerText);
const nav = async (p, label) => { await p.click(`aside nav button[title="${label}"]`); await sleep(700); };

try {
  const admin = await newPage();
  const a = await login(admin, ADMIN);
  check('admin login redirect is /admin/', a.redirect === '/admin/');

  /* ───────── centre ───────── */
  const c = await newPage();
  await signupVerify(c, C, 'provider');
  let r = await post(c, '/api/forms/claim', { centreSlug: SLUG, name: C.name, email: C.email, phone: '416-555-0100', roleTitle: 'Owner' });
  check('centre: claim submitted', r.status === 200, JSON.stringify(r.body));
  await c.goto(BASE + '/provider-dashboard/'); await sleep(1500);
  let t = await text(c);
  check('centre: dashboard before approval shows claim under review', /claim is being reviewed/i.test(t), t.slice(0, 200));
  await admin.goto(BASE + '/admin/claims/'); await admin.locator('[data-approve-claim]').first().click(); await admin.waitForLoadState('networkidle'); await sleep(800);
  const lr = await login(c, C);
  check('centre: login sends to the centre dashboard', lr.redirect === '/provider-dashboard/', lr.redirect);
  // a public callback request on the centre page = a lead
  const pub = await newPage();
  await pub.goto(`${BASE}/${SLUG}/`); await sleep(2500);
  r = await post(pub, '/api/forms/callback', { centreSlug: SLUG, name: 'Sam Lead', phone: '416-555-0199', email: 'sam.lead@example.test', who: 'Self', when: 'This week', setting: 'Residential', substance: 'Alcohol', ack: true, sourcePath: `/${SLUG}/` });
  check('public: callback request saved', r.status === 200, JSON.stringify(r.body));
  check('centre owner e-mailed about the new lead', (await mail(C.email)).some((m) => /New callback request/.test(m.subject)));

  await c.goto(BASE + '/provider-dashboard/'); await sleep(2000);
  t = await text(c);
  check('centre: overview shows the centre name', /Star Drug Testing/i.test(t));
  check('centre: no demo labels', !/Fictional example data|Demo data|Lakeside|Jane/.test(t));
  check('centre: hot lead is the real lead', /Sam Lead/.test(t));
  check('centre: profile views counted', /Profile views\s*\n?\s*[1-9]/.test(t), (t.match(/Profile views[\s\S]{0,30}/) || [''])[0]);
  await c.screenshot({ path: '/tmp/claude-0/c-overview.png', fullPage: true });

  // leads
  await nav(c, 'Leads');
  await c.getByText('Sam Lead').first().click(); await sleep(500);
  await c.getByPlaceholder(/Write a reply/).fill('Hi Sam, we have space this week.');
  await c.getByRole('button', { name: /^Send/ }).first().click(); await sleep(1500);
  check('centre: reply e-mailed to the lead', (await mail('sam.lead@example.test')).some((m) => /we have space this week/.test(m.body)));
  await c.screenshot({ path: '/tmp/claude-0/c-lead.png', fullPage: false });
  // facility via the drawer
  await c.keyboard.press('Escape');
  await c.goto(BASE + '/provider-dashboard/?view=facilities'); await sleep(1500);
  await c.getByRole('button', { name: /Add facility/ }).first().click(); await sleep(400);
  const inputs = c.locator('aside input, [role=dialog] input');
  check('centre: facility form opens', (await inputs.count()) >= 2, String(await inputs.count()));
  await inputs.nth(0).fill('Main Residence'); await inputs.nth(1).fill('Toronto, ON'); await inputs.nth(2).fill('40'); await inputs.nth(3).fill('31');
  await c.getByRole('button', { name: /^Add facility$/ }).last().click(); await sleep(1800);
  await c.goto(BASE + '/provider-dashboard/?view=facilities'); await sleep(1800);
  t = await text(c);
  check('centre: facility saved and still there after reload', /Main Residence/.test(t));
  // listing: description
  await c.goto(BASE + '/provider-dashboard/?view=profile'); await sleep(1500);
  await c.getByText('Description', { exact: true }).click(); await sleep(300);
  await c.locator('textarea').first().fill('We help adults recover from alcohol and drug use with residential care.');
  await c.getByRole('button', { name: 'Save changes' }).first().click(); await sleep(1500);
  t = await text(c);
  check('centre: listing saved (review mode message)', /waiting for review|live/i.test(t));
  await c.screenshot({ path: '/tmp/claude-0/c-listing.png', fullPage: true });
  await nav(c, 'Billing'); await c.screenshot({ path: '/tmp/claude-0/c-billing.png', fullPage: true });
  await nav(c, 'Analytics'); await c.screenshot({ path: '/tmp/claude-0/c-analytics.png', fullPage: true });
  await nav(c, 'Settings'); await c.screenshot({ path: '/tmp/claude-0/c-settings.png', fullPage: true });
  await nav(c, 'Calendar'); await c.screenshot({ path: '/tmp/claude-0/c-calendar.png', fullPage: true });
  r = await (await c.request.get(BASE + '/therapist-dashboard/', { maxRedirects: 0 })).status();
  check('centre: /therapist-dashboard redirects away', r === 307 || r === 308 || r === 303, String(r));

  /* ───────── therapist ───────── */
  const p = await newPage();
  await signupVerify(p, P, 'therapist');
  r = await post(p, '/api/forms/therapistOnboarding', { email: P.email, payload: { name: P.name, email: P.email, phone: '647-555-0101', desig: 'rp', city: 'Toronto', prov: 'ON', fee: '150', tagline: 'Practical help for alcohol use', concerns: ['Addiction'], accepting: true } });
  check('therapist: onboarding submitted', r.status === 200, JSON.stringify(r.body));
  await p.goto(BASE + '/therapist-dashboard/'); await sleep(1500);
  t = await text(p);
  check('therapist: dashboard before approval says profile is being reviewed', /being reviewed/i.test(t), t.slice(0, 300));
  await admin.goto(BASE + '/admin/onboarding/'); await admin.getByRole('button', { name: /Approve/ }).first().click(); await admin.waitForLoadState('networkidle'); await sleep(800);
  const pl = await login(p, P);
  check('therapist: login sends to the therapist dashboard', pl.redirect === '/therapist-dashboard/', pl.redirect);
  await p.goto(BASE + '/therapist-dashboard/'); await sleep(2000);
  t = await text(p);
  check('therapist: greets the therapist', /Good (morning|afternoon|evening), Taylor/.test(t));
  check('therapist: no demo people', !/Maya|Lakeshore|Jordan Ellis/.test(t));
  await p.getByRole('button', { name: 'Add client' }).first().click(); await sleep(400);
  const fi = p.locator('input');
  await p.locator('label:has-text("Full name") input').fill('Alex Client');
  await p.locator('label:has-text("Email") input').first().fill('alex.client@example.test');
  await p.getByRole('button', { name: /^Add client$/ }).last().click(); await sleep(1500);
  await p.getByRole('button', { name: 'Book appointment' }).first().click(); await sleep(400);
  const sel = p.locator('label:has-text("Client") select').first();
  await sel.selectOption({ label: 'Alex Client' });
  const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(10, 0, 0, 0);
  await p.locator('input[type=datetime-local]').first().fill(new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 16));
  await p.getByRole('button', { name: /^Book appointment$/ }).last().click(); await sleep(1800);
  await p.goto(BASE + '/therapist-dashboard/?view=clients'); await sleep(1800);
  t = await text(p);
  check('therapist: client persisted after reload', /Alex Client/.test(t));
  check('therapist: next appointment shown for the client', /Alex Client[\s\S]{0,200}(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/.test(t));
  await p.screenshot({ path: '/tmp/claude-0/t-clients.png', fullPage: true });
  await p.goto(BASE + '/therapist-dashboard/?view=profile'); await sleep(1500);
  await p.getByText('Headline & bio').click(); await sleep(300);
  await p.locator('label:has-text("Headline") input').fill('Steady, practical support for recovery');
  await p.getByRole('button', { name: 'Save changes' }).first().click(); await sleep(1500);
  t = await text(p);
  check('therapist: profile saved', /saved/i.test(t));
  await p.goto(BASE + '/therapist-dashboard/'); await sleep(1500);
  await p.screenshot({ path: '/tmp/claude-0/t-overview.png', fullPage: true });
  for (const v of ['calendar', 'billing', 'reports', 'settings', 'leads', 'analytics', 'waitlist', 'tasks', 'availability']) { await p.goto(BASE + '/therapist-dashboard/?view=' + v); await sleep(1300); await p.screenshot({ path: `/tmp/claude-0/t-${v}.png`, fullPage: true }); }
  for (const v of ['partners', 'reports', 'tasks', 'marketing', 'leads']) { await c.goto(BASE + '/provider-dashboard/?view=' + v); await sleep(1300); await c.screenshot({ path: `/tmp/claude-0/c-${v}.png`, fullPage: true }); }
  const m = await newPage(390); await login(m, C); await m.goto(BASE + '/provider-dashboard/'); await sleep(2000); await m.screenshot({ path: '/tmp/claude-0/c-mobile.png', fullPage: true });
  check('mobile: no horizontal scroll', await m.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
} catch (e) { console.log('FAIL exception', e.message); failed++; }
check('no client-side errors', errors.length === 0, errors.slice(0, 5).join(' | '));
await browser.close();
console.log(failed ? `${failed} FAILED` : 'ALL PASSED');
process.exit(failed ? 1 : 0);
