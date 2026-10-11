'use client';
/** Browser helper for the JSON endpoints (/api/forms/*, /api/auth/*). Adds the honeypot-free payload, the page path and (when configured) a Turnstile token. */
export type PostResult<T = Record<string, unknown>> = { ok: boolean; status: number; error?: string; fields?: Record<string, string>; data: T };

declare global { interface Window { turnstile?: { render: (el: HTMLElement, o: Record<string, unknown>) => string; execute: (id: string) => void; reset: (id: string) => void }; __tsLoad?: Promise<void> } }

async function turnstileToken(): Promise<string | undefined> {
  const site = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!site || typeof window === 'undefined') return undefined;
  window.__tsLoad ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement('script'); s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; s.async = true; s.onload = () => resolve(); s.onerror = () => reject(new Error('turnstile'));
    document.head.appendChild(s);
  });
  await window.__tsLoad;
  return new Promise((resolve) => {
    const el = document.createElement('div'); el.style.position = 'fixed'; el.style.left = '-9999px'; document.body.appendChild(el);
    const id = window.turnstile!.render(el, { sitekey: site, size: 'invisible', callback: (t: string) => { resolve(t); el.remove(); }, 'error-callback': () => { resolve(undefined); el.remove(); } });
    window.turnstile!.execute(id);
  });
}

export async function postJson<T = Record<string, unknown>>(url: string, payload: Record<string, unknown>): Promise<PostResult<T>> {
  try {
    const turnstile = await turnstileToken();
    const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ ...payload, sourcePath: window.location.pathname, ...(turnstile ? { turnstile } : {}) }) });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    return { ok: res.ok && data.ok !== false, status: res.status, error: typeof data.error === 'string' ? data.error : res.ok ? undefined : 'Something went wrong. Please try again or call 1-855-885-4747.', fields: data.fields as Record<string, string> | undefined, data: data as T };
  } catch {
    return { ok: false, status: 0, error: 'We could not reach the server, so nothing was sent. Check your connection or call 1-855-885-4747.', data: {} as T };
  }
}
