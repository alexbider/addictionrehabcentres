import { NextRequest } from 'next/server';
import path from 'node:path';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { count, eq } from 'drizzle-orm';
import { canEditCentre, currentUser } from '@/server/auth';
import { json, sameOrigin } from '@/server/request';
import { rateLimit } from '@/server/ratelimit';
import { requireDb, dbConfigured, schema } from '@/db';
import { audit } from '@/server/audit';
import { SLUG_RE } from '@/lib/slug';

const MAX_BYTES = 6 * 1024 * 1024;
const MAX_PHOTOS = 30;

/** Magic-byte sniffing: the declared content type is never trusted. */
function sniff(b: Buffer): 'jpeg' | 'png' | 'webp' | null {
  if (b.length > 12 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpeg';
  if (b.length > 8 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (b.length > 12 && b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP') return 'webp';
  return null;
}

/** Photo upload for a centre: JPEG/PNG/WebP up to 6 MB, re-encoded to WebP (max 1600 px, metadata stripped), stored on Supabase Storage
 *  (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY), else Vercel Blob (BLOB_READ_WRITE_TOKEN), else, in local development / tests only, under public/uploads. */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ ok: false, error: 'Request blocked.' }, 403);
  if (!dbConfigured()) return json({ ok: false, error: 'Uploads are not available yet.' }, 503);
  const u = await currentUser();
  if (!u || (u.role !== 'provider' && u.role !== 'master_admin')) return json({ ok: false, error: 'Please sign in.' }, 401);
  if (!u.verified && u.role !== 'master_admin') return json({ ok: false, error: 'Confirm your email address first.' }, 403);
  if (!(await rateLimit(`upload:${u.id}`, 40, 3600))) return json({ ok: false, error: 'Too many uploads. Try again later.' }, 429);
  let form: FormData;
  try { form = await req.formData(); } catch { return json({ ok: false, error: 'Invalid upload.' }, 400); }
  const slug = String(form.get('slug') || '');
  const file = form.get('file');
  if (!SLUG_RE.test(slug) || !(await canEditCentre(u, slug))) return json({ ok: false, error: 'You cannot edit this centre.' }, 403);
  if (!(file instanceof File)) return json({ ok: false, error: 'No file.' }, 400);
  if (file.size > MAX_BYTES) return json({ ok: false, error: 'The photo is larger than 6 MB.' }, 413);
  const raw = Buffer.from(await file.arrayBuffer());
  if (!sniff(raw)) return json({ ok: false, error: 'Only JPEG, PNG or WebP photos are accepted.' }, 415);
  const db = await requireDb();
  const [{ n }] = await db.select({ n: count() }).from(schema.media).where(eq(schema.media.centreSlug, slug));
  if (Number(n) >= MAX_PHOTOS) return json({ ok: false, error: `A centre can have up to ${MAX_PHOTOS} photos.` }, 400);

  let out: Buffer;
  try { out = await sharp(raw, { limitInputPixels: 50_000_000 }).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 78 }).toBuffer(); } catch { return json({ ok: false, error: 'That image could not be read.' }, 400); }
  const name = `${slug}/${crypto.randomBytes(8).toString('hex')}.webp`;
  let url: string;
  const sbUrl = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
  const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (sbUrl && sbKey) {
    // Supabase Storage (public bucket): REST upload with the service-role key, which never leaves the server.
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'centre-photos';
    const res = await fetch(`${sbUrl}/storage/v1/object/${bucket}/${name}`, { method: 'POST', headers: { authorization: `Bearer ${sbKey}`, apikey: sbKey, 'content-type': 'image/webp', 'x-upsert': 'false', 'cache-control': 'public, max-age=31536000, immutable' }, body: new Uint8Array(out), signal: AbortSignal.timeout(20000) });
    if (!res.ok) { console.error('[upload] supabase storage', res.status, (await res.text()).slice(0, 200)); return json({ ok: false, error: 'The photo could not be stored. Please try again.' }, 502); }
    url = `${sbUrl}/storage/v1/object/public/${bucket}/${name}`;
  } else if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import('@vercel/blob');
    url = (await put(`centres/${name}`, out, { access: 'public', contentType: 'image/webp', addRandomSuffix: false })).url;
  } else if (process.env.ARC_LOCAL_DB) {
    const dir = path.join(process.cwd(), 'public', 'uploads', slug);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(process.cwd(), 'public', 'uploads', name), out);
    url = `/uploads/${name}`;
  } else return json({ ok: false, error: 'Photo storage is not configured (set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY).' }, 503);
  const alt = String(form.get('alt') || '').slice(0, 200);
  await db.insert(schema.media).values({ ownerUserId: u.id, centreSlug: slug, url, pathname: name, contentType: 'image/webp', bytes: out.length, alt });
  await audit(u.id, 'media.uploaded', 'centre', slug, { url });
  return json({ ok: true, url, alt });
}
