import { NextRequest } from 'next/server';
import { desc, eq, isNotNull, and } from 'drizzle-orm';
import { requireDb, schema } from '@/db';
import { currentUser } from '@/server/auth';
import { json, sameOrigin } from '@/server/request';
import { stripe } from '@/server/stripe';
import { siteOrigin } from '@/server/site';

/** Stripe customer portal (manage / cancel). */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ ok: false, error: 'Request blocked.' }, 403);
  const s = stripe();
  if (!s) return json({ ok: false, error: 'Billing is not open yet.' }, 503);
  const u = await currentUser();
  if (!u) return json({ ok: false, error: 'Please sign in.' }, 401);
  const db = await requireDb();
  const [sub] = await db.select().from(schema.subscriptions).where(and(eq(schema.subscriptions.userId, u.id), isNotNull(schema.subscriptions.stripeCustomerId))).orderBy(desc(schema.subscriptions.createdAt)).limit(1);
  if (!sub?.stripeCustomerId) return json({ ok: false, error: 'You have no subscription to manage.' }, 404);
  const session = await s.billingPortal.sessions.create({ customer: sub.stripeCustomerId, return_url: `${siteOrigin(req)}/provider-dashboard/billing/` });
  return json({ ok: true, url: session.url });
}
