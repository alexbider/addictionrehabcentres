'use client';
import type { ReactNode } from 'react';
import SiteHeader, { css as headerCss } from '@/views/SiteHeader';

/** Base typography copied from the design pages (same rules as each view's `ownCss`) + SiteHeader styles. */
const baseCss =
  'html,body{margin:0;padding:0;background:#f7fafd;color:#10233a;font-family:Figtree,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}' +
  '*{box-sizing:border-box}a{color:#0890E8;text-decoration:none}a:hover{color:#0670b8}' +
  'h1,h2,h3,h4,h5,h6{font-family:Jost,Helvetica,sans-serif;margin:0;font-weight:600;letter-spacing:-0.01em;text-wrap:balance}' +
  'p{margin:0;text-wrap:pretty}ul,ol{margin:0}img{max-width:100%}';

export default function PageShell({ active, routes, children }: { active?: string; routes?: string[]; children: ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: baseCss + '\n' + headerCss }} />
      <div className="rc-page" data-sc-name="ContentPage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SiteHeader active={active} routes={routes} __hostStyle={{ position: 'sticky', top: '0', zIndex: '50' }} />
        {children}
      </div>
    </>
  );
}
