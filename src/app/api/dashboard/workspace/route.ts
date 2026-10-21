import { NextRequest } from 'next/server';
import { dbConfigured, requireDb, schema } from '@/db';
import { currentUser } from '@/server/auth';
import { isJson, json, readJson, sameOrigin } from '@/server/request';
import { rateLimit } from '@/server/ratelimit';

const MAX = 900 * 1024;

/** Saves the signed-in user's dashboard workspace (facilities, partners, reports, tasks, campaigns, calendar; for therapists their practice records). */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req) || !isJson(req)) return json({ ok: false, error: 'Request blocked.' }, 403);
  if (!dbConfigured()) return json({ ok: false, error: 'The dashboard is not available yet.' }, 503);
  const u = await currentUser();
  if (!u) return json({ ok: false, error: 'Please sign in again.' }, 401);
  if (!(await rateLimit(`ws:${u.id}`, 240, 600))) return json({ ok: false, error: 'Too many saves. Please wait a moment.' }, 429);
  let body: { data?: unknown };
  try { body = (await readJson(req, MAX)) as typeof body; } catch { return json({ ok: false, error: 'Your workspace is too large to save.' }, 413); }
  const data = body.data;
  if (!data || typeof data !== 'object' || Array.isArray(data)) return json({ ok: false, error: 'Invalid data.' }, 400);
  const kind = u.role === 'therapist' ? 'therapist' : 'centre';
  const db = await requireDb();
  await db.insert(schema.providerWorkspaces).values({ userId: u.id, kind, data, updatedAt: new Date() })
    .onConflictDoUpdate({ target: schema.providerWorkspaces.userId, set: { data, kind, updatedAt: new Date() } });
  return json({ ok: true, savedAt: Date.now() });
}
