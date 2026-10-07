import Link from 'next/link';
import { isPublishedRoute } from '@/lib/content';

export type CentreCardItem = { name: string; href: string; address: string; excerpt: string; category: string; image: { src: string; alt: string; width?: number | null; height?: number | null } | null };

/** Centre cards as the source shows them (image, category, name, address, excerpt). A card links only to a published centre. */
export default function CentreCards({ items }: { items: CentreCardItem[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '22px', margin: '0 0 8px' }} data-cols="repeat(3,1fr)">
      {items.map((c) => {
        const path = new URL(c.href).pathname;
        const linked = isPublishedRoute(path);
        return (
          <article key={c.href} className={linked ? 'scpn' : undefined} style={{ background: '#fff', border: '1px solid #e3ecf4', borderRadius: '22px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {c.image && (
              <div style={{ aspectRatio: '16/10', background: '#eaf2f8', overflow: 'hidden' }}>
                <img src={c.image.src} alt={c.image.alt} width={c.image.width ?? undefined} height={c.image.height ?? undefined} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            )}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {c.category && <span style={{ font: '500 11.5px Figtree,sans-serif', color: '#1f3550', background: '#eef4f9', padding: '4px 9px', borderRadius: '999px', alignSelf: 'flex-start' }}>{c.category}</span>}
              <h3 style={{ fontSize: '19px', lineHeight: 1.25 }}>{linked ? <Link className="scp0" href={path} style={{ color: '#10233a' }}>{c.name}</Link> : c.name}</h3>
              {c.address && <p style={{ fontSize: '13.5px', color: '#6b7f95', lineHeight: 1.45 }}>{c.address}</p>}
              {c.excerpt && <p style={{ fontSize: '14.5px', lineHeight: 1.55, color: '#3b4d63' }}>{c.excerpt}</p>}
            </div>
          </article>
        );
      })}
    </div>
  );
}
