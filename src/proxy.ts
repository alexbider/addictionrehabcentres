import { NextResponse, type NextRequest } from 'next/server';
import { PRODUCTION_HOSTS } from '@/lib/site';

// Only the production host is indexable. Any other host (Vercel preview, *.vercel.app, localhost) gets
// `X-Robots-Tag: noindex, nofollow` on every response and a robots.txt that disallows everything.
export function proxy(req: NextRequest) {
  const host = (req.headers.get('host') || '').toLowerCase();
  if (PRODUCTION_HOSTS.includes(host)) return NextResponse.next();
  if (req.nextUrl.pathname === '/robots.txt') {
    return new NextResponse('User-agent: *\nDisallow: /\n', { headers: { 'content-type': 'text/plain', 'x-robots-tag': 'noindex, nofollow' } });
  }
  const res = NextResponse.next();
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
}

export const config = { matcher: ['/((?!_next/static|_next/image|assets/|favicon.ico).*)'] };
