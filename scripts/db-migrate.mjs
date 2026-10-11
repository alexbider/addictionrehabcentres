// Applies ./drizzle migrations to DATABASE_URL, then makes sure the master admin exists (ADMIN_EMAIL / ADMIN_PASSWORD).
// Usage: DATABASE_URL=... ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/db-migrate.mjs
import path from 'node:path';
import crypto from 'node:crypto';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

const url = process.env.DATABASE_URL;
if (!url) { console.error('DATABASE_URL is not set'); process.exit(1); }
const sql = postgres(url, { max: 1, prepare: false });
await migrate(drizzle(sql), { migrationsFolder: path.resolve('drizzle') });
console.log('migrations applied');

const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || '';
if (email && password) {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  const hash = `scrypt$16384$8$1$${salt.toString('base64')}$${key.toString('base64')}`;
  const rows = await sql`select id from users where email = ${email}`;
  if (rows.length) console.log('master admin already exists');
  else { await sql`insert into users (email, password_hash, name, role, email_verified_at) values (${email}, ${hash}, 'Administrator', 'master_admin', now())`; console.log('master admin created:', email); }
} else console.log('ADMIN_EMAIL / ADMIN_PASSWORD not set: no admin created');
await sql.end();
