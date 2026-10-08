import Link from 'next/link';
import { provinceNav, provinceNavItems } from '@/lib/provinces';
import { routeExists } from '@/lib/content';

/** Source block "Drug Rehab Centres By Provinces". Links to provinces that are not published yet are left out. */
export default function ProvincesNav({ current }: { current?: string }) {
  const links = provinceNavItems(routeExists, current);
  if (!links.length) return null;
  return (
    <section style={{ background: '#f7fafd', borderTop: '1px solid #e9eff5' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '56px 32px' }} data-rc-wrap="1">
        <h2 style={{ fontSize: 'clamp(24px,3vw,30px)', color: '#10233a', marginBottom: '22px' }}>{provinceNav.heading}</h2>
        <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: 0, margin: 0, listStyle: 'none' }}>
          {links.map(({ label, href }) => (
            <li key={label}>
              {href ? <Link className="scp2" href={href} style={{ display: 'inline-block', padding: '10px 16px', borderRadius: '999px', background: '#fff', border: '1px solid #dbe6f0', color: '#10233a', font: '500 14.5px Figtree,sans-serif' }}>{label}</Link> : <span style={{ display: 'inline-block', padding: '10px 16px', borderRadius: '999px', background: '#fff', border: '1px solid #dbe6f0', color: '#6b7f95', font: '500 14.5px Figtree,sans-serif' }}>{label}</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
