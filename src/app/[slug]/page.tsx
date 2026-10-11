import { BeforeFooterProvider } from '@/components/BeforeFooter';
import { RelatedLinks } from '@/components/RelatedLinks';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Root as ProvinceView } from '@/views/Province';
import { provinceData } from '@/lib/province';
import { Root as CityView } from '@/views/City';
import { cityData } from '@/lib/city';
import { Root as CentreView } from '@/views/Centre';
import { centreData } from '@/lib/centre';
import { Root as PostView } from '@/views/BlogPost';
import { postData } from '@/lib/post';
import { Root as DrugView } from '@/views/Drug';
import { Root as AlcoholView } from '@/views/Alcohol';
import { Root as InterventionView } from '@/views/Intervention';
import { isAlcoholView, isDrugView, isInterventionView, legacyData } from '@/lib/legacy';
import { drugData } from '@/lib/drug';
import { getPageByRoute, getPublished } from '@/lib/content';
import { JsonLd, pageMetadata } from '@/lib/metadata';
import { getPlaceReviews, placeIdFor } from '@/lib/reviews';
import { getApprovedProfile } from '@/server/profile';
import { getPageSeo } from '@/server/seo';
import { mergeProfile } from '@/lib/profile-merge';
import { routeToSlug } from '@/lib/slug';

export const dynamicParams = true; // must stay true: with false, Next cannot regenerate a page after revalidatePath() (NoFallbackError); unknown slugs still 404 via notFound()

export function generateStaticParams() {
  return getPublished().filter((e) => /^\/[^/]+\/$/.test(e.route) && e.route !== '/blog/' && e.type !== 'promote' && e.type !== 'claim').map((e) => ({ slug: e.route.slice(1, -1) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = getPageByRoute(`/${(await params).slug}/`);
  if (!page) return {};
  const m = pageMetadata(page);
  const o = await getPageSeo(page.route); // admin overrides (title / description / noindex)
  if (!o) return m;
  return { ...m, ...(o.title ? { title: { absolute: o.title } } : {}), ...(o.description ? { description: o.description } : {}), ...(o.noindex ? { robots: { index: false, follow: true } } : {}) };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const page = getPageByRoute(`/${(await params).slug}/`);
  if (!page) notFound();
  // Real Google reviews (null without GOOGLE_PLACES_API_KEY / place_id): nothing about reviews is rendered then.
  const live = page.page_type === 'centre' ? await getPlaceReviews(page.centre?.place_id ?? placeIdFor(page.route)) : null;
  // Static export content + the owner's approved edits (none without a database): pages stay static, revalidatePath() refreshes one on approval.
  const { page: merged, extra } = mergeProfile(page, page.page_type === 'centre' ? await getApprovedProfile(routeToSlug(page.route)) : null);
  // Every page type renders on its approved design view; there is no old-template fallback.
  const view = (() => {
    if (isAlcoholView(page)) return <AlcoholView data={legacyData(page)} />;
    if (isDrugView(page)) return <DrugView data={drugData(page)} />;
    if (isInterventionView(page)) return page.route === '/intervention/' ? <InterventionView /> : <InterventionView data={legacyData(page)} />;
    if (page.page_type === 'centre') return <CentreView data={centreData(merged, live, extra)} />;
    if (page.page_type === 'blog-post') return <PostView data={postData(page)} />;
    if (page.listing && page.page_type === 'province') return <ProvinceView data={provinceData(page)} />;
    if (page.listing && page.page_type === 'city') return <CityView data={cityData(page)} />;
    return null;
  })();
  if (!view) notFound();
  return (
    <>
      <JsonLd page={merged} reviews={live} />
      <BeforeFooterProvider extra={<RelatedLinks page={page} />}>{view}</BeforeFooterProvider>
    </>
  );
}
