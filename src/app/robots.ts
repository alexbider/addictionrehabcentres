import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/content';
import { DRAFT_ROUTES } from '@/lib/drafts';

export default function robots(): MetadataRoute.Robots {
  // Draft design pages (see src/lib/drafts.ts) are not crawlable; every other path stays allowed.
  return { rules: { userAgent: '*', allow: '/', disallow: DRAFT_ROUTES.flatMap((r) => [r, r + '/']) }, sitemap: SITE + '/sitemap_index.xml' };
}
