/**
 * PLACEHOLDER plan configuration (one file). Plan names come from the approved Promote design; NO prices are defined here.
 * The client must confirm names, features and prices; the real price of each plan is the Stripe Price whose ID is set in
 * STRIPE_PRICE_<KEY> (e.g. STRIPE_PRICE_VERIFIED). Until STRIPE_SECRET_KEY and the price IDs exist, the plans page shows
 * "Coming soon" and the buy buttons are disabled; no purchase can be faked.
 */
export type Plan = { key: string; name: string; summary: string };
export const PLANS_CONFIRMED = false;
export const PLANS: Plan[] = [
  { key: 'verified', name: 'Verified', summary: 'Enhanced profile, provider dashboard, enquiries.' },
  { key: 'local', name: 'Local', summary: 'Everything in Verified plus a city sponsorship.' },
  { key: 'growth', name: 'Growth', summary: 'Province and multi-city placement.' },
  { key: 'premium', name: 'Premium', summary: 'Several cities and substances.' },
  { key: 'national', name: 'National', summary: 'Nationwide placement.' },
];

export const priceIdFor = (key: string) => process.env[`STRIPE_PRICE_${key.toUpperCase()}`] || '';
export const paymentsConfigured = () => !!process.env.STRIPE_SECRET_KEY;
export const planAvailable = (key: string) => paymentsConfigured() && !!priceIdFor(key);
