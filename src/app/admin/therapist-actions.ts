'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { requireDb, schema } from '@/db';
import { currentUser } from '@/server/auth';
import { audit } from '@/server/audit';

export async function setTherapistStatus(fd: FormData) {
  const u = await currentUser();
  if (!u || u.role !== 'master_admin') redirect('/login/?denied=1');
  const id = z.string().uuid().parse(fd.get('id'));
  const status = z.enum(['published', 'draft', 'removed']).parse(fd.get('status'));
  const db = await requireDb();
  if (status === 'published') {
    const [p] = await db.select().from(schema.therapistProfiles).where(eq(schema.therapistProfiles.therapistId, id)).limit(1);
    if (!p || p.descriptionStatus === 'needs_review') return; // never publish text nobody has approved
  }
  const [row] = await db.update(schema.therapists).set({ status }).where(eq(schema.therapists.id, id)).returning({ slug: schema.therapists.slug });
  if (row) revalidatePath(`/therapists/${row.slug}`);
  await audit(u.id, 'therapist.status', 'therapist', id, { status });
  revalidatePath('/admin/therapists/');
  revalidatePath('/therapists');
  revalidatePath('/sitemap.xml');
}
