# 06 — URL exceptions (nothing below is changed or redirected — waiting for your approval)

**Rule applied:** every page that exists on addictionrehabcenters.ca keeps its exact path and trailing-slash behaviour (`trailingSlash: true` in `next.config.mjs`; the source 301s non-slash URLs to the slash form, so this matches). No slug was changed. `redirects()` in `next.config.mjs` is empty.

## 1. Source URLs I do NOT plan to serve (would 404 until you decide) — 101 URLs

Full list with status/reason: `audit/old-to-new-routes.csv` (`status = NOT NEEDED`). Proposed 301 targets:

| Group | Count | Example | Proposed 301 target | Why |
|---|---|---|---|---|
| Blog category archives | 26 | `/category/addiction-detox/` | `/blog/` | Replaced by the category filter on `/blog/` |
| Listing-category archives = province duplicates | 11 | `/listing-category/alberta-rehabs/` | `/alberta-rehabs/` (Quebec → `/drug-alcohol-rehabs-in-quebec/`) | Same centres as the province page |
| Non-core listing categories | 2 | `/listing-category/mexico/`, `/listing-category/dui-lawyers-ontario/` | `/` (or keep — your call) | Out of scope |
| Empty city archives (0 centres) | 23 | `/listing-location/aurora/` | `/` or the province page | Nothing to show |
| noindex pages not linked anywhere | 26 | `/admissions/`, `/cocaine-addiction-treatment/` | the indexed twin where one exists, else `/` | already `noindex` on the source |
| Shop / account / search / thank-you | 7 | `/cart/`, `/checkout/`, `/my-account/`, `/search/` | none | WooCommerce not migrated |
| Legal pages | 4 | `/privacy-policy/`, `/terms-of-use/` | **not redirected — recommend building them** | Footer already links to them |
| Old packages page / directory search | 2 | `/pricing/`, `/search-listing/` | `/promote-your-centre/` / `/` | Replaced |

The 135 single-centre city archives and 63 under-60-word centres (see `07-thin-pages.md`) are also pending your decision.

## 2. Routes that need a different structure but not a different URL

None need to change:
- `/search-listing/<slug>/` (20 centres) and `/listing-location/<city>/` (194) are two-segment paths; they will be served at the **same URL** by dedicated routes in their phases.
- Single-segment slugs (pages, posts, 438 centres) are served by `app/[slug]/page.tsx`; `/blog/`, `/contact/`, `/intervention/` are static routes that already coincide with source URLs.
- No source slug contains uppercase, spaces or percent-encoding; none collides with a Next.js reserved path.
- Source `sitemap_index.xml` is kept alive with a **rewrite** to `/sitemap.xml`. Yoast sub-sitemaps (`post-sitemap.xml`, …) will 404 — say if you want them replicated.

## 3. Design-only routes (not source URLs)

Confirmed: these existed only on the Vercel preview (addictionrehabcentres.vercel.app), never on the real domain, so **no redirects are needed**. `/drug`, `/city`, `/centre`, `/province`, `/alcohol`, `/promote`, `/claim-listing` and the 12 product pages are replaced by the real pages at the source URLs when each phase lands.

**Clashes between design routes and real source URLs** (checked against all 1,040 source paths): only `/blog/`, `/contact/` and `/intervention/`. They are the same URL on both sides, so the design page simply becomes the real page — no conflict, but their placeholder content must be replaced with source content in the relevant phase. No other design route name is a source slug.
