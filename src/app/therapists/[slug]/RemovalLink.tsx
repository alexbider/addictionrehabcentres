'use client';
import { useState } from 'react';
import { postJson } from '@/lib/form-client';
import { FormError, Honeypot } from '@/components/FormBits';

/** "Request removal" on every therapist page: anyone can ask for this listing to be taken down. */
export default function RemovalLink({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const [s, setS] = useState<{ busy: boolean; done: boolean; error: string }>({ busy: false, done: false, error: '' });
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setS({ busy: true, done: false, error: '' });
    const r = await postJson('/api/forms/removal', { therapistSlug: slug, name: fd.get('name') || '', email: fd.get('email') || '', reason: fd.get('reason') || '', company_website: fd.get('company_website') || '' });
    setS(r.ok ? { busy: false, done: true, error: '' } : { busy: false, done: false, error: r.error || 'Your request was not sent.' });
  }
  return (
    <div style={{ marginTop: 18, fontSize: 15 }}>
      {s.done ? <p role="status" style={{ color: '#1d6b3f' }}>Thank you. We received your removal request and will act on it.</p> : (
        <>
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} style={{ background: 'none', border: 0, padding: 0, color: '#0670b8', cursor: 'pointer', font: '600 15px Figtree,sans-serif', textDecoration: 'underline' }}>Request removal of this profile</button>
          {open ? (
            <form onSubmit={submit} style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 480 }}>
              <Honeypot />
              <input name="email" type="email" required placeholder="Your email" aria-label="Your email" style={{ padding: 11, borderRadius: 10, border: '1px solid #cfdceb' }} />
              <textarea name="reason" rows={2} placeholder="Reason (optional)" aria-label="Reason" style={{ padding: 11, borderRadius: 10, border: '1px solid #cfdceb' }} />
              <FormError message={s.error} />
              <button disabled={s.busy} style={{ padding: '11px 16px', borderRadius: 10, border: '1.5px solid #9b1c1c', background: '#fff', color: '#9b1c1c', font: '600 15px Jost,sans-serif', cursor: 'pointer', minHeight: 44 }}>{s.busy ? 'Sending…' : 'Send removal request'}</button>
            </form>
          ) : null}
        </>
      )}
    </div>
  );
}
