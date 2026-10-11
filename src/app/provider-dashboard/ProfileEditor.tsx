'use client';
import { useState } from 'react';
import { btn, colors, input, Notice } from '@/components/backend/ui';
import type { CentreProfile } from '@/server/schemas';

type Placeholders = { phone?: string; email?: string; website?: string; description?: string };
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
const lines = (v?: string[]) => (v ?? []).join('\n');
const fromLines = (t: string) => t.split('\n').map((x) => x.trim()).filter(Boolean);

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={id} style={{ font: '600 14px Figtree,sans-serif', color: colors.ink }}>{label}</label>
      {children}
      {hint ? <span style={{ fontSize: 13, color: colors.muted }}>{hint}</span> : null}
      {error ? <span role="alert" style={{ fontSize: 13.5, color: colors.red }}>{error}</span> : null}
    </div>
  );
}

/** Everything a centre owner can change. Anything left empty is simply not shown on the public page. */
export default function ProfileEditor({ slug, initial, placeholders, moderation }: { slug: string; initial: CentreProfile; placeholders: Placeholders; moderation: 'review' | 'instant' }) {
  const [p, setP] = useState<CentreProfile>(initial);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'error' | 'info'; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof CentreProfile>(k: K, v: CentreProfile[K]) => setP((c) => ({ ...c, [k]: v }));
  const pricing = p.pricing ?? [];
  const photos = p.photos ?? [];
  const hours = p.hours ?? [];

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null); setErrors({});
    try {
      const res = await fetch('/api/provider/profile', { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ slug, profile: p }) });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; live?: boolean; error?: string; fields?: Record<string, string> };
      if (res.ok && j.ok) setMsg({ kind: 'ok', text: j.live ? 'Saved. Your changes are live on the public page.' : 'Saved. Your changes are waiting for review and will appear once approved.' });
      else { setMsg({ kind: 'error', text: j.error || 'Your changes were not saved.' }); setErrors(j.fields ?? {}); }
    } catch { setMsg({ kind: 'error', text: 'We could not reach the server, so nothing was saved.' }); }
    setBusy(false);
  }

  async function upload(file: File) {
    setMsg(null);
    const fd = new FormData(); fd.append('slug', slug); fd.append('file', file); fd.append('alt', '');
    const res = await fetch('/api/provider/upload', { method: 'POST', body: fd, credentials: 'same-origin' });
    const j = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string; error?: string };
    if (res.ok && j.ok && j.url) set('photos', [...photos, { url: j.url, alt: '' }]);
    else setMsg({ kind: 'error', text: j.error || 'The photo was not uploaded.' });
  }

  const group = (title: string, children: React.ReactNode) => (
    <fieldset style={{ border: `1px solid ${colors.line}`, borderRadius: 18, padding: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 16, background: '#fff' }}>
      <legend style={{ font: '600 18px Jost,sans-serif', color: colors.ink, padding: '0 8px' }}>{title}</legend>
      {children}
    </fieldset>
  );

  return (
    <form onSubmit={save} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 22 }} data-profile-form>
      <Notice kind="info">{moderation === 'review' ? 'Changes are reviewed by our team before they appear on the public page.' : 'Changes go live as soon as you save.'} Anything you leave empty is not shown.</Notice>
      {group('About your centre', (
        <Field id="description" label="Description" hint="Replaces the text on your page. Leave empty to keep the current text." error={errors.description}>
          <textarea id="description" rows={8} maxLength={8000} value={p.description ?? ''} placeholder={placeholders.description} onChange={(e) => set('description', e.target.value)} style={{ ...input, resize: 'vertical' }} />
        </Field>
      ))}
      {group('Contact', (
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
          <Field id="phone" label="Phone" error={errors.phone}><input id="phone" inputMode="tel" value={p.phone ?? ''} placeholder={placeholders.phone} onChange={(e) => set('phone', e.target.value)} style={input} /></Field>
          <Field id="email" label="Public email" error={errors.email}><input id="email" type="email" value={p.email ?? ''} placeholder={placeholders.email} onChange={(e) => set('email', e.target.value)} style={input} /></Field>
          <Field id="website" label="Website" error={errors.website}><input id="website" type="url" value={p.website ?? ''} placeholder={placeholders.website ?? 'https://'} onChange={(e) => set('website', e.target.value)} style={input} /></Field>
          {(['facebook', 'instagram', 'youtube', 'linkedin', 'twitter'] as const).map((k) => (
            <Field key={k} id={`s-${k}`} label={k[0].toUpperCase() + k.slice(1) + ' page'} error={errors[`social.${k}`]}>
              <input id={`s-${k}`} type="url" value={p.social?.[k] ?? ''} placeholder="https://" onChange={(e) => set('social', { ...p.social, [k]: e.target.value })} style={input} />
            </Field>
          ))}
        </div>
      ))}
      {group('Programs, amenities and insurance', (
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
          <Field id="programs" label="Programs (one per line)"><textarea id="programs" rows={5} value={lines(p.programs)} onChange={(e) => set('programs', fromLines(e.target.value))} style={input} /></Field>
          <Field id="amenities" label="Amenities (one per line)"><textarea id="amenities" rows={5} value={lines(p.amenities)} onChange={(e) => set('amenities', fromLines(e.target.value))} style={input} /></Field>
          <Field id="insurance" label="Insurance accepted (one per line)"><textarea id="insurance" rows={5} value={lines(p.insurance)} onChange={(e) => set('insurance', fromLines(e.target.value))} style={input} /></Field>
          <Field id="length" label="Program length" hint="For example “30–90 days”." error={errors.programLength}><input id="length" value={p.programLength ?? ''} onChange={(e) => set('programLength', e.target.value)} style={input} /></Field>
        </div>
      ))}
      {group('Pricing', (
        <>
          <p style={{ margin: 0, fontSize: 14, color: colors.muted }}>Add only prices you want to publish. Without any rows, no pricing section is shown. Visitors see “Updated” with the date you last changed it.</p>
          {pricing.map((r, i) => (
            <div key={i} style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr)) auto', alignItems: 'end' }}>
              <Field id={`pl-${i}`} label="Program" error={errors[`pricing.${i}.label`]}><input id={`pl-${i}`} value={r.label} onChange={(e) => set('pricing', pricing.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} style={input} /></Field>
              <Field id={`pp-${i}`} label="Price" error={errors[`pricing.${i}.price`]}><input id={`pp-${i}`} value={r.price} placeholder="$0,000" onChange={(e) => set('pricing', pricing.map((x, j) => (j === i ? { ...x, price: e.target.value } : x)))} style={input} /></Field>
              <Field id={`pn-${i}`} label="Note (optional)"><input id={`pn-${i}`} value={r.note ?? ''} onChange={(e) => set('pricing', pricing.map((x, j) => (j === i ? { ...x, note: e.target.value } : x)))} style={input} /></Field>
              <button type="button" onClick={() => set('pricing', pricing.filter((_, j) => j !== i))} style={btn('danger')} aria-label={`Remove price row ${i + 1}`}>Remove</button>
            </div>
          ))}
          <div><button type="button" onClick={() => set('pricing', [...pricing, { label: '', price: '' }])} style={btn('ghost')}>Add a price</button></div>
        </>
      ))}
      {group('Hours', (
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
          {DAYS.map((d) => (
            <Field key={d} id={`h-${d}`} label={d}>
              <input id={`h-${d}`} value={hours.find((h) => h.day === d)?.hours ?? ''} placeholder="e.g. 9:00am - 5:00pm, or Open 24 hours" onChange={(e) => set('hours', DAYS.flatMap((x) => { const v = x === d ? e.target.value : hours.find((h) => h.day === x)?.hours ?? ''; return v.trim() ? [{ day: x, hours: v }] : []; }))} style={input} />
            </Field>
          ))}
        </div>
      ))}
      {group('Photos', (
        <>
          <p style={{ margin: 0, fontSize: 14, color: colors.muted }}>JPEG, PNG or WebP, up to 6 MB each. Describe each photo for people who cannot see it.</p>
          <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))' }}>
            {photos.map((ph, i) => (
              <div key={ph.url} style={{ border: `1px solid ${colors.line}`, borderRadius: 14, overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ph.url} alt={ph.alt} style={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input aria-label={`Description of photo ${i + 1}`} placeholder="Description (alt text)" value={ph.alt} onChange={(e) => set('photos', photos.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))} style={input} />
                  <button type="button" onClick={() => set('photos', photos.filter((_, j) => j !== i))} style={btn('danger')}>Remove photo</button>
                </div>
              </div>
            ))}
          </div>
          <div>
            <label htmlFor="photo" style={{ ...btn('ghost'), display: 'inline-flex', alignItems: 'center' }}>Upload a photo</label>
            <input id="photo" data-photo-input type="file" accept="image/jpeg,image/png,image/webp" style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }} onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) await upload(f); }} />
          </div>
        </>
      ))}
      {msg ? <Notice kind={msg.kind}>{msg.text}</Notice> : null}
      <div><button type="submit" disabled={busy} style={btn('primary')} data-save>{busy ? 'Saving…' : 'Save changes'}</button></div>
    </form>
  );
}
