import type { Metadata } from 'next';
import type { Page } from './content';
import { toSite } from './site';

/** Source title, description, canonical and robots exactly as published (the domain comes from NEXT_PUBLIC_SITE_URL, default the live domain). */
export function pageMetadata(page: Page): Metadata {
  const { seo, source } = page;
  const robots = source.robots || '';
  const index = !/noindex/.test(robots);
  const follow = !/nofollow/.test(robots);
  return {
    title: { absolute: seo.meta_title },
    description: seo.meta_description,
    ...(seo.canonical_source ? { alternates: { canonical: toSite(seo.canonical_source) } } : {}), // the source emits no canonical on 7 noindex pages
    robots: index ? { index, follow, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } : { index, follow },
    openGraph: {
      type: 'article', title: seo.og.title || seo.meta_title, description: seo.og.description || seo.meta_description, ...(seo.canonical_source ? { url: toSite(seo.canonical_source) } : {}),
      ...(seo.og.image ? { images: [toSite(seo.og.image)] } : {}),
    },
  };
}

/** The structured data the source page carries (Article, BreadcrumbList, FAQPage, …), unchanged. */
export function JsonLd({ page }: { page: Page }) {
  return (
    <>
      {page.seo.jsonld_source.map((g, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toSite(g)).replace(/</g, '\\u003c') }} />
      ))}
    </>
  );
}
