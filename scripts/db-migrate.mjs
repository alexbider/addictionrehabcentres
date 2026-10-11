// Applies ./drizzle migrations to DATABASE_URL, then makes sure the master admin exists (ADMIN_EMAIL / ADMIN_PASSWORD).
// Usage: DATABASE_URL=... ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/db-migrate.mjs
import path from 'node:path';
import crypto from 'node:crypto';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

// Supabase: migrations should use the DIRECT connection (port 5432) or the session pooler; DIRECT_URL wins over DATABASE_URL here.
const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!url) { console.error('Set DIRECT_URL (or DATABASE_URL) to your Supabase Postgres connection string'); process.exit(1); }
const ssl = /supabase\.(co|com)/.test(url) && !/sslmode=/.test(url) ? 'require' : undefined;
const sql = postgres(url, { max: 1, prepare: false, ...(ssl ? { ssl } : {}) });
await migrate(drizzle(sql), { migrationsFolder: path.resolve('drizzle') });
console.log('migrations applied');

const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || '';
if (email && password) {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  const hash = `scrypt$16384$8$1$${salt.toString('base64')}$${key.toString('base64')}`;
  const rows = await sql`select id from users where email = ${email}`;
  if (rows.length) { await sql`update users set role = 'master_admin', email_verified_at = coalesce(email_verified_at, now()), disabled_at = null where email = ${email}`; console.log('existing user is now master_admin:', email); }
  else { await sql`insert into users (email, password_hash, name, role, email_verified_at) values (${email}, ${hash}, 'Administrator', 'master_admin', now())`; console.log('master admin created:', email); }
} else console.log('ADMIN_EMAIL / ADMIN_PASSWORD not set: no admin created');
await sql.end();
