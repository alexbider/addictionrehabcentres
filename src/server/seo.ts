import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/db';

export type PageSeo = { title: string | null; description: string | null; noindex: boolean };

/** Admin overrides for one path (null without a database or an override). Read at build / ISR time. */
export async function getPageSeo(path: string): Promise<PageSeo | null> {
  try {
    const db = await getDb();
    if (!db) return null;
    const [r] = await db.select().from(schema.pageSeo).where(eq(schema.pageSeo.path, path)).limit(1);
    return r ? { title: r.title, description: r.description, noindex: r.noindex } : null;
  } catch { return null; }
}

export async function noindexPaths(): Promise<Set<string>> {
  try {
    const db = await getDb();
    if (!db) return new Set();
    const rows = await db.select({ p: schema.pageSeo.path }).from(schema.pageSeo).where(eq(schema.pageSeo.noindex, true));
    return new Set(rows.map((r) => r.p));
  } catch { return new Set(); }
}
