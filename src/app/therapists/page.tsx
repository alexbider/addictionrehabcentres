import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import SiteFooter from '@/views/SiteFooter';
import TherapistCard from '@/components/TherapistCard';
import { getPublishedTherapists, PROVINCES, therapistCredential, therapistFee, therapistLocation } from '@/server/therapists';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export async function generateMetadata(): Promise<Metadata> {
  const n = (await getPublishedTherapists()).length;
  return {
    title: 'Find a Therapist in Canada | Addiction Rehab Centres Canada',
    description: 'Therapists, counsellors and clinicians who created their own profile on Addiction Rehab Centres Canada.',
    alternates: { canonical: SITE_URL + '/therapists/' },
    robots: n ? { index: true, follow: true } : { index: false, follow: true }, // an empty directory is not worth indexing
  };
}

export default async function Page() {
  const list = await getPublishedTherapists();
  const byProv = new Map<string, number>();
  list.forEach((t) => t.data.prov && byProv.set(t.data.prov, (byProv.get(t.data.prov) ?? 0) + 1));
  return (
    <PageShell active="">
      <main style={{ background: '#f7fafd', padding: '48px 16px 80px', flex: 1 }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(30px,4.5vw,48px)', color: '#10233a' }}>Find a therapist in Canada</h1>
          <p style={{ color: '#3b4d63', fontSize: 17, lineHeight: 1.6, maxWidth: 760, marginTop: 10 }}>
            Every profile here was created by the therapist, in their own words. Nothing is copied from another directory, and details a therapist did not provide are left out.
          </p>
          {byProv.size ? (
            <ul style={{ listStyle: 'none', display: 'flex', gap: 8, flexWrap: 'wrap', padding: 0, margin: '22px 0' }}>
              {[...byProv.entries()].sort().map(([code, n]) => <li key={code} style={{ padding: '8px 14px', borderRadius: 999, background: '#fff', border: '1px solid #dbe6f0', font: '500 14px Figtree,sans-serif' }}>{PROVINCES[code] ?? code} · {n}</li>)}
            </ul>
          ) : null}
          {list.length ? (
            <div className="cc-grid" style={{ marginTop: 26 }}>
              {list.map((t) => (
                <TherapistCard key={t.slug} name={t.data.name ?? 'Therapist'} href={`/therapists/${t.slug}/`} credentials={therapistCredential(t.data)} location={[therapistLocation(t.data), t.data.modes?.join(' & ')].filter(Boolean).join(' · ')} bio={t.data.tagline} tags={[...(t.data.concerns ?? [])]} phone={t.data.phone} fee={therapistFee(t.data)} note={t.data.accepting ? 'Accepting new clients' : null} />
              ))}
            </div>
          ) : (
            <section style={{ marginTop: 28, background: '#fff', border: '1px solid #e3ecf4', borderRadius: 22, padding: 32, maxWidth: 760 }}>
              <h2 style={{ fontSize: 26 }}>No therapist profiles are published yet</h2>
              <p style={{ color: '#3b4d63', lineHeight: 1.6 }}>We are opening this directory to therapists who want to list themselves. If you are a psychotherapist, psychologist, counsellor or social worker, you can create your profile for free.</p>
              <p style={{ marginTop: 14 }}><a href="/therapist-onboarding/" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 48, padding: '0 22px', borderRadius: 12, background: '#0890E8', color: '#fff', font: '600 16px Jost,sans-serif' }}>Create your profile</a></p>
              <p style={{ marginTop: 18, color: '#516378' }}>Looking for a treatment centre instead? <a href="/search/">Search rehab centres</a> or call <a href="tel:+18558854747">1-855-885-4747</a>.</p>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </PageShell>
  );
}
