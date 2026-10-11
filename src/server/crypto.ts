import crypto from 'node:crypto';

const N = 16384, R = 8, P = 1;

/** scrypt hash in the form scrypt$N$r$p$salt$key (all parameters stored, so they can be raised later). */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  const key = await new Promise<Buffer>((res, rej) => crypto.scrypt(password, salt, 64, { N, r: R, p: P, maxmem: 64 * 1024 * 1024 }, (e, k) => (e ? rej(e) : res(k))));
  return `scrypt$${N}$${R}$${P}$${salt.toString('base64')}$${key.toString('base64')}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [alg, n, r, p, salt, key] = stored.split('$');
  if (alg !== 'scrypt' || !salt || !key) return false;
  const expected = Buffer.from(key, 'base64');
  const got = await new Promise<Buffer>((res, rej) => crypto.scrypt(password, Buffer.from(salt, 'base64'), expected.length, { N: Number(n), r: Number(r), p: Number(p), maxmem: 64 * 1024 * 1024 }, (e, k) => (e ? rej(e) : res(k))));
  return got.length === expected.length && crypto.timingSafeEqual(got, expected);
}

export const randomToken = () => crypto.randomBytes(32).toString('base64url');
export const sha256 = (s: string) => crypto.createHash('sha256').update(s).digest('hex');
// Only used to hash IP addresses stored with leads. AUTH_SECRET should be set in production; without it a value derived from DATABASE_URL is used.
const secret = () => process.env.AUTH_SECRET || (process.env.DATABASE_URL ? sha256(process.env.DATABASE_URL) : 'local-development-only');
export const hmac = (s: string) => crypto.createHmac('sha256', secret()).update(s).digest('hex');
