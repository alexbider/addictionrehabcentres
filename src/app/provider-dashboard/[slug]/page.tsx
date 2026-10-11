import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';
import { dbConfigured, requireDb, schema } from '@/db';
import { canEditCentre, requireRole } from '@/server/auth';
import { centreTitle, staticCentre } from '@/server/dashboard';
import { getApprovedProfile, getModerationMode } from '@/server/profile';
import { Notice, Shell, fmtDate } from '@/components/backend/ui';
import ProfileEditor from '../ProfileEditor';
import { NAV } from '../page';
import { slugToRoute, SLUG_RE } from '@/lib/slug';

export const metadata: Metadata = { title: 'Edit your page', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!dbConfigured() || !SLUG_RE.test(slug)) notFound();
  const u = await requireRole(['provider'], `/provider-dashboard/${slug}/`);
  if (!(await canEditCentre(u, slug))) notFound();
  const db = await requireDb();
  const [approved, [pending], mode] = await Promise.all([
    getApprovedProfile(slug),
    db.select().from(schema.centreProfileRevisions).where(eq(schema.centreProfileRevisions.centreSlug, slug)).orderBy(desc(schema.centreProfileRevisions.submittedAt)).limit(1),
    getModerationMode(),
  ]);
  const st = staticCentre(slug)?.centre;
  const waiting = pending && pending.status === 'pending';
  const initial = (waiting ? pending.data : approved?.data ?? {}) as import('@/server/schemas').CentreProfile;
  return (
    <Shell title={centreTitle(slug)} subtitle="Edit your public page" nav={NAV('edit')}>
      <p style={{ marginTop: -10, marginBottom: 18 }}><a href={slugToRoute(slug)}>View the public page</a> · <a href="/provider-dashboard/">Back to the dashboard</a></p>
      {!u.verified ? <Notice kind="error">Confirm your email address to save changes. We sent a link to {u.email}.</Notice> : null}
      {waiting ? <Notice kind="info">Your last changes ({fmtDate(pending.submittedAt)}) are waiting for review. The page below shows them.</Notice> : null}
      {pending?.status === 'rejected' ? <Notice kind="error">Your last changes were not approved{pending.reviewNote ? `: ${pending.reviewNote}` : '.'}</Notice> : null}
      <ProfileEditor slug={slug} initial={initial} moderation={mode} placeholders={{ phone: st?.phone_text, email: st?.email, website: st?.website, description: 'The current text of your page is shown until you replace it.' }} />
    </Shell>
  );
}
