import { redirect } from 'next/navigation';
export const dynamic = 'force-dynamic';
/** Stripe returns here (?success=1 / ?canceled=1); the dashboard's Billing screen shows the result. */
export default async function Page({ searchParams }: { searchParams: Promise<{ success?: string; canceled?: string }> }) {
  const q = await searchParams;
  redirect('/provider-dashboard/?view=billing' + (q.success ? '&success=1' : '') + (q.canceled ? '&canceled=1' : ''));
}
