import Link from 'next/link';
import type { Block, Card, Page } from '@/lib/content';
import { getRoutes, isPublishedRoute } from '@/lib/content';
import { Blk, body, wrap } from './blocks';
import PageShell from './PageShell';
import SiteFooter from './SiteFooter';
import ProvincesNav from './ProvincesNav';

/**
 * Province / city listing page — styled like the Province and City design templates (light hero, 3-column centre cards,
 * guide text). Everything shown comes from the page JSON; template blocks with no source data (stats, "why trust us",
 * filters, FAQ, photo, badges, ratings) are not rendered. Responsive via data-cols / data-rc-wrap / data-rc-lg.
 */
const pin = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '3px' }}>
    <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

function CardView({ c }: { c: Card }) {
  const path = new URL(c.href).pathname;
  const linked = isPublishedRoute(path);
  const name = linked ? <Link className="scp0" href={path} style={{ color: '#10233a' }}>{c.name}</Link> : c.name;
  return (
    <article className={linked ? 'scpn' : undefined} style={{ background: '#fff', border: '1px solid #e3ecf4', borderRadius: '22px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform .2s,box-shadow .2s' }}>
      {c.image && (
        <div style={{ aspectRatio: '16/10', background: '#eaf2f8', overflow: 'hidden' }}>
          <img src={c.image.local_path} alt={c.image.alt} width={c.image.width ?? undefined} height={c.image.height ?? undefined} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      )}
      <div style={{ padding: '20px 20px 22px', display: 'flex', flexDirection: 'column', gap: '9px', flex: 1 }}>
        {c.category && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ font: '500 11.5px Figtree,sans-serif', color: '#1f3550', background: '#eef4f9', padding: '4px 9px', borderRadius: '999px' }}>{c.category}</span>
          </div>
        )}
        <h3 style={{ fontSize: '19px', lineHeight: 1.25 }}>{name}</h3>
        {c.address && (
          <p style={{ fontSize: '13.5px', color: '#6b7f95', display: 'flex', gap: '7px', alignItems: 'flex-start', lineHeight: 1.45 }}>{pin}<span>{c.address}</span></p>
        )}
        {c.excerpt && <p style={{ fontSize: '14.5px', lineHeight: 1.55, color: '#3b4d63' }}>{c.excerpt}</p>}
        {c.reviews > 0 && <p style={{ fontSize: '13px', color: '#6b7f95', marginTop: 'auto' }}>{c.reviews} Reviews</p>}
      </div>
    </article>
  );
}

const Blocks = ({ bl }: { bl: Block[] }) => <>{bl.map((b, i) => <Blk key={i} b={b} />)}</>;

export default function ListingPage({ page }: { page: Page }) {
  const rows = page.rows.filter((r) => r.columns.some((c) => c.blocks.length) && !r.classes.includes('bottomWidget'));
  const banner = rows.find((r) => r.kind === 'listing-banner');
  const heroBlocks = (banner?.columns.flatMap((c) => c.blocks) ?? []).filter((b) => b.type !== 'h1');
  const rest = rows.filter((r) => r !== banner);
  const byHref = new Map((page.listing?.cards ?? []).map((c) => [c.href, c]));
  let shade = 0;
  return (
    <PageShell routes={getRoutes()}>
      <main>
        <section style={{ background: 'radial-gradient(1000px 500px at 85% -10%,#dbeefb 0%,rgba(219,238,251,0) 60%),#f7fafd', borderBottom: '1px solid #e9eff5' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '72px 32px 56px' }} data-rc-wrap="1">
            <h1 style={{ fontSize: '54px', lineHeight: 1.05, color: '#10233a', maxWidth: '900px' }} data-rc-lg="1">{page.h1}</h1>
            <div style={{ maxWidth: '820px', marginTop: '18px' }}>
              {heroBlocks.map((b, i) =>
                b.type === 'h2' ? <h2 key={i} style={{ font: '400 22px/1.45 Figtree,sans-serif', color: '#516378', margin: '0 0 12px' }} dangerouslySetInnerHTML={{ __html: b.html }} /> : <Blk key={i} b={b} />,
              )}
            </div>
          </div>
        </section>
        {rest.map((r, i) => {
          const bg = shade++ % 2 === 0 ? '#f7fafd' : '#fff';
          const flat = r.columns.flatMap((c) => c.blocks);
          const hasCards = flat.some((b) => b.type === 'cards');
          const parts: (Block[] | string[])[] = [];
          for (const b of flat) {
            if (b.type === 'cards') parts.push(b.hrefs);
            else if (Array.isArray(parts[parts.length - 1]) && typeof (parts[parts.length - 1] as unknown[])[0] !== 'string') (parts[parts.length - 1] as Block[]).push(b);
            else parts.push([b]);
          }
          return (
            <section key={i} id={hasCards ? 'listings' : undefined} style={{ background: bg, borderTop: '1px solid #e9eff5' }}>
              <div style={{ ...wrap, padding: '56px 32px 64px' }} data-rc-wrap="1">
                {parts.map((p, k) =>
                  typeof p[0] === 'string' || (p.length === 0) ? (
                    <div key={k} style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '22px', margin: '0 0 28px' }} data-cols="repeat(3,1fr)">
                      {(p as string[]).map((h) => byHref.get(h)).filter((c): c is Card => !!c).map((c) => <CardView key={c.href} c={c} />)}
                    </div>
                  ) : (
                    <div key={k} style={{ maxWidth: '900px', margin: '0 0 8px' }}><Blocks bl={p as Block[]} /></div>
                  ),
                )}
              </div>
            </section>
          );
        })}
      </main>
      <ProvincesNav current={page.route} />
      <SiteFooter />
    </PageShell>
  );
}
