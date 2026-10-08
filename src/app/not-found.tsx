import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Page not found - Addiction Rehab Centers', robots: { index: false, follow: true } };

// Plain 404: a search box (GET to /search/, works without JavaScript), the helpline and the province pages.
export default function NotFound() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '72px 24px', fontFamily: 'Figtree,Helvetica,Arial,sans-serif', color: '#10233a' }}>
      <h1 style={{ fontFamily: 'Jost,Helvetica,sans-serif', fontSize: 40, margin: '0 0 12px' }}>We could not find that page</h1>
      <p style={{ fontSize: 18, lineHeight: 1.6, color: '#3b4d63' }}>Search for a rehab centre by name, city or province, or call the free helpline, open 24/7.</p>
      <form action="/search/" method="get" role="search" style={{ display: 'flex', gap: 8, margin: '24px 0', flexWrap: 'wrap' }}>
        <label style={{ flex: '1 1 260px' }}>
          <span style={{ position: 'absolute', left: -9999 }}>Search rehab centres</span>
          <input name="q" type="search" placeholder="Name, city or keyword" style={{ width: '100%', minHeight: 48, padding: '0 14px', border: '1px solid #dbe6f0', borderRadius: 12, font: '500 16px Figtree,sans-serif' }} />
        </label>
        <button type="submit" style={{ minHeight: 48, padding: '0 22px', border: 0, borderRadius: 12, background: '#0670b8', color: '#fff', font: '600 16px Jost,sans-serif', cursor: 'pointer' }}>Search</button>
      </form>
      <p><a href="tel:+18558854747" style={{ color: '#0670b8', fontWeight: 600 }}>Call 1-855-885-4747</a> · <a href="/" style={{ color: '#0670b8' }}>Home</a> · <a href="/blog/" style={{ color: '#0670b8' }}>Blog</a></p>
    </main>
  );
}
