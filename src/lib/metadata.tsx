import type { Metadata } from 'next';
import type { Page } from './content';
import { toSite } from './site';

const metaOf = (page: Page, name: string) => page.head?.meta.find((m) => m[1] === name)?.[2];

/** Title, description, canonical and robots exactly as the live source publishes them (domain from NEXT_PUBLIC_SITE_URL).
 *  Open Graph / Twitter / article tags are emitted verbatim by <SeoHead>, so they are not set here (no duplicates). */
export function pageMetadata(page: Page): Metadata {
  const { seo, source } = page;
  const robotsSrc = metaOf(page, 'robots') ?? source.robots ?? '';
  const index = !/noindex/.test(robotsSrc);
  const follow = !/nofollow/.test(robotsSrc);
  const canonical = page.head ? page.head.canonical : seo.canonical_source;
  const description = page.head ? metaOf(page, 'description') : seo.meta_description;
  return {
    title: { absolute: page.head?.title ?? seo.meta_title },
    ...(description ? { description } : {}),
    ...(canonical ? { alternates: { canonical: toSite(canonical) } } : {}), // the source emits no canonical on some noindex pages
    robots: index ? { index, follow, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } : { index, follow },
  };
}

/** The source's Open Graph, article, Twitter tags and rel=next/prev links, verbatim (React hoists them into <head>). */
export function SeoHead({ page }: { page: Page }) {
  const h = page.head;
  if (!h) return null;
  return (
    <>
      {h.meta
        .filter(([, n]) => /^(og:|article:|twitter:)/.test(n))
        .map(([kind, n, c], i) => (kind === 'property' ? <meta key={i} property={n} content={toSite(c)} /> : <meta key={i} name={n} content={toSite(c)} />))}
      {h.links.filter(([rel]) => rel === 'next' || rel === 'prev').map(([rel, , href], i) => (
        <link key={'l' + i} rel={rel} href={toSite(href)} />
      ))}
    </>
  );
}

/** The structured data the live source page carries (Article, BreadcrumbList, FAQPage, …), unchanged apart from the domain variable. */
export function JsonLd({ page }: { page: Page }) {
  return (
    <>
      <SeoHead page={page} />
      {page.seo.jsonld_source.map((g, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toSite(g)).replace(/</g, '\\u003c') }} />
      ))}
    </>
  );
}
