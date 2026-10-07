import type { Block, Page, Row } from '@/lib/content';
import { getRoutes } from '@/lib/content';
import { Blk, Btn, body, wrap } from './blocks';
import PageShell from './PageShell';
import SiteFooter from './SiteFooter';
import ProvincesNav from './ProvincesNav';

/**
 * Home page. Sections follow the source's rows in order (hero, intro, “where do we fit in”, feature rows, featured centres,
 * treatment tabs, accordions…). Only source content is rendered. The source has two H1s: the first stays the page H1,
 * the second is rendered as an H2 (text unchanged).
 */
const has = (r: Row, c: string) => r.classes.includes(c);
const flat = (r: Row) => r.columns.flatMap((c) => c.blocks);

function Hero({ r }: { r: Row }) {
  const bl = flat(r);
  const imgs = bl.filter((b): b is Extract<Block, { type: 'image' }> => b.type === 'image');
  const small = imgs.find((i) => Number(i.width) < 300);
  const big = imgs.find((i) => Number(i.width) >= 300);
  const lines = bl.filter((b) => b.type === 'p');
  return (
    <section style={{ background: 'linear-gradient(135deg,#0b3d6b 0%,#0890E8 100%)', color: '#fff' }}>
      <div style={{ ...wrap, padding: '64px 32px', display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: '48px', alignItems: 'center' }} data-cols="1.1fr .9fr" data-rc-gap="1" data-rc-wrap="1">
        <div>
          {bl.filter((b) => b.type === 'h3').map((b, i) => <p key={i} style={{ font: '600 15px Figtree,sans-serif', letterSpacing: '.04em', color: '#cfe8fb', margin: '0 0 14px' }}>{(b as { text: string }).text}</p>)}
          {bl.filter((b) => b.type === 'h2').map((b, i) => <h2 key={i} style={{ fontSize: 'clamp(30px,4.4vw,52px)', lineHeight: 1.08, color: '#fff', margin: '0 0 22px' }} dangerouslySetInnerHTML={{ __html: (b as { html: string }).html }} />)}
          {bl.filter((b) => b.type === 'link').map((b, i) => <Btn key={i} href={(b as { new_href: string }).new_href} light>{(b as { text: string }).text}</Btn>)}
          {(small || lines.length > 0) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '22px' }}>
              {small && <img src={small.src} alt={small.alt} width={small.width ?? undefined} height={small.height ?? undefined} style={{ height: '50px', width: 'auto', borderRadius: 0 }} />}
              <div style={{ color: '#fff', lineHeight: 1.35, fontWeight: 600 }}>{lines.map((b, i) => <div key={i}>{(b as { text: string }).text}</div>)}</div>
            </div>
          )}
        </div>
        {big && <img src={big.src} alt={big.alt} width={big.width ?? undefined} height={big.height ?? undefined} style={{ width: '100%', height: 'auto', borderRadius: '24px', display: 'block' }} />}
      </div>
    </section>
  );
}

export default function HomePage({ page }: { page: Page }) {
  const rows = page.rows.filter((r) => r.columns.some((c) => c.blocks.length));
  let shade = 0, h1Seen = false;
  return (
    <PageShell routes={getRoutes()}>
      <style dangerouslySetInnerHTML={{ __html: '.home-counter::after{content:"+";font-size:.55em;margin-left:.08em;vertical-align:.18em}' }} />
      <main>
        {rows.map((r, i) => {
          if (has(r, 'newHomeBanner') && !has(r, 'bottomHomeBanner')) return <Hero key={i} r={r} />;
          const bl = flat(r);
          if (has(r, 'introText') && !has(r, 'bottomAccordions')) {
            return (
              <section key={i} style={{ background: '#fff', borderBottom: '1px solid #e9eff5' }}>
                <div style={{ ...wrap, padding: '44px 32px', textAlign: 'center' }} data-rc-wrap="1">
                  {bl.map((b, k) => {
                    if (b.type === 'h1' && !h1Seen) { h1Seen = true; return <h1 key={k} style={{ fontSize: 'clamp(26px,3.6vw,42px)', lineHeight: 1.15, color: '#10233a' }} data-rc-lg="1" dangerouslySetInnerHTML={{ __html: b.html }} />; }
                    return <Blk key={k} b={b} />;
                  })}
                </div>
              </section>
            );
          }
          const dark = has(r, 'bottomHomeBanner');
          const bg = dark ? '#10233a' : shade++ % 2 === 0 ? '#f7fafd' : '#fff';
          const two = r.columns.filter((c) => c.blocks.length).length === 2;
          const cols = r.columns.filter((c) => c.blocks.length);
          return (
            <section key={i} className={dark ? 'cp-light' : undefined} style={{ background: bg, color: dark ? '#fff' : undefined, borderTop: '1px solid #e9eff5' }}>
              <div style={{ ...wrap, padding: '56px 32px' }} data-rc-wrap="1">
                <div style={{ display: 'grid', gridTemplateColumns: two ? '1fr 1fr' : '1fr', gap: '48px', alignItems: 'center' }} data-cols="1fr 1fr" data-rc-gap="1">
                  {cols.map((c, j) => (
                    <div key={j} style={{ minWidth: 0 }}>
                      {c.blocks.map((b, k) => {
                        if (has(r, 'addictionTreatmentsBox') && b.type === 'text' && /^\d+$/.test(b.text.trim())) return <span key={k} className="home-counter" style={{ font: '400 clamp(72px,10vw,150px)/1 Figtree,sans-serif', color: '#3f3b36' }}>{b.text}</span>;
                        if (b.type === 'h1') { if (!h1Seen) { h1Seen = true; return <h1 key={k} style={{ fontSize: 'clamp(26px,3.6vw,42px)', color: dark ? '#fff' : '#10233a' }} dangerouslySetInnerHTML={{ __html: b.html }} />; } return <Blk key={k} b={b} light={dark} />; }
                        return <Blk key={k} b={b} light={dark} />;
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </main>
      <ProvincesNav />
      <SiteFooter />
    </PageShell>
  );
}
