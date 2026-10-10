'use client';
// Lets a server page hand a block of content to the shared site footer: <BeforeFooterProvider extra={<…/>}> wraps a view, and the
// footer (src/views/SiteFooter.jsx) renders the block just above itself. Used for the SEO "related articles / browse" link blocks.
import { createContext, useContext, type ReactNode } from 'react';

const Ctx = createContext<ReactNode>(null);
export function BeforeFooterProvider({ extra, children }: { extra: ReactNode; children: ReactNode }) {
  return <Ctx.Provider value={extra}>{children}</Ctx.Provider>;
}
export function BeforeFooterSlot() {
  return <>{useContext(Ctx)}</>;
}
