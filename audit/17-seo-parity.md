# SEO parity: live source vs built site

Baseline: live <head> and content outline pulled from addictionrehabcenters.ca (audit/data/source-head.json). Built site checked on localhost:3100 with the production Host header. Per-page results: audit/17-seo-parity.csv (PASS / DIFF / MISSING-ON-SOURCE).

Pages checked: 729

## Totals by check

| Check | PASS | DIFF | MISSING-ON-SOURCE |
|---|---|---|---|
| url | 729 | 0 | 0 |
| title | 729 | 0 | 0 |
| description | 729 | 0 | 0 |
| canonical | 729 | 0 | 0 |
| robots | 729 | 0 | 0 |
| og | 729 | 0 | 0 |
| twitter | 729 | 0 | 0 |
| jsonld | 729 | 0 | 0 |
| breadcrumb_schema | 729 | 0 | 0 |
| breadcrumb_visible | 0 | 0 | 729 |
| headings | 247 | 482 | 0 |
| images_kept | 326 | 403 | 0 |
| images_alt | 722 | 7 | 0 |
| images_dims | 727 | 2 | 0 |
| images_main_eager | 725 | 4 | 0 |
| ext_links | 72 | 453 | 204 |
| hreflang_pagination | 0 | 6 | 723 |
| dates | 729 | 0 | 0 |

## Summary by page type

| Type | Pages | All checks pass (DIFF = 0) |
|---|---|---|
| about-info | 4 | 3 |
| alcohol | 1 | 1 |
| blog-post | 186 | 175 |
| centre | 391 | 0 |
| city | 4 | 0 |
| city-archive | 59 | 0 |
| drug | 24 | 24 |
| home | 1 | 0 |
| intervention | 1 | 1 |
| legal | 4 | 3 |
| province | 20 | 5 |
| site-utility | 1 | 0 |
| support-service | 2 | 1 |
| treatment-support | 31 | 30 |

Note: all head-level checks (URL, title, description, canonical, robots, Open Graph, Twitter, JSON-LD, breadcrumb schema, dates) pass on every page. Remaining DIFFs are body-level and explained below.

## Remaining DIFFs and why
- headings (centre, 391): the design shows the sidebar blocks (Specialties, Amenities, Social, Hours, Tags) in a different order than the source, and the source's login-modal / footer widget / review-form headings are intentionally not rebuilt. Same heading texts, different order.
- headings (city-archive, 59; province, 15; city, 4): the same chrome headings plus the design's "Rehab Centres by Provinces" navigation headings; source quirks logged in audit/08-source-issues.md §17-26.
- images_kept (centre 391, city-archive 4, province 2, blog-post 4, home 1): source sidebar/banner decorations (e.g. Rehabs-01.jpg, addiction-rehab-centers-canada-1.jpg) that belong to the old theme chrome, not the content.
- ext_links (centre 391, city-archive 59, blog-post 3): the source footer widget links (Facebook page, Google listing with tracking query) are not in the shared Home footer.
- hreflang_pagination (6): rel=next on six paginated city archives; the /page/N/ pages are not built (§25).
- home: Home still uses the design's sample content (see audit/15-design-gap.md).

## Site-level findings
- Sitemap: ours 722 URLs vs source 1003. In source not ours: 284 (158 /listing-location/ thin archives and pagination, 26 /category/, 13 /listing-category/, 5 /search-listing/, thin centres, user-dashboard); in ours not source: 3. Lists: audit/data/sitemap-source-only.txt, audit/data/sitemap-ours-only.txt.
- robots.txt: ours is allow-all with drafts disallowed and Sitemap -> /sitemap_index.xml (200). Source robots disallows wp-admin and woocommerce paths only (WordPress-specific, not applicable).
- Redirects: 64 approved redirects, all single-hop 301 to a 200 page, no chains, no loops (audit/data/redirect-problems.json is empty).
- Drafts (/auth, /provider-dashboard, /menu-options, therapist pages, join-directory, centre-onboarding): X-Robots-Tag noindex,nofollow, meta robots noindex, not in sitemap.xml or llms.txt, still load by direct URL.
- Lighthouse mobile, report-only, localhost (audit/data/lighthouse-mobile.txt): performance 75-79, accessibility 85-93, LCP 5.8-7.7 s (dev-machine, unthrottled-network figures), CLS 0. The SEO category scores 61-69 only because localhost is a non-production host, which is deliberately noindex.

## Fixes made during this pass
- Centre view: Hours, Tags, Specialties/Amenities and Social labels are now real h3 headings (outline parity).
- rel=next/prev only emitted when the target exists.
- City archive place name no longer built from concatenated category tags (caused 390px overflow on 3 pages).
