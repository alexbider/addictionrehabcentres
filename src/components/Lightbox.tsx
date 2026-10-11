'use client';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type LightboxImage = { src: string; alt: string; width?: number | null; height?: number | null };

const FOCUSABLE = 'button:not([disabled]),[href],[tabindex]:not([tabindex="-1"])';

/** Accessible image lightbox: Esc closes, ←/→ navigate, swipe on touch screens, focus is trapped inside and returned to the trigger on close,
 *  counter "3 / 12", close button, neighbours preloaded, images served through next/image. */
export default function Lightbox({ images, start, onClose, label = 'Photo gallery' }: { images: LightboxImage[]; start: number; onClose: () => void; label?: string }) {
  const [i, setI] = useState(Math.min(Math.max(start, 0), images.length - 1));
  const box = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const n = images.length;
  const go = useCallback((d: number) => setI((c) => (c + d + n) % n), [n]);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    box.current?.querySelector<HTMLElement>('[data-close]')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      else if (e.key === 'Tab' && box.current) {
        const f = [...box.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; prev?.focus?.(); };
  }, [go, onClose]);

  const cur = images[i];
  const near = n > 1 ? [images[(i + 1) % n], images[(i - 1 + n) % n]] : [];
  const btn: React.CSSProperties = { position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, borderRadius: 999, border: '1px solid rgba(255,255,255,.35)', background: 'rgba(16,35,58,.6)', color: '#fff', cursor: 'pointer', font: '600 22px Jost,sans-serif', display: 'grid', placeItems: 'center' };
  return createPortal(
    <div
      ref={box}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => { if (touchX.current == null) return; const dx = e.changedTouches[0].clientX - touchX.current; touchX.current = null; if (Math.abs(dx) > 50 && n > 1) go(dx < 0 ? 1 : -1); }}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(8,16,28,.92)', display: 'grid', placeItems: 'center', padding: '56px 16px 64px' }}
    >
      <div style={{ position: 'absolute', top: 12, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
        <span aria-live="polite" data-counter style={{ font: '600 15px Jost,sans-serif' }}>{i + 1} / {n}</span>
        <button type="button" data-close onClick={onClose} aria-label="Close gallery" style={{ ...btn, position: 'static', transform: 'none' }}>×</button>
      </div>
      <div style={{ position: 'relative', width: 'min(1200px,100%)', height: 'min(100%,80vh)' }}>
        <Image key={cur.src} src={cur.src} alt={cur.alt} fill sizes="100vw" priority style={{ objectFit: 'contain' }} />
      </div>
      {n > 1 ? (
        <>
          <button type="button" data-prev onClick={() => go(-1)} aria-label="Previous photo" style={{ ...btn, left: 12 }}>‹</button>
          <button type="button" data-next onClick={() => go(1)} aria-label="Next photo" style={{ ...btn, right: 12 }}>›</button>
        </>
      ) : null}
      <p style={{ position: 'absolute', bottom: 16, left: 16, right: 16, margin: 0, textAlign: 'center', color: '#dbe6f0', font: '500 14px Figtree,sans-serif' }}>{cur.alt}</p>
      {/* neighbours are preloaded so next/previous is instant */}
      <div aria-hidden style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0 }}>
        {near.map((x) => <Image key={x.src} src={x.src} alt="" width={x.width || 1000} height={x.height || 700} sizes="100vw" />)}
      </div>
    </div>,
    document.body,
  );
}
