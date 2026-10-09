import type { MetadataRoute } from 'next';
import { getPublished, SITE } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE + '/' },
    { url: SITE + '/contact/' },
    { url: SITE + '/centre-onboarding/' },
    ...getPublished().filter((e) => !e.noindex && e.route !== '/').map((e) => ({ url: SITE + e.route, ...(e.modified ? { lastModified: e.modified } : {}) })),
  ];
}
