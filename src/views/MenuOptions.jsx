'use client';
// Generated from Menu Options.dc.html — layout, styles and copy are a 1:1 port of the design.
import React, { Fragment } from 'react';
import { DCLogic, createDC, DCRoot, $A, $i, $css, $list, $val, $chk, $styleVal, $hostStyle } from '@/dc/runtime';
import SiteHeader, { css as SiteHeader_css } from './SiteHeader';

/* ───────────────────────── component logic (state, handlers, data) ───────────────────────── */
class Component extends DCLogic {}

/* ───────────────────────── markup ───────────────────────── */
function template(v) {
  return (
    <>
      <section style={{ padding: '48px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span
            style={{
              font: '600 12px Figtree,sans-serif',
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              color: '#7a6a58',
            }}
          >
            {'Turn 3 · Warm & human mega menu'}
          </span>
          <h1 style={{ font: '600 30px Jost,sans-serif', color: '#10233a', margin: '0' }}>Two layouts: pick one</h1>
          <p style={{ font: '400 15px/1.5 Figtree,sans-serif', color: '#5d6b7a', margin: '0', maxWidth: '720px' }}>
            Both are live. Hover the other menu items to switch sections. Drop photos onto the placeholders.{' '}
            <$A href="#3a">3a</$A> keeps columns with a feature card; <$A href="#3b">3b</$A> uses category tabs on the
            left.
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', alignItems: 'flex-start' }}>
          <div id="3a" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  font: '600 13px Jost,sans-serif',
                  color: '#fff',
                  background: '#10233a',
                  borderRadius: '8px',
                  padding: '4px 9px',
                }}
              >
                3a
              </span>
              <span style={{ font: '600 15px Figtree,sans-serif', color: '#10233a' }}>Columns + feature card</span>
            </div>
            <div
              style={{
                width: '1280px',
                height: '880px',
                background: '#fff',
                borderRadius: '18px',
                boxShadow: '0 30px 60px -30px rgba(58,44,30,.4)',
                position: 'relative',
              }}
            >
              <SiteHeader layout="columns" previewOpen="alcohol" />
            </div>
          </div>
          <div id="3b" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  font: '600 13px Jost,sans-serif',
                  color: '#fff',
                  background: '#10233a',
                  borderRadius: '8px',
                  padding: '4px 9px',
                }}
              >
                3b
              </span>
              <span style={{ font: '600 15px Figtree,sans-serif', color: '#10233a' }}>
                Category tabs → content (hover to switch)
              </span>
            </div>
            <div
              style={{
                width: '1280px',
                height: '880px',
                background: '#fff',
                borderRadius: '18px',
                boxShadow: '0 30px 60px -30px rgba(58,44,30,.4)',
                position: 'relative',
              }}
            >
              <SiteHeader layout="tabs" previewOpen="drugs" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export const ownCss =
  '*{box-sizing:border-box}a{text-decoration:none}body{margin:0;background:#ede6db;font-family:Figtree,sans-serif}a{color:#0890E8}a:hover{color:#0670b8}\nhtml,body{background:#f0eee6}#dc-root>.sc-host{position:relative}';
export const css = [ownCss, SiteHeader_css].filter(Boolean).join('\n');
export const defaults = {};
const View = createDC('Menu Options', Component, template);
export default View;
export function Root(props) {
  return <DCRoot View={View} defaults={defaults} css={css} {...props} />;
}
