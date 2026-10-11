import type { MetadataRoute } from 'next';
import { getPublished, SITE } from '@/lib/content';
import { noindexPaths } from '@/server/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const hidden = await noindexPaths(); // pages an admin marked "no index"
  return [
    { url: SITE + '/' },
    { url: SITE + '/contact/' },
    ...getPublished().filter((e) => !e.noindex && e.route !== '/' && !hidden.has(e.route)).map((e) => ({ url: SITE + e.route, ...(e.modified ? { lastModified: e.modified } : {}) })),
  ];
}
