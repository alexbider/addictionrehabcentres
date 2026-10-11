import { headers } from 'next/headers';

export async function clientIp(): Promise<string> {
  const h = await headers();
  return (h.get('x-forwarded-for') || h.get('x-real-ip') || 'unknown').split(',')[0].trim();
}

/** CSRF defence for cookie-authenticated JSON endpoints: the request must come from this site (Origin / Sec-Fetch-Site) and carry a JSON content type,
 *  which a cross-site HTML form cannot send. Server Actions have Next's own origin check. */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  const site = req.headers.get('sec-fetch-site');
  if (site && site !== 'same-origin' && site !== 'none') return false;
  if (origin) {
    try {
      const o = new URL(origin).host;
      const host = (req.headers.get('x-forwarded-host') || req.headers.get('host') || '').toLowerCase();
      if (o.toLowerCase() !== host) return false;
    } catch { return false; }
  } else if (!site) return false; // neither header: not a browser request from our pages
  return true;
}

export const isJson = (req: Request) => (req.headers.get('content-type') || '').toLowerCase().startsWith('application/json');

export function json(data: unknown, status = 200, extra?: HeadersInit) {
  return Response.json(data, { status, headers: { 'cache-control': 'no-store', ...extra } });
}

/** Reads a JSON body with a hard size cap. */
export async function readJson(req: Request, maxBytes = 64 * 1024): Promise<unknown> {
  const text = await req.text();
  if (text.length > maxBytes) throw new Error('TOO_LARGE');
  return text ? JSON.parse(text) : {};
}
