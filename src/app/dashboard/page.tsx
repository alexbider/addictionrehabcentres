import { redirect } from 'next/navigation';
import { currentUser } from '@/server/auth';
export const dynamic = 'force-dynamic';
/** One address for "my dashboard": centres, therapists and admins each land on their own. */
export default async function Page() {
  const u = await currentUser();
  if (!u) redirect('/login/?next=/dashboard/');
  redirect(u.role === 'master_admin' ? '/admin/' : u.role === 'therapist' ? '/therapist-dashboard/' : '/provider-dashboard/');
}
