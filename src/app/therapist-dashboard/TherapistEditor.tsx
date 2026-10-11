'use client';
import { useState } from 'react';
import { btn, colors, input, Notice } from '@/components/backend/ui';
import type { TherapistData } from '@/server/therapists';
import { DESIGNATIONS, PROVINCES } from '@/server/therapists-constants';

const lines = (v?: string[]) => (v ?? []).join('\n');
const fromLines = (t: string) => t.split('\n').map((x) => x.trim()).filter(Boolean);
const MODES = ['In person', 'Online', 'Phone'];

function F({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><label htmlFor={id} style={{ font: '600 14px Figtree,sans-serif', color: colors.ink }}>{label}</label>{children}{hint ? <span style={{ fontSize: 13, color: colors.muted }}>{hint}</span> : null}{error ? <span role="alert" style={{ fontSize: 13.5, color: colors.red }}>{error}</span> : null}</div>;
}

export default function TherapistEditor({ initial }: { initial: TherapistData }) {
  const [p, setP] = useState<TherapistData>(initial);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof TherapistData>(k: K, v: TherapistData[K]) => setP((c) => ({ ...c, [k]: v }));
  async function post(body: unknown) {
    setBusy(true); setMsg(null); setErrors({});
    try {
      const res = await fetch('/api/therapist/profile', { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(body) });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: Record<string, string> };
      if (res.ok && j.ok) { setMsg({ kind: 'ok', text: 'Saved.' }); return true; }
      setMsg({ kind: 'error', text: j.error || 'Not saved.' }); setErrors(j.fields ?? {});
    } catch { setMsg({ kind: 'error', text: 'We could not reach the server, so nothing was saved.' }); }
    finally { setBusy(false); }
    return false;
  }
  const { email: _e, reg: _r, ...profile } = p; void _e; void _r; // e-mail and registration number are private: not editable here
  return (
    <form onSubmit={async (e) => { e.preventDefault(); await post({ profile }); }} style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 18 }}>
      <fieldset style={{ border: `1px solid ${colors.line}`, borderRadius: 18, padding: 20, margin: 0, display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', background: '#fff' }}>
        <legend style={{ font: '600 18px Jost,sans-serif', padding: '0 8px' }}>About you</legend>
        <F id="t-name" label="Name" error={errors.name}><input id="t-name" value={p.name ?? ''} onChange={(e) => set('name', e.target.value)} style={input} /></F>
        <F id="t-desig" label="Designation"><select id="t-desig" value={p.desig ?? ''} onChange={(e) => set('desig', e.target.value)} style={input}><option value="">—</option>{Object.entries(DESIGNATIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></F>
        <F id="t-city" label="City"><input id="t-city" value={p.city ?? ''} onChange={(e) => set('city', e.target.value)} style={input} /></F>
        <F id="t-prov" label="Province"><select id="t-prov" value={p.prov ?? ''} onChange={(e) => set('prov', e.target.value)} style={input}><option value="">—</option>{Object.entries(PROVINCES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></F>
        <F id="t-phone" label="Public phone (optional)" error={errors.phone}><input id="t-phone" value={p.phone ?? ''} onChange={(e) => set('phone', e.target.value)} style={input} /></F>
        <F id="t-web" label="Website (optional)" error={errors.website}><input id="t-web" type="url" value={p.website ?? ''} onChange={(e) => set('website', e.target.value)} style={input} /></F>
      </fieldset>
      <fieldset style={{ border: `1px solid ${colors.line}`, borderRadius: 18, padding: 20, margin: 0, display: 'grid', gap: 14, background: '#fff' }}>
        <legend style={{ font: '600 18px Jost,sans-serif', padding: '0 8px' }}>Your words</legend>
        <F id="t-tag" label="Headline" hint="One sentence, in your own words." error={errors.tagline}><input id="t-tag" maxLength={200} value={p.tagline ?? ''} onChange={(e) => set('tagline', e.target.value)} style={input} /></F>
        <F id="t-bio" label="About you and how you work" hint="Write it yourself; do not paste text from another website." error={errors.bio}><textarea id="t-bio" rows={8} maxLength={6000} value={p.bio ?? ''} onChange={(e) => set('bio', e.target.value)} style={input} /></F>
      </fieldset>
      <fieldset style={{ border: `1px solid ${colors.line}`, borderRadius: 18, padding: 20, margin: 0, display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', background: '#fff' }}>
        <legend style={{ font: '600 18px Jost,sans-serif', padding: '0 8px' }}>Practice</legend>
        <F id="t-modes" label="Session types"><div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>{MODES.map((m) => <label key={m} style={{ display: 'flex', gap: 6, alignItems: 'center' }}><input type="checkbox" checked={!!p.modes?.includes(m)} onChange={(e) => set('modes', e.target.checked ? [...(p.modes ?? []), m] : (p.modes ?? []).filter((x) => x !== m))} /> {m}</label>)}</div></F>
        <F id="t-concerns" label="Concerns you work with (one per line)"><textarea id="t-concerns" rows={5} value={lines(p.concerns)} onChange={(e) => set('concerns', fromLines(e.target.value))} style={input} /></F>
        <F id="t-approaches" label="Approaches (one per line)"><textarea id="t-approaches" rows={5} value={lines(p.approaches)} onChange={(e) => set('approaches', fromLines(e.target.value))} style={input} /></F>
        <F id="t-langs" label="Languages (one per line)"><textarea id="t-langs" rows={3} value={lines(p.langs)} onChange={(e) => set('langs', fromLines(e.target.value))} style={input} /></F>
        <F id="t-fee" label="Session fee in dollars (optional)" error={errors.fee}><input id="t-fee" inputMode="numeric" value={p.fee ?? ''} onChange={(e) => set('fee', e.target.value)} style={input} /></F>
        <F id="t-acc" label="New clients"><label style={{ display: 'flex', gap: 8, alignItems: 'center' }}><input id="t-acc" type="checkbox" checked={p.accepting ?? false} onChange={(e) => set('accepting', e.target.checked)} /> I am accepting new clients</label></F>
      </fieldset>
      {msg ? <Notice kind={msg.kind}>{msg.text}</Notice> : null}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button type="submit" disabled={busy} style={btn('primary')}>{busy ? 'Saving…' : 'Save profile'}</button>
        <button type="button" disabled={busy} style={btn('danger')} onClick={async () => { if (confirm('Remove your profile from the site?')) { if (await post({ action: 'remove' })) window.location.reload(); } }}>Remove my profile</button>
      </div>
    </form>
  );
}
