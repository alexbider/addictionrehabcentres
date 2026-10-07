'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

export type BlogItem = {
  path: string; title: string; excerpt: string; categories: string[]; categorySlugs: string[];
  image: { alt: string; src: string; width?: number; height?: number } | null;
};
export type BlogCat = { slug: string; label: string; count: number };

const PAGE = 12;

/** Blog index: the source's post grid (image, title, excerpt) plus a category filter built from the posts' own categories. */
export default function BlogIndex({ items, cats }: { items: BlogItem[]; cats: BlogCat[] }) {
  const [cat, setCat] = useState('all');
  const [shown, setShown] = useState(PAGE);
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get('category');
    if (c && cats.some((x) => x.slug === c)) setCat(c);
  }, [cats]);
  const list = useMemo(() => (cat === 'all' ? items : items.filter((i) => i.categorySlugs.includes(cat))), [cat, items]);
  const pick = (slug: string) => {
    setCat(slug); setShown(PAGE);
    const u = new URL(window.location.href);
    if (slug === 'all') u.searchParams.delete('category'); else u.searchParams.set('category', slug);
    window.history.replaceState(null, '', u);
  };
  const chip = (on: boolean): React.CSSProperties => ({ font: '500 14px Figtree,sans-serif', padding: '8px 14px', borderRadius: '999px', border: '1px solid ' + (on ? '#0890E8' : '#dbe6f0'), background: on ? '#0890E8' : '#fff', color: on ? '#fff' : '#10233a', cursor: 'pointer' });
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 32px 72px' }} data-rc-wrap="1">
      <div role="group" aria-label="Filter by category" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
        <button type="button" style={chip(cat === 'all')} aria-pressed={cat === 'all'} onClick={() => pick('all')}>All ({items.length})</button>
        {cats.map((c) => (
          <button key={c.slug} type="button" style={chip(cat === c.slug)} aria-pressed={cat === c.slug} onClick={() => pick(c.slug)}>{c.label} ({c.count})</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '22px' }} data-cols="repeat(3,1fr)">
        {list.slice(0, shown).map((p) => (
          <article key={p.path} className="scpn" style={{ background: '#fff', border: '1px solid #e3ecf4', borderRadius: '22px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform .2s,box-shadow .2s' }}>
            {p.image && (
              <Link href={p.path} style={{ display: 'block', aspectRatio: '16/10', background: '#eaf2f8', overflow: 'hidden' }}>
                <img src={p.image.src} alt={p.image.alt} width={p.image.width} height={p.image.height} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </Link>
            )}
            <div style={{ padding: '20px 20px 22px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
              {p.categories[0] && <span style={{ font: '500 11.5px Figtree,sans-serif', color: '#1f3550', background: '#eef4f9', padding: '4px 9px', borderRadius: '999px', alignSelf: 'flex-start' }}>{p.categories[0]}</span>}
              <h2 style={{ fontSize: '19px', lineHeight: 1.25 }}><Link className="scp0" href={p.path} style={{ color: '#10233a' }}>{p.title}</Link></h2>
              {p.excerpt && <p style={{ fontSize: '14.5px', lineHeight: 1.55, color: '#3b4d63' }}>{p.excerpt}</p>}
              <Link className="scp1" href={p.path} style={{ marginTop: 'auto', alignSelf: 'flex-start', padding: '9px 16px', borderRadius: '999px', background: '#0890E8', color: '#fff', font: '600 14px Figtree,sans-serif' }}>Read more</Link>
            </div>
          </article>
        ))}
      </div>
      {list.length === 0 && <p style={{ color: '#516378' }}>No posts in this category.</p>}
      {shown < list.length && (
        <div style={{ textAlign: 'center', marginTop: '36px' }}>
          <button type="button" className="scp2" onClick={() => setShown(shown + PAGE)} style={{ font: '600 15px Jost,sans-serif', padding: '13px 26px', borderRadius: '12px', border: '1px solid #dbe6f0', background: '#fff', color: '#10233a', cursor: 'pointer' }}>Show more ({list.length - shown})</button>
        </div>
      )}
    </div>
  );
}
