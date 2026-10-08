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

/* ───────── Search (the /search/ page on the City view) ───────── */
const fieldLabel = { font: '600 11px Figtree,sans-serif', letterSpacing: '.1em', textTransform: 'uppercase', color: '#6b7f95' };
const fieldBox = { display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2px', minHeight: '56px', padding: '6px 14px', borderRadius: '10px', minWidth: 0 };
const fieldInput = { appearance: 'none', border: '0', background: 'transparent', font: '500 15px Figtree,sans-serif', color: '#10233a', outline: 'none', padding: '0', width: '100%', minWidth: 0 };

/** Filters, sort and removable chips: same controls as the Home search, in the Home form's card style. */
export function SearchControls({ search }) {
  const S = search;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <form role="search" onSubmit={(e) => { e.preventDefault(); S.submit(); }} style={{ background: '#fff', border: '1px solid #dbe6f0', borderRadius: '16px', padding: '8px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: '8px', boxShadow: '0 20px 50px -30px rgba(16,35,58,.35)' }}>
        <label style={fieldBox}>
          <span style={fieldLabel}>Search</span>
          <input type="search" name="q" value={S.draft} onChange={(e) => S.setDraft(e.target.value)} placeholder="Name, city or keyword" autoComplete="off" style={fieldInput} />
        </label>
        <label style={{ ...fieldBox, borderLeft: '1px solid #e9eff5' }}>
          <span style={fieldLabel}>Location</span>
          <select name="province" value={S.province} onChange={(e) => S.set({ province: e.target.value })} style={{ ...fieldInput, cursor: 'pointer' }}>
            <option value="">Anywhere in Canada</option>
            {S.provinces.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>
        <label style={{ ...fieldBox, borderLeft: '1px solid #e9eff5' }}>
          <span style={fieldLabel}>Treatment for</span>
          <select name="type" value={S.type} onChange={(e) => S.set({ type: e.target.value })} style={{ ...fieldInput, cursor: 'pointer' }}>
            <option value="">Any addiction</option>
            {S.types.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>
        <label style={{ ...fieldBox, borderLeft: '1px solid #e9eff5' }}>
          <span style={fieldLabel}>Sort by</span>
          <select name="sort" value={S.sort} onChange={(e) => S.set({ sort: e.target.value })} style={{ ...fieldInput, cursor: 'pointer' }}>
            <option value="relevance">Relevance</option>
            <option value="az">A to Z</option>
          </select>
        </label>
        <button type="submit" style={{ appearance: 'none', border: '0', cursor: 'pointer', font: '600 16px Jost,sans-serif', color: '#fff', background: '#0890E8', padding: '0 22px', borderRadius: '11px', minHeight: '56px' }}>Search</button>
      </form>
      {S.chips.length ? (
        <ul aria-label="Active filters" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {S.chips.map((c) => (
            <li key={c.key}>
              <button type="button" onClick={c.remove} aria-label={'Remove filter: ' + c.label} style={{ appearance: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', minHeight: '44px', padding: '0 14px', borderRadius: '999px', border: '1px solid #cfe0ef', background: '#fff', color: '#10233a', font: '500 14px Figtree,sans-serif' }}>
                {c.label}
                <span aria-hidden="true" style={{ fontSize: '18px', lineHeight: 1, color: '#516378' }}>×</span>
              </button>
            </li>
          ))}
          <li>
            <button type="button" onClick={S.clear} style={{ appearance: 'none', cursor: 'pointer', minHeight: '44px', padding: '0 12px', border: 0, background: 'transparent', color: '#0670b8', font: '600 14px Figtree,sans-serif', textDecoration: 'underline' }}>Clear all</button>
          </li>
        </ul>
      ) : null}
    </div>
  );
}

/** Shown instead of the list when nothing matches (or before the results load): message, helpline, real suggestions. */
export function SearchEmpty({ search }) {
  const S = search;
  return (
    <div style={{ background: '#fff', border: '1px solid #e3ecf4', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <h3 style={{ fontSize: '26px', lineHeight: '1.2' }}>{S.emptyTitle}</h3>
      <p style={{ fontSize: '16.5px', lineHeight: '1.7', color: '#3b4d63', maxWidth: '760px' }}>{S.emptyText}</p>
      <div>
        <$A className="scp1" href="tel:+18558854747" style={{ display: 'inline-flex', alignItems: 'center', font: '600 16px Jost,sans-serif', color: '#fff', background: '#0890E8', padding: '14px 22px', borderRadius: '12px' }}>Call 1-855-885-4747</$A>
      </div>
      {S.suggestCities.length ? (
        <div>
          <div style={fieldLabel}>Cities with centres</div>
          <ul style={{ listStyle: 'none', margin: '10px 0 0', padding: 0, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {S.suggestCities.map((c) => <li key={c.href}><$A className="scp2" href={c.href} style={{ display: 'inline-flex', alignItems: 'center', minHeight: '44px', padding: '0 14px', borderRadius: '999px', border: '1px solid #dbe6f0', background: '#fff', color: '#10233a', font: '500 14px Figtree,sans-serif' }}>{c.label}</$A></li>)}
          </ul>
        </div>
      ) : null}
      <div>
        <div style={fieldLabel}>Provinces and territories</div>
        <ul style={{ listStyle: 'none', margin: '10px 0 0', padding: 0, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {S.suggestProvinces.map((c) => <li key={c.label}>{c.href ? <$A className="scp2" href={c.href} style={{ display: 'inline-flex', alignItems: 'center', minHeight: '44px', padding: '0 14px', borderRadius: '999px', border: '1px solid #dbe6f0', background: '#fff', color: '#10233a', font: '500 14px Figtree,sans-serif' }}>{c.label}</$A> : <span style={{ display: 'inline-flex', alignItems: 'center', minHeight: '44px', padding: '0 14px', color: '#516378', font: '500 14px Figtree,sans-serif' }}>{c.label}</span>}</li>)}
        </ul>
      </div>
    </div>
  );
}

export function SearchMore({ search }) {
  const S = search;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '28px' }}>
      <button type="button" onClick={S.more} style={{ appearance: 'none', cursor: 'pointer', font: '600 16px Jost,sans-serif', color: '#0670b8', background: '#fff', border: '1.5px solid #0670b8', borderRadius: '12px', padding: '0 24px', minHeight: '48px' }}>Load more ({S.remaining} more)</button>
    </div>
  );
}
