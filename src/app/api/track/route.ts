import { NextRequest } from 'next/server';
import { sql } from 'drizzle-orm';
import { getDb, schema } from '@/db';
import { json, sameOrigin } from '@/server/request';
import { rateLimit } from '@/server/ratelimit';
import { hmac } from '@/server/crypto';
import { SLUG_RE } from '@/lib/slug';

const KINDS = new Set(['view', 'call', 'click']);
const BOT = /bot|crawl|spider|slurp|headless|lighthouse|preview|fetch/i;

/** Anonymous page counters for listing pages (no cookies, no personal data: a day, a counter, the referring path on this site). */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ ok: false }, 403);
  const db = await getDb();
  if (!db) return json({ ok: true });
  if (BOT.test(req.headers.get('user-agent') || '')) return json({ ok: true });
  let b: { e?: string; s?: string; k?: string; r?: string };
  try { b = JSON.parse((await req.text()).slice(0, 2000)); } catch { return json({ ok: false }, 400); }
  const entity = b.e === 'therapist' ? 'therapist' : b.e === 'centre' ? 'centre' : null;
  const slug = String(b.s || '');
  const kind = String(b.k || '');
  if (!entity || !SLUG_RE.test(slug) || slug.length > 160 || !KINDS.has(kind)) return json({ ok: false }, 400);
  const ip = (req.headers.get('x-forwarded-for') || 'x').split(',')[0].trim();
  if (!(await rateLimit(`track:${hmac(ip).slice(0, 16)}`, 300, 3600))) return json({ ok: true });
  const day = new Date().toISOString().slice(0, 10);
  const bump = (k: string, key = '') => db.insert(schema.listingStats).values({ entity, slug, kind: k, key, day, count: 1 })
    .onConflictDoUpdate({ target: [schema.listingStats.entity, schema.listingStats.slug, schema.listingStats.kind, schema.listingStats.key, schema.listingStats.day], set: { count: sql`${schema.listingStats.count} + 1` } });
  await bump(kind);
  if (kind === 'view' && typeof b.r === 'string' && b.r.startsWith('/') && b.r.length < 200) {
    const [path, query] = b.r.split('?');
    if (path !== '/' + slug.replace(/__/g, '/') + '/') await bump('ref', path.slice(0, 160));
    const q = new URLSearchParams(query || '').get('q');
    if (q && q.trim().length >= 2) await bump('term', q.trim().toLowerCase().slice(0, 60));
  }
  return json({ ok: true });
}
