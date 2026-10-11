'use client';
import { btn } from './ui';

export default function SignOut() {
  return <button type="button" style={btn('ghost')} onClick={async () => { await fetch('/api/auth/logout', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}', credentials: 'same-origin' }); window.location.href = '/login/'; }}>Sign out</button>;
}
