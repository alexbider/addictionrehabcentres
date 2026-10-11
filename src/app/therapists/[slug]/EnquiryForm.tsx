'use client';
import { useState } from 'react';
import { postJson } from '@/lib/form-client';
import { FormError, Honeypot } from '@/components/FormBits';

const input = { width: '100%', padding: '11px 13px', borderRadius: 12, border: '1px solid #cfdceb', font: '500 15.5px Figtree,sans-serif' } as const;

/** Sends a message to the therapist through the site (their e-mail address is never shown). Success only after the server saved it. */
export default function EnquiryForm({ slug, name }: { slug: string; name: string }) {
  const [s, setS] = useState<{ busy: boolean; done: boolean; error: string; fields?: Record<string, string> }>({ busy: false, done: false, error: '' });
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setS({ busy: true, done: false, error: '' });
    const r = await postJson('/api/forms/enquiry', { therapistSlug: slug, name: fd.get('name') || '', email: fd.get('email') || '', phone: fd.get('phone') || '', message: fd.get('message') || '', company_website: fd.get('company_website') || '' });
    setS(r.ok ? { busy: false, done: true, error: '' } : { busy: false, done: false, error: r.error || 'Your message was not sent.', fields: r.fields });
  }
  if (s.done) return <section role="status" style={{ marginTop: 22, background: '#e9f8ef', border: '1px solid #bfe6cf', borderRadius: 22, padding: 24, color: '#1d6b3f' }}><h2 style={{ fontSize: 22 }}>Message sent</h2><p>{name} will reply to the address you gave.</p></section>;
  return (
    <form onSubmit={submit} style={{ marginTop: 22, background: '#fff', border: '1px solid #e3ecf4', borderRadius: 22, padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ fontSize: 22 }}>Send {name} a message</h2>
      <Honeypot />
      <input name="name" required placeholder="Your name" aria-label="Your name" style={input} />
      <input name="email" type="email" required placeholder="Your email" aria-label="Your email" style={input} />
      <input name="phone" type="tel" placeholder="Phone (optional)" aria-label="Phone (optional)" style={input} />
      <textarea name="message" required rows={4} placeholder="How can they help? Please do not include medical details." aria-label="Message" style={input} />
      <FormError message={s.error} fields={s.fields} />
      <button disabled={s.busy} style={{ padding: '13px 18px', borderRadius: 12, border: 0, background: '#10233a', color: '#fff', font: '600 16px Jost,sans-serif', cursor: 'pointer', minHeight: 48 }}>{s.busy ? 'Sending…' : 'Send message'}</button>
    </form>
  );
}
