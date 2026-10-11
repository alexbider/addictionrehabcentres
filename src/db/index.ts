import path from 'node:path';
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
import * as schema from './schema';

export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;
export { schema };

/**
 * One database handle for the whole backend.
 *  - DATABASE_URL  → Postgres (Neon / Supabase via the Vercel Marketplace), through postgres.js with a small pool.
 *  - ARC_LOCAL_DB  → an embedded Postgres (PGlite, a directory path) for local development and the e2e tests; migrated on start.
 *  - neither       → getDb() returns null and every backend feature switches off: the public site (static pages) works without a database.
 * Migrations are SQL files in ./drizzle (npm run db:generate / db:migrate).
 */
const g = globalThis as unknown as { __arcDb?: Promise<Db | null> };

export const dbConfigured = () => !!(process.env.DATABASE_URL || process.env.ARC_LOCAL_DB);

async function open(): Promise<Db | null> {
  const url = process.env.DATABASE_URL;
  if (url) {
    const [{ drizzle }, { default: postgres }] = await Promise.all([import('drizzle-orm/postgres-js'), import('postgres')]);
    // Supabase: use the pooled (transaction-mode, port 6543) connection string; prepared statements are off for that reason; TLS is required.
    const ssl = /supabase\.(co|com)/.test(url) && !/sslmode=/.test(url) ? 'require' : undefined;
    const client = postgres(url, { max: 5, idle_timeout: 20, connect_timeout: 10, prepare: false, ...(ssl ? { ssl } : {}) });
    return drizzle(client, { schema }) as unknown as Db;
  }
  const dir = process.env.ARC_LOCAL_DB;
  if (dir) {
    // Loaded by variable name so the bundler never includes the embedded database in a production build (it is a dev dependency).
    const pg = '@electric-sql/pglite';
    const dz = 'drizzle-orm/pglite';
    const mg = 'drizzle-orm/pglite/migrator';
    const { PGlite } = await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ pg);
    const { drizzle } = await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ dz);
    const { migrate } = await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ mg);
    const client = new PGlite(path.resolve(dir));
    const db = drizzle(client, { schema });
    await migrate(db, { migrationsFolder: path.resolve(process.cwd(), 'drizzle') });
    await seedLocalAdmin(db as unknown as Db);
    return db as unknown as Db;
  }
  return null;
}

export function getDb(): Promise<Db | null> {
  return (g.__arcDb ??= open().catch((e) => { console.error('[db] could not open the database:', e instanceof Error ? e.message : e); g.__arcDb = undefined; return null; }));
}

/** Like getDb() but for code that cannot work without it (dashboard, admin, form handlers). */
export async function requireDb(): Promise<Db> {
  const db = await getDb();
  if (!db) throw new Error('DATABASE_NOT_CONFIGURED');
  return db;
}

/** Local development / e2e only: creates the master admin from ARC_SEED_ADMIN_EMAIL / ARC_SEED_ADMIN_PASSWORD when the embedded database is empty. */
async function seedLocalAdmin(db: Db) {
  const email = (process.env.ARC_SEED_ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ARC_SEED_ADMIN_PASSWORD || '';
  if (!email || !password) return;
  const { eq } = await import('drizzle-orm');
  const [u] = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, email)).limit(1);
  if (u) return;
  const { hashPassword } = await import('@/server/crypto');
  await db.insert(schema.users).values({ email, name: 'Administrator', role: 'master_admin', passwordHash: await hashPassword(password), emailVerifiedAt: new Date() });
}
