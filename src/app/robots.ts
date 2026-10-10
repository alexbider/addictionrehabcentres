import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { SITE } from '@/lib/content';
import { DRAFT_ROUTES } from '@/lib/drafts';
import { PRODUCTION_DISALLOW, isProductionHost } from '@/lib/site';

/** Depends on the Host header: only the production domain (and www.) may be crawled; every other host (*.vercel.app, previews) is Disallow: /. */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  if (!isProductionHost(host)) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Draft design pages (src/lib/drafts.ts) and private areas are not crawlable; every other path stays allowed.
      disallow: [...PRODUCTION_DISALLOW, ...DRAFT_ROUTES.map((r) => r + '/'), '/search/', '/*?q=', '/*?province=', '/*?type=', '/*?s='],
    },
    sitemap: SITE + '/sitemap.xml',
  };
}
