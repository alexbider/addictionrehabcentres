# 01 — Project structure (read-only audit)

Stack: Next.js 16 (App Router) + React 19 + TypeScript; fonts Jost/Figtree via `@fontsource`. No Tailwind, no CMS, no data layer, no API routes, no `middleware`. `next.config.mjs` is the default (`reactStrictMode` only: **no `redirects()`, no `images`, no `trailingSlash`**).

## 1. How a page is built

```
src/app/<route>/page.tsx      → exports metadata (some pages) + <Root/> from a view
src/views/<Page>.jsx          → ONE file per design page (1,200–4,400 lines each, 2.5 MB total)
   class Component extends DCLogic   state + handlers + ALL data arrays (renderVals())
   template(vals)                    JSX markup, inline styles copied from the design
   ownCss / css                      page stylesheet string (+ SiteHeader_css), injected as <style>
   defaults                          prop defaults, e.g. { drug:'Benzodiazepine' }
   Root = <DCRoot View defaults css responsive/>
src/dc/runtime.jsx            → tiny host: setState/lifecycle shim, $i() interpolation, $A (internal <a> → next/link)
```

* `renderVals()` returns the values the template reads (`{$i(drug)}`, `$list(centres)`…). Props passed to `<Root/>` override `defaults` — this is the only built-in parametrisation (names such as `drug`, `province`, `city`, `centreName`, `tpName`, `locName`).
* **Header** = `SiteHeader.jsx` (shared, self-contained mega-menu + mobile drawer, `active="drugs"` prop). It has its own province/drug/service link lists (root-level paths like `/alberta-rehabs/`).
* **Footer is NOT shared**: the footer markup + `footerCols` array is copy-pasted inside ~20 views. Every view also still carries dead copies of `provinces`, `drugs`, `menus`, `navItems` (leftover from the header; only `menus`/`navItems` are referenced, not used for rendering).
* **Responsive**: (a) JS width (`vw`/`w` state) in some pages; page hidden by `.sc-host.dc-pending{visibility:hidden}` until hydration (content is still in the SSR HTML); (b) `responsive.css` (217 lines, ≤1000/≤640/≤520 px) targets hooks written into the markup: `data-cols` (201 uses, grid template), `data-rc-wrap` (156), `data-rc-dyn` (119), `data-rc-lg` (106, big headings), `data-rc-gap` (60) + a few one-offs (`data-rc-slider/table/radial/…`). `rc-page` class (from `responsive` flag in `DCRoot`) switches the rules on per page.
* **Hover/focus** states live in `dc-pseudo.css` (`.scp0…` classes generated from the design).
* **Images**: `public/assets/img/*.jpg` (33 files: `home-*`, `blog-*`, `drug-benzo-*`, `tr-*`, `prog-*`, `menu-*`) referenced as `/assets/img/x.jpg` in plain `<img>` (no `next/image`). Placeholders (`photo · name.jpg` text boxes) are used wherever the design had no photo. Alcohol and Intervention hot-link 8 images from `addictionrehabcenters.ca/wp-content/uploads/2022/02/…` (all 8 return HTTP 200 + `image/jpeg` with curl, with and without a localhost Referer — if they look broken in a browser the cause is not a 404; they should still be self-hosted).
* **SEO**: layout has only `title: 'Addiction Rehab Centres Canada'`. Per-page `metadata` exists on **6 of 23** pages (alcohol, blog, blog post, contact, intervention, provider-dashboard) as hard-coded `title.absolute` + description. Canonical + OG + JSON-LD (Article, BreadcrumbList, FAQPage) only on the blog-post page (inline `<script type="application/ld+json">`). No sitemap.xml, robots.txt, `generateMetadata`, or `llms.txt` route (home/design links to `/llms.txt` 20×).
* **Routing / URLs**: the 23 routes are flat design names (`/drug`, `/city`, `/centre`…). The views' own links already use the **source site's root-level slugs** (`/alberta-rehabs/`, `/toronto-rehabs/`, `/aa-support-group/`…), but none of those routes exist → today **75 distinct internal links on the built pages 404**, and 13 point at paths that do not exist on the source either (`/alcohol-rehab/`, `/rehab/…`, `/quebec-drug-rehab-centers/`, `/alberta-rehabs/#`).

## 2. Routes ↔ views (23)

| # | Route | View (lines) | Content type | Meta/SEO set? |
|---|---|---|---|---|
| 1 | `/` | Home (4415) | home | no |
| 2 | `/alcohol` | Alcohol (2024) | alcohol page | yes |
| 3 | `/drug` | Drug (2549) | drug page (Benzodiazepine) | no |
| 4 | `/province` | Province (2364) | province page (Alberta) | no |
| 5 | `/city` | City (2753) | city ranking page (Toronto) | no |
| 6 | `/centre` | Centre (3863) | centre profile (Metamorphosis) | no |
| 7 | `/blog` | Blog (1694) | blog index | yes |
| 8 | `/blog/how-long-does-alcohol-detox-take` | BlogPost (3029) | blog post | yes + JSON-LD |
| 9 | `/intervention` | Intervention (1705) | long-form guide | yes |
| 10 | `/contact` | Contact (1598) | form + FAQ | yes |
| 11 | `/therapists` | Therapists (2578) | therapist directory home | no |
| 12 | `/therapists-province` | TherapistsProvince (2711) | therapist province page | no |
| 13 | `/therapists-city` | TherapistsCity (2716) | therapist city page | no |
| 14 | `/therapist-profile` | TherapistProfile (2582) | therapist profile | no |
| 15 | `/therapist-onboarding` | TherapistOnboarding (2716) | multi-step form | no |
| 16 | `/centre-onboarding` | CentreOnboarding (2304) | multi-step form | no |
| 17 | `/claim-listing` | ClaimListing (2330) | claim flow (4 steps + pay) | no |
| 18 | `/claim-therapist` | ClaimTherapist (2347) | claim flow | no |
| 19 | `/join-directory` | JoinDirectory (2888) | marketing/pricing | no |
| 20 | `/promote` | Promote (3137) | marketing/pricing | no |
| 21 | `/auth` | Auth (1246) | login/signup (demo, localStorage) | no |
| 22 | `/provider-dashboard` | ProviderDashboard (4386) | client-only dashboard | yes (title) |
| 23 | `/menu-options` | MenuOptions (106) | header design board (internal) | no |

## 3. Per-view reuse analysis

Legend — **HC** = hard-coded prose in the JSX template; **DATA** = arrays/objects in `Component.renderVals()`.

| View | HC text (what is baked in) | DATA arrays | What must change to serve many pages |
|---|---|---|---|
| **Drug** | Whole Benzodiazepine article: intro, 2 body columns, 3 `<img>`, stats strip, “find help” CTA, references list (~1,000 lines of JSX prose). Only `{drug}` in H1/H2 is a prop. | `effects`, `effectCards`, `drugFaqData`, `drugToc`, `tabData`/`programs`, `centres`, `locations`, who/funding/substance options | Pull body out of JSX into `drug.sections[]`/`bodyHtml`; make hero image, 3 images, stats, effect cards, FAQ, TOC, references optional (source drug pages have none of them); drop hard-coded `/drug` self-links; one template ⇒ ~30 drug pages. |
| **Province** | Intro + SEO copy for Alberta, “trust” strip, filter chips, CTA text. | `raw` (24 real Alberta centres: name, slug, address, excerpt, reviews, city, tags), `filterNames`, `trust`, `faqData`, `toc` | Replace `raw` with per-province centre list (from content JSON); province name prop exists, copy does not; make FAQ/TOC/trust optional; 44 vs 24 cards (source paginates). |
| **City** | “N Best Rehab Centres in {city} {year} (With Pricing)” layout, criteria, nearby cities, popular types. | `raw`, `cityRaw` (Toronto centres incl. price/duration), `criteria`, `cityFaqData`, `cityToc`, `nearby`, `popularTypes` | Same as Province plus ranking/pricing blocks that the source only has for Toronto/Ottawa/Montreal/Vancouver; 217 location archives are plain lists. |
| **Centre** | Section headings + layout; **invented** pricing, team, reviews, rating bars, programs, FAQs for Metamorphosis | `glance`, `services`, `programSteps`, `priceData`, `team`, `reviewsList`, `ratingBars`, `serving`, `centreFaqData`, + drug sections | Drive from `centre` JSON (`about`, `specialties`, `amenities`, `therapies`, `contact`, `gallery`); every other block (pricing/team/reviews/FAQ/rating) must be optional — source centres have none of it (0 reviews, 3 shared stock photos). |
| **BlogPost** | The alcohol-detox article (TOC ids, timeline, 3 FAQs, author/reviewer, featured centres/therapists) | `main`, `centres`, `therapists`, `timeline`, `related`, `kinds`, TOC | Render `bodyHtml` + auto-TOC from headings; author/reviewer/FAQ/featured blocks optional; metadata + JSON-LD from `generateMetadata`. |
| **Blog** | Hero, newsletter, hubs, steps | `posts` (11 invented), `catNames`, `hubs`, `popular`, pagination `[1,2,3,…,12]` | `posts` ← 189 real posts; category filter ← 26 categories; real pagination. |
| **Alcohol** | Whole page copy (what/types/provinces/effects/signs/treatment) | `types`, `effects`, `signs`, `treatments`, `faqData`, `hub`, `tocDefs` | Maps to a single page (`/addiction-by-alcohol/`) — reuse only for `/alcohol-addiction-treatment/`. |
| **Intervention** | Whole guide copy | `steps`, `reading`, `whoList`, `tocDefs` | Single page; reusable as generic “long-form guide” for 3 more intervention pages. |
| **Home** | Hero, programs, regions map, FAQ-like blocks | `top`, `medals`, `regionDefs`, `popCities`, `programs`, `tabData`, `trImgs` | Single page; `image-slot` custom element for 2 photos. |
| **Contact** | Copy + form | `channels`, `topicDefs`, `faqData` | Single page. |
| **Therapists / TherapistsProvince / TherapistsCity / TherapistProfile** | Therapist directory copy + invented therapist data | `thRaw`, `thFaqData`, `locGuide`, `tp*` | **No source equivalent** (source has no therapist directory); not part of the content migration. |
| **JoinDirectory / Promote / ClaimListing / ClaimTherapist / CentreOnboarding / TherapistOnboarding / Auth / ProviderDashboard** | Product/marketing/forms (front-end only; demo localStorage) | plans, steps, compare rows, KPIs | Only `Promote` ↔ `/promote-your-centre/` and `ClaimListing` ↔ `/claim-your-listing/` exist on the source. Others are new product features. |
| **MenuOptions** | internal header board | — | Not a public page. |

### Shared pattern that blocks reuse
1. Content and layout are fused (prose inside JSX), so a “template” is today a *page*. Reuse needs a **content → props** layer (JSON per page) and optional sections.
2. Duplicated data (footer ×20, provinces/drugs ×20) should move to one shared module/component.
3. Every view is a client component with a JS-driven layout. That works with SSR but means every new page ships the full view bundle; acceptable for ~1,200 pages only if built as a handful of dynamic routes (see 05).
4. No per-page metadata/JSON-LD mechanism exists except the one blog-post file → needs `generateMetadata` from the content JSON.
