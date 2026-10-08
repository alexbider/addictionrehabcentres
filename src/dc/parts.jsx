'use client';
// Small design parts reused across views (markup copied from the Blog / BlogPost designs).
import React from 'react';
import { $A } from '@/dc/runtime';
import { buildBody } from '@/dc/guide';

/** The helpline card from the Blog design (fixed design copy, the site's helpline number). */
export function HelplineCard({ title = 'Reading for someone you love?', body = 'A confidential call is often the fastest way to a clear next step.' }) {
  return (
    <div style={{ background: 'linear-gradient(160deg,#0f5fa8,#0890E8)', borderRadius: '22px', padding: '26px', color: '#fff', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <span style={{ font: '500 12px Figtree,sans-serif', letterSpacing: '.14em', textTransform: 'uppercase', opacity: '.8' }}>Free helpline · 24/7</span>
      <div style={{ fontSize: '22px', color: '#fff', lineHeight: '1.2', fontFamily: 'Jost,Helvetica,sans-serif', fontWeight: 600 }}>{title}</div>
      <p style={{ fontSize: '14px', lineHeight: '1.55', opacity: '.9' }}>{body}</p>
      <$A className="scp5" href="tel:+18558854747" style={{ marginTop: '6px', display: 'inline-flex', justifyContent: 'center', font: '600 16px Jost,sans-serif', color: '#0f5fa8', background: '#fff', padding: '12px 16px', borderRadius: '10px' }}>
        Call 1-855-885-4747
      </$A>
    </div>
  );
}

const eyebrow = { font: '600 12px Figtree,sans-serif', letterSpacing: '.14em', textTransform: 'uppercase', color: '#0890E8' };

/** "Let Us Help You" band: source help text + helpline button + the source's list of links (no form: no FORM_ENDPOINT). */
export function HelpSection({ heading, blocks = [], links = [], label = 'Let Us Help You' }) {
  const nodes = buildBody(React.createElement, blocks).nodes;
  return (
    <section data-screen-label="Let Us Help You" style={{ background: '#f7fafd', borderTop: '1px solid #e9eff5' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '72px 32px', display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: '48px', alignItems: 'start' }} data-cols="1.1fr .9fr" data-rc-gap="1" data-rc-wrap="1">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
          <h3 style={{ fontSize: '36px', lineHeight: '1.12' }} data-rc-lg="1">{heading || label}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '17px', lineHeight: '1.7', color: '#3b4d63' }}>{nodes}</div>
          <$A className="scp1" href="tel:+18558854747" style={{ alignSelf: 'flex-start', font: '600 16px Jost,sans-serif', color: '#fff', background: '#0890E8', padding: '14px 22px', borderRadius: '12px', boxShadow: '0 10px 24px -12px rgba(8,144,232,.6)' }}>
            Call 1-855-885-4747
          </$A>
        </div>
        {links.length ? (
          <ul style={{ listStyle: 'none', margin: 0, padding: '22px', background: '#fff', border: '1px solid #e3ecf4', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {links.map((l, i) => (
              <li key={i}>
                <$A className="scp0" href={l.href} style={{ display: 'block', padding: '10px 6px', borderTop: i ? '1px solid #edf2f7' : '0', font: '500 15.5px Figtree,sans-serif', color: '#1f3550' }}>{l.label}</$A>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

/** Heading + grid of link tiles (provinces / other drugs). */
export function LinkTiles({ kicker, heading, items = [], cols = 4, bg = '#f7fafd', screen, plain = false }) {
  if (!items.length) return null;
  return (
    <section data-screen-label={screen} style={{ background: bg, borderTop: '1px solid #e9eff5' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '72px 32px' }} data-rc-wrap="1">
        <div style={{ marginBottom: '28px' }}>
          {kicker ? <span style={eyebrow}>{kicker}</span> : null}
          {plain ? <div style={{ font: '600 32px Jost,sans-serif', marginTop: '8px', letterSpacing: '-0.01em' }}>{heading}</div> : <h3 style={{ fontSize: '32px', marginTop: '8px' }}>{heading}</h3>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: '14px' }} data-cols={`repeat(${cols},1fr)`}>
          {items.map((it, i) => (
            it.href ? <$A key={i} className="scp1b" href={it.href} style={{ background: '#fff', border: '1px solid #e3ecf4', borderRadius: '16px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px', color: '#10233a', transition: 'transform .18s,border-color .18s', font: '500 15px Figtree,sans-serif' }}>
              {plain || it.heading === false ? it.label : <h3 style={{ font: '500 15px Figtree,sans-serif', margin: 0, letterSpacing: 0 }}>{it.label}</h3>}
            </$A> : <span key={i} style={{ background: '#fff', border: '1px solid #e3ecf4', borderRadius: '16px', padding: '16px 18px', display: 'flex', alignItems: 'center', color: '#6b7f95', font: '500 15px Figtree,sans-serif' }}>{plain || it.heading === false ? it.label : <h3 style={{ font: 'inherit', margin: 0 }}>{it.label}</h3>}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
