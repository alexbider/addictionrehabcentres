'use client';
import { useEffect } from 'react';

/** Counts a visit to a listing page (and clicks on its phone / e-mail / website links) for the owner's dashboard analytics.
 *  Anonymous: no cookie, no identifier; only the day, the counter and the page on this site the visitor came from. */
export default function TrackListing({ entity, slug }: { entity: 'centre' | 'therapist'; slug: string }) {
  useEffect(() => {
    const send = (k: string, r?: string) => {
      try {
        const body = JSON.stringify({ e: entity, s: slug, k, r });
        fetch('/api/track', { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true, credentials: 'omit' }).catch(() => {});
      } catch { /* analytics never breaks the page */ }
    };
    let ref = '';
    try { const u = new URL(document.referrer); if (u.host === location.host) ref = u.pathname + u.search; } catch { /* external or none */ }
    send('view', ref);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a');
      if (!a) return;
      const h = a.getAttribute('href') || '';
      if (h.startsWith('tel:')) send('call');
      else if (h.startsWith('mailto:') || (/^https?:/.test(h) && !h.includes(location.host))) send('click');
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [entity, slug]);
  return null;
}
