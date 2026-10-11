import { desc } from 'drizzle-orm';
import { requireDb, schema } from '@/db';
import { currentUser } from '@/server/auth';

const q = (v: unknown) => { let s = v == null ? '' : String(v); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; }; // quotes cells and defuses spreadsheet formulas

/** CSV export of every lead (master admin only). */
export async function GET() {
  const u = await currentUser();
  if (!u || u.role !== 'master_admin') return new Response('Forbidden', { status: 403 });
  const db = await requireDb();
  const rows = await db.select().from(schema.leads).orderBy(desc(schema.leads.createdAt));
  const head = ['received', 'type', 'centre', 'name', 'email', 'phone', 'message', 'source_path', 'status'];
  const csv = [head.join(','), ...rows.map((l) => [l.createdAt.toISOString(), l.type, l.centreSlug, l.name, l.email, l.phone, l.message, l.sourcePath, l.status].map(q).join(','))].join('\r\n');
  return new Response(csv, { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`, 'cache-control': 'no-store' } });
}
