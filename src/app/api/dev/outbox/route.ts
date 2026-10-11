import { NextRequest } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { getDb, schema } from '@/db';

/** Local development / e2e tests only: reads the e-mails the app "sent" while no mail provider is configured. Disabled unless ENABLE_DEV_OUTBOX=1 and the embedded database is in use. */
export async function GET(req: NextRequest) {
  if (process.env.ENABLE_DEV_OUTBOX !== '1' || !process.env.ARC_LOCAL_DB || process.env.RESEND_API_KEY) return new Response('Not found', { status: 404 });
  const to = (req.nextUrl.searchParams.get('to') || '').toLowerCase();
  const db = await getDb();
  if (!db || !to) return Response.json([]);
  const rows = await db.select().from(schema.outbox).where(eq(schema.outbox.toEmail, to)).orderBy(desc(schema.outbox.createdAt)).limit(10);
  return Response.json(rows);
}
