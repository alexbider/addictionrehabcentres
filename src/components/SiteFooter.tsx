import Link from 'next/link';
import { footerCols } from '@/lib/footer';
import { routeExists } from '@/lib/content';

const social = { width: '40px', height: '40px', borderRadius: '10px', border: '1px solid rgba(255,255,255,.14)', display: 'grid', placeItems: 'center', color: '#fff', font: '600 15px Jost,sans-serif' } as const;

/** Same footer as the design pages; links to routes that do not exist yet are left out (no dead links). */
export default function SiteFooter() {
  const cols = footerCols.map((c) => ({ ...c, links: c.links.filter((l) => routeExists(l.href)) })).filter((c) => c.links.length);
  const legal = [
    ['Privacy Policy', '/privacy-policy/'],
    ['Terms of Use', '/terms-of-use/'],
    ['Promote Your Centre', '/promote-your-centre/'],
  ].filter(([, h]) => routeExists(h));
  return (
    <footer style={{ background: '#10233a', color: '#b7c7d8', marginTop: 'auto' }}>
      <div
        style={{ maxWidth: '1280px', margin: '0 auto', padding: '72px 32px 32px', display: 'grid', gridTemplateColumns: `1.3fr ${'1fr '.repeat(3).trim()}`, gap: '48px' }}
        data-cols="1.3fr 1fr 1fr 1fr"
        data-rc-gap="1"
        data-rc-wrap="1"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <Link href="/" style={{ display: 'inline-block', background: '#fff', borderRadius: '12px', padding: '10px 14px', alignSelf: 'flex-start' }}>
            <img src="/assets/logo.png" alt="Addiction Rehab Centres Canada" style={{ height: '44px', display: 'block' }} />
          </Link>
          <h4 style={{ fontSize: '18px', color: '#fff' }}>We Are Available 24/7</h4>
          <p style={{ fontSize: '15px' }}>
            Call Us:{' '}
            <a href="tel:+1-855-885-4747" style={{ color: '#7cc4f5', fontWeight: 600 }}>+1-855-885-4747</a>
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <a className="scpd" href="https://www.facebook.com/Addiction-Rehab-Centres-Canada-772760289732512/" aria-label="Facebook" style={social}>f</a>
            <a className="scpd" href="https://www.google.com/search?ludocid=17732523544542585825&q=Addiction%20Rehab%20Centres%20Canada" aria-label="Google" style={social}>G</a>
          </div>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <h4 style={{ font: '600 12px Figtree,sans-serif', letterSpacing: '.14em', textTransform: 'uppercase', color: '#7cc4f5', marginBottom: '18px' }}>{col.title}</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '9px', padding: 0, listStyle: 'none' }}>
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link className="scpe" href={l.href} style={{ fontSize: '14.5px', color: '#b7c7d8', lineHeight: 1.4 }}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '22px 32px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', fontSize: '13.5px' }} data-rc-wrap="1">
          <span>© {new Date().getFullYear()} Addiction Rehab Centres Canada</span>
          <div style={{ display: 'flex', gap: '22px', flexWrap: 'wrap' }}>
            {legal.map(([label, href]) => (
              <Link key={href} className="scpe" href={href} style={{ color: '#b7c7d8' }}>{label}</Link>
            ))}
            <a className="scpe" href="/llms.txt" style={{ color: '#b7c7d8' }}>Hey Ai, Learn About Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
