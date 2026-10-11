// End-to-end test of the backend on a production build with the embedded database:
//   provider signs up → confirms email → claims a centre → admin approves the claim → provider edits the page → admin approves the edit →
//   the public page shows the change (on-demand revalidation) → empty fields are not rendered.
// Usage: npm run build && node tests/e2e/run.mjs        (starts its own server on :3500 with ARC_LOCAL_DB=.data/e2e-db)
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 3500, BASE = `http://localhost:${PORT}`;
const ADMIN = { email: 'admin@example.test', password: 'Admin-Passw0rd-123' };
const OWNER = { name: 'Test Owner', email: `owner-${Date.now()}@example.test`, password: 'Correct-Horse-9-Battery' };
const SLUG = 'star-drug-testing-services'; // a restored listing with no pricing / insurance in the export
fs.rmSync('.data/e2e-db', { recursive: true, force: true });
const server = spawn('npx', ['next', 'start', '-p', String(PORT)], { env: { ...process.env, ARC_LOCAL_DB: '.data/e2e-db', ENABLE_DEV_OUTBOX: '1', ARC_SEED_ADMIN_EMAIL: ADMIN.email, ARC_SEED_ADMIN_PASSWORD: ADMIN.password, RESEND_API_KEY: '' }, stdio: ['ignore', 'pipe', 'pipe'] });
let log = ''; server.stdout.on('data', (d) => (log += d)); server.stderr.on('data', (d) => (log += d));
const stop = () => { try { server.kill('SIGTERM'); } catch {} };
process.on('exit', stop);
for (let i = 0; i < 60; i++) { try { if ((await fetch(BASE + '/robots.txt')).ok) break; } catch {} await new Promise((r) => setTimeout(r, 500)); }

let failed = 0;
const check = (name, ok, extra = '') => { console.log((ok ? 'PASS ' : 'FAIL ') + name + (extra ? ' — ' + extra : '')); if (!ok) failed++; };
const browser = await chromium.launch({ executablePath: CHROME });
const owner = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
const admin = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
const publicPage = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
const mail = async (to) => (await (await fetch(`${BASE}/api/dev/outbox?to=${encodeURIComponent(to)}`)).json());
const settle = async (pred, ms = 15000) => { const t0 = Date.now(); let t = ''; while (Date.now() - t0 < ms) { t = await pageText(); if (pred(t)) return t; await new Promise((r) => setTimeout(r, 700)); } return t; };
const pageText = async () => (await (await fetch(`${BASE}/${SLUG}/`)).text()).replace(/<(script|style)[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');

try {
  // 0. baseline: the page has no pricing section and none of the owner fields
  let t = await pageText();
  check('baseline: no pricing section', !/Programs cost/.test(t));
  check('baseline: no owner text yet', !/We test hair samples for employers/.test(t));

  // 1. sign up through the real sign-up page
  await owner.goto(BASE + '/signup/', { waitUntil: 'load' });
  await owner.getByRole('button', { name: /Treatment centre/ }).click();
  await owner.getByPlaceholder('Jane Doe').fill(OWNER.name);
  await owner.locator('form input[type=email]').first().fill(OWNER.email);
  await owner.locator('form input[type=password]').first().fill(OWNER.password);
  await owner.getByRole('button', { name: /I agree to the Terms/ }).click({ position: { x: 10, y: 10 } });
  await Promise.all([owner.waitForURL(/centre-onboarding/, { timeout: 20000 }), owner.getByRole('button', { name: 'Create account' }).click()]);
  check('sign-up creates an account and signs in', true);

  // 2. email confirmation
  let msgs = await mail(OWNER.email);
  const verify = msgs.find((m) => /Confirm your email/.test(m.subject));
  check('a confirmation email was queued', !!verify);
  const link = verify?.body.match(/https?:\/\/[^\s]+\/api\/auth\/verify\?token=[\w-]+/)?.[0];
  await owner.goto(link.replace(/^https?:\/\/[^/]+/, BASE), { waitUntil: 'load' });
  check('the confirmation link works', /verified=1|provider-dashboard/.test(owner.url()), owner.url());

  // 3. claim the listing through the real claim page
  await owner.goto(`${BASE}/claim-listing/?centre=${SLUG}`, { waitUntil: 'load' });
  await owner.getByPlaceholder('Jane Doe').fill(OWNER.name);
  await owner.getByPlaceholder('Clinical Director').fill('Owner');
  await owner.getByPlaceholder('you@yourcentre.ca').fill(OWNER.email);
  await owner.getByRole('button', { name: /confirm|authori[sz]e|I am|I'm/i }).first().click().catch(() => {});
  await owner.screenshot({ path: 'audit/shots/e2e-claim-step2.png' }).catch(() => {});
  const cont = owner.getByRole('button', { name: /Review your claim/ });
  await cont.click();
  // authorization checkbox is a button on step 2 in the design; click it if the step did not advance
  if (await owner.getByRole('button', { name: /Submit claim/ }).count() === 0) {
    await owner.getByText(/I confirm|authori/i).first().click().catch(() => {});
    await cont.click().catch(() => {});
  }
  await owner.getByRole('button', { name: /I agree to the/ }).click({ position: { x: 10, y: 10 } });
  await owner.getByRole('button', { name: /Submit claim/ }).click();
  await owner.getByRole('heading', { name: 'Claim received' }).waitFor({ timeout: 20000 });
  check('claim submitted and saved (confirmation shown only after the server saved it)', true);

  // 4. admin signs in and approves the claim
  await admin.goto(BASE + '/login/', { waitUntil: 'load' });
  await admin.getByPlaceholder(/you@/).first().fill(ADMIN.email);
  await admin.locator('input[type=password]').first().fill(ADMIN.password);
  await Promise.all([admin.waitForURL(/\/admin\//, { timeout: 20000 }), admin.locator('form').first().getByRole('button', { name: /Log in/ }).click()]);
  check('admin signs in and lands on /admin/', /\/admin\//.test(admin.url()));
  await admin.goto(BASE + '/admin/claims/', { waitUntil: 'load' });
  await admin.locator('[data-approve-claim]').first().click();
  await admin.waitForLoadState('networkidle');
  check('admin approved the claim', (await admin.content()).includes('approved'));

  // 5. provider signs in again (memberships sync on sign-in), opens the editor
  await owner.goto(BASE + '/provider-dashboard/', { waitUntil: 'load' });
  check('the approved centre is listed in the provider dashboard', (await owner.content()).includes('Star Drug Testing'), owner.url());
  await owner.goto(`${BASE}/provider-dashboard/${SLUG}/`, { waitUntil: 'load' });
  await owner.getByLabel('Description').fill('We test hair samples for employers and individuals. This text was written by the centre owner.');
  await owner.getByLabel('Phone').fill('204-555-0142');
  await owner.getByRole('button', { name: 'Add a price' }).click();
  await owner.getByLabel('Program', { exact: true }).fill('Hair test');
  await owner.getByLabel('Price', { exact: true }).fill('$150');
  await owner.locator('[data-save]').click();
  await owner.getByText(/waiting for review/).waitFor({ timeout: 15000 });
  check('provider edit is held for review (moderation default)', true);
  t = await pageText();
  check('public page does not show the unapproved edit', !/We test hair samples for employers/.test(t));

  // 6. admin approves the edit; the static page is regenerated
  await admin.goto(BASE + '/admin/revisions/', { waitUntil: 'load' });
  await admin.locator('[data-approve-revision]').first().click();
  await admin.waitForLoadState('networkidle');
  t = await settle((x) => /We test hair samples for employers/.test(x));
  check('public page shows the approved description', /We test hair samples for employers/.test(t));
  check('public page shows the approved phone', /204-555-0142/.test(t));
  check('pricing section appears with the owner price', /Hair test/.test(t) && /\$150/.test(t));
  check('"Updated <date>" appears next to the owner pricing', /Updated [A-Z][a-z]+ \d{1,2}, \d{4}/.test(t));
  check('a field the owner left empty is not rendered (no insurance group)', !/Insurance accepted/.test(t));

  // 7. the owner removes the price and saves again: pricing disappears, nothing empty is rendered
  await owner.goto(`${BASE}/provider-dashboard/${SLUG}/`, { waitUntil: 'load' });
  await owner.getByRole('button', { name: /Remove price row 1/ }).click();
  await owner.locator('[data-save]').click();
  await owner.getByText(/waiting for review/).waitFor({ timeout: 15000 });
  await admin.goto(BASE + '/admin/revisions/', { waitUntil: 'load' });
  await admin.locator('[data-approve-revision]').first().click();
  await admin.waitForLoadState('networkidle');
  t = await settle((x) => !/Hair test/.test(x));
  check('emptying the pricing hides the pricing section again', !/Programs cost/.test(t) && !/Hair test/.test(t));

  // 8. access control
  const anon = await fetch(`${BASE}/admin/`, { redirect: 'manual' });
  check('/admin/ redirects anonymous visitors to sign-in', [302, 303, 307, 308].includes(anon.status) && /login/.test(anon.headers.get('location') || ''), String(anon.status));
  const ownerAdmin = await owner.goto(BASE + '/admin/', { waitUntil: 'load' });
  check('a provider cannot open /admin/', /login/.test(owner.url()), owner.url());
  const noCsrf = await fetch(`${BASE}/api/provider/profile`, { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://evil.example' }, body: '{}' });
  check('cross-site POST to the profile API is refused', noCsrf.status === 403);
  void ownerAdmin;
} catch (e) {
  failed++;
  console.log('FAIL exception — ' + (e instanceof Error ? e.message.split('\n').slice(0, 4).join(' | ') : e));
  await owner.screenshot({ path: 'audit/shots/e2e-owner-fail.png' }).catch(() => {});
  await admin.screenshot({ path: 'audit/shots/e2e-admin-fail.png' }).catch(() => {});
  console.log('--- server log tail ---\n' + log.slice(-1500));
}
await browser.close();
stop();
console.log(failed ? `\n${failed} check(s) failed` : '\nAll e2e checks passed');
process.exit(failed ? 1 : 0);
