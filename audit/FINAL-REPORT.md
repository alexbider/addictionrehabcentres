# Final report — addictionrehabcenters.ca migration

## 1. Page counts
| Type | Live | Unpublished → 301 |
|---|---|---|
| Centres | 391 | 68 (61 thin, 7 out of scope) |
| Blog posts | 186 | 2 (thin) |
| City archives (59 + 7 `/page/N/`) | 66 | 135 (+23 empty archives never built) |
| Category archives | 29 (13 categories) | 13 categories (1–2 posts) |
| Drug | 24 | – |
| Treatment/support | 31 | 1 (`/dui-lawyers-in-canada/`) |
| Provinces | 20 | 2 |
| About/FAQ/getting-started/philosophy + residences/admissions/nutrition | 7 | – |
| Legal | 4 | – |
| City (ranked) | 4 | – |
| Alcohol | 2 | – |
| Support services | 2 | – |
| Intervention (incl. `/intervention/`, `/drug-intervention-treatment-centres/`) | 3 | – |
| Home + blog index | 2 | – |
| **Total live** | **771** | **208 unpublished; 271 redirects in total** |
Draft (noindex, not in sitemap/llms.txt, unlinked): 11 routes (Therapists ×3, TherapistProfile, ClaimTherapist, TherapistOnboarding, JoinDirectory, Auth, ProviderDashboard, CentreOnboarding, MenuOptions). Also noindex: 5 design sample routes (`/alcohol /centre /city /drug /province`).

## 2. SEO parity (771 pages)
| Check | Passed | Differed | Missing on source |
|---|---|---|---|
| url, title, description, canonical, robots, Open Graph, Twitter, breadcrumb schema, dates, no wp-content in head | 771 each | 0 | 0 |
| jsonld | 767 | 4 | 0 |
| breadcrumb visible | 0 | 0 | 771 |
| headings | 247 | 524 | 0 |
| images kept | 679 | 92 | 0 |
| images alt | 763 | 8 | 0 |
| images width/height | 765 | 6 | 0 |
| main image not lazy | 764 | 7 | 0 |
| external links | 420 | 12 | 339 |
| hreflang/pagination | 36 | 0 | 735 |
Worst 5: (1) headings differ on 524 pages (source chrome the shared header/footer replaces; 353 centres show the same headings in another order); (2) 92 pages lose old-theme sidebar artwork; (3) 4 centres' JSON-LD drops truncated, 404 schema image URLs; (4) 12 pages lose Google-maps/reviewer links (not output by decision); (5) 8 alt differences and 7 lazy first images (category pages whose lead post has no image).

## 3. Source URL accounting (1003 source sitemap URLs)
Built 736 · redirected 267 · dropped 0 · still 404: **0**. (Plus 4 non-sitemap URLs redirected, 271 redirects in total, all one hop to a 200, no chains or loops.) By reason: thin city archives 135; empty city archives 23; thin/out-of-scope centres 68; thin category archives 13; `/listing-category/` duplicates of province pages 13; thin posts 2; thin provinces 2; commerce/search/account pages 7; pricing/promote/claim pages 3; `/rehab/…` and `/alcohol-rehab/` aliases the source itself 301s 4; `/dui-lawyers-in-canada/` 1.

## 4. Internal 404s
Full body-link check on all 771 pages: 668 unique internal targets, **0 broken**. Header/footer links: 0 broken (the one 404, `/alcohol-rehab/`, now redirects like the source). `/our-philosophy/`, `/addiction-by-alcohol/`, `/drugs-and-alcohol-intervention/`: all fixed, 200. `/dui-lawyers-in-canada/` → 301 to `/` (home): it is an out-of-scope page (DUI lawyers directory, approved as skipped, like the DUI-lawyer centres); there is no closer parent page.

## 5. Fidelity and overflow (771 pages × 320/390/768/1024/1440)
First pass flagged 27 of 771 pages: 11 blog posts overflowed sideways at 1024 (images inside headings; fixed in `responsive.css` and re-checked clean), 14 province pages and `/blog/` list cards that sit hidden behind "Load more" (present in the page, not visible; not a loss), and Home (about 160 words not visible: city instead of full address on three centre cards, other five tab texts held in a hidden block). After the fixes no page overflows at any of the five widths and there are no broken images; the other 744 pages have 0 missing words. The re-check covered the 25 flagged pages, not a full second run.

## 6. Demo-content swap (approximate; elements were not individually counted)
- **Replaced (~35 items):** Home hero, intro, program, CTA images (4); 4 program photos; 6 tab images; 4 centre photos/phones/excerpts (1 top rated + 3 featured) and the Drug-addiction card photo; 5 header menu images; ClaimListing hero photo; the old sample `/intervention` replaced by the real page; Alcohol page on live data.
- **Hidden (~12 element types):** Home ratings, review counts, Featured/Verified badges, ad tooltip, "Coast to coast" card; Alcohol hero stats, topic hub, sample article/FAQ/provinces/help; footer Google review icon; empty centre headings; ranking/compare/FAQ blocks on City.
- **Still design copy:** Promote (prices, analytics numbers, testimonials, founding partner, plan comparison), ClaimListing (price, steps), Contact (response times, copy), Home section eyebrows/headings and buttons, header menu promo text. Most design copy left: **Promote, ClaimListing, Contact, Home**; the 11 draft pages are untouched and entirely design content.

## 7. Lighthouse mobile (performance / accessibility / SEO / best practices)
Before (performance, accessibility; SEO only measured on 6 types, best practices not measured): home 79/89/61 · centre 77/93/61 · blog-post 87/89/69 · drug 85/90/69 · province 80/85/69 · city-archive 84/88/69 · blog 88/94 · alcohol 86/89 · document 83/90 · category 88/94.
After (final run): 
| Type | Perf | A11y | SEO | Best practices |
|---|---|---|---|---|
| home | 91 | 100 | 61 | 100 |
| centre | 91 | 100 | 61 | 96 |
| blog-post | 95 | 98 | 69 | 100 |
| drug | 95 | 100 | 69 | 100 |
| province | **88** | 100 | 69 | 100 |
| city-archive | 98 | 98 | 69 | 100 |
| blog | 94 | 100 | 69 | 100 |
| alcohol | 98 | 100 | 69 | 100 |
| document | 98 | 100 | 69 | 100 |
| category | 96 | 100 | 61 | 100 |
Notes: runs vary about ±3 (province was 90 on the previous run, so it is on the edge). SEO scores are low only because the test host (localhost) is deliberately noindex; failures are `is-crawlable` (all pages), `link-text` (2) and `meta-description` (1, category). Best-practices 96 on centre: one browser-issue audit.

## 8. Decisions needed
1. Production domain (default https://addictionrehabcenters.ca; one variable).
2. FORM_ENDPOINT (callback, claim, newsletter, lead forms are hidden until set).
3. Home final copy (eyebrows/headings the source does not have; full addresses on cards).
4. Approve the 271 redirects in `audit/18-redirects.csv` (including the 13 `/listing-category/` pages redirected instead of built, thin centres to city/province, `/dui-lawyers-in-canada/` to home).
5. Whether `/residences/`, `/admissions/`, `/nutrition-and-wellness/` should be indexable (the source has them noindex,nofollow).
6. Promote / ClaimListing / Contact design copy: keep prices, analytics numbers, testimonials, response-time promises, or supply real facts.
7. Accessibility colours: brand blue text and white-on-blue buttons use #0670b8 (was #0890E8), grey text #566b82.
8. Centre sidebar heading order (353 centres differ from the source's order) and empty "Specialties/Amenities/Social" headings the source prints.
9. Whether to keep the design sample routes (`/alcohol /centre /city /drug /province`) in the build (noindex) or remove them.
10. The 13 `/category/` archives with 1–2 posts and the thin centres: confirm redirecting rather than publishing.
11. Province page performance sits at the 90 edge; accept or allow smaller card images.

## 9. Git state
Branch `main`; no remote tracking branch is set. Local commits not on `origin/main`: 44 (41 not on `deploy/main`): `11a9d7e fdcd665 5a10009 e380a95 707d0c5 ddfbc9e 2ca9082 02c15a8 ad699f1 814b10c 096cfae 9fb70a4 a2cafc7 97f122c 4abe5e4 b38a86b c23cd49 4fae7f5 a946ef7 4aaff1d dbc53e0 b30f1d2 1efeb28 2c60ea0 c3e615e d0af75e 3122d67 9b78164 35f901f c8cb14a 3288a2f fbb3d09 364e6a7 17c51ac 63909fc 86c282a 552f4e4 1abc84a 01251b8 8d9a6fc 424394b 80f1ada e5e34be cf6aa4f`. Nothing has been pushed.
