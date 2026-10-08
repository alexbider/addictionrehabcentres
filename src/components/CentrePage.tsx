import { Fragment } from 'react';
import Link from 'next/link';
import type { Page } from '@/lib/content';
import { getRoutes, isPublishedRoute } from '@/lib/content';
import { categoryRoute } from '@/lib/provinces';
import { Blk, body } from './blocks';
import PageShell from './PageShell';
import SiteFooter from '@/views/SiteFooter';
import ProvincesNav from './ProvincesNav';

/**
 * Centre profile, styled like the Centre design. Only source data is rendered: name, province, gallery, about text and lists,
 * FAQ, contact details, business hours, tags and the sponsored banner. Nothing is added (no price, team, rating, badges,
 * callback form, map) and the Google reviews widget and the enquiry button are left out.
 * Responsive via data-cols (stacks at ≤1000px) / data-rc-wrap / data-rc-lg.
 */
const icon = (d: string) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true"><path d={d} /></svg>
);
const I = {
  phone: icon('M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z'),
  mail: icon('M4 5h16v14H4z M4 7l8 6 8-6'),
  globe: icon('M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M3 12h18 M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3z'),
  pin: icon('M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z M12 10m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0'),
};
const glyph: Record<string, string> = { facebook: 'f', twitter: 'X', instagram: 'ig', linkedin: 'in', youtube: 'yt', pinterest: 'p', tiktok: 'tt' };
const card: React.CSSProperties = { background: '#fff', border: '1px solid #e3ecf4', borderRadius: '20px', padding: '22px' };
const row: React.CSSProperties = { display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '15px', lineHeight: 1.5, color: '#10233a', overflowWrap: 'anywhere' };

export default function CentrePage({ page }: { page: Page }) {
  const c = page.centre!;
  const catLinks = c.categories.map((label) => ({ label, href: categoryRoute[label] }));
  return (
    <PageShell routes={getRoutes()}>
      <style dangerouslySetInnerHTML={{ __html: '.cp-table table{border-collapse:collapse;width:100%;min-width:480px}.cp-table th,.cp-table td{border:1px solid #dbe6f0;padding:10px 12px;text-align:left;font-size:15px;line-height:1.5;color:#3b4d63;vertical-align:top}.cp-table th{background:#eaf5fd;color:#10233a}.ctr-about img{max-width:100%;height:auto;border-radius:14px}.ctr-about a{text-decoration:underline;text-underline-offset:2px}.ctr-faq summary{cursor:pointer;font:600 17px Jost,sans-serif;color:#10233a;list-style:none;padding:16px 4px}.ctr-faq summary::-webkit-details-marker{display:none}.ctr-faq details{border-bottom:1px solid #e3ecf4}.ctr-soc::before{content:attr(data-g)}' }} />
      <main>
        <section style={{ background: 'radial-gradient(1000px 500px at 85% -10%,#dbeefb 0%,rgba(219,238,251,0) 60%),#f7fafd', borderBottom: '1px solid #e9eff5' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '56px 32px 40px' }} data-rc-wrap="1">
            {catLinks.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {catLinks.map((k) => {
                  const st: React.CSSProperties = { font: '600 12px Figtree,sans-serif', letterSpacing: '.08em', textTransform: 'uppercase', color: '#0890E8', background: '#eaf5fd', padding: '6px 10px', borderRadius: '999px' };
                  return k.href && isPublishedRoute(k.href) ? <Link key={k.label} href={k.href} style={st}>{k.label}</Link> : <span key={k.label} style={st}>{k.label}</span>;
                })}
              </div>
            )}
            <h1 style={{ fontSize: '46px', lineHeight: 1.1, color: '#10233a', maxWidth: '980px' }} data-rc-lg="1">{c.name}</h1>
          </div>
        </section>
        {c.gallery.length > 0 && (
          <section style={{ background: '#fff', borderBottom: '1px solid #e9eff5' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 32px' }} data-rc-wrap="1">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(260px,100%),1fr))', gap: '14px' }} data-cols="repeat(auto-fill,minmax(170px,1fr))">
                {c.gallery.map((g, i) => (
                  <img key={i} src={g.src} alt={g.alt} width={g.width ?? undefined} height={g.height ?? undefined} loading={i < 2 ? undefined : 'lazy'} style={{ width: '100%', aspectRatio: '3/2', objectFit: 'cover', borderRadius: '16px', display: 'block', background: '#eaf2f8' }} />
                ))}
              </div>
            </div>
          </section>
        )}
        <section style={{ background: '#f7fafd' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 32px 72px', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(300px,380px)', gap: '40px', alignItems: 'start' }} data-cols="minmax(0,1fr) minmax(300px,380px)" data-rc-wrap="1">
            <div className="ctr-about" style={{ minWidth: 0 }}>
              {c.about_blocks.map((b, i) => <Blk key={i} b={b} />)}
              {c.specialty_groups.filter((g) => g.items.length || g.text).map((g) => (
                <div key={g.heading} style={{ margin: '8px 0 22px' }}>
                  <h4 style={{ fontSize: '19px', color: '#10233a', margin: '20px 0 10px' }}>{g.heading}</h4>
                  {g.text && <p style={body}>{g.text}</p>}
                  {g.items.length > 0 && <ul style={{ ...body, paddingLeft: '22px', listStyle: 'disc' }}>{g.items.map((it, i) => <li key={i} style={{ marginBottom: '6px' }}>{it}</li>)}</ul>}
                </div>
              ))}
              {c.faqs.length > 0 && (
                <div className="ctr-faq" style={{ marginTop: '28px' }}>
                  {c.faq_heading && <h3 style={{ fontSize: 'clamp(22px,2.6vw,26px)', color: '#10233a', margin: '0 0 8px' }}>{c.faq_heading}</h3>}
                  {c.faqs.map((f, i) => (
                    <details key={i}>
                      <summary>{f.question}</summary>
                      <div style={{ padding: '0 4px 12px' }}>{f.answer_blocks.map((b, j) => <Blk key={j} b={b} />)}</div>
                    </details>
                  ))}
                </div>
              )}
            </div>
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
              <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {c.info_items.map((it, i) => (
                  <div key={i} style={{ ...row, flexDirection: 'column', gap: '2px' }}>
                    {it.label && it.label !== it.value && <span style={{ fontSize: '13px', color: '#6b7f95' }}>{it.label}</span>}
                    <span style={{ fontWeight: 600 }}>{it.value}</span>
                  </div>
                ))}
                {c.phone_text && <div style={row}>{I.phone}<a href={c.phone_href} style={{ color: '#10233a', fontWeight: 600 }}>{c.phone_text}</a></div>}
                {c.email && <div style={row}>{I.mail}<a href={`mailto:${c.email}`} style={{ color: '#10233a' }}>{c.email}</a></div>}
                {c.website && <div style={row}>{I.globe}<a href={c.website} rel="noopener noreferrer nofollow" target="_blank" style={{ color: '#10233a' }}>{c.website_text || c.website}</a></div>}
                {c.address && <div style={row}>{I.pin}<span>{c.address}</span></div>}
                {Object.keys(c.social).length > 0 && (
                  <div style={{ borderTop: '1px solid #e9eff5', paddingTop: '14px' }}>
                    {c.social_title && <h5 style={{ font: '600 12px Figtree,sans-serif', letterSpacing: '.14em', textTransform: 'uppercase', color: '#6b7f95', marginBottom: '10px' }}>{c.social_title}</h5>}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {Object.entries(c.social).map(([k, h]) => (
                        <a key={k} href={h} aria-label={k} rel="noopener noreferrer nofollow" target="_blank" className="ctr-soc" data-g={glyph[k] ?? k.slice(0, 2)} style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #dbe6f0', display: 'grid', placeItems: 'center', color: '#10233a', font: '600 14px Jost,sans-serif' }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {c.hours.rows.length > 0 && (
                <div style={card}>
                  {c.hours.heading && <h4 style={{ fontSize: '18px', marginBottom: '12px', color: '#10233a' }}>{c.hours.heading}</h4>}
                  <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 16px', fontSize: '14.5px', color: '#3b4d63' }}>
                    {c.hours.rows.map(([d, t]) => (<Fragment key={d}><dt style={{ fontWeight: 600, color: '#10233a' }}>{d}</dt><dd style={{ margin: 0, textAlign: 'right' }}>{t}</dd></Fragment>))}
                  </dl>
                </div>
              )}
              {c.tags.items.length > 0 && (
                <div style={card}>
                  {c.tags.heading && <h4 style={{ fontSize: '18px', marginBottom: '12px', color: '#10233a' }}>{c.tags.heading}</h4>}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {c.tags.items.map((tg) => <span key={tg} style={{ font: '500 12.5px Figtree,sans-serif', color: '#1f3550', background: '#eef4f9', padding: '5px 10px', borderRadius: '999px' }}>{tg}</span>)}
                  </div>
                </div>
              )}
              {c.sponsor && (
                <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
                  {c.sponsor.label && <h4 style={{ font: '600 12px Figtree,sans-serif', letterSpacing: '.14em', textTransform: 'uppercase', color: '#6b7f95', padding: '16px 22px 0' }}>{c.sponsor.label}</h4>}
                  {c.sponsor.image && <a href={c.sponsor.href}><img src={c.sponsor.image.src} alt={c.sponsor.image.alt} width={c.sponsor.image.width ?? undefined} height={c.sponsor.image.height ?? undefined} loading="lazy" style={{ width: '100%', height: 'auto', display: 'block', margin: '12px 0 0' }} /></a>}
                  <div style={{ padding: '16px 22px 22px' }}>
                    {c.sponsor.title && <h2 style={{ fontSize: '20px', marginBottom: '10px' }}><a href={c.sponsor.href} style={{ color: '#10233a' }}>{c.sponsor.title}</a></h2>}
                    {c.sponsor.text && <p style={{ ...body, fontSize: '14.5px', whiteSpace: 'pre-line' }}>{c.sponsor.text}</p>}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>
      </main>
      <ProvincesNav />
      <SiteFooter />
    </PageShell>
  );
}
