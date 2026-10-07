# 10 — Blog phase report

## 1. Result
**272 pages published** (blog-post 186, city 4, drug 24, legal 4, province 20, site-utility 1, support-service 2, treatment-support 31). New this phase: **186 blog posts**, the real **`/blog/` index with category filter**, and the **4 legal pages**. `npm run build` passes (298 static pages). Nothing committed.
Not published: the 2 thin posts (`/7-things-people-recovering-from-an-addiction-wish-you-knew/` 141 words, `/the-seven-cs-for-helping-your-child-heal-during-your-recovery/` 285 words).

## 2. Decisions applied
| # | Decision | Result |
|---|---|---|
| 1 | Copy the 31 addictionrehabtoronto.ca images, keep alt | done (WebP, original alt text kept) |
| 2 | Archive links: text kept, link removed. Links to later-phase pages kept. List links with no target | 466 links unwrapped on 186 posts (`audit/10-removed-links.csv`); remaining targets with no page: §4 |
| 3 | PEI redirect only if the target page is published and covers PEI | **not done**: `/prince-edward-island-drug-rehab-centers/` is not published (and is `noindex` on the source). Options unchanged in `08-source-issues.md` §5; `/prince-edward-island-rehabs/` still 404 |
| 4 | Legal pages with exact source content | built: `/privacy-policy/`, `/terms-of-use/`, `/privacy/`, `/disclaimer/` (source robots kept: privacy + disclaimer noindex; Terms “index, nofollow”). Footer now shows Privacy Policy and Terms of Use |
| 5 | WebP ≤1600px, total under 80 MB | **70 MB** total in `public/assets/img` (5 MB are the design JPGs); 1,003 unique WebP files; under the limit, no stop needed |
| 6 | 2 images 404 on the source: omit and log | omitted; logged in `08-source-issues.md` §6 |
| 7 | Two shared URLs | `/alcoholism-in-canada/` → post 12845 published, post 12546 skipped; `/family-therapy/` → the post (what the sitemap lists) published, the page skipped; `/drug-detox/` (earlier phase) same rule. Logged in `08-source-issues.md` §7 |
| 8 | No form, no invented author/reviewer/FAQ | none rendered; also no table of contents added |
| 9 | Keep Article/Breadcrumb/FAQPage schema, title, description, canonical; log old domain | kept unchanged (FAQPage on 15 posts); logged in `08-source-issues.md` §8 |
| 10 | Replace /blog/ placeholder, add category filter, keep thin unpublished | done: source heading + 185 post cards (+`/drug-detox/`) with image, title and excerpt as the source shows them, 26 category chips with counts, “Show more”, deep link `?category=<slug>` |
| 11 | Verify every post, check widths and tables | §3 |

## 3. Verification
**Content (all 186 posts, against the live source HTML):** title tag, meta description, canonical, H1, body text, number of tables (88) and images (483 shown), image files present, number of JSON-LD blocks — **185 identical; 1 flagged by my checker is a false alarm** (`/alternative-methods-of-coping/`: the source repeats the title in its date header, so my text-offset test was 26 characters off; the body itself matches). Alt text of every image equals the source alt; the 1 omitted image is the 404 one.
Earlier pages re-checked after the build changes: the 66 non-listing pages match exactly; the 19 listing pages match for text and all cards (4 name differences are the garbled-character fixes).

**Responsive** (headless Chrome, 430 page loads): every post at 320 and 390; the 19 posts with tables at 320/390/768/1440; every 20th post at 768/1440; `/blog/` and the 4 legal pages at all four widths. **0 sideways scroll, 0 broken images.** All 88 tables sit in their own `overflow-x:auto` box (min-width 520 px, so they scroll inside the box on phones; the page itself never scrolls). One overflow found and fixed on the way: a long unbroken string in the privacy policy at 390 px (text now wraps anywhere).
Filter test: 27 chips (All + 26 categories); clicking a chip filters, updates the URL, and `/blog/?category=addiction-detox` opens pre-filtered (3 posts).

## 4. Links that still have no target (content links on published pages)
12 targets, 47 occurrences — full list `audit/10-links-without-target.csv`:
| Target | Why | Links |
|---|---|---|
| `/alcohol-addiction-treatment/`, `/addiction-by-alcohol/`, `/drugs-and-alcohol-intervention/`, `/about-us/`, `/our-philosophy/` | later phase (alcohol, intervention, about pages: Phase 6) | 19 + 14 + 2 + 1 + 1 |
| `/victoria-wellness/`, `/inspire-change-wellness-center/`, `/metamorphosis-centre-for-change/`, `/canadian-centre-for-addictions/` | later phase (centre profiles: Phase 4) | 4 |
| `/7-things-people-recovering-from-an-addiction-wish-you-knew/` | thin post, unpublished, decision pending | 3 |
| `/dual-diagnosis-treatment/`, `/prescription-drug-addiction-treatment/` | **never built** (noindex on the source); links sit on the earlier-phase pages `/drug-rehab/`, `/prescription-drug-rehab/` — I recommend unwrapping them as for posts | 3 |
Header and footer: 119 internal links checked in a browser, **0 without a target** (the one reported, `/about-us/`, is a body link on a drug page, listed above).

## 5. Still open
- PEI target (above). 8 duplicate provinces and 32 heading-count mismatches for the client (`08-source-issues.md`).
- `/blog/how-long-alcohol-detox-take` (invented design article) still exists in the app, outside the sitemap — delete?
- Domain in schema/canonical (`08-source-issues.md` §8).
- Next in `05-build-plan.md`: Phase 4 centres (395 + 63 thin), Phase 5 city archives (59 + 135 thin), Phase 6 alcohol/intervention/about/FAQs.
