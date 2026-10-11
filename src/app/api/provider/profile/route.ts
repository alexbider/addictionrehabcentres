import { NextRequest } from 'next/server';
import { canEditCentre, currentUser } from '@/server/auth';
import { isJson, json, readJson, sameOrigin } from '@/server/request';
import { submitProfile } from '@/server/profile';
import { rateLimit } from '@/server/ratelimit';
import { dbConfigured } from '@/db';
import { SLUG_RE } from '@/lib/slug';

/** A provider saves their centre page edits. Needs: same-origin JSON, a signed-in provider (or admin) with a confirmed email, ownership of the centre. */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req) || !isJson(req)) return json({ ok: false, error: 'Request blocked.' }, 403);
  if (!dbConfigured()) return json({ ok: false, error: 'The dashboard is not available yet.' }, 503);
  const u = await currentUser();
  if (!u || (u.role !== 'provider' && u.role !== 'master_admin')) return json({ ok: false, error: 'Please sign in.' }, 401);
  if (!u.verified && u.role !== 'master_admin') return json({ ok: false, error: 'Confirm your email address first (check your inbox).' }, 403);
  let body: { slug?: string; profile?: unknown };
  try { body = (await readJson(req, 256 * 1024)) as typeof body; } catch { return json({ ok: false, error: 'Invalid request.' }, 400); }
  const slug = String(body.slug || '');
  if (!SLUG_RE.test(slug) || !(await canEditCentre(u, slug))) return json({ ok: false, error: 'You cannot edit this centre.' }, 403);
  if (!(await rateLimit(`profile:${u.id}`, 30, 600))) return json({ ok: false, error: 'Too many saves. Please wait a few minutes.' }, 429);
  const r = await submitProfile(u.id, u.role === 'master_admin', slug, body.profile);
  if (!r.ok) return json({ ok: false, error: 'Please check the highlighted fields.', fields: r.fields }, 400);
  return json({ ok: true, live: r.live });
}
