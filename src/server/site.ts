import { SITE_URL } from '@/lib/site';

/** Origin for links in e-mails and redirects: the request's own host in local development / tests, otherwise the production origin (APP_ORIGIN or SITE_URL). */
export function siteOrigin(from?: Request | Headers): string {
  const h = from instanceof Headers ? from : from?.headers;
  if ((process.env.NODE_ENV !== 'production' || process.env.ARC_LOCAL_DB) && h) {
    const host = h.get('x-forwarded-host') || h.get('host');
    if (host) return `${host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https'}://${host}`;
  }
  return (process.env.APP_ORIGIN || SITE_URL).replace(/\/+$/, '');
}
