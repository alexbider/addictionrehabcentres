// Crawls every URL in /sitemap.xml of a running build and reports: internal links that 404 or redirect, broken images,
// pages missing <title>, meta description or canonical. Usage: node audit/scripts/crawl-site.mjs http://localhost:3300 [outfile-prefix]
const BASE = (process.argv[2] || 'http://localhost:3300').replace(/\/$/, '');
const OUT = process.argv[3] || 'audit/out/crawl';
import fs from 'node:fs';
const CANON = 'https://addictionrehabcenters.ca';
const get = async (u, method = 'GET') => { try { return await fetch(u, { method, redirect: 'manual', headers: { 'user-agent': 'arc-crawl/1.0' } }); } catch (e) { return { status: 0, headers: new Headers(), text: async () => '' }; } };
const pool = async (items, n, fn) => { const out = []; let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]); } })); return out; };

const sm = await (await get(BASE + '/sitemap.xml')).text();
const pages = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const linkRefs = new Map(); // target -> Set(source pages)
const adj = new Map(); // page -> Set(targets)
const imgRefs = new Map();
const issues = { noTitle: [], noDesc: [], noCanonical: [], badCanonical: [], multiH1: [] };
const norm = (href, from) => { try { const u = new URL(href, BASE + from); if (u.origin !== BASE && u.origin !== CANON) return null; return u.pathname + u.search; } catch { return null; } };
await pool(pages, 8, async (p) => {
  const r = await get(BASE + p); const h = await r.text();
  if (!/<title>[^<]+<\/title>/.test(h)) issues.noTitle.push(p);
  if (!/<meta name="description" content="[^"]+"/.test(h)) issues.noDesc.push(p);
  const c = h.match(/<link rel="canonical" href="([^"]+)"/);
  if (!c) issues.noCanonical.push(p); else if (c[1] !== CANON + p) issues.badCanonical.push(p + ' -> ' + c[1]);
  if ((h.match(/<h1[\s>]/g) || []).length > 1) issues.multiH1.push(p);
  for (const m of h.matchAll(/<a\s[^>]*href="([^"#]+)[^"]*"/g)) { const t = norm(m[1].replace(/&amp;/g, '&'), p); if (t && !t.startsWith('/_next') && !t.startsWith('/assets/')) { (linkRefs.get(t) ?? linkRefs.set(t, new Set()).get(t)).add(p); (adj.get(p) ?? adj.set(p, new Set()).get(p)).add(t.split('?')[0]); } }
  for (const m of h.matchAll(/<img\s[^>]*src="([^"]+)"/g)) { const t = norm(m[1].replace(/&amp;/g, '&'), p); if (t && !t.startsWith('/_next/image')) (imgRefs.get(t) ?? imgRefs.set(t, new Set()).get(t)).add(p); else if (t) { const u = new URL(t, BASE).searchParams.get('url'); if (u?.startsWith('/')) (imgRefs.get(u) ?? imgRefs.set(u, new Set()).get(u)).add(p); } }
});
const broken = [], redirected = [], brokenImg = [];
await pool([...linkRefs.keys()], 8, async (t) => { const r = await get(BASE + t, 'HEAD'); if (r.status === 404 || r.status === 0 || r.status >= 500) broken.push([t, r.status, [...linkRefs.get(t)][0], linkRefs.get(t).size]); else if (r.status >= 300 && r.status < 400) redirected.push([t, r.status, r.headers.get('location'), [...linkRefs.get(t)][0], linkRefs.get(t).size]); });
await pool([...imgRefs.keys()], 8, async (t) => { const r = await get(BASE + t, 'HEAD'); if (r.status !== 200) brokenImg.push([t, r.status, [...imgRefs.get(t)][0], imgRefs.get(t).size]); });
// Orphans: sitemap URLs not reachable by following links from the home page.
const seen = new Set(['/']); const queue = ['/'];
while (queue.length) { const u = queue.pop(); for (const t of adj.get(u) ?? []) if (!seen.has(t)) { seen.add(t); queue.push(t); } }
const orphans = pages.filter((p) => !seen.has(p));
const q = (v) => '"' + String(v).replace(/"/g, '""') + '"';
fs.writeFileSync(OUT + '-broken-links.csv', 'target,status,example_page,pages\n' + broken.map((r) => r.map(q).join(',')).join('\n'));
fs.writeFileSync(OUT + '-redirected-links.csv', 'target,status,location,example_page,pages\n' + redirected.map((r) => r.map(q).join(',')).join('\n'));
fs.writeFileSync(OUT + '-broken-images.csv', 'target,status,example_page,pages\n' + brokenImg.map((r) => r.map(q).join(',')).join('\n'));
fs.writeFileSync(OUT + '-orphans.txt', orphans.join('\n'));
fs.writeFileSync(OUT + '-page-issues.json', JSON.stringify(issues, null, 1));
console.log(JSON.stringify({ pagesCrawled: pages.length, uniqueInternalLinks: linkRefs.size, brokenLinks404: broken.length, linksToRedirects: redirected.length, uniqueImages: imgRefs.size, brokenImages: brokenImg.length, orphanSitemapUrls: orphans.length, missingTitle: issues.noTitle.length, missingDescription: issues.noDesc.length, missingCanonical: issues.noCanonical.length, wrongCanonical: issues.badCanonical.length, multipleH1: issues.multiH1.length }, null, 1));
