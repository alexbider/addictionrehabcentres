import { NextResponse, type NextRequest } from 'next/server';
import { CANONICAL_HOST, NOINDEX_OK, REDIRECT_PREVIEW_TO_CANONICAL, hostOnly, isProductionHost } from '@/lib/site';
import { legacyOutcome } from '@/lib/legacy-urls';

/**
 * Every redirect is computed here in ONE step (host + protocol + case + trailing slash + legacy rules + the 301 map in
 * src/lib/redirects.json), so a request never takes more than one hop to reach its final URL.
 *
 *  - Production host (addictionrehabcenters.ca, www.): indexable. http→https and www→apex are 301s. No noindex, except NOINDEX_OK paths.
 *  - Any other host (*.vercel.app, localhost): robots.txt = Disallow: / and X-Robots-Tag: noindex on every response.
 *    With REDIRECT_PREVIEW_TO_CANONICAL=true, *.vercel.app requests are 301'd to the production domain instead (set once the domain is attached).
 */
export function proxy(req: NextRequest) {
  const rawHost = (req.headers.get('x-forwarded-host') || req.headers.get('host') || '').toLowerCase();
  const host = hostOnly(rawHost);
  const proto = (req.headers.get('x-forwarded-proto') || req.nextUrl.protocol.replace(':', '')).split(',')[0];
  const prod = isProductionHost(host);
  const local = host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local');
  const toCanonical = prod || (REDIRECT_PREVIEW_TO_CANONICAL && host.endsWith('.vercel.app'));
  const { pathname, search } = req.nextUrl;

  // 1. Where should this request end up? (path rules are host independent)
  const legacy = legacyOutcome(pathname);
  if (legacy.gone) return new NextResponse('Gone', { status: 410, headers: { 'content-type': 'text/plain', 'cache-control': 'public, max-age=86400' } });
  const finalPath = legacy.to ?? null;
  const wantHost = toCanonical ? CANONICAL_HOST : rawHost;
  const wantProto = toCanonical ? 'https' : proto;
  const pathChanged = finalPath !== null && finalPath !== pathname;
  const hostChanged = toCanonical && !local && (host !== CANONICAL_HOST || proto !== 'https');
  if (pathChanged || hostChanged) {
    const dest = `${wantProto}://${wantHost}${finalPath ?? pathname}${search}`;
    return NextResponse.redirect(dest, 301);
  }

  // 2. robots.txt on non-production hosts
  if (!prod && pathname === '/robots.txt') {
    return new NextResponse('User-agent: *\nDisallow: /\n', { headers: { 'content-type': 'text/plain', 'x-robots-tag': 'noindex, nofollow' } });
  }

  // 3. Indexing headers
  const res = NextResponse.next();
  if (!prod) res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  else if (NOINDEX_OK.includes(pathname)) res.headers.set('X-Robots-Tag', 'noindex, follow');
  return res;
}

// Static files and Next internals are skipped; /wp-content/uploads/* (old WordPress images) is handled in legacyOutcome.
export const config = { matcher: ['/((?!_next/static|_next/image|assets/|favicon.ico).*)'] };
