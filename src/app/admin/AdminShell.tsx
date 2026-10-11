import type { ReactNode } from 'react';
import { dbConfigured } from '@/db';
import { requireAdmin } from '@/server/auth';
import { Notice, Shell } from '@/components/backend/ui';
import SignOut from '@/components/backend/SignOut';

const LINKS: [string, string][] = [['', 'Overview'], ['claims', 'Claims'], ['revisions', 'Moderation queue'], ['centres', 'Centres'], ['onboarding', 'Onboarding'], ['therapists', 'Therapists'], ['invites', 'Invites'], ['leads', 'Leads'], ['users', 'Users'], ['subscriptions', 'Subscriptions'], ['imports', 'Imports'], ['seo', 'SEO'], ['audit', 'Audit log'], ['settings', 'Settings']];

/** Every admin page starts here: master admin only (redirects to the sign-in page otherwise). */
export default async function AdminShell({ current, title, children }: { current: string; title: string; children: (u: { id: string; email: string }) => Promise<ReactNode> | ReactNode }) {
  if (!dbConfigured()) return <Shell title="Admin"><Notice kind="error">The admin needs the database (DATABASE_URL).</Notice></Shell>;
  const u = await requireAdmin(`/admin/${current ? current + '/' : ''}`);
  const body = await children(u);
  return (
    <Shell title={title} subtitle={`Master admin · ${u.email}`} nav={LINKS.map(([k, label]) => ({ href: `/admin/${k ? k + '/' : ''}`, label, current: k === current }))}>
      {body}
      <div style={{ marginTop: 26 }}><SignOut /></div>
    </Shell>
  );
}
