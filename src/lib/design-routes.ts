import { notFound } from 'next/navigation';

/** Draft design pages (src/lib/drafts.ts) carry the design's sample content, so a production build answers 404 for them.
 *  `next dev` serves them (audit/scripts/compare-design.mjs needs them); ENABLE_DESIGN_ROUTES=1 turns them on in a production build too. */
export function assertDesignRoute() {
  if (process.env.NODE_ENV === 'production' && process.env.ENABLE_DESIGN_ROUTES !== '1') notFound();
}
