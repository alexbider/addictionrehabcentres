import type { Page, Row } from '@/lib/content';
import { getRoutes } from '@/lib/content';
import { Blk, body, wrap } from './blocks';
import ProvincesNav from './ProvincesNav';
import PageShell from './PageShell';
import SiteFooter from './SiteFooter';

/**
 * Long-form page layout (hero banner → text/image rows → call-to-action band → help band), the layout the source
 * uses for drug and treatment/support pages. Every value comes from the page JSON; a section with no data is not rendered.
 * Responsive hooks (data-cols / data-rc-wrap / data-rc-gap / data-rc-lg) are the ones in src/app/responsive.css.
 */
const hasContent = (r: Row) => r.columns.some((c) => c.blocks.length);

function Columns({ row, light }: { row: Row; light?: boolean }) {
  const cols = row.columns.filter((c) => c.blocks.length);
  const wide = cols.filter((c) => !c.classes.includes('vc_col-sm-6'));
  const half = cols.filter((c) => c.classes.includes('vc_col-sm-6'));
  // full-width columns first (intro heading), then the 50/50 pair in source order
  return (
    <>
      {wide.map((c, i) => (<div key={'w' + i}>{c.blocks.map((b, j) => <Blk key={j} b={b} light={light} />)}</div>))}
      {half.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: half.length > 1 ? '1fr 1fr' : '1fr', gap: '48px', alignItems: 'center' }} data-cols="1fr 1fr" data-rc-gap="1">
          {half.map((c, i) => (<div key={i} style={{ minWidth: 0 }}>{c.blocks.map((b, j) => <Blk key={j} b={b} light={light} />)}</div>))}
        </div>
      )}
    </>
  );
}

export default function ContentPage({ page }: { page: Page }) {
  if (!page.rows.length && page.blocks?.length) {
    return (
      <PageShell routes={getRoutes()}>
        <main>
          <section style={{ background: '#10233a', color: '#fff' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '72px 32px' }} data-rc-wrap="1">
              <h1 style={{ fontSize: '54px', lineHeight: 1.08, color: '#fff' }} data-rc-lg="1">{page.h1}</h1>
            </div>
          </section>
          <section style={{ background: '#fff' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '56px 32px 72px' }} data-rc-wrap="1">
              {page.blocks.map((b, i) => (b.type === 'h1' ? null : <Blk key={i} b={b} />))}
            </div>
          </section>
        </main>
        <SiteFooter />
      </PageShell>
    );
  }
  const rows = page.rows.filter((r) => hasContent(r) && !r.classes.includes('bottomWidget'));
  const hero = rows.find((r) => r.kind === 'hero-banner');
  const rest = rows.filter((r) => r !== hero);
  let n = 0;
  return (
    <PageShell active={page.page_type === 'drug' ? 'drugs' : undefined} routes={getRoutes()}>
      <style dangerouslySetInnerHTML={{ __html: '.cp-table table{border-collapse:collapse;width:100%;min-width:480px}.cp-table th,.cp-table td{border:1px solid #dbe6f0;padding:10px 12px;text-align:left;font-size:15px;line-height:1.5;color:#3b4d63;vertical-align:top}.cp-table th{background:#eaf5fd;color:#10233a}.cp-light a:not(.scp1){color:#fff;text-decoration:underline}.cp-light a:not(.scp1):hover{color:#d9eefc}' }} />
      <main>
        <section
          style={{
            position: 'relative', overflow: 'hidden', color: '#fff',
            background: hero?.background_image
              ? `linear-gradient(rgba(16,35,58,.62),rgba(16,35,58,.62)),url(${hero.background_image}) center/cover no-repeat`
              : '#10233a',
          }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '84px 32px', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} data-rc-wrap="1">
            <h1 style={{ fontSize: '54px', lineHeight: 1.08, color: '#fff', maxWidth: '900px' }} data-rc-lg="1">{page.h1}</h1>
            {hero?.columns.flatMap((c) => c.blocks).filter((b) => b.type === 'p').map((b, i) => (
              <p key={i} style={{ ...body, color: 'rgba(255,255,255,.92)', maxWidth: '820px', marginTop: '18px' }} dangerouslySetInnerHTML={{ __html: (b as { html: string }).html }} />
            ))}
          </div>
        </section>
        {rest.map((r, i) => {
          if (r.kind === 'cta-banner')
            return (
              <section key={i} className="cp-light" style={{ background: '#10233a', color: '#fff' }}>
                <div style={{ ...wrap, padding: '56px 32px' }} data-rc-wrap="1"><Columns row={r} light /></div>
              </section>
            );
          if (r.kind === 'help-block')
            return (
              <section key={i} className="cp-light" style={{ color: '#fff', background: r.background_image ? `linear-gradient(rgba(8,100,170,.9),rgba(8,100,170,.9)),url(${r.background_image}) center/cover no-repeat` : '#0b6fb8' }}>
                <div style={{ ...wrap, padding: '56px 32px', maxWidth: '1000px' }} data-rc-wrap="1"><Columns row={r} light /></div>
              </section>
            );
          const bg = n++ % 2 === 0 ? '#fff' : '#f7fafd';
          return (
            <section key={i} style={{ background: bg, borderTop: '1px solid #e9eff5' }}>
              <div style={wrap} data-rc-wrap="1"><Columns row={r} /></div>
            </section>
          );
        })}
      </main>
      <ProvincesNav />
      <SiteFooter />
    </PageShell>
  );
}
