# 05 — Build plan (proposal — nothing has been built)

## 1. Scope in numbers

| | Pages |
|---|---|
| Source URLs | 1,040 |
| BUILT (11 real counterparts of the 23 design pages) | 11 |
| NOT NEEDED (redirect/skip) | 101 |
| **REMAINING** | **928** → centres 458 · blog posts 188 · city archives 194 · drug 23 · treatment/service/support 34 · province 21 · about/FAQ 4 · city ranking 3 · intervention 2 · alcohol 1 |
| Template fit | FULL FIT 0 · FIT WITH CHANGES 924 · NO TEMPLATE 4 |

## 2. URL / routing decision (needs your answer — Q1)

**Recommendation: keep every source URL exactly as it is (flat, root-level, trailing slash).** 928 pages × existing backlinks/rankings; zero redirects needed for them. The built views already link this way (`/alberta-rehabs/`, `/aa-support-group/`).

| | A. Preserve URLs (recommended) | B. Restructure (`/drug/x`, `/centre/x`, `/blog/x`) |
|---|---|---|
| SEO risk | none | 928 × 301; ranking dip likely for weeks |
| Routing | one root `app/[slug]/page.tsx` that looks the slug up in a content index and renders the right view (Next cannot have `[drug]` **and** `[province]` at the same level) + `app/search-listing/[slug]` (20 centres) + `app/listing-location/[slug]` (194 city archives) | clean separate dynamic routes |
| Needed config | `trailingSlash: true` | redirects for all |

Static design routes (`/drug`, `/city`, `/centre`, `/province`, `/alcohol`…) become the *template previews*; real pages replace them at their real URLs (`/benzodiazepine-addiction/`, `/toronto-rehabs/`, `/metamorphosis-centre-for-change/`, `/alberta-rehabs/`, `/addiction-by-alcohol/`). Full mapping: `audit/old-to-new-routes.csv`; link rewriting table: `audit/link-map.csv` (2,872 distinct hrefs).

## 3. Where content lives

```
content/                      (repo root, imported on the server, not in /public)
  _index.json                 slug → { type, route, title, template }   (928 entries)
  pages/<slug>.json           drug, info, province, city, intervention, alcohol, about (88)
  posts/<slug>.json           188
  centres/<slug>.json         458
  cities/<slug>.json          194
  _redirects.json             old path → target (101 NOT NEEDED + 13 source 301s + design routes)
public/media/<slug>/…         images (from audit/images, see §5)
```
* The files in `audit/content/*.json` already carry the final schema (`seo`, `h1`, `rows`/`blocks`/`sections`, `images` with local paths, `links` with old→new, `faqs`, `centre`/`cards`/`post`). For production strip `raw_html` + the duplicate `blocks`/`sections` copy (52 MB → ≈12 MB).
* Views read `props.data`; `generateMetadata` reads `seo`; JSON-LD per type (Article, FAQPage from `faqs`, LocalBusiness/MedicalBusiness for centres, BreadcrumbList).
* `app/sitemap.ts` + `robots.ts` + `llms.txt` route generated from `_index.json` (source has `llms.txt`, sitemap_index.xml).

## 4. Order of work (value first)

No traffic data is available to me — **please send a Search Console export (clicks by URL)** so this order can be confirmed.

| Phase | What | Pages | Why first |
|---|---|---|---|
| 0 | Foundation: shared footer/header data, content loader, `[slug]` route, metadata/JSON-LD, sitemap/robots, redirects, `trailingSlash`, optional-section support in views | – | Everything depends on it; fixes the 75 dead links as pages land |
| 1 | **Province pages with centre cards** (16 of the 21; Alberta’s primary page is already built) & **City ranking** (Vancouver, Ottawa, Montreal) | 19 | Navigation hubs; link to every centre; highest internal-link value |
| 2 | **Drug (23) + info/service/support/text-only province (39) + intervention/alcohol (3)** — one L1 layout, one view | 65 | Biggest keyword pages in the header menu; one template covers all |
| 3 | **Blog index (real data, 26 categories as filter) + 188 posts** | 188 | Long-tail traffic; simple, uniform data |
| 4 | **Centre profiles** (generic first, then the 25 rich ones ≥1,000 words) | 458 | Largest set; mostly thin → hide empty sections |
| 5 | **City archives** — only those with ≥2 centres first (59), then decide on the 135 single-centre ones | 59 + 135 | Thin; decision pending (Q3) |
| 6 | About / Philosophy / Getting started / FAQs (design needed) | 4 | NO TEMPLATE |

Each phase ends with: `next build`, link check against `link-map.csv`, metadata diff against `02-site-inventory.csv`.

## 5. Images

* 2,006 unique source images downloaded OK → `audit/images/` (2,313 files incl. per-page copies, **757 MB**, median width 1,000 px, 26 files >2,000 px, one 5.9 MB PNG). `images/_shared/` holds the 21 files used on ≥5 pages (e.g. the 3 stock gallery photos, the Sponsored-Ad banner on all 458 centres).
* Manifest with original URL, local path, alt, real pixel size, status: `audit/images-manifest.csv` (3,571 rows).
* **Failed (404 on the source itself): 3** — `Life-Science-Addiction-Treatment1.webp` (centre `life-science-addiction-treatment`), two old CloudFront images in posts (`Sober-Bar-Activities.jpg`, `Child-Coping-with-Addiction.jpg`).
* **Skipped on purpose: 50 URLs / 149 occurrences** — Google reviewer avatars (personal photos on 9 centre pages); review text/author names are kept in JSON, avatars are not.
* The 8 hot-linked images on Alcohol/Intervention currently return 200; they are not in this download set (those pages are BUILT) — self-host them in the build.
* Recommend serving through `next/image` with one-time resize to ≤1600 px + WebP (≈ 250–300 MB expected).

## 6. Risks and open questions

**Questions for you**
1. **URL strategy** — preserve (A, recommended) or restructure (B)?
2. **Exact content vs. rich design** — the templates contain invented content (pricing, team, reviews, stats, effect cards, reviewer names, 11 invented blog posts). The source has none of it for most pages. Rule proposed: *render only what the source has; hide the rest.* Alternative: keep design placeholders (visible “photo · …”/“Clinical Reviewer (name, credentials)” text on 900 pages — not recommended).
3. **Thin pages** — 135 city archives list exactly 1 centre, 23 are empty, province pages for SK/NWT/PEI/MB are cards only. Build all, noindex the thin ones, or merge into the province page?
4. **Duplicates** — each province has 2–3 competing pages (`/alberta-rehabs/`, `/alcohol-drug-rehab-centres-in-alberta/`, `/listing-category/alberta-rehabs/`); drug pages have `-treatment` twins (6 are noindex). Keep all (exact migration) or canonicalise?
5. **Legal pages** (privacy-policy, terms-of-use, disclaimer, privacy) — marked NOT NEEDED per your example; I recommend building them (a live health site needs them).
6. **Non-core listings** — Mexico retreat (1) and DUI-lawyers-Ontario (3) archives; the 11 BUILT pages are still sample content — extract their real source content too? (cheap, same pipeline)
7. **Forms** — the lead form (“Let Us Help You”, on every blog post/drug page) and contact form are front-end only in the design; the source posts to a WordPress form plugin. Need an endpoint (email/Supabase/Resend?).
8. **Therapist directory & product pages** (12 design-only routes) — keep in the new site although the source has none?

**Risks**
* **SEO**: 1,040 URLs on a site with thin/duplicate sets; any URL change without 301s loses rankings. 13 slugs already 301 on the source (kept in `link-map.csv`).
* **Link hygiene**: 367 links to `/listing-tag/*`, 30 to `/listing-amenity/*`, 188 to broken `/YYYY/00/` date pages — rendered as plain labels (no target).
* **Raw HTML from Elementor** (rich centre pages) contains wrapper markup; blocks are flattened but inline styles/classes must be sanitised before `dangerouslySetInnerHTML`.
* **Text fidelity**: block text coverage of the raw HTML is 100 % (checked on all 928 files, ignoring forms/cards); I did not rewrite anything. Source typos are kept (e.g. “Undertanding Hypnotics Addictions”, `miami-alcohol-rehab` titled “Toronto Alcohol Rehab”, “Dr. Sarah Mitchell” demo article not on the source).
* **Google Reviews content** (9 centres) is third-party content shown by a plugin — check usage terms before republishing as static text.
* **Bundle/perf**: every view is a 2–4k-line client component; ~930 pages from 8 views is fine for SSG, but split the heavy sections (hero slider, tabs) with `next/dynamic`.
* **No analytics, no Search Console** in this audit — traffic ranking is an assumption.
* **Repo size**: `audit/` is ~812 MB (images). Add `audit/images/` to `.gitignore` or move it outside the repo before committing.
