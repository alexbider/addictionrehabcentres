# 08 — Source issues log (kept exactly as on the source unless stated)

## 1. Headline counts that do not match the page (kept word for word)

Decision: headings, meta titles and meta descriptions stay exactly as on the source. “Listed” = distinct centres the source itself lists on that page (first page + its own “Load More” pages, repeated centres removed).


| Page | Where | Source text | Says | Listed |
|---|---|---|---|---|
| /alberta-rehabs/ | H2 on page | 44 Best Rehab Centres in Alberta | 44 | 42 |
| /alberta-rehabs/ | meta title | Alberta Rehabs \| 44 Best Rehab Centres in Alberta | 44 | 42 |
| /alberta-rehabs/ | meta description | …rowse the 44 Best Rehab Centres in Alberta with… | 44 | 42 |
| /alcohol-drug-rehab-centres-in-alberta/ | H2 on page | 44 Best Rehab Centres in Alberta | 44 | 42 |
| /alcohol-drug-rehab-centres-in-alberta/ | meta title | Alberta Rehabs \| 44 Best Rehab Centres in Alberta | 44 | 42 |
| /alcohol-drug-rehab-centres-in-alberta/ | meta description | …rowse the 44 Best Rehab Centres in Alberta with… | 44 | 42 |
| /alcohol-drug-rehab-centres-in-british-columbia/ | meta title | British Columbia Rehabs \| 89 Best Rehab Centres in BC | 89 | 116 |
| /alcohol-drug-rehab-centres-in-british-columbia/ | meta description | …rowse the 89 Best Rehab Centres in British Colu… | 89 | 116 |
| /alcohol-drug-rehab-centres-in-manitoba/ | meta title | Manitoba Rehabs \| 51 Best Rehab Centres in Manitoba | 51 | 44 |
| /alcohol-drug-rehab-centres-in-manitoba/ | meta description | …rowse the 51 Best Rehab Centres in Manitoba wit… | 51 | 44 |
| /alcohol-drug-rehab-centres-in-ontario/ | meta title | Ontario Rehabs \| 88 Best Rehab Centres in Ontario | 88 | 104 |
| /alcohol-drug-rehab-centres-in-ontario/ | meta description | …rowse the 88 Best Rehab Centres in Ontario with… | 88 | 104 |
| /british-columbia-rehabs/ | meta title | British Columbia Rehabs \| 89 Best Rehab Centres in BC | 89 | 116 |
| /british-columbia-rehabs/ | meta description | …rowse the 89 Best Rehab Centres in British Colu… | 89 | 116 |
| /drug-rehab-centres-in-new-brunswick/ | meta title | New Brunswick Rehabs \| 34 Top Rehab Centres in New Brunswick | 34 | 33 |
| /drug-rehab-centres-in-new-brunswick/ | meta description | …rowse the 34 Best Rehab Centres in New Brunswic… | 34 | 33 |
| /manitoba-rehabs/ | meta title | Manitoba Rehabs \| 51 Best Rehab Centres in Manitoba | 51 | 44 |
| /manitoba-rehabs/ | meta description | …rowse the 51 Best Rehab Centres in Manitoba wit… | 51 | 44 |
| /new-brunswick-rehabs/ | meta title | New Brunswick Rehabs \| 34 Top Rehab Centres in New Brunswick | 34 | 33 |
| /new-brunswick-rehabs/ | meta description | …rowse the 34 Best Rehab Centres in New Brunswic… | 34 | 33 |
| /newfoundland-and-labrador-rehabs/ | meta title | 28 Best Rehab Centres in Newfoundland And Labrador | 28 | 24 |
| /newfoundland-and-labrador-rehabs/ | meta description | …rowse the 28 Best Rehab Centres in Newfoundland… | 28 | 24 |
| /newfoundland-drug-rehab-centers/ | meta title | 28 Best Rehab Centres in Newfoundland And Labrador | 28 | 24 |
| /newfoundland-drug-rehab-centers/ | meta description | …rowse the 28 Best Rehab Centres in Newfoundland… | 28 | 24 |
| /nova-scotia-drug-rehab-centers/ | meta title | Nova Scotia Rehabs \| 55 Best Rehab Centres in Nova Scotia | 55 | 51 |
| /nova-scotia-drug-rehab-centers/ | meta description | …rowse the 55 Best Rehab Centres in Nova Scotia … | 55 | 51 |
| /nova-scotia-rehabs/ | meta title | Nova Scotia Rehabs \| 55 Best Rehab Centres in Nova Scotia | 55 | 51 |
| /nova-scotia-rehabs/ | meta description | …rowse the 55 Best Rehab Centres in Nova Scotia … | 55 | 51 |
| /ontario-rehabs/ | meta title | Ontario Rehabs \| 88 Best Rehab Centres in Ontario | 88 | 104 |
| /ontario-rehabs/ | meta description | …rowse the 88 Best Rehab Centres in Ontario with… | 88 | 104 |
| /toronto-rehabs/ | H2 on page | 8 Best Rehab Centres in Toronto | 8 | 7 |
| /toronto-rehabs/ | meta title | 8 Best Rehab Centres in Toronto 2025 | 8 | 7 |


Not an error but related: the source “Load More” returns some centres twice (Alberta 4, Manitoba 6, Nova Scotia 7, Ontario 10, Newfoundland 3, BC 1); repeats are shown once.


## 2. Garbled characters fixed (page, before → after)

Cause: the source database stores UTF-8 text that was re-read as Windows-1252 (e.g. “é” → “Ã©”) and non-breaking spaces as “Â ”. Fix is applied by `scripts/build-content.mjs` at build time to every string; nothing else is altered. **61 occurrences on 8 published pages** (grouped below); 117 more occurrences exist on unpublished pages and are fixed the same way.


| Page | Before | After | × |
|---|---|---|---|
| /alcohol-drug-rehab-centres-in-manitoba/ | `…VitalitÃ© Health Netw…` | `…Vitalité Health Netw…` | 1 |
| /alcohol-drug-rehab-centres-in-ontario/ | `…Children and YouthÂ is a family-…` | `…Children and Youth is a family-…` | 1 |
| /alcohol-drug-rehab-centres-in-ontario/ | `…Dr.Â Lesley Mille…` | `…Dr. Lesley Mille…` | 1 |
| /alcohol-drug-rehab-centres-in-ontario/ | `…Maison FraternitÃ© is a non-pr…` | `…Maison Fraternité is a non-pr…` | 1 |
| /alcohol-drug-rehab-centres-in-ontario/ | `…The RoyalÂ Ottawa Healt…` | `…The Royal Ottawa Healt…` | 1 |
| /alcohol-drug-rehab-centres-in-ontario/ | `…ation center. TheyÂ offer…` | `…ation center. They offer…` | 1 |
| /alcohol-drug-rehab-centres-in-ontario/ | `…ehab facility thatÂ specializes …` | `…ehab facility that specializes …` | 1 |
| /alcohol-drug-rehab-centres-in-ontario/ | `…s at the forefrontÂ of specializ…` | `…s at the forefront of specializ…` | 1 |
| /alcohol-drug-rehab-centres-in-ontario/ | `…t centers focusingÂ on opio…` | `…t centers focusing on opio…` | 1 |
| /alcohol-drug-rehab-centres-in-ontario/ | `…ury, Ontario. TheyÂ specialize…` | `…ury, Ontario. They specialize…` | 1 |
| /drug-rehab-centres-in-new-brunswick/ | `… Care is aÂ publicÂ rehabil…` | `… Care is aÂ public rehabil…` | 3 |
| /drug-rehab-centres-in-new-brunswick/ | `…VitalitÃ© Health Netw…` | `…Vitalité Health Netw…` | 7 |
| /drug-rehab-centres-in-new-brunswick/ | `…x Health Care is aÂ publicÂ reha…` | `…x Health Care is a publicÂ reha…` | 3 |
| /manitoba-rehabs/ | `…VitalitÃ© Health Netw…` | `…Vitalité Health Netw…` | 1 |
| /new-brunswick-rehabs/ | `… Care is aÂ publicÂ rehabil…` | `… Care is aÂ public rehabil…` | 3 |
| /new-brunswick-rehabs/ | `…VitalitÃ© Health Netw…` | `…Vitalité Health Netw…` | 7 |
| /new-brunswick-rehabs/ | `…x Health Care is aÂ publicÂ reha…` | `…x Health Care is a publicÂ reha…` | 3 |
| /ontario-rehabs/ | `…Children and YouthÂ is a family-…` | `…Children and Youth is a family-…` | 1 |
| /ontario-rehabs/ | `…Dr.Â Lesley Mille…` | `…Dr. Lesley Mille…` | 1 |
| /ontario-rehabs/ | `…Maison FraternitÃ© is a non-pr…` | `…Maison Fraternité is a non-pr…` | 1 |
| /ontario-rehabs/ | `…The RoyalÂ Ottawa Healt…` | `…The Royal Ottawa Healt…` | 1 |
| /ontario-rehabs/ | `…ation center. TheyÂ offer…` | `…ation center. They offer…` | 1 |
| /ontario-rehabs/ | `…ehab facility thatÂ specializes …` | `…ehab facility that specializes …` | 1 |
| /ontario-rehabs/ | `…s at the forefrontÂ of specializ…` | `…s at the forefront of specializ…` | 1 |
| /ontario-rehabs/ | `…t centers focusingÂ on opio…` | `…t centers focusing on opio…` | 1 |
| /ontario-rehabs/ | `…ury, Ontario. TheyÂ specialize…` | `…ury, Ontario. They specialize…` | 1 |
| /ottawa-rehabs/ | `… planning are alsoÂ offered in c…` | `… planning are also offered in c…` | 3 |
| /ottawa-rehabs/ | `…Maison FraternitÃ© is a non-pr…` | `…Maison Fraternité is a non-pr…` | 3 |
| /ottawa-rehabs/ | `…The RoyalÂ Ottawa Healt…` | `…The Royal Ottawa Healt…` | 3 |
| /toronto-rehabs/ | `…ation center. TheyÂ offer 30-day…` | `…ation center. They offer 30-day…` | 3 |
| /toronto-rehabs/ | `…t can help clientsÂ with everyth…` | `…t can help clients with everyth…` | 3 |


## 3. Duplicate province pages kept published at their source URLs (to raise with the client)

Each alternate is a separate indexed URL on the source with its **own** canonical (self-referencing, unchanged here), so the two URLs compete for the same query. Kept as is.


| Duplicate (alternate) URL | Competes with | Canonical tag (as source) | Same cards? |
|---|---|---|---|
| /alcohol-drug-rehab-centres-in-alberta/ | /alberta-rehabs/ | https://addictionrehabcenters.ca/alberta-rehabs/ | yes — same listing |
| /alcohol-drug-rehab-centres-in-british-columbia/ | /british-columbia-rehabs/ | https://addictionrehabcenters.ca/british-columbia-rehabs/ | yes — same listing |
| /alcohol-drug-rehab-centres-in-manitoba/ | /manitoba-rehabs/ | https://addictionrehabcenters.ca/manitoba-rehabs/ | yes — same listing |
| /alcohol-drug-rehab-centres-in-ontario/ | /ontario-rehabs/ | https://addictionrehabcenters.ca/ontario-rehabs/ | yes — same listing |
| /drug-rehab-centres-in-new-brunswick/ | /new-brunswick-rehabs/ | https://addictionrehabcenters.ca/new-brunswick-rehabs/ | yes — same listing |
| /newfoundland-drug-rehab-centers/ | /newfoundland-and-labrador-rehabs/ | https://addictionrehabcenters.ca/newfoundland-and-labrador-rehabs/ | yes — same listing |
| /nova-scotia-drug-rehab-centers/ | /nova-scotia-rehabs/ | https://addictionrehabcenters.ca/nova-scotia-rehabs/ | yes — same listing |
| /saskatchewan-drug-rehab-treatment/ | /saskatchewan-rehabs/ | https://addictionrehabcenters.ca/saskatchewan-drug-rehab-treatment/ | no listing (text page) |


Note: `/saskatchewan-rehabs/` is no longer a page (approved 301 → `/saskatchewan-drug-rehab-treatment/`), so that pair is now one page.


## 4. Other source problems noticed (kept as is)

- `/prince-edward-island-rehabs/` lists one centre, “Irecover Newfoundland” (a Newfoundland centre filed under PEI), and its image alt reads “Clsc Alberta Health Services” (wrong centre). Page not published (see below).
- 118 centres use the identical stock gallery trio and every centre repeats the “Sponsored Ad” banner (Phase 4).
- Several excerpts run words together (“ProfessionalsAt Serenity House”) — source text, kept.
- Header menu on the design linked `/rehab/…` URLs that 301 on the source; the header now only links to existing pages.


## 5. PEI page — what the source contains and proposed target (no redirect added yet)

`/prince-edward-island-rehabs/` = H1 “Prince Edward Island Rehabs”, meta title “Best Rehab Centres in Prince Edward Island”, meta description “Browse the Best Rehab Centres in Prince Edward Island with reviews. Call 1-855-885-4747 to get in contact with Prince Edward Island Rehab Centres.”, **4 words of text and 1 centre card** (Irecover Newfoundland, address “Trout River Rd, Prince Edward Island C0A, Canada”, 0 reviews).

Related PEI URLs on the source: `/prince-edward-island-drug-rehab-centers/` (506-word text page, **noindex**), the centre `/addictions-and-mental-health-services-prince-edward/` (79 words, a centre profile; not published yet), `/listing-category/prince-edward-island-rehabs/` (same single card).

**Options**
1. **Recommended:** 301 `/prince-edward-island-rehabs/` → `/prince-edward-island-drug-rehab-centers/` and publish that 506-word page (it is the only PEI page with real content; I keep its `noindex` as on the source unless you say index it).
2. 301 to `/` (home) — loses the PEI context.
3. Publish the PEI page as is (one card, no text) — thin.

## 6. Images that are 404 on the source (omitted, no broken image)
| Page | Image | Status |
|---|---|---|
| /how-sober-bars-are-creating-a-new-buzz-around-town/ (published) | https://d2hhyarrvfefvk.cloudfront.net/wp-content/uploads/2016/09/Sober-Bar-Activities.jpg | 404 on source; omitted (the same file also appears as a 238x179 thumbnail inside the text, omitted too) |
| /the-seven-cs-for-helping-your-child-heal-during-your-recovery/ (thin, unpublished) | https://d2hhyarrvfefvk.cloudfront.net/wp-content/uploads/2016/10/Child-Coping-with-Addiction.jpg | 404 on source; will be omitted if the page is ever published |
| centre `life-science-addiction-treatment` (Phase 4) | https://addictionrehabcenters.ca/wp-content/uploads/2023/05/Life-Science-Addiction-Treatment1.webp | 404 on source |

## 7. Two (three) URLs that WordPress holds twice
| URL | Items on the source | Sitemap lists | Published | Skipped |
|---|---|---|---|---|
| /alcoholism-in-canada/ | post 12845 (2022-08-09, modified 2022-09-12) and post 12546 (2022-02-17) | the URL **twice** (lastmod 2022-02-17 and 2022-09-12) — both | 12845, the one the live URL serves and the newer one | **12546** (2,302 words, older) |
| /family-therapy/ | page 11373 (492 words) and post 13806 (1,187 words) | the **post** only (post-sitemap, lastmod 2023-01-05) | post 13806 (also what the live URL serves) | **page 11373** |
| /drug-detox/ (Phase 0, same rule) | page 11350 and post 945 (2015) | both (post-sitemap 2015, page-sitemap 2025) | the page (live URL serves it) | **post 945** |

## 8. Schema, canonical and domain
All source structured data is kept unchanged on every published page (Article/BlogPosting, BreadcrumbList, WebPage, WebSite, Organization, Person, ImageObject; FAQPage on 15 posts). Title, meta description and canonical are the source values. **All of it points to the source domain `https://addictionrehabcenters.ca`** (8,445 URL references across 272 pages; canonical tags too), and the author `Person` nodes use `secure.gravatar.com` images (747 references, third-party). If the new site launches on a different domain these need a decision before launch (keep = canonicals point to the old domain).

## 9. Blog and legal pages — other source facts
- `/blog/` on the source lists 189 posts (the grid shows `/alcoholism-in-canada/` twice and `/drug-detox/`, which is a page); the new index lists 186 posts + `/drug-detox/`, minus the 2 unpublished thin posts, with duplicates shown once. `/inpatient-vs-outpatient-treatment/` is a live indexable post that is **not** in the source sitemap and **not** in the blog grid — published at its URL, not listed on the index.
- Legal pages built with exact source content: `/privacy-policy/` (index, follow), `/terms-of-use/` (index, **nofollow**), `/privacy/` and `/disclaimer/` (both **noindex** on the source; kept noindex, excluded from the sitemap). `/privacy/` duplicates `/privacy-policy/` on the source.
- Posts show: category chips, date (as the source shows it), title, featured image, body. The source's “Let Us Help You” form is not rendered; no author, reviewer, table of contents or invented FAQ.
- Links removed from posts (text kept): 466 on 186 posts — category archive: 243, category/tag/amenity/date archive: 186, page not migrated: 21, source redirects this URL to the home page: 10, redirect target not migrated: 6. Full list: `audit/10-removed-links.csv`.
- The nested design route `/blog/how-long-alcohol-detox-take` (invented article) still exists in the app; it is not a source URL and is not in the sitemap or the index — say if I should delete it.

## 10. Domain in canonicals and schema — pages affected (decision: keep the source domain)
Decision: canonical tags and structured data keep `https://addictionrehabcenters.ca`. Affected today: **265 of 272 published pages** carry a canonical on that domain (the other 7 are noindex pages on which the source itself emits no canonical: `/detox-centres-in-canada/`, `/disclaimer/`, `/drug-rehab/`, `/ecstasy-addiction/`, `/prevention-education-programs/`, `/privacy/`, `/tranquilisers-addiction/` — none is emitted here either); **272 pages** have structured data that references it (8,446 URL references); 249 pages also reference third-party `secure.gravatar.com` author images. Every page published in later phases will be affected in the same way.

## 11. Phase 4 — centre pages: items for the client
### 11a. Out-of-scope centres skipped (not published, not redirected → 404)
| Centre | URL | Source category |
|---|---|---|
| Karapancev Law Professional Corporation | https://addictionrehabcenters.ca/karapancev-law-professional-corporation/ | DUI Lawyers Ontario |
| Mass Tsang Criminal Lawyers | https://addictionrehabcenters.ca/mass-tsang-criminal-lawyers/ | DUI Lawyers Ontario |
| Toronto Criminal and DUI Lawyers | https://addictionrehabcenters.ca/toronto-criminal-and-dui-lawyers/ | DUI Lawyers Ontario |
| Sayulita Wellness Retreat | https://addictionrehabcenters.ca/sayulita-wellness-retreat/ | Mexico |
| Irecover Newfoundland | https://addictionrehabcenters.ca/irecover-newfoundland/ | Prince Edward Island Rehabs (a Newfoundland centre filed under PEI; its image alt on the PEI page names a different centre) |
Their cards stay on the province pages as plain text (no link).

### 11b. Centres with Google reviews on the source — review text, reviewer names, ratings and avatars NOT rendered (10: the 9 found earlier plus Metamorphosis)
| Centre | URL | Reviews in the widget |
|---|---|---|
| Addiction Rehab Toronto | https://addictionrehabcenters.ca/addiction-rehab-toronto/ | 5 |
| Another Road Addiction Recovery Centre | https://addictionrehabcenters.ca/another-road-addiction-recovery-centre/ | 34 |
| Bellwood Health Services | https://addictionrehabcenters.ca/bellwood-health-services/ | 5 |
| Canadian Centre For Addictions | https://addictionrehabcenters.ca/canadian-centre-for-addictions/ | 20 |
| Centres for Health and Healing | https://addictionrehabcenters.ca/centres-for-health-and-healing/ | 5 |
| Metamorphosis Centre for Change | https://addictionrehabcenters.ca/metamorphosis-centre-for-change/ | 9 |
| Michael Walsh Addictions Specialist Sober Coach Canada | https://addictionrehabcenters.ca/michael-walsh-addictions-specialist-sober-coach-canada/ | 38 |
| Red Road Recovery | https://addictionrehabcenters.ca/red-road-recovery-sorrento-british-columbia/ | 4 |
| The Farm Rehab | https://addictionrehabcenters.ca/the-farm-rehab/ | 5 |
| Twelve Mile Recovery | https://addictionrehabcenters.ca/twelve-mile-recovery/ | 28 |

The source JSON-LD contains no `Review`, `AggregateRating` or `reviewRating` nodes (0 removed); the check is automated at build time. The small “N Reviews” count that the theme prints under the name (not Google text) is shown on the 17 centres where it is above 0, as on the province cards.

### 11c. Other facts about centre pages
- 1 gallery PNG is corrupt on the source (`Gwasala-Nakwaxdaxw-Nations-3.png`, libpng read error): omitted, logged in `audit/11-corrupt-images.json`.
- Not rendered because they are UI, not content: the “Contact Business” enquiry button, the live “Local time” clock, the Elementor share-buttons widget (6 pages), the Google reviews widget (10 pages), spacers/dividers.
- Source “Verified by Addiction Rehab Centres …” text (an icon-box on 127 pages) is rendered as written.
- Source “Specialties”/“Amenities” headings that have no items (27 occurrences) are hidden.
- 63 thin centres → 301 to the province page; list for client approval: `audit/thin-centre-redirects.csv`.
- Videos: 72 centres embed a YouTube video (shown via youtube-nocookie.com) and 15 centres embed Vimeo/Facebook/LinkedIn frames — third-party embeds as on the source.

## 12. “N Reviews” counts hidden (approved)
The theme’s review count (a plain number such as “5 Reviews”, not Google text) is no longer shown anywhere on the new site. The data stays in the content files. Pages where the source showed a count above 0:
- **17 centre pages**: /1000-islands-addiction-rehab/ (5), /addiction-rehab-toronto/ (3), /alcove-addiction-recovery-for-women/ (1), /canadian-centre-for-addictions/ (2), /centres-for-health-and-healing/ (2), /drug-rehab-center/ (1), /emergo-recovery/ (1), /inspire-change-wellness-center/ (1), /metamorphosis-centre-for-change/ (2), /native-horizons-treatment-centre/ (1), /north-bay-recovery-home/ (2), /red-road-recovery-sorrento-british-columbia/ (1), /rising-sun-rehabilitation-centre/ (1), /rose-city-recovery-addiction-treatment-centre/ (1), /simon-house-recovery-centre/ (1), /stonehenge-therapeutic-community/ (1), /young-spirit-winds/ (1)
- **10 listing pages** (cards with a count; number of cards in brackets): /7-best-drug-alcohol-rehab-centres-in-vancouver-2025/ (1), /alberta-rehabs/ (4), /alcohol-drug-rehab-centres-in-alberta/ (4), /alcohol-drug-rehab-centres-in-british-columbia/ (2), /alcohol-drug-rehab-centres-in-ontario/ (10), /british-columbia-rehabs/ (2), /drug-rehab-centres-in-new-brunswick/ (1), /new-brunswick-rehabs/ (1), /ontario-rehabs/ (10), /toronto-rehabs/ (2)

## 13. Links to the two thin blog posts removed (link text kept)
`/7-things-people-recovering-from-an-addiction-wish-you-knew/` and `/the-seven-cs-for-helping-your-child-heal-during-your-recovery/` are unpublished (thin). Anchors to them were unwrapped on: `/how-sober-bars-are-creating-a-new-buzz-around-town/` (“recovering from an addiction”), `/marijuana-addiction/` (“addiction”), `/saskatchewan-drug-rehab-treatment/` (“drug addiction”). Their “Read more” buttons on the source blog grid are not part of the new index. Detail: `audit/12-thin-post-links-removed.json`.

## 14. Phase 5 log
### 14a. Home page (`/`)
- Two H1s on the source: “DRUG REHAB CENTER & ALCOHOL ADDICTION SERVICES IN CANADA” (kept as the page H1) and “Drug Addiction” (in the dark banner) — text unchanged, the second is rendered as an **H2**.
- Theme badges on the three featured cards (“Featured”, “✓ Verified”, “N Reviews”) are not shown (review figures hidden, badges are theme UI). All other text matches the source word for word (automated check); title, description, canonical and the 2 JSON-LD blocks are the source values.
- The “Addiction Treatments” row contains a counter widget: the source markup holds only “30” (no label) and its theme adds a “+” with CSS, so the live source shows a large **“30+”** (checked on the rendered source page). The new page matches that: text “30”, the “+” drawn by CSS. For the client: the number has no label or explanation on the source either.
- Source images smaller than 300 px (icons, logo strip) are shown at their own size, not stretched.

## 15. Source pages that clash with the approved design pages (design pages left unchanged)
The approved design pages are kept exactly as designed (sample content included) until the client decides. “Clash” = the source page and the approved design cannot both be right for the same job.
| Source URL | Design page | What clashes | One-line question for the client |
|---|---|---|---|
| `/contact/` | Contact (`/contact`, **same URL**) | The source page is a promo landing page (“Choose the plan that’s right for you Centre”, Why Choose Us, testimonials, FAQ) with no contact form or channels; the design Contact is a message form + channels page. | Should `/contact/` keep the source’s promo content, or become a real contact page (phone, email, message form — needs a form endpoint)? |
| `/intervention/` | Intervention (`/intervention`, **same URL**) | The source is a 1,120-word guide; the design page holds a different sample article, TOC, steps and a form. | May the Intervention design show the source guide text word for word in place of its sample article? |
| `/promote-your-centre/` | Promote (`/promote`, different URL) | The source is 519 words of promo text; the design is a sales page with plans, prices, placements and analytics that the source does not contain. | Should the Promote design show only the source text (plans/pricing hidden), or will the client supply real plans and prices? |
| `/claim-your-listing/` | ClaimListing (`/claim-listing`, different URL) | The source is a 92-word promo stub (stays published, no redirect); the design is a multi-step claim flow with search, plans and payment. | Is a working claim flow wanted, or only the short source text? |

## 16. Home and Blog restored to the approved designs
`/` is the approved Home design (`src/views/Home.jsx`, unchanged, sample content); `/blog/` is the approved Blog design with the 186 real published posts (title, image, date, category, link) in its list. The Blog view hides every block that has no source data: the hero eyebrow and paragraph, “Featured Articles”, the Latest/Popular sort, the “Popular” list, the “Reading for someone you love” card, the newsletter form, the “Topic Hubs” section and “min read”/author. The source-based home page (`content/home.json`, `HomePage.tsx`) is kept in the repo but unused.

## 17. Card excerpts cut mid-word (rule approved)
The source theme cuts every listing-card excerpt at a fixed number of raw characters (44 on province cards, 100/250/500 elsewhere) with no word logic, so many end in a half word (e.g. “…for t”, “…faith-ba”).
- **Rule:** if the cut falls mid-word, the partial last word is removed and “…” is added. No other word is changed. A cut that falls exactly at the end of a word, or an excerpt that already ends in sentence punctuation, is left as it is.
- **How it is decided** (`audit/scripts/excerpt_cuts.py` → `audit/data/excerpt_cuts.json`, applied in `scripts/build-content.mjs`; the original text stays in `excerpt_source`): the live centre page is searched for the excerpt and the character after it is read (158 cards: 107 mid-word, 51 at a word end). For the 291 cards whose excerpt text is not on the centre page the last token counts as a complete word when it occurs in the site’s own text at least as often as the longer words that start with it (94 % right on the 158 verifiable cards); those are marked `inferred-mid` / `inferred-word` in the JSON for review. 4 excerpts end in punctuation and are unchanged.
- Totals (449 distinct excerpts): 323 shortened (107 confirmed, 216 inferred), 122 unchanged, 4 already complete.

## 18. Province pages on the approved Province view
- Hidden (no source data): hero eyebrow/photo/stats, “Why trust us”, sort/filter bar, ratings, review counts, Featured/Verified badges, “Need help choosing” band, cities block, author/reviewer card, FAQ, “Load more” (all cards are shown).
- The hero “Call 1-855-885-4747” button is the design’s own element; the number is the site’s real helpline (it is in the source header/footer and in every province meta description).
- Card images with an empty `alt` on the source are kept with empty alt (Alberta 4, British Columbia 20 + 3 cards with no image, Ontario 22).
- PEI stays 404 and `/saskatchewan-rehabs/` stays a 301 to `/saskatchewan-drug-rehab-treatment/`; the two thin province pages are not published.

## 19. City ranking pages on the approved City view
Vancouver (`/7-best-drug-alcohol-rehab-centres-in-vancouver-2025/`), Ottawa, Montreal, Toronto.
- Hidden (no source data): “Ranked list · year” / “Updated” chips, “(With Pricing)”, hero paragraph and stats, “At a glance” card, “How we ranked”, rank badges, ratings, tags, price / program length / site reviews, “Details verified…”, “Call for availability”, “Not sure which centre…” band, Compare table, author/reviewer card, FAQ, “Popular types of rehab”.
- The design’s H1 (“N Best Rehab Centres in {City} {year} (With Pricing)”) is not used: the source H1 (e.g. “Addiction Rehab Centres Toronto”) is the H1; the source H2 above the list (“8 Best Rehab Centres in Toronto”) is the list heading with its intro paragraphs; Montreal has no list heading (its H2 “Best Rehab Centres in Montreal” sits in the hero).
- Headline counts that disagree with the cards are kept as written (Toronto “8 Best” shows 7 cards; Vancouver “7 Best” shows 7; Ottawa 11 cards).
- Excerpt rule (§17) also applies to these cards; the mojibake repair is applied to the cut list too.
- 3 Montreal/Vancouver cards have no source image and show the design’s neutral placeholder.

## 20. Centre prototype on the approved Centre view (4 pages, not the full 391)
Pages: `/another-road-addiction-recovery-centre/` (rich: 11 gallery images, YouTube video, long body; has Google reviews), `/peace-country-wilderness-program/` (average), `/canadawide-mobile/` (minimal, 85 words), `/blue-skies-recovery/` (LinkedIn embed). Switch list: `CENTRE_VIEW_SLUGS` in `src/lib/centre.ts`; every other centre still uses the old component.
- Shown (source fields only): breadcrumb, category, name, address, phone, website, gallery, about body (headings, paragraphs, lists, tables, images, videos/embeds) in the BlogPost article styles, specialties/amenities groups that have items.
- Not shown (per owner): ratings, review counts, Google review text, hours, FAQ, tags, social links, email, price/length items, sponsor ad, badges, logo box, “Show all photos”, tab bar, team, location/map, callback form, claim banner, sponsored centres, author/reviewer.
- Source oddity kept as is: `/canadawide-mobile/` and `/peace-country-wilderness-program/` list “Substance Abuse Treatmental” under both Specialties and Amenities.
- Gallery: the first 5 images fill the design’s mosaic (layout adapts to 1–4 images); images beyond 5 appear as a thumbnail grid under the body.

## 21. Centre view: restored fields and rules (owner decisions)
- **Restored where the design has a natural place:** email + social links in the contact card under Call / Visit website; tags as chips and hours as a card in the About side column (headings are the source’s: “More Tags”, “Business Hours”); FAQ in the design’s FAQ accordion (source FAQ text; the source FAQPage JSON-LD is kept on those pages). Hidden when the source has none.
- **Info items** (e.g. “$500+ / Day”, “30-90 days”; 12 centres): shown as value-only cards in the hero’s “at a glance” row (the design’s slot for price/length facts). The source gives them no label (label = value), so no label is invented.
- **Bullet lines** (“• Holistic”, 5,948 paragraphs, plus 14 “– …” ones that come in runs of two or more) are converted into real lists; only the bullet symbol is removed.
- **“Substance Abuse Tremental”-style oddity kept as in the source:** appears under both Specialties and Amenities on centres such as `/canadawide-mobile/` and `/peace-country-wilderness-program/`; not corrected.
- Still never shown: Google review text (10 centres), review counts, ratings, sponsor ad.
