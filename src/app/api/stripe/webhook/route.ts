import { NextRequest } from 'next/server';
import type Stripe from 'stripe';
import { requireDb, schema } from '@/db';
import { stripe } from '@/server/stripe';
import { audit } from '@/server/audit';

/** Subscription state comes from Stripe only (signature verified with STRIPE_WEBHOOK_SECRET). */
export async function POST(req: NextRequest) {
  const s = stripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!s || !secret) return new Response('Not configured', { status: 503 });
  const sig = req.headers.get('stripe-signature');
  const raw = await req.text();
  let event: Stripe.Event;
  try { event = s.webhooks.constructEvent(raw, sig ?? '', secret); } catch { return new Response('Bad signature', { status: 400 }); }
  const db = await requireDb();

  const save = async (sub: Stripe.Subscription) => {
    const md = sub.metadata ?? {};
    const userId = md.userId;
    if (!userId) return;
    const item = sub.items?.data?.[0];
    const end = (item as unknown as { current_period_end?: number } | undefined)?.current_period_end ?? (sub as unknown as { current_period_end?: number }).current_period_end;
    const values = { userId, centreSlug: md.centreSlug || null, planKey: md.plan || 'unknown', status: sub.status, stripeCustomerId: typeof sub.customer === 'string' ? sub.customer : sub.customer.id, stripeSubscriptionId: sub.id, currentPeriodEnd: end ? new Date(end * 1000) : null, updatedAt: new Date() };
    await db.insert(schema.subscriptions).values(values).onConflictDoUpdate({ target: schema.subscriptions.stripeSubscriptionId, set: values });
    await audit(userId, 'subscription.' + event.type, 'subscription', sub.id, { status: sub.status });
  };

  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') await save(event.data.object as Stripe.Subscription);
  if (event.type === 'checkout.session.completed') {
    const cs = event.data.object as Stripe.Checkout.Session;
    if (cs.mode === 'subscription' && typeof cs.subscription === 'string') await save(await s.subscriptions.retrieve(cs.subscription));
  }
  return new Response('ok');
}
