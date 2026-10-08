'use client';
// Small design parts reused across views (markup copied from the Blog / BlogPost designs).
import React from 'react';
import { $A } from '@/dc/runtime';

/** The helpline card from the Blog design (fixed design copy, the site's helpline number). */
export function HelplineCard({ title = 'Reading for someone you love?', body = 'A confidential call is often the fastest way to a clear next step.' }) {
  return (
    <div style={{ background: 'linear-gradient(160deg,#0f5fa8,#0890E8)', borderRadius: '22px', padding: '26px', color: '#fff', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <span style={{ font: '500 12px Figtree,sans-serif', letterSpacing: '.14em', textTransform: 'uppercase', opacity: '.8' }}>Free helpline · 24/7</span>
      <h3 style={{ fontSize: '22px', color: '#fff', lineHeight: '1.2' }}>{title}</h3>
      <p style={{ fontSize: '14px', lineHeight: '1.55', opacity: '.9' }}>{body}</p>
      <$A className="scp5" href="tel:+18558854747" style={{ marginTop: '6px', display: 'inline-flex', justifyContent: 'center', font: '600 16px Jost,sans-serif', color: '#0f5fa8', background: '#fff', padding: '12px 16px', borderRadius: '10px' }}>
        Call 1-855-885-4747
      </$A>
    </div>
  );
}
