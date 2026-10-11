'use client';
import { useState, type CSSProperties, type ReactNode } from 'react';
import Lightbox, { type LightboxImage } from './Lightbox';

/** The centre page's hero photo grid: every tile and the "Show all N photos" button open the lightbox. No images → nothing is rendered. */
export default function GalleryGrid({ images, children, photoIcon }: { images: LightboxImage[]; children?: ReactNode; photoIcon?: ReactNode }) {
  const [open, setOpen] = useState<number | null>(null);
  const top = images.slice(0, 5);
  const n = top.length;
  if (!n) return null;
  const cols = n <= 1 ? 'minmax(0,1fr)' : n <= 3 ? '2fr 1fr' : '2fr 1fr 1fr';
  const place = (i: number): CSSProperties => (n >= 3 && i === 0 ? { gridRow: '1/3' } : n === 4 && i === 3 ? { gridColumn: '2/4' } : {});
  return (
    <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: cols, gridTemplateRows: n <= 2 ? '1fr' : '1fr 1fr', gap: 10, height: 440 }} data-cols="2fr 1fr 1fr" data-gallery>
      {top.map((x, i) => (
        <button key={x.src} type="button" onClick={() => setOpen(i)} aria-label={`Open photo ${i + 1} of ${images.length}: ${x.alt}`} style={{ ...place(i), minHeight: 0, borderRadius: 16, overflow: 'hidden', height: '100%', background: '#eaf2f8', border: 0, padding: 0, cursor: 'zoom-in', display: 'block' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={x.src} alt={x.alt} width={x.width || undefined} height={x.height || undefined} loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : undefined} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </button>
      ))}
      <button type="button" data-show-all onClick={() => setOpen(0)} className="scp2" style={{ position: 'absolute', right: 16, bottom: 16, appearance: 'none', cursor: 'pointer', font: '600 14px Jost,sans-serif', color: '#10233a', background: '#fff', border: '1px solid #dbe6f0', padding: '10px 16px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 10px 24px -14px rgba(16,35,58,.5)' }}>
        {photoIcon}
        {images.length === 1 ? 'View photo' : `Show all ${images.length} photos`}
      </button>
      {children}
      {open !== null ? <Lightbox images={images} start={open} onClose={() => setOpen(null)} label="Centre photos" /> : null}
    </div>
  );
}
