'use client';
/** Shared bits of the public forms: an invisible honeypot field (bots fill it, people never see it) and an accessible error message. */
export function Honeypot() {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
      <label>Leave this field empty<input type="text" name="company_website" tabIndex={-1} autoComplete="off" defaultValue="" /></label>
    </div>
  );
}

export function FormError({ message, fields }: { message?: string; fields?: Record<string, string> }) {
  if (!message) return null;
  const list = fields ? Object.entries(fields).filter(([k]) => k !== 'form') : [];
  return (
    <div role="alert" style={{ padding: '12px 14px', borderRadius: 12, background: '#fdecec', color: '#9b1c1c', fontSize: 14.5, lineHeight: 1.45 }}>
      {message}
      {list.length ? <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>{list.map(([k, v]) => <li key={k}>{k}: {v}</li>)}</ul> : null}
    </div>
  );
}
