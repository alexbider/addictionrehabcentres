import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Root } from '@/views/Auth';
import { currentUser } from '@/server/auth';

// Sign-in page (not indexed, disallowed in robots.txt on the production host). Already signed in: straight to the dashboard.
export const metadata: Metadata = { title: 'Sign in', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }: { searchParams: Promise<{ denied?: string; next?: string }> }) {
  const q = await searchParams;
  const u = await currentUser();
  if (u && !q.denied) redirect(q.next && q.next.startsWith('/') && !q.next.startsWith('//') ? q.next : u.role === 'master_admin' ? '/admin/' : u.role === 'therapist' ? '/therapist-dashboard/' : '/provider-dashboard/');
  return <Root initialMode="login" />;
}
