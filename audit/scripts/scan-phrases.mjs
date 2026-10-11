// Counts unsupported / filler phrases across every sitemap page of a running build. Usage: node audit/scripts/scan-phrases.mjs http://localhost:3300
const base = process.argv[2] || 'http://localhost:3300';
const PHRASES = ['clinical advisor', 'Priya', 'Sarah', 'Medically reviewed', 'Reviewed by', 'Listing reviewed', 'accredited', 'accreditation', '11.2k', 'Top Rated', 'Photo:', 'photo ·', 'moderate reviews', 'We moderate', 'Verified listing', 'Verified by', 'physician', '10,000', 'within the hour', 'Example data', 'Example prices', 'sample', 'Lorem', 'Ad disclosure', 'Sponsored', 'pay to be featured', 'Contact for pricing', 'Varies', 'Site reviews', 'Google reviews', '★', 'Call for availability', 'Est. reading time', 'Be the first to share'];
const sm = await (await fetch(base + '/sitemap.xml')).text();
const pages = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname).concat(['/', '/contact/', '/promote/', '/claim-listing/', '/centre-onboarding/', '/search/']);
const hits = {}; const ex = {};
let i = 0;
await Promise.all(Array.from({ length: 8 }, async () => { while (i < pages.length) { const p = pages[i++]; const h = await (await fetch(base + p)).text(); const t = h.replace(/<(script|style|noscript)[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' '); for (const ph of PHRASES) { const k = t.indexOf(ph); if (k >= 0) { hits[ph] = (hits[ph] || 0) + 1; (ex[ph] ??= []).length < 2 && ex[ph].push(p + ' … ' + t.slice(Math.max(0, k - 50), k + 70)); } } } }));
for (const ph of PHRASES) if (hits[ph]) console.log(String(hits[ph]).padStart(4), JSON.stringify(ph), '\n      ', (ex[ph] || []).join('\n       '));
console.log('pages scanned:', pages.length);
