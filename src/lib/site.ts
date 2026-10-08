/** One variable for the production domain (canonicals, Open Graph, schema, sitemap, robots). Default: the live site's domain. */
export const SOURCE_ORIGIN = 'https://addictionrehabcenters.ca';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || SOURCE_ORIGIN).replace(/\/+$/, '');
/** Hosts that may be indexed: the production domain (and www.) plus any extra from PRODUCTION_HOSTS (comma separated). */
export const PRODUCTION_HOSTS = [new URL(SITE_URL).host, 'www.' + new URL(SITE_URL).host, ...(process.env.PRODUCTION_HOSTS || '').split(',').map((h) => h.trim()).filter(Boolean)];

/** Source URLs → production domain (works on strings and on parsed JSON-LD). */
export function toSite<T>(v: T): T {
  if (SITE_URL === SOURCE_ORIGIN) return v;
  if (typeof v === 'string') return v.split(SOURCE_ORIGIN).join(SITE_URL) as unknown as T;
  if (Array.isArray(v)) return v.map(toSite) as unknown as T;
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, toSite(x)])) as unknown as T;
  return v;
}
