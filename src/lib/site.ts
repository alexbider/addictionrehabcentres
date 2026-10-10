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

/** Bare production host (no www) — every redirect and canonical points here. */
export const CANONICAL_HOST = new URL(SITE_URL).host;
/** Paths that stay noindex on the production host on purpose (same as the old site). */
export const NOINDEX_OK = ['/search/', '/centre-onboarding/', '/ecstasy-addiction/', '/tranquilisers-addiction/'];
/** Paths crawlers must not fetch on the production host. */
export const PRODUCTION_DISALLOW = ['/admin', '/dashboard', '/api', '/provider-dashboard', '/login'];
/** Set REDIRECT_PREVIEW_TO_CANONICAL=true (after the domain is attached) to 301 every *.vercel.app request to the production domain. Off by default so previews keep working. */
export const REDIRECT_PREVIEW_TO_CANONICAL = process.env.REDIRECT_PREVIEW_TO_CANONICAL === 'true';

export const hostOnly = (h: string | null | undefined) => (h || '').toLowerCase().replace(/:\d+$/, '');
/** True for the production domain and its www. alias (the only hosts that may be indexed). */
export const isProductionHost = (h: string | null | undefined) => PRODUCTION_HOSTS.map(hostOnly).includes(hostOnly(h));
