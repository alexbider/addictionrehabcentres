'use client';
/**
 * Runtime for the page "views" in src/views.
 *
 * The design was authored as HTML templates + a small logic class per page (state, handlers, data).
 * Each view keeps that exact structure: a logic class (`Component`) whose `renderVals()` feeds a JSX template.
 * This file provides the tiny host that wires them together, with the same semantics as the original:
 *   • `setState` merges into `this.state` synchronously, then re-renders
 *   • lifecycle: componentDidMount / componentDidUpdate(prevProps, prevState) / componentWillUnmount
 *   • every view is wrapped in <div class="sc-host">, interpolated values in <span class="sc-interp">
 */
import React, { Fragment, isValidElement } from 'react';
import Link from 'next/link';
import Script from 'next/script';

/* ───────────── style helpers ───────────── */
const kebabToCamel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
export function cssToObj(css) {
  const o = {};
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    o[prop.startsWith('--') ? prop : kebabToCamel(prop)] = decl.slice(i + 1).trim();
  }
  return o;
}
const HOST_STYLE_PROPS = new Set(['position', 'left', 'right', 'top', 'bottom', 'inset', 'width', 'height', 'z-index', 'transform']);
export function $hostStyle(style) {
  const all = typeof style === 'string' ? cssToObj(style) : style != null && typeof style === 'object' ? style : null;
  if (!all) return undefined;
  const out = {};
  for (const [k, v] of Object.entries(all)) {
    if (HOST_STYLE_PROPS.has(k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()))) out[k] = v;
  }
  return Object.keys(out).length ? out : undefined;
}
export const $css = (s) => cssToObj(String(s));
export const $styleVal = (v) => (typeof v === 'string' ? cssToObj(v) : v);

/* ───────────── template helpers ───────────── */
export const $val = (v) => (v === undefined ? '' : v);
export const $chk = (v) => (v === undefined ? false : v);
export const $list = (v) => (Array.isArray(v) ? v : []);
/** `{{ value }}` in text: strings/numbers are wrapped in an inline span (as in the original), elements pass through. */
export function $i(v) {
  if (v === undefined) return null;
  if (isValidElement(v) || Array.isArray(v)) return <Fragment>{v}</Fragment>;
  if (v === null || typeof v === 'boolean') return null;
  return <span className="sc-interp">{String(v)}</span>;
}
/** Every <a>: internal paths use next/link (client-side navigation), everything else stays a plain anchor. */
export function $A({ href, children, ...rest }) {
  if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')) {
    return <Link href={href} {...rest}>{children}</Link>;
  }
  return <a href={href} {...rest}>{children}</a>;
}

/* ───────────── logic base class ───────────── */
export class DCLogic {
  constructor(props) {
    this.props = props || {};
    this.state = {};
    this.__host = null;
  }
  setState(update, cb) {
    if (this.__host) this.__host.__setLogicState(update, cb);
  }
  forceUpdate() {
    if (this.__host) this.__host.forceUpdate();
  }
  componentDidMount() {}
  componentDidUpdate() {}
  componentWillUnmount() {}
  renderVals() {
    return {};
  }
}

/* ───────────── host ───────────── */
class DCHost extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tick: 0, mounted: false };
    this.__rendered = null;
    this.__prevRendered = null;
    this.logic = new props.Logic(this.__userProps());
    this.logic.__host = this;
  }
  __userProps() {
    // eslint-disable-next-line no-unused-vars
    const { dcName, Logic, template, __hostStyle, __root, __rc, ...rest } = this.props;
    return rest;
  }
  __setLogicState(update, cb) {
    const prev = this.logic.state;
    const patch = typeof update === 'function' ? update(prev) : update;
    this.logic.state = { ...prev, ...patch };
    this.setState((s) => ({ tick: s.tick + 1 }), cb);
  }
  componentDidMount() {
    try { this.logic.componentDidMount(); } catch (e) { console.error(e); }
    // Layout that depends on the measured width has now been applied — reveal the page in the same paint.
    if (this.props.__root) this.setState({ mounted: true });
  }
  componentDidUpdate(prevProps) {
    this.logic.props = this.__userProps();
    try { this.logic.componentDidUpdate(prevProps, this.__prevRendered); } catch (e) { console.error(e); }
  }
  componentWillUnmount() {
    try { this.logic.componentWillUnmount(); } catch (e) { console.error(e); }
  }
  render() {
    const userProps = this.__userProps();
    this.logic.props = userProps;
    let vals = userProps;
    try {
      vals = { ...userProps, ...(this.logic.renderVals() || {}) };
    } catch (e) {
      console.error(`${this.props.dcName}.renderVals():`, e);
    }
    this.__prevRendered = this.__rendered;
    this.__rendered = this.logic.state;
    const pending = this.props.__root && !this.state.mounted;
    return (
      <div className={'sc-host' + (this.props.__rc ? ' rc-page' : '') + (pending ? ' dc-pending' : '')} data-sc-name={this.props.dcName} style={this.props.__hostStyle}>
        {this.props.template(vals)}
      </div>
    );
  }
}

export function createDC(dcName, Logic, template) {
  function DC(props) {
    return <DCHost dcName={dcName} Logic={Logic} template={template} {...props} />;
  }
  DC.displayName = dcName;
  return DC;
}

/** Page root: injects the page's own stylesheet (scoped to the page's lifetime) and applies the prop defaults. */
export function DCRoot({ View, defaults, css, imageSlot, responsive, ...props }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <View {...defaults} {...props} __root __rc={responsive} />
      {imageSlot ? <Script src="/image-slot.js" strategy="afterInteractive" /> : null}
    </>
  );
}
