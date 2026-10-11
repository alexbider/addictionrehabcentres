'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { requireDb, schema } from '@/db';
import { currentUser, normEmail, syncMemberships } from '@/server/auth';
import { applyRevision, rejectRevision, setModerationMode } from '@/server/profile';
import { audit } from '@/server/audit';
import { sendEmail } from '@/server/email';
import { getPageByRoute } from '@/lib/content';
import { slugToRoute } from '@/lib/slug';
import { randomToken, sha256 } from '@/server/crypto';
import { siteOrigin } from '@/server/site';
import { headers } from 'next/headers';

/** Every action starts here: only a signed-in master admin may run it. */
async function admin() {
  const u = await currentUser();
  if (!u || u.role !== 'master_admin') redirect('/login/?denied=1');
  return u;
}
const uuid = z.string().uuid();
const note = (fd: FormData) => String(fd.get('note') || '').slice(0, 500);

export async function approveClaim(fd: FormData) {
  const a = await admin();
  const id = uuid.parse(fd.get('id'));
  const db = await requireDb();
  const [c] = await db.select().from(schema.claims).where(eq(schema.claims.id, id)).limit(1);
  if (!c || c.status !== 'pending') return;
  const page = getPageByRoute(slugToRoute(c.centreSlug));
  await db.insert(schema.centres).values({ slug: c.centreSlug, name: page?.centre?.name ?? c.centreSlug, source: 'static', status: 'published' }).onConflictDoNothing();
  await db.update(schema.claims).set({ status: 'approved', reviewedBy: a.id, reviewedAt: new Date(), reviewNote: note(fd) || null }).where(eq(schema.claims.id, id));
  const [u] = await db.select().from(schema.users).where(eq(schema.users.email, normEmail(c.email))).limit(1);
  if (u?.emailVerifiedAt) await syncMemberships(u.id, u.email);
  await audit(a.id, 'claim.approved', 'claim', id, { centre: c.centreSlug });
  await sendEmail(c.email, 'Your claim was approved', u ? `Your claim for ${page?.centre?.name ?? c.centreSlug} was approved. Sign in to edit the page:\n${siteOrigin(await headers())}/login/` : `Your claim for ${page?.centre?.name ?? c.centreSlug} was approved. Create your account with this email address to edit the page:\n${siteOrigin(await headers())}/signup/`);
  revalidatePath('/admin/claims/');
}

export async function rejectClaim(fd: FormData) {
  const a = await admin();
  const id = uuid.parse(fd.get('id'));
  const db = await requireDb();
  const [c] = await db.select().from(schema.claims).where(eq(schema.claims.id, id)).limit(1);
  if (!c || c.status !== 'pending') return;
  await db.update(schema.claims).set({ status: 'rejected', reviewedBy: a.id, reviewedAt: new Date(), reviewNote: note(fd) || null }).where(eq(schema.claims.id, id));
  await audit(a.id, 'claim.rejected', 'claim', id, { centre: c.centreSlug });
  await sendEmail(c.email, 'About your claim', `We could not verify your claim for ${c.centreSlug}.${note(fd) ? '\n\n' + note(fd) : ''}\nReply to this message or call 1-855-885-4747 if you think this is a mistake.`);
  revalidatePath('/admin/claims/');
}

export async function approveRevision(fd: FormData) { const a = await admin(); await applyRevision(uuid.parse(fd.get('id')), a.id, note(fd)); revalidatePath('/admin/revisions/'); }
export async function rejectRevisionAction(fd: FormData) { const a = await admin(); await rejectRevision(uuid.parse(fd.get('id')), a.id, note(fd)); revalidatePath('/admin/revisions/'); }

export async function setModeration(fd: FormData) {
  const a = await admin();
  await setModerationMode(fd.get('mode') === 'instant' ? 'instant' : 'review', a.id);
  revalidatePath('/admin/settings/');
}

export async function markLead(fd: FormData) {
  const a = await admin();
  const db = await requireDb();
  await db.update(schema.leads).set({ status: fd.get('status') === 'new' ? 'new' : 'handled' }).where(eq(schema.leads.id, uuid.parse(fd.get('id'))));
  await audit(a.id, 'lead.status', 'lead', String(fd.get('id')));
  revalidatePath('/admin/leads/');
}

export async function setUserRole(fd: FormData) {
  const a = await admin();
  const id = uuid.parse(fd.get('id'));
  const role = z.enum(['master_admin', 'provider', 'therapist']).parse(fd.get('role'));
  if (id === a.id) return; // never demote yourself by accident
  const db = await requireDb();
  await db.update(schema.users).set({ role }).where(eq(schema.users.id, id));
  await audit(a.id, 'user.role', 'user', id, { role });
  revalidatePath('/admin/users/');
}

export async function toggleUser(fd: FormData) {
  const a = await admin();
  const id = uuid.parse(fd.get('id'));
  if (id === a.id) return;
  const db = await requireDb();
  const disable = fd.get('disable') === '1';
  await db.update(schema.users).set({ disabledAt: disable ? new Date() : null }).where(eq(schema.users.id, id));
  if (disable) await db.delete(schema.sessions).where(eq(schema.sessions.userId, id));
  await audit(a.id, disable ? 'user.disabled' : 'user.enabled', 'user', id);
  revalidatePath('/admin/users/');
}

const slugify = (t: string) => t.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);

export async function approveOnboarding(fd: FormData) {
  const a = await admin();
  const id = uuid.parse(fd.get('id'));
  const db = await requireDb();
  const [s] = await db.select().from(schema.onboardingSubmissions).where(eq(schema.onboardingSubmissions.id, id)).limit(1);
  if (!s || s.status !== 'pending') return;
  const payload = s.payload as Record<string, unknown>;
  const name = String(payload.centre || payload.name || payload.fullName || 'New listing').slice(0, 160);
  if (s.kind === 'centre') {
    let slug = slugify(name) || 'new-centre';
    if (getPageByRoute(slugToRoute(slug))) slug += '-new';
    await db.insert(schema.centres).values({ slug, name, source: 'onboarding', status: 'draft' }).onConflictDoNothing();
    if (s.userId) await db.insert(schema.centreMembers).values({ userId: s.userId, centreSlug: slug }).onConflictDoNothing();
    await db.update(schema.onboardingSubmissions).set({ status: 'approved', centreSlug: slug, reviewedBy: a.id, reviewedAt: new Date() }).where(eq(schema.onboardingSubmissions.id, id));
  } else {
    const slug = slugify(name) + '-' + randomToken().slice(0, 4).toLowerCase();
    const [t] = await db.insert(schema.therapists).values({ slug, userId: s.userId, status: 'draft', source: 'self' }).returning({ id: schema.therapists.id });
    await db.insert(schema.therapistProfiles).values({ therapistId: t.id, data: payload, descriptionStatus: 'owner' });
    await db.update(schema.onboardingSubmissions).set({ status: 'approved', therapistId: t.id, reviewedBy: a.id, reviewedAt: new Date() }).where(eq(schema.onboardingSubmissions.id, id));
  }
  await audit(a.id, 'onboarding.approved', 'onboarding', id, { kind: s.kind });
  revalidatePath('/admin/onboarding/');
}

export async function rejectOnboarding(fd: FormData) {
  const a = await admin();
  const id = uuid.parse(fd.get('id'));
  const db = await requireDb();
  await db.update(schema.onboardingSubmissions).set({ status: 'rejected', reviewedBy: a.id, reviewedAt: new Date() }).where(and(eq(schema.onboardingSubmissions.id, id), eq(schema.onboardingSubmissions.status, 'pending')));
  await audit(a.id, 'onboarding.rejected', 'onboarding', id);
  revalidatePath('/admin/onboarding/');
}

export async function saveSeo(fd: FormData) {
  const a = await admin();
  const path = z.string().trim().regex(/^\/[a-z0-9\-/]*$/).max(200).parse(fd.get('path'));
  const title = String(fd.get('title') || '').trim().slice(0, 200) || null;
  const description = String(fd.get('description') || '').trim().slice(0, 400) || null;
  const noindex = fd.get('noindex') === 'on';
  const db = await requireDb();
  if (!title && !description && !noindex) await db.delete(schema.pageSeo).where(eq(schema.pageSeo.path, path));
  else await db.insert(schema.pageSeo).values({ path, title, description, noindex, updatedBy: a.id }).onConflictDoUpdate({ target: schema.pageSeo.path, set: { title, description, noindex, updatedBy: a.id, updatedAt: new Date() } });
  await audit(a.id, 'seo.saved', 'page', path, { noindex });
  revalidatePath(path);
  revalidatePath('/admin/seo/');
  revalidatePath('/sitemap.xml');
}

export async function inviteByEmail(fd: FormData) {
  const a = await admin();
  const email = z.string().trim().toLowerCase().email().parse(fd.get('email'));
  const kind = z.enum(['therapist', 'centre']).parse(fd.get('kind'));
  const centreSlug = String(fd.get('centreSlug') || '').trim() || null;
  const db = await requireDb();
  const token = randomToken();
  const prefill = { name: String(fd.get('name') || '').slice(0, 160) };
  await db.insert(schema.invites).values({ email, kind, centreSlug, prefill, tokenHash: sha256(token), invitedBy: a.id, expiresAt: new Date(Date.now() + 14 * 864e5) });
  const origin = siteOrigin(await headers());
  const link = kind === 'therapist' ? `${origin}/therapist-onboarding/?invite=${token}` : `${origin}/claim-listing/?invite=${token}${centreSlug ? `&centre=${centreSlug}` : ''}`;
  await sendEmail(email, kind === 'therapist' ? 'Create your therapist profile' : 'Claim your listing', `Hello${prefill.name ? ' ' + prefill.name : ''},\n\nYou are invited to ${kind === 'therapist' ? 'create your own profile on Addiction Rehab Centres Canada' : 'claim your centre listing'}. All of the text on your profile is yours: nothing is published unless you write or approve it.\n\n${link}\n\nThe link works for 14 days. If this is not for you, ignore this message.`);
  await audit(a.id, 'invite.sent', 'invite', email, { kind });
  revalidatePath('/admin/invites/');
}
