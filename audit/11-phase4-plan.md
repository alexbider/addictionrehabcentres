# 11 — Phase 4 plan: centre profiles (not built)

**Scope:** 458 centres = **395 strong** (≥60 words) + **63 thin**; plus `/metamorphosis-centre-for-change/` (a design sample today; 396th once its content is extracted). 15 strong centres live at `/search-listing/<slug>/` (4 thin), the rest at root slugs. Total published now: 272 pages.

## Template
Centre design (`Centre.jsx`) → new data-driven `CentrePage` (same approach as province/city: design styling, source data only). Source data per page: name, province category, about text (rich HTML on 125 pages, headings on 391), specialties / amenities / therapies lists, address, phone, email (decoded from Cloudflare), website, social links, gallery, featured image, business hours, tag chips, FAQ accordion, Google reviews, “Sponsored Ad” banner, source JSON-LD (WebPage, BreadcrumbList, Organization; FAQPage on 37).

## What is hidden when the source lacks it (counts for the 395 strong centres)
| Block | Shown on | Hidden on |
|---|---|---|
| About text | 395 | – |
| Contact card: phone / email / website / address | 390 / 356 / 353 / 395 | the rest |
| Social links | 223 | 172 |
| Specialties / amenities lists | 142 / 136 | ~255 |
| Therapies and other H4 lists | 266 | 129 |
| Photo gallery | 378 (98 of them the identical stock trio) | 17 |
| Review count/rating | 16 (non-zero only) | 379 (“0 Reviews” never shown) |
| Google reviews (rating + review text) | 9 | 386 |
| FAQ accordion | 120 (37 with FAQPage schema) | 275 |
| Business hours / tag chips | 125 / 128 | ~270 |
Never rendered (not in the source): price, team, programs, rating bars, claimed/verified badges, callback form, map, “Sponsored centres”. Reviewer avatars are not copied.

## The 63 thin centres (<60 words; 53 are linked from province pages; by province: Manitoba 27, Nova Scotia 11, Ontario 8, New Brunswick 7, Newfoundland 4, BC 3, Alberta 3)
Not published. Recommendation: **merge + 301 each profile to its province page** (the centre stays as a card on that page with name, address, excerpt); no card link while unpublished. Alternative: publish them with phone/address/website as minimal pages — I do not recommend it.
Out-of-scope categories among the strong ones: 3 “DUI Lawyers Ontario”, 1 “Mexico”, 1 “Prince Edward Island” (Irecover Newfoundland) — need your call (build / skip).

## Image size — **this does not fit the 80 MB cap**
Current `public/assets/img`: 70 MB. Phase 4 adds (dry-run on the real files, 1,126 unique images after hash dedupe, WebP):
| Which images | 1600 px q80 | 1000 px q75 | 800 px q72 |
|---|---|---|---|
| All (featured + gallery) | +90 MB | **+65 MB** | +47 MB |
| Featured + 2 gallery per centre | – | +43 MB | – |
| One image per centre | – | +19 MB | ≈ +13 MB |
Even one image per centre breaks 80 MB. Options: (a) raise the cap (all images at 1000 px ≈ 135 MB total); (b) one image per centre at ≤800 px and recompress the existing images (blog/cards) to ~1000 px — ≈ 80–85 MB; (c) keep images outside the repo (CDN/blob) and reference by URL. I will not build until you choose. 1 gallery PNG is corrupt on the source (`Gwasala-Nakwaxdaxw-Nations-3.png`) and will be omitted and logged.

## Risks
- Image size/ cap (above); the 98 centres sharing three identical stock photos look duplicated — hide stock gallery or keep?
- Rich pages carry Elementor markup (125) — sanitised block rendering needed; 25 centres ≥1,000 words (cost, therapies, philosophy).
- Google reviews text (9 centres) is third-party content — confirm you want it republished.
- Thin/duplicate: many centres have 60–135 words of near-identical template prose.
- Two route families (`/search-listing/<slug>/`) plus root slugs in `[slug]`; centre slugs like `drug-rehab-center-2` are source slugs and are kept.
- 72 garbled-character spots across centre content (fixed by the existing repair step; logged).
- Province-page cards will start linking to centres → the thin 63 must be decided first or those links stay plain text.
