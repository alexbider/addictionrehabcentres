import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { dbConfigured, requireDb, schema } from '@/db';
import { currentUser } from '@/server/auth';
import { isJson, json, readJson, sameOrigin } from '@/server/request';
import { therapistProfileSchema } from '@/server/schemas';
import { audit } from '@/server/audit';
import { rateLimit } from '@/server/ratelimit';

/** A therapist saves or removes their own profile. Their text is theirs: it is published as written (an admin can still unpublish). */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req) || !isJson(req)) return json({ ok: false, error: 'Request blocked.' }, 403);
  if (!dbConfigured()) return json({ ok: false, error: 'Not available yet.' }, 503);
  const u = await currentUser();
  if (!u || u.role !== 'therapist') return json({ ok: false, error: 'Please sign in with your therapist account.' }, 401);
  if (!u.verified) return json({ ok: false, error: 'Confirm your email address first.' }, 403);
  if (!(await rateLimit(`therapist:${u.id}`, 30, 600))) return json({ ok: false, error: 'Too many saves. Please wait a few minutes.' }, 429);
  let body: { action?: string; profile?: unknown };
  try { body = (await readJson(req, 128 * 1024)) as typeof body; } catch { return json({ ok: false, error: 'Invalid request.' }, 400); }
  const db = await requireDb();
  const [t] = await db.select().from(schema.therapists).where(eq(schema.therapists.userId, u.id)).limit(1);
  if (!t) return json({ ok: false, error: 'No profile is linked to your account yet.' }, 404);

  if (body.action === 'remove') {
    await db.update(schema.therapists).set({ status: 'removed' }).where(eq(schema.therapists.id, t.id));
    await audit(u.id, 'therapist.removed_by_owner', 'therapist', t.id);
    revalidatePath('/therapists'); revalidatePath(`/therapists/${t.slug}`); revalidatePath('/sitemap.xml');
    return json({ ok: true });
  }
  const parsed = therapistProfileSchema.safeParse(body.profile);
  if (!parsed.success) return json({ ok: false, error: 'Please check the highlighted fields.', fields: Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0] ?? 'form'), i.message])) }, 400);
  const [cur] = await db.select().from(schema.therapistProfiles).where(eq(schema.therapistProfiles.therapistId, t.id)).limit(1);
  const merged = { ...(cur?.data as Record<string, unknown> | undefined), ...Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== '' && v !== undefined && !(Array.isArray(v) && !v.length))) };
  // a cleared optional field must disappear
  for (const [k, v] of Object.entries(parsed.data)) if (v === '' || (Array.isArray(v) && !v.length)) delete merged[k];
  await db.insert(schema.therapistProfiles).values({ therapistId: t.id, data: merged, descriptionStatus: 'owner' }).onConflictDoUpdate({ target: schema.therapistProfiles.therapistId, set: { data: merged, descriptionStatus: 'owner', updatedAt: new Date() } });
  await audit(u.id, 'therapist.profile_saved', 'therapist', t.id);
  revalidatePath('/therapists'); revalidatePath(`/therapists/${t.slug}`);
  return json({ ok: true, status: t.status });
}
