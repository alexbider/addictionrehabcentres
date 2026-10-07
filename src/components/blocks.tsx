import Link from 'next/link';
import type { Block } from '@/lib/content';
import CentreCards from './CentreCards';
import TabsBlock from './TabsBlock';

/** Block renderers shared by ContentPage and ListingPage. */
export const heading: Record<string, React.CSSProperties> = {
  h2: { fontSize: 'clamp(26px,3.4vw,34px)', lineHeight: 1.15, color: '#10233a', margin: '0 0 16px' },
  h3: { fontSize: 'clamp(21px,2.4vw,25px)', lineHeight: 1.2, color: '#10233a', margin: '24px 0 12px' },
  h4: { fontSize: '19px', lineHeight: 1.3, color: '#10233a', margin: '20px 0 10px' },
  h5: { fontSize: '17px', color: '#10233a', margin: '16px 0 8px' },
  h6: { fontSize: '16px', color: '#10233a', margin: '16px 0 8px' },
};
export const body: React.CSSProperties = { fontSize: '16.5px', lineHeight: 1.7, color: '#3b4d63', margin: '0 0 16px', overflowWrap: 'anywhere' };
export const wrap: React.CSSProperties = { maxWidth: '1280px', margin: '0 auto', padding: '56px 32px' };

export const isInternal = (h: string) => h.startsWith('/') && !h.startsWith('//');

export function Btn({ href, children, light }: { href: string; children: React.ReactNode; light?: boolean }) {
  const st: React.CSSProperties = {
    display: 'inline-block', margin: '8px 0 16px', padding: '13px 24px', borderRadius: '999px', font: '600 15px Figtree,sans-serif',
    background: light ? '#fff' : '#0890E8', color: light ? '#0670b8' : '#fff',
  };
  return isInternal(href) ? <Link className="scp1" href={href} style={st}>{children}</Link> : <a className="scp1" href={href} style={st}>{children}</a>;
}

export function Blk({ b, light }: { b: Block; light?: boolean }) {
  const col = light ? { color: 'rgba(255,255,255,.92)' } : null;
  switch (b.type) {
    case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6': {
      const T = (b.type === 'h1' ? 'h2' : b.type) as 'h2';
      return <T style={{ ...heading[b.type === 'h1' ? 'h2' : b.type], ...(light ? { color: '#fff' } : null) }} dangerouslySetInnerHTML={{ __html: b.html }} />;
    }
    case 'p': case 'text':
      return <p style={{ ...body, ...col }} {...('html' in b ? { dangerouslySetInnerHTML: { __html: b.html } } : { children: b.text })} />;
    case 'blockquote':
      return <blockquote style={{ ...body, borderLeft: '4px solid #0890E8', paddingLeft: '18px', margin: '0 0 16px' }} dangerouslySetInnerHTML={{ __html: b.html }} />;
    case 'ul': case 'ol': {
      const L = b.type;
      return (
        <L style={{ ...body, paddingLeft: '22px', listStyle: b.type === 'ul' ? 'disc' : 'decimal', ...col }}>
          {b.items.map((it, i) => <li key={i} style={{ marginBottom: '6px' }} dangerouslySetInnerHTML={{ __html: it.html }} />)}
        </L>
      );
    }
    case 'table':
      return <div className="cp-table" style={{ overflowX: 'auto', margin: '0 0 20px' }} dangerouslySetInnerHTML={{ __html: b.html }} />;
    case 'image': {
      const w = Number(b.width);
      const icon = w > 0 && w <= 300; // small source images (icons, logos) keep their own size instead of being stretched
      return <img src={b.src} alt={b.alt} width={b.width ?? undefined} height={b.height ?? undefined} loading="lazy" style={icon ? { width: `${w}px`, maxWidth: '100%', height: 'auto', display: 'block', margin: '0 0 12px' } : { width: '100%', height: 'auto', display: 'block', borderRadius: '18px' }} />;
    }
    case 'iframe': {
      const w = Number(b.width) || 560, h = Number(b.height) || 315;
      return (
        <div style={{ margin: '0 0 22px', maxWidth: w > 900 ? '100%' : w + 'px' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: `${w}/${h}`, borderRadius: '14px', overflow: 'hidden', background: '#eaf2f8' }}>
            <iframe src={b.src} title={b.title || 'Embedded content'} loading="lazy" allowFullScreen style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
          </div>
        </div>
      );
    }
    case 'video':
      return (
        <div style={{ margin: '0 0 22px' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '14px', overflow: 'hidden', background: '#10233a' }}>
            <iframe src={`https://www.youtube-nocookie.com/embed/${b.id}`} title="Video" loading="lazy" allowFullScreen style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
          </div>
        </div>
      );
    case 'centre-cards':
      return <CentreCards items={b.items} />;
    case 'tabs':
      return (
        <TabsBlock
          titles={b.tabs.map((x) => x.title)}
          panels={b.tabs.map((x) => (
            <div key={x.title} style={{ display: 'grid', gridTemplateColumns: x.blocks.some((y) => y.type === 'image') ? 'minmax(0,.9fr) minmax(0,1.1fr)' : '1fr', gap: '28px', alignItems: 'center' }} data-cols="1fr 1fr" data-rc-gap="1">
              {x.blocks.filter((y) => y.type === 'image').map((y, i) => <Blk key={'i' + i} b={y} />)}
              <div>{x.blocks.filter((y) => y.type !== 'image').map((y, i) => <Blk key={i} b={y} />)}</div>
            </div>
          ))}
        />
      );
    case 'accordion':
      return (
        <div style={{ margin: '0 0 16px' }}>
          {b.items.map((it, i) => (
            <details key={i} style={{ borderBottom: '1px solid #e3ecf4' }} open={i === 0}>
              <summary style={{ cursor: 'pointer', font: '600 20px Jost,sans-serif', color: light ? '#fff' : '#10233a', padding: '16px 4px', listStyle: 'none' }}>{it.title}</summary>
              <div style={{ padding: '0 4px 12px' }}>{it.blocks.map((x, j) => <Blk key={j} b={x} light={light} />)}</div>
            </details>
          ))}
        </div>
      );
    case 'link':
      return <Btn href={b.new_href} light={light}>{b.text}</Btn>;
    default:
      return null;
  }
}

