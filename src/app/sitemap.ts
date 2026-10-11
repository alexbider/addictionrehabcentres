import type { MetadataRoute } from 'next';
import { getPublished, SITE } from '@/lib/content';
import { noindexPaths } from '@/server/seo';
import { getPublishedTherapists } from '@/server/therapists';

// Rendered per request: published therapists and admin "no index" overrides change without a deploy.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const hidden = await noindexPaths(); // pages an admin marked "no index"
  const therapists = await getPublishedTherapists(); // empty until therapists publish their own profiles
  return [
    { url: SITE + '/' },
    { url: SITE + '/contact/' },
    ...(therapists.length ? [{ url: SITE + '/therapists/' }, ...therapists.map((t) => ({ url: `${SITE}/therapists/${t.slug}/` }))] : []),
    ...getPublished().filter((e) => !e.noindex && e.route !== '/' && !hidden.has(e.route)).map((e) => ({ url: SITE + e.route, ...(e.modified ? { lastModified: e.modified } : {}) })),
  ];
}
