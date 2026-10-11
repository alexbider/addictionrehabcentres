import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import SiteFooter from '@/views/SiteFooter';
import { getPublishedTherapists, getTherapist, therapistCredential, therapistFee, therapistLocation } from '@/server/therapists';
import { SITE_URL } from '@/lib/site';
import EnquiryForm from './EnquiryForm';
import RemovalLink from './RemovalLink';

export const dynamicParams = true; // required so a profile published later can be rendered / regenerated on demand

export async function generateStaticParams() {
  return (await getPublishedTherapists()).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = await getTherapist((await params).slug);
  if (!t) return { robots: { index: false, follow: false } };
  const d = t.data;
  const where = therapistLocation(d);
  return {
    title: `${d.name}${therapistCredential(d) ? ', ' + therapistCredential(d).replace(/\s*\(.*\)/, '') : ''}${where ? ' — ' + where : ''} | Addiction Rehab Centres Canada`,
    description: d.tagline || undefined,
    alternates: { canonical: `${SITE_URL}/therapists/${t.slug}/` },
    robots: { index: true, follow: true },
  };
}

const list = (title: string, items?: string[]) => (items?.length ? (
  <section style={{ marginTop: 22 }}>
    <h2 style={{ fontSize: 20, marginBottom: 10 }}>{title}</h2>
    <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 8, padding: 0, margin: 0 }}>{items.map((x) => <li key={x} style={{ padding: '6px 12px', borderRadius: 999, background: '#eef4f9', color: '#1f3550', font: '500 14px Figtree,sans-serif' }}>{x}</li>)}</ul>
  </section>
) : null);

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const t = await getTherapist((await params).slug);
  if (!t) notFound();
  const d = t.data;
  const fee = therapistFee(d);
  const ld = {
    '@context': 'https://schema.org', '@type': 'Person', name: d.name, url: `${SITE_URL}/therapists/${t.slug}/`,
    ...(therapistCredential(d) ? { jobTitle: therapistCredential(d) } : {}),
    ...(d.city || d.prov ? { workLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', ...(d.city ? { addressLocality: d.city } : {}), ...(d.prov ? { addressRegion: d.prov } : {}), addressCountry: 'CA' } } } : {}),
    ...(d.phone ? { telephone: d.phone } : {}), ...(d.website ? { sameAs: [d.website] } : {}),
    ...(d.langs?.length ? { knowsLanguage: d.langs } : {}), ...(d.concerns?.length ? { knowsAbout: d.concerns } : {}),
  };
  const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' }, { '@type': 'ListItem', position: 2, name: 'Find a therapist', item: SITE_URL + '/therapists/' }, { '@type': 'ListItem', position: 3, name: d.name }] };
  return (
    <PageShell active="">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, '\\u003c') }} />
      <main style={{ background: '#f7fafd', padding: '40px 16px 80px', flex: 1 }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <nav aria-label="Breadcrumb" style={{ fontSize: 14, color: '#5d7188', marginBottom: 14 }}><a href="/">Home</a> / <a href="/therapists/">Find a therapist</a> / {d.name}</nav>
          <article style={{ background: '#fff', border: '1px solid #e3ecf4', borderRadius: 24, padding: 'clamp(20px,4vw,40px)' }}>
            <h1 style={{ fontSize: 'clamp(28px,4vw,40px)' }}>{d.name}</h1>
            {therapistCredential(d) ? <p style={{ color: '#0670b8', font: '600 17px Figtree,sans-serif', margin: '6px 0 0' }}>{therapistCredential(d)}</p> : null}
            {therapistLocation(d) ? <p style={{ color: '#5d7188', margin: '6px 0 0' }}>{therapistLocation(d)}{d.modes?.length ? ' · ' + d.modes.join(' & ') : ''}</p> : null}
            {d.tagline ? <p style={{ fontSize: 20, lineHeight: 1.5, color: '#1f3550', marginTop: 18 }}>{d.tagline}</p> : null}
            {d.bio ? <div style={{ marginTop: 18, color: '#3b4d63', fontSize: 17, lineHeight: 1.75 }}>{d.bio.split(/\n\s*\n/).map((p, i) => <p key={i} style={{ margin: '0 0 14px' }}>{p}</p>)}</div> : null}
            {list('Concerns they work with', d.concerns)}
            {list('Approaches', d.approaches)}
            {list('Who they work with', d.clients)}
            {list('Languages', d.langs)}
            {d.accepting !== undefined || fee || d.sliding || d.consult || d.payments?.length || d.years ? (
              <section style={{ marginTop: 22 }}>
                <h2 style={{ fontSize: 20, marginBottom: 10 }}>Practice details</h2>
                <ul style={{ margin: 0, paddingLeft: 20, color: '#3b4d63', lineHeight: 1.8 }}>
                  {d.accepting !== undefined ? <li>{d.accepting ? 'Accepting new clients' : 'Not accepting new clients right now'}</li> : null}
                  {fee ? <li>{fee}{d.couples && /^\d{2,4}$/.test(d.couples) ? `; $${d.couples} for couples` : ''}</li> : null}
                  {d.sliding ? <li>Sliding scale available</li> : null}
                  {d.consult ? <li>Offers a free consultation</li> : null}
                  {d.payments?.length ? <li>Payment: {d.payments.join(', ')}</li> : null}
                  {d.years ? <li>{d.years} years in practice</li> : null}
                </ul>
              </section>
            ) : null}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 24 }}>
              {d.phone ? <a href={`tel:${d.phone.replace(/[^\d+]/g, '')}`} style={{ display: 'inline-flex', alignItems: 'center', minHeight: 48, padding: '0 22px', borderRadius: 12, background: '#0890E8', color: '#fff', font: '600 16px Jost,sans-serif' }}>Call {d.phone}</a> : null}
              {d.website ? <a href={d.website} rel="noopener noreferrer nofollow" target="_blank" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 48, padding: '0 22px', borderRadius: 12, border: '1.5px solid #0890E8', color: '#0670b8', font: '600 16px Jost,sans-serif' }}>Website</a> : null}
            </div>
          </article>
          <EnquiryForm slug={t.slug} name={d.name ?? 'this therapist'} />
          <RemovalLink slug={t.slug} />
          <p style={{ color: '#5d7188', fontSize: 14, marginTop: 18 }}>This profile was written by the therapist. Always confirm a clinician&apos;s registration with the regulator for their province.</p>
        </div>
      </main>
      <SiteFooter />
    </PageShell>
  );
}
