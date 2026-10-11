import { desc, eq, inArray, or } from 'drizzle-orm';
import { requireDb, schema } from '@/db';
import { getPageByRoute } from '@/lib/content';
import { slugToRoute } from '@/lib/slug';

export const staticCentre = (slug: string) => { const p = getPageByRoute(slugToRoute(slug)); return p?.centre ? p : null; };
export const centreTitle = (slug: string) => staticCentre(slug)?.centre?.name ?? slug;

export async function myCentres(userId: string) {
  const db = await requireDb();
  return db.select({ slug: schema.centres.slug, name: schema.centres.name }).from(schema.centreMembers).innerJoin(schema.centres, eq(schema.centres.slug, schema.centreMembers.centreSlug)).where(eq(schema.centreMembers.userId, userId));
}

export async function myClaims(userId: string, email: string) {
  const db = await requireDb();
  return db.select().from(schema.claims).where(or(eq(schema.claims.userId, userId), eq(schema.claims.email, email))).orderBy(desc(schema.claims.createdAt)).limit(50);
}

export async function leadsFor(slugs: string[]) {
  if (!slugs.length) return [];
  const db = await requireDb();
  return db.select().from(schema.leads).where(inArray(schema.leads.centreSlug, slugs)).orderBy(desc(schema.leads.createdAt)).limit(200);
}

export async function mySubscriptions(userId: string) {
  const db = await requireDb();
  return db.select().from(schema.subscriptions).where(eq(schema.subscriptions.userId, userId)).orderBy(desc(schema.subscriptions.createdAt));
}
