import { sql } from 'drizzle-orm';
import { requireDb, schema } from '@/db';

/** Fixed-window counter in the database (works across serverless instances). Returns false when the limit is exceeded. */
export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  const db = await requireDb();
  const rows = await db.execute(sql`
    insert into ${schema.rateLimits} (key, count, window_start) values (${key}, 1, now())
    on conflict (key) do update set
      count = case when ${schema.rateLimits.windowStart} < now() - (${windowSeconds} * interval '1 second') then 1 else ${schema.rateLimits.count} + 1 end,
      window_start = case when ${schema.rateLimits.windowStart} < now() - (${windowSeconds} * interval '1 second') then now() else ${schema.rateLimits.windowStart} end
    returning count`);
  const list = (Array.isArray(rows) ? rows : (rows as { rows?: unknown[] }).rows ?? []) as { count: number }[];
  return Number(list[0]?.count ?? 1) <= limit;
}
