# 16 — Audit: client design folder vs repo vs built pages

Reference (read-only): `~/Downloads/Addiction Rehab Centers Redesign/` — 24 `.dc.html` files + `support.js`, `image-slot.js`, `assets/`, `screenshots/`, `uploads/`. It was copied to the scratchpad and served on :3300; nothing inside the original folder was touched. Compared with: `~/Downloads/arc-design-original` (port 3200; BlogPost, which has no route there, via a scratch copy with one added route on :3201) and the repo's design routes (:3100, `src/views`).
Method: every file rendered at 1440 px with reduced motion, scrolled to trigger reveals; compared page height, section labels (`data-screen-label`), visible text (word multiset), image list, CSS keyframes and a full-page pixel diff (threshold: a pixel counts when the RGB sum differs by > 40). “Identical” = same height, same sections, same text, same images, pixel diff < 1 % (the ~0.1–0.7 % residue is the runtime’s shine animation and font anti-aliasing). Scripts: `audit/scripts/checks/zip-compare.mjs`, `zip-built.mjs`; raw numbers `audit/shots/zip-compare/compare.json`, `built.json`; side-by-sides `audit/shots/zip-compare/*-side-{1440,390}.png` (design left, built right).

## 1. Summary
| | |
|---|---|
| Files in the folder | 24 (`.dc.html`) |
| Identical to the clone `arc-design-original` | **23** (22 pages + SiteHeader, which is identical inside every page) — 1 differs: **Menu Options** |
| Identical to the repo’s design route / `src/views` | **18** pages |
| Differ in the repo | **5**: Province, City (regression, see §2.2), Blog (route is the built blog index, by design), BlogPost (view modified for data, no design route), SiteHeader (extra route-hiding logic) |
| Missing from the repo | **0** — all 24 exist as views (`Menu Options`→`MenuOptions.jsx`, `SiteHeader`→`SiteHeader.jsx`) |
| Design pages filled with source content | only 5 types: Home (untouched, sample text), Blog, Province, City, Centre (+ BlogPost on 2 prototype posts) |

## 2. File by file
| File | Clone (arc-design-original) | Repo view / route | Notes |
|---|---|---|---|
| Home | identical (0.39 %) | identical | Home shows the design’s sample content (not source content) |
| SiteHeader | identical in all pages | **different** (markup/logic) | repo adds `routes` prop logic, `{showClaim/showSignIn/showFind/menuAllShow}` wrappers and `allShow` per menu: links to unbuilt pages are hidden; renders identical when no `routes` is passed (old components pass it) |
| Province | identical | **different: height 8241 vs 8477, pixel 15.7 %** | regression, §2.2 |
| City | identical | **different: 8838 vs 9397, pixel 14.1 %** | regression, §2.2 |
| Centre | identical | identical in sample mode | route `/centre` unchanged; built centres use data mode |
| Drug | identical | identical | not built with source content yet |
| Alcohol | identical | identical | not built yet |
| Intervention | identical | identical | not built yet (`/intervention/` source page clashes, see 08 §15) |
| Blog | identical | **different by design** (40 % pixel): `/blog` is the built index (186 posts) | sample route no longer exists in the repo |
| BlogPost | identical (scratch route) | view modified (props); **no route** in the repo | live on 2 prototype posts only |
| Contact | identical | identical | design page left untouched; source `/contact/` clashes |
| Promote | identical | identical | |
| ClaimListing, ClaimTherapist | identical | identical | |
| Therapists, TherapistsProvince, TherapistsCity, TherapistProfile, TherapistOnboarding | identical | identical | design-only, see §3 |
| Auth, ProviderDashboard, JoinDirectory, CentreOnboarding | identical | identical | design-only, see §3 |
| Menu Options | **differs from the folder render (6.4 %)** | same as clone | in the folder render the “3b” tabbed panel starts empty (no active tab content) while the repo/clone render show “Addiction by Drug”; interaction-state difference on first paint, internal design board only |

### 2.1 What “identical” covered
Text: 0 differing words in all 23 pages vs the clone and vs the repo (except Blog/BlogPost as above). Images: same image lists. CSS keyframes: the folder adds `sc-shine` (from `support.js`, the dc runtime’s shimmer) that the repo’s own runtime (`src/dc/runtime.jsx`) does not define; no visible difference at rest.

### 2.2 Regression found: Province and City design routes (sample mode)
`/province` and `/city` in the repo no longer match the design: in sample mode the cards’ footer row (Google-review text, **Call** / **View** buttons, “Details verified…”, “Call for availability”, “View centre”) is hidden because the live-data flags `rowOn` / `viewOn` are undefined on the sample cards (Province −236 px, City −559 px). Fix (not applied, audit only): set `rowOn: true, viewOn: true` on the sample cards, or treat `undefined` as visible. The built pages are not affected.

## 3. Designs that are not built with source content
All 23 designs are in `src/views` and routed (`/alcohol /auth /centre /centre-onboarding /city /claim-listing /claim-therapist /contact /drug /intervention /join-directory /menu-options /promote /provider-dashboard /province /therapist-onboarding /therapist-profile /therapists /therapists-city /therapists-province`) except BlogPost (view only, no route). Source-site match (from `audit/02-site-inventory.csv`, `13-design-mapping.md`):
| Design | Source site has matching pages? |
|---|---|
| Therapists, TherapistsProvince, TherapistsCity, TherapistProfile | **No.** There is no therapist directory on addictionrehabcenters.ca (only centres and posts that mention “therapy”). New feature, no source content. |
| TherapistOnboarding, ClaimTherapist | **No.** New feature (profile builder / claim flow). |
| JoinDirectory | **No.** Marketing + plans for therapists; the closest source page is `/promote-your-centre/` (519 words, centre promotion) — different audience. |
| Auth | **No.** The source uses WordPress/WooCommerce `/my-account/` (17 words, noindex) — system page, marked NOT NEEDED. |
| ProviderDashboard | **No.** Source has `/user-dashboard/` (19 words), system page, NOT NEEDED. New app feature. |
| CentreOnboarding | **No** equivalent page (source has `/claim-your-listing/`, 92 words). |
| ClaimListing | Partial: `/claim-your-listing/` stub exists (92 words); the design is a multi-step flow. |
| Promote | Yes: `/promote-your-centre/` (519 words) — content/design clash logged in 08 §15. |
| Contact | Yes: `/contact/` (608 words) — the source page is a promo/plans page without a contact form (08 §15). |
| Drug (24 pages + 5 text-only provinces), Alcohol (2), Intervention (3 + 33 treatment/support + About/Philosophy/Getting started) | **Yes** — source content exists, not yet built on these views (planned). |
| BlogPost | **Yes** — 186 posts; built only on 2 prototypes so far. |

## 4. Assets
| Item | Result |
|---|---|
| `assets/img/*` (33 files), `logo.png`, `logo-white.png`, `canada-map.json` | all **36 files byte-identical** to `public/assets/` of the repo and of the clone |
| `image-slot.js` | identical in repo and clone |
| `support.js` (dc runtime) | not in the repo (repo uses its own `src/dc/runtime.jsx`); not needed |
| `assets/gen/footer.html`, `footer.js`, `footer-claim.js` | **missing from the repo and clone.** They are the generator fragments for the *rich* footer (rounded dark gradient footer used on Home, CentreOnboarding, ClaimListing, ClaimTherapist, TherapistOnboarding). The other 15 pages with a footer use the older flat dark footer. |
| `assets/gen/prompts.json` | image-generation prompts (design tool); not a site asset |
| `screenshots/*` (8), `uploads/logo-…png`, `.thumbnail` | design-tool leftovers, not site assets |
Note for “same footer as Home on every page”: the client’s own designs are **not** consistent — Home + 4 onboarding/claim pages use the rich footer, 15 pages use the flat one. The footer rule needs an explicit client decision.

## 5. Built page types vs their design, ranked by visual impact
Screenshots: `audit/shots/zip-compare/<type>-side-1440.png` / `-390.png`; numbers in `built.json`. Heights (design → built, 1440): province 8477 → 10906, city 9397 → 5589, centre 9778 → 6701, blog index 4333 → 3489, blog post old 8222 → 3240, blog post view 8222 → 9384. No sideways scroll at 390 on any.

### 5.1 Single blog post — **biggest gap** (186 posts still on the old component)
Old component (`PostPage`, what 184 posts use today) vs `BlogPost` design:
1. No article header treatment: no breadcrumb Home/Blog/Category/Title (only “Blog”), no “Medically reviewed” pill, no dek, no author/date/read-time row, no share buttons (source has only title, category, date).
2. Hero image: design is a full-width 21:9 band with rounded bottom corners and caption; built is a small centred rounded image.
3. No three-column article layout: missing sticky “In this article” TOC with active-section highlight and reading-progress bar; missing “Listen to this article” audio player (speech synthesis, speed buttons); body typography narrow (860 px) and plain.
4. No right sidebar (sticky): featured-centre card, “Related reading”, “Own a centre?” promo.
5. No in-article design elements: key-takeaways box, timeline cards, callouts, pull quote, in-article helpline strip (“Not sure if you need medical detox? Call…”), FAQ accordion, tags row, author card, sources, disclaimer.
6. No dark “Featured centre” band, no “Hand-picked” centres carousel (tabs Rehab centres/Therapists, arrows, dots), no “Related articles” grid and previous/next links.
7. The old component also uses the filtered header (hides links) and the flat footer.
8. Interactions missing: TOC scroll-spy, progress bar, audio reader, copy-link, FAQ accordion, carousel.
Prototype on the `BlogPost` view (`/what-is-smart-recovery/`): has header, hero, TOC + progress, audio player, sticky related sidebar, related articles + previous/next. Still missing (no source data): medically-reviewed pill, dek, author row, share buttons, key takeaways/timeline/quote/FAQ/tags/author card/sources/disclaimer, featured-centre card/band, carousel, “Own a centre?” promo, helpline strip.

### 5.2 City
Missing vs design: hero chips (“Ranked list · 2025”, “Updated”), design H1 formula, hero paragraph and stats, “At a glance” card (numbered shortlist with ratings), “How we ranked” criteria row, rank badges and “Top pick/Runner-up” labels, Featured/Verified badges, Google rating chip, category/tag chips, pricing / program-length / site-review cells, “Details verified…” line, “Call for availability” buttons, **Compare table**, FAQ accordion, “Popular types” links, author/reviewer card in the guide. Built has: source H1, list heading, intro, image cards, helpline band (restored), guide, province links. Interaction missing: FAQ accordion, sticky glance card.

### 5.3 Centre
Missing vs design: photo-mosaic badges (Verified/Top rated) and “Show all N photos” button, logo box, rating chip, at-a-glance cards (only source “info items” shown), price card (“From $…”), “Request a callback” and “Save to wishlist”, section tab bar, About pillars (01/02/03 with photos), centre video player with play overlay, “What’s included in your stay” icon grid, “Your program, week by week” steps, “Facility at a glance” and “Listing reviewed by” cards, **Programs & Pricing** (tabs, price table), **Team**, **Reviews** (rating bars), **Location** (map, distances), **Request a callback form**, **Claim banner**, **Sponsored centres carousel**. Built has: gallery, contact card (phone, website, email, social), long body, hours/tags/specialties, FAQ.

### 5.4 Province
Missing vs design: hero eyebrow/stats strip/photo slot/“Independently listed” badge, “Why trust us” row, directory header with **sort select and filter chips**, “Showing N of M” + **Load more**, card badges (Featured/Verified), Google rating chip, review-count text, Call button on cards, **Cities** grid, author/reviewer card, FAQ accordion, “Rehabs By Provinces” crumb. Built adds all cards at once (50+ images), TOC only when ≥ 2 headings.

### 5.5 Blog index
Missing vs design: eyebrow + intro + “N articles”, **Featured** lead card with two secondary cards, Latest/Popular toggle, author initials / read time on cards, right sidebar (**helpline card**, “Guides by topic”, “Most read this month”, **newsletter form**), **Topic Hubs** dark band (“Complete guides…” 4 steps). Built adds real pagination (12/page), 26 category chips with counts, 186 real posts.

## 6. Things to decide / follow up (no src changes made in this task)
1. Fix the Province/City sample-mode regression (§2.2).
2. Footer rule: client designs mix two footers (§4).
3. Header: repo `SiteHeader.jsx` differs from the design (route-hiding); restoring it makes every link live-but-dead for unbuilt pages (12 internal 404 targets today, see `14-links-still-broken.csv`).
4. Blog posts: 184 of 186 still use the plain old component; Part 0 of the previous brief covers the rebuild.
5. Uncommitted work in the tree from the interrupted combined task (Part 1 centre fixes: `src/dc/guide.js`, `src/views/Centre.jsx`, `audit/scripts/checks/centre-all.mjs`) is untouched by this audit and not committed.

## 7. Final status table — all 24 design files
Legend: **Built and matching** = the view matches the client design file (rendered diff < 1 %); **Built with sections hidden** = filled with source content, the listed design sections are hidden because the source has no data (full reasons: `audit/15-design-gap.md`); **Not built (no source content)** = design-only feature, the source site has no matching pages. Where source content exists but the page type is not built yet, that is stated explicitly (it fits none of the three labels).

| # | Design file | Status | Hidden sections / notes |
|---|---|---|---|
| 1 | Home | **Built and matching** | Unmodified view; shows the design’s own sample text, not source content (source home page not yet filled in). |
| 2 | SiteHeader | **Built and matching** | Restored to the client’s original. On inner pages the active-section dot (and “Claim Your Listing” target on therapist pages) differs from Home by design. Links to unbuilt pages are live and 404 (list: `15-header-footer-links.csv`). |
| 3 | Menu Options | **Built and matching** | Internal design board; folder render starts with the second panel empty, repo/clone render it filled. |
| 4 | Province | **Built with sections hidden** | hero photo slot + “Independently listed” badge, hero paragraph, “Why trust” row, card ratings/review text/Featured-Verified badges, tag filters (city filters used instead), author/reviewer card, FAQ. |
| 5 | City | **Built with sections hidden** | hero chips and design H1 formula, hero paragraph, “How we ranked”, rank badges, Featured/Verified badges, ratings, tags, price/length/site-review cells, “Details verified…”, Compare table, FAQ, author/reviewer card. |
| 6 | Centre | **Built with sections hidden** | Verified/Top-rated badges, rating chip, price card, Programs & Pricing, Team, Reviews, callback form and big claim form (no form endpoint), logo box, “Show all photos”, About pillars / “What’s included” / week-by-week, “Facility at a glance”, reviewer card, Sponsored centres. |
| 7 | Blog | **Built with sections hidden** | intro paragraph with article count, “Editor’s pick”, author/read time, Popular sort, “Most read this month”, newsletter form, “Find a rehab near you” link (dead target). |
| 8 | BlogPost | **Built with sections hidden** (2 prototype posts; the other 184 still on the old plain component) | “Medically reviewed”, dek, author/reviewer row, read time, key takeaways/timeline/quote/in-article helpline strip, FAQ block, tags, sources, disclaimer, author card, featured-centre card/band and centres carousel, “Own a centre?” promo. |
| 9 | Drug | **Built with sections hidden** (3 prototype pages: heroin, cocaine, Yukon text-only; the other 22 drug pages not built yet) | “Medically reviewed”, hero paragraph/stats/adverse-effects card, “Find A Drug Rehab” button (dead target), Sponsored centres, author/reviewer card, form, FAQ. |
| 10 | Intervention | **Built with sections hidden** (2 prototype treatment/support pages: aa-support-group, drug-alcohol-helpline; the other 31 not built yet; the source `/intervention/` page clashes and keeps the design sample) | hero eyebrow/paragraphs/“Find A Drug Rehab” button, “2×” statistic card, form. |
| 11 | Alcohol | **Not built yet — source content exists** (2 source pages: Alcohol, Alcohol addiction) | Design route live with sample content. |
| 12 | Contact | **Design page only — source page exists but clashes** | Source `/contact/` is a promo/plans page with no contact form (08 §15); design left untouched, sample content. |
| 13 | Promote | **Design page only — source page exists but clashes** | Source `/promote-your-centre/` is 519 words of promo text, the design is a plans/pricing sales page (08 §15). |
| 14 | ClaimListing | **Design page only — source page exists but clashes** | Source `/claim-your-listing/` is a 92-word stub; the design is a multi-step claim flow. |
| 15 | Therapists | **Not built (no source content)** | No therapist directory on the source site. |
| 16 | TherapistsProvince | **Not built (no source content)** | same |
| 17 | TherapistsCity | **Not built (no source content)** | same |
| 18 | TherapistProfile | **Not built (no source content)** | same |
| 19 | TherapistOnboarding | **Not built (no source content)** | new feature (profile builder) |
| 20 | ClaimTherapist | **Not built (no source content)** | new feature (claim flow for therapists) |
| 21 | JoinDirectory | **Not built (no source content)** | marketing + plans for therapists; nothing equivalent on the source |
| 22 | Auth | **Not built (no source content)** | source only has WooCommerce `/my-account/` (system page, not needed) |
| 23 | ProviderDashboard | **Not built (no source content)** | source only has `/user-dashboard/` (19 words, system page) |
| 24 | CentreOnboarding | **Not built (no source content)** | new feature; closest source page is the `/claim-your-listing/` stub |

Totals: built and matching 3 · built with sections hidden 7 (Province, City, Centre, Blog, BlogPost, Drug, Intervention) · design page only (source clashes) 3 · not built, source content exists 1 (Alcohol) · not built, no source content 10.
Caveat for rows 8–10: the prototype pages for Drug, Intervention and BlogPost were built but their final fidelity/overflow/side-by-side run (Part 4) was interrupted before it finished, and the header/footer pixel run (Part 2) is partial; markup comparison finished (footer markup identical on 28 of 30 routes at 1440 and 390, the other two have no footer).
