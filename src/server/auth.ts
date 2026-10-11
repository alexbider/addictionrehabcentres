import { cache } from 'react';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { and, eq, gt, isNull } from 'drizzle-orm';
import { getDb, requireDb, schema } from '@/db';
import { randomToken, sha256 } from './crypto';

export const SESSION_COOKIE = 'arc_session';
const SESSION_DAYS = 14;

export type Role = 'master_admin' | 'provider' | 'therapist';
export type SessionUser = { id: string; email: string; name: string; role: Role; verified: boolean };

export async function createSession(userId: string): Promise<void> {
  const db = await requireDb();
  const h = await headers();
  const token = randomToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 864e5);
  await db.insert(schema.sessions).values({ tokenHash: sha256(token), userId, expiresAt, ip: (h.get('x-forwarded-for') || '').split(',')[0].trim() || null, userAgent: (h.get('user-agent') || '').slice(0, 200) || null });
  (await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' && !process.env.ARC_LOCAL_DB, sameSite: 'lax', path: '/', expires: expiresAt });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) { const db = await getDb(); if (db) await db.delete(schema.sessions).where(eq(schema.sessions.tokenHash, sha256(token))); }
  jar.delete(SESSION_COOKIE);
}

/** The signed-in user for this request (null when signed out, disabled, expired, or the backend is not configured). */
export const currentUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const db = await getDb();
  if (!db) return null;
  const [row] = await db
    .select({ id: schema.users.id, email: schema.users.email, name: schema.users.name, role: schema.users.role, verifiedAt: schema.users.emailVerifiedAt })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.users.id, schema.sessions.userId))
    .where(and(eq(schema.sessions.tokenHash, sha256(token)), gt(schema.sessions.expiresAt, new Date()), isNull(schema.users.disabledAt)))
    .limit(1);
  return row ? { id: row.id, email: row.email, name: row.name, role: row.role, verified: !!row.verifiedAt } : null;
});

/** Server components / actions: redirect to the sign-in page unless the user has one of the roles. Master admins pass every role check. */
export async function requireRole(roles: Role[], next = '/'): Promise<SessionUser> {
  const u = await currentUser();
  if (!u) redirect('/login/?next=' + encodeURIComponent(next));
  if (u.role !== 'master_admin' && !roles.includes(u.role)) redirect('/login/?denied=1');
  return u;
}

export async function requireAdmin(next = '/admin/'): Promise<SessionUser> {
  const u = await currentUser();
  if (!u) redirect('/login/?next=' + encodeURIComponent(next));
  if (u.role !== 'master_admin') redirect('/login/?denied=1');
  return u;
}

/** May this user edit this centre? (admins always; providers only for centres they own) */
export async function canEditCentre(u: SessionUser, slug: string): Promise<boolean> {
  if (u.role === 'master_admin') return true;
  const db = await requireDb();
  const [m] = await db.select({ slug: schema.centreMembers.centreSlug }).from(schema.centreMembers).where(and(eq(schema.centreMembers.userId, u.id), eq(schema.centreMembers.centreSlug, slug))).limit(1);
  return !!m;
}

export const normEmail = (e: string) => e.trim().toLowerCase();

/** Gives a verified user the centres whose claims an admin already approved for their email address. Called after sign-in and after e-mail confirmation. */
export async function syncMemberships(userId: string, email: string): Promise<void> {
  const db = await requireDb();
  const claims = await db.select().from(schema.claims).where(and(eq(schema.claims.email, email), eq(schema.claims.status, 'approved')));
  for (const c of claims) {
    await db.insert(schema.centreMembers).values({ userId, centreSlug: c.centreSlug, role: 'owner' }).onConflictDoNothing();
    if (!c.userId) await db.update(schema.claims).set({ userId }).where(eq(schema.claims.id, c.id));
  }
}
