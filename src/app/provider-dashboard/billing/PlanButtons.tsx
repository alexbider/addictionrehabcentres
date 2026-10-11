'use client';
import { useState } from 'react';
import { btn } from '@/components/backend/ui';

export default function PlanButtons({ mode, plan, available, centres }: { mode: 'buy' | 'portal'; plan?: string; available?: boolean; centres?: { slug: string; name: string }[] }) {
  const [slug, setSlug] = useState(centres?.[0]?.slug ?? '');
  const [err, setErr] = useState('');
  async function go() {
    setErr('');
    const res = await fetch(mode === 'buy' ? '/api/stripe/checkout' : '/api/stripe/portal', { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ plan, centreSlug: slug }) });
    const j = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
    if (res.ok && j.url) window.location.href = j.url; else setErr(j.error || 'Something went wrong.');
  }
  if (mode === 'buy' && !available) return <button type="button" disabled style={{ ...btn('ghost'), opacity: 0.55, cursor: 'not-allowed' }}>Coming soon</button>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
      {mode === 'buy' && centres?.length ? <select aria-label="Centre" value={slug} onChange={(e) => setSlug(e.target.value)} style={{ padding: 10, borderRadius: 10, border: '1px solid #cfdceb' }}>{centres.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select> : null}
      <button type="button" style={btn('primary')} onClick={go} disabled={mode === 'buy' && !slug}>{mode === 'buy' ? 'Choose this plan' : 'Manage billing'}</button>
      {err ? <span role="alert" style={{ color: '#9b1c1c', fontSize: 14 }}>{err}</span> : null}
    </div>
  );
}
