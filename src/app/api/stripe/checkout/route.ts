import { NextRequest } from 'next/server';
import { canEditCentre, currentUser } from '@/server/auth';
import { isJson, json, readJson, sameOrigin } from '@/server/request';
import { stripe } from '@/server/stripe';
import { PLANS, planAvailable, priceIdFor } from '@/config/plans';
import { siteOrigin } from '@/server/site';

/** Starts a Stripe Checkout subscription. Without STRIPE_SECRET_KEY and the plan's price ID it refuses; nothing is ever simulated. */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req) || !isJson(req)) return json({ ok: false, error: 'Request blocked.' }, 403);
  const s = stripe();
  let body: { plan?: string; centreSlug?: string } = {};
  try { body = (await readJson(req, 4096)) as typeof body; } catch { return json({ ok: false, error: 'Invalid request.' }, 400); }
  const plan = PLANS.find((p) => p.key === body.plan);
  if (!s || !plan || !planAvailable(plan.key)) return json({ ok: false, error: 'Plans are not open for purchase yet.' }, 503);
  const u = await currentUser();
  if (!u || (u.role !== 'provider' && u.role !== 'master_admin')) return json({ ok: false, error: 'Please sign in to choose a plan.' }, 401);
  if (!u.verified && u.role !== 'master_admin') return json({ ok: false, error: 'Confirm your email address first.' }, 403);
  const slug = String(body.centreSlug || '');
  if (!slug || !(await canEditCentre(u, slug))) return json({ ok: false, error: 'Choose one of your centres.' }, 403);
  const origin = siteOrigin(req);
  const session = await s.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceIdFor(plan.key), quantity: 1 }],
    customer_email: u.email,
    client_reference_id: u.id,
    metadata: { userId: u.id, centreSlug: slug, plan: plan.key },
    subscription_data: { metadata: { userId: u.id, centreSlug: slug, plan: plan.key } },
    success_url: `${origin}/provider-dashboard/billing/?success=1`,
    cancel_url: `${origin}/provider-dashboard/billing/?canceled=1`,
  });
  return json({ ok: true, url: session.url });
}
