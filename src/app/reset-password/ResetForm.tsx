'use client';
import { useState } from 'react';
import { postJson } from '@/lib/form-client';
import PageShell from '@/components/PageShell';
import SiteFooter from '@/views/SiteFooter';

export default function ResetForm() {
  const [pw, setPw] = useState('');
  const [state, setState] = useState<{ busy: boolean; error: string; done: boolean }>({ busy: false, error: '', done: false });
  const token = typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('token') || '';
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ busy: true, error: '', done: false });
    const r = await postJson('/api/auth/reset', { token, password: pw });
    setState(r.ok ? { busy: false, error: '', done: true } : { busy: false, error: (r.fields && r.fields.password) || r.error || 'Could not update the password.', done: false });
  };
  return (
    <PageShell active="">
      <section style={{ background: '#f7fafd', padding: '72px 16px' }}>
        <div style={{ maxWidth: 460, margin: '0 auto', background: '#fff', border: '1px solid #e3ecf4', borderRadius: 22, padding: 32 }}>
          <h1 style={{ fontSize: 30, margin: '0 0 8px' }}>Choose a new password</h1>
          {state.done ? (
            <p role="status" style={{ color: '#1d6b3f' }}>Password updated. <a href="/login/" style={{ color: '#0670b8', fontWeight: 600 }}>Sign in</a></p>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label htmlFor="npw" style={{ font: '600 14px Figtree,sans-serif' }}>New password (at least 10 characters)</label>
              <input id="npw" type="password" autoComplete="new-password" minLength={10} required value={pw} onChange={(e) => setPw(e.target.value)} style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid #cfdceb', font: '500 16px Figtree,sans-serif' }} />
              {state.error ? <p role="alert" style={{ margin: 0, padding: '12px 14px', borderRadius: 12, background: '#fdecec', color: '#9b1c1c' }}>{state.error}</p> : null}
              {!token ? <p role="alert" style={{ margin: 0, color: '#9b1c1c' }}>This page needs the link from your email.</p> : null}
              <button type="submit" disabled={state.busy || !token} style={{ padding: '13px 18px', borderRadius: 12, border: 0, background: '#10233a', color: '#fff', font: '600 16px Jost,sans-serif', cursor: 'pointer' }}>{state.busy ? 'Saving…' : 'Update password'}</button>
            </form>
          )}
        </div>
      </section>
      <SiteFooter />
    </PageShell>
  );
}
