import { NextRequest } from 'next/server';
import { and, eq, gt, isNull } from 'drizzle-orm';
import { getDb, schema } from '@/db';
import { sha256 } from '@/server/crypto';
import { json } from '@/server/request';
import { rateLimit } from '@/server/ratelimit';

/** Pre-fills the onboarding / claim page for someone an admin invited (the token is the secret). */
export async function GET(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const db = await getDb();
  if (!db || token.length < 20) return json({ ok: false }, 404);
  if (!(await rateLimit(`invite:${(req.headers.get('x-forwarded-for') || 'x').split(',')[0]}`, 30, 600))) return json({ ok: false }, 429);
  const [i] = await db.select().from(schema.invites).where(and(eq(schema.invites.tokenHash, sha256(token)), isNull(schema.invites.usedAt), gt(schema.invites.expiresAt, new Date()))).limit(1);
  if (!i) return json({ ok: false }, 404);
  return json({ ok: true, kind: i.kind, email: i.email, name: (i.prefill as { name?: string }).name ?? '', centreSlug: i.centreSlug });
}
