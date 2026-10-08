// Compare each design file in the client's folder (served on :3300) with the same design rendered from the clone (:3200, BlogPost :3201)
// and from the repo's design routes (:3100). usage: node zip-compare.mjs <out.json>
import fs from 'node:fs'; import { createRequire } from 'node:module';
const sharp = createRequire('/Users/mac/Downloads/arc-next/package.json')('sharp');
const OUT = process.argv[2]; const SHOTS = '/private/tmp/claude-501/-Users-mac-Downloads-arc-next/dee83184-9305-4a60-9b03-925195a524c5/scratchpad/zc';
fs.mkdirSync(SHOTS, { recursive: true });
const files = [['Home', '/'], ['Alcohol', '/alcohol'], ['Auth', '/auth'], ['Blog', '/blog'], ['BlogPost', '/blog-post'], ['Centre', '/centre'], ['CentreOnboarding', '/centre-onboarding'], ['City', '/city'], ['ClaimListing', '/claim-listing'], ['ClaimTherapist', '/claim-therapist'], ['Contact', '/contact'], ['Drug', '/drug'], ['Intervention', '/intervention'], ['JoinDirectory', '/join-directory'], ['Menu Options', '/menu-options'], ['Promote', '/promote'], ['ProviderDashboard', '/provider-dashboard'], ['Province', '/province'], ['TherapistOnboarding', '/therapist-onboarding'], ['TherapistProfile', '/therapist-profile'], ['Therapists', '/therapists'], ['TherapistsCity', '/therapists-city'], ['TherapistsProvince', '/therapists-province']];
const tabs = await (await fetch('http://localhost:9333/json')).json();
const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = {}; ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m.result); delete pend[m.id]; } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (x) => (await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true })).result.value;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
async function grab(url, w, file) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 500 });
  await send('Page.navigate', { url }); await wait(4500);
  await ev('(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,50));}window.scrollTo(0,0)})()'); await wait(800);
  const info = await ev(`({h:document.documentElement.scrollHeight,sw:document.documentElement.scrollWidth,text:document.body.innerText.replace(/\\s+/g,' ').trim(),labels:[...document.querySelectorAll('[data-screen-label]')].map(e=>e.getAttribute('data-screen-label')),imgs:[...document.images].map(i=>(i.getAttribute('src')||'').split('/').pop()),kf:[...document.styleSheets].flatMap(s=>{try{return [...s.cssRules].filter(r=>r.type===7).map(r=>r.name)}catch(e){return []}})})`);
  const h = info.h; const parts = [];
  for (let y = 0; y < h; y += 2500) { const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y, width: w, height: Math.min(2500, h - y), scale: 1 } }); parts.push({ input: Buffer.from(s.data, 'base64'), left: 0, top: y }); }
  await sharp({ create: { width: w, height: h, channels: 3, background: '#fff' } }).composite(parts).png().toFile(file);
  return info;
}
async function pix(a, b) {
  const A = await sharp(a).raw().toBuffer({ resolveWithObject: true }), B = await sharp(b).raw().toBuffer({ resolveWithObject: true });
  const w = Math.min(A.info.width, B.info.width), h = Math.min(A.info.height, B.info.height); let d = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x += 2) { const i = (y * A.info.width + x) * 3, j = (y * B.info.width + x) * 3; if (Math.abs(A.data[i] - B.data[j]) + Math.abs(A.data[i + 1] - B.data[j + 1]) + Math.abs(A.data[i + 2] - B.data[j + 2]) > 40) d++; }
  return +(100 * d / (h * Math.ceil(w / 2))).toFixed(3);
}
const words = (t) => t.toLowerCase().split(/[^a-z0-9$%']+/).filter(Boolean);
function tdiff(a, b) { const c = {}; for (const w of words(a)) c[w] = (c[w] || 0) + 1; for (const w of words(b)) c[w] = (c[w] || 0) - 1; const only = (s) => Object.entries(c).filter(([, v]) => s * v > 0).map(([k, v]) => `${k}×${Math.abs(v)}`); return { onlyFolder: only(1).slice(0, 12), onlyOther: only(-1).slice(0, 12), nFolder: only(1).length, nOther: only(-1).length }; }
const res = {};
for (const [name, route] of files) {
  const r = { name, route }; const f = name.replace(/ /g, '%20');
  r.folder = await grab(`http://localhost:3300/${f}.dc.html`, 1440, `${SHOTS}/${name}-folder.png`);
  const cloneBase = name === 'BlogPost' ? 'http://localhost:3201' : 'http://localhost:3200';
  r.clone = await grab(cloneBase + route, 1440, `${SHOTS}/${name}-clone.png`);
  if (name !== 'BlogPost') r.repo = await grab('http://localhost:3100' + route, 1440, `${SHOTS}/${name}-repo.png`);
  for (const k of ['clone', 'repo']) if (r[k]) { r[k].pixDiff = await pix(`${SHOTS}/${name}-folder.png`, `${SHOTS}/${name}-${k}.png`); r[k].textDiff = tdiff(r.folder.text, r[k].text); r[k].labelsSame = JSON.stringify(r.folder.labels) === JSON.stringify(r[k].labels); r[k].imgsDiff = { onlyFolder: r.folder.imgs.filter((x) => !r[k].imgs.includes(x)), onlyOther: r[k].imgs.filter((x) => !r.folder.imgs.includes(x)) }; r[k].kfDiff = { onlyFolder: r.folder.kf.filter((x) => !r[k].kf.includes(x)), onlyOther: r[k].kf.filter((x) => !r.folder.kf.includes(x)) }; }
  for (const k of ['folder', 'clone', 'repo']) if (r[k]) { r[k].textLen = r[k].text.length; delete r[k].text; }
  res[name] = r; console.log(name, 'folder h', r.folder.h, '| clone h', r.clone.h, 'pix', r.clone.pixDiff, 'text only-folder/other', r.clone.textDiff.nFolder, r.clone.textDiff.nOther, '| repo h', r.repo?.h, 'pix', r.repo?.pixDiff);
  fs.writeFileSync(OUT, JSON.stringify(res, null, 1));
}
process.exit(0);
