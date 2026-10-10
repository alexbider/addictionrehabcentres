import redirects from './redirects.json';
import imageRedirects from './image-redirects.json';

/** Everything the old WordPress site served that the new site answers with a 301 (or 410). Pure function: used by src/proxy.ts and by the tests. */

const OLD_SITEMAPS = new Set(['/category-sitemap.xml', '/listing-category-sitemap.xml', '/listing-item-sitemap.xml', '/listing-location-sitemap.xml', '/page-sitemap.xml', '/post-sitemap.xml', '/sitemap_index.xml', '/wp-sitemap.xml']);

const MAP = new Map<string, string>((redirects as { source: string; destination: string }[]).map((r) => [r.source.replace(/\/?$/, '/').toLowerCase(), r.destination]));
const IMG = imageRedirects as { map: Record<string, string>; gone: string[] };
const IMG_LOWER = new Map(Object.entries(IMG.map).map(([k, v]) => [k.toLowerCase(), v]));
const GONE = new Set(IMG.gone.map((g) => g.toLowerCase()));

const safeDecode = (s: string) => { try { return decodeURIComponent(s); } catch { return s; } };
/** Lower-case a path but leave %XX escapes alone. */
const lowerPath = (p: string) => p.replace(/(%[0-9a-fA-F]{2})|([A-Z]+)/g, (m, esc, up) => (esc ? esc : up.toLowerCase()));
const hasExt = (p: string) => /\.[a-z0-9]{2,5}$/i.test(p.split('/').pop() || '');

export type Outcome = { to?: string; gone?: boolean };

/** Final path for a request path, or `{}` when the path is already final. */
export function legacyOutcome(pathname: string): Outcome {
  if (pathname.startsWith('/_next') || pathname.startsWith('/assets/') || pathname.startsWith('/api/') || pathname === '/api') return {};

  // Old WordPress uploads: same file, new location (or gone). /wp-content/uploads/2021/09/name-300x200.jpg → the original's published image.
  if (pathname.startsWith('/wp-content/')) {
    const dec = safeDecode(pathname);
    const key = dec.toLowerCase();
    const bare = key.replace(/-\d+x\d+(\.[a-z0-9]+)$/, '$1');
    const to = IMG.map[dec] ?? IMG_LOWER.get(key) ?? IMG_LOWER.get(bare);
    if (to) return { to };
    if (GONE.has(key) || GONE.has(bare)) return { gone: true };
    return {};
  }

  let p = lowerPath(pathname);
  if (OLD_SITEMAPS.has(p) || OLD_SITEMAPS.has(p.replace(/\/$/, ''))) return { to: '/sitemap.xml' };
  if (!hasExt(p) && !p.endsWith('/')) p += '/';
  if (p === '/feed/') p = '/blog/';
  else if (/^\/(blog\/)?page\/\d+\/$/.test(p)) p = '/blog/';
  else if (/^\/tag\/.+/.test(p)) p = '/blog/';
  else if (/^\/20\d\d\/(\d\d\/)?$/.test(p)) p = '/blog/'; // WordPress date archives (/2023/09/, /2022/00/ …)
  // The approved 301 map (single hop: targets are always real pages — checked by audit/scripts/check-redirects.mjs).
  const mapped = MAP.get(p);
  if (mapped) p = mapped;
  return p !== pathname ? { to: p } : {};
}
