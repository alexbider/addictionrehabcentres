import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { requireDb, schema } from '@/db';
import AdminShell from '../../AdminShell';
import ProfileEditor from '@/app/provider-dashboard/ProfileEditor';
import { getApprovedProfile, getModerationMode } from '@/server/profile';
import { centreTitle, staticCentre } from '@/server/dashboard';
import type { CentreProfile } from '@/server/schemas';
import { slugToRoute, SLUG_RE } from '@/lib/slug';

export const metadata: Metadata = { title: 'Edit centre · Admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!SLUG_RE.test(slug)) notFound();
  return (
    <AdminShell current="centres" title={centreTitle(slug)}>
      {async () => {
        const st = staticCentre(slug)?.centre;
        const db = await requireDb();
        const [reg] = await db.select().from(schema.centres).where(eq(schema.centres.slug, slug)).limit(1);
        if (!st && !reg) notFound();
        if (!reg) await db.insert(schema.centres).values({ slug, name: st!.name, source: 'static', status: 'published' }).onConflictDoNothing();
        const approved = await getApprovedProfile(slug);
        return (
          <>
            <p style={{ marginTop: -8 }}><a href={slugToRoute(slug)}>View the public page</a> · <a href="/admin/centres/">Back</a> · As an administrator your edits go live at once.</p>
            <ProfileEditor slug={slug} initial={(approved?.data ?? {}) as CentreProfile} moderation={await getModerationMode()} placeholders={{ phone: st?.phone_text, email: st?.email, website: st?.website, description: 'The current text of the page is shown until you replace it.' }} />
          </>
        );
      }}
    </AdminShell>
  );
}
