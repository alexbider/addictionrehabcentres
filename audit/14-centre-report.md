# 14 — Centre report (all centres on the approved Centre view)

## Counts
| | Count |
|---|---|
| Centre pages in the source (extracted) | 459 |
| **Built and published on the Centre view** | **391** (incl. 15 under `/search-listing/<slug>/`) |
| Thin (< 60 words) — not published, 301 to the province page | 63 (`audit/thin-centre-redirects.csv`) |
| Out of scope — skipped, stay 404 | 5 (3 DUI Lawyers Ontario, 1 Mexico, 1 Prince Edward Island Rehabs) |
| Review-widget centres (Google reviews on the source) | 10 — all built; review text, ratings and counts are not rendered |

Batches (alphabetical by slug, `BATCH_SIZE` in `src/lib/centre.ts` is now 391 = all): prototypes (4) → batch 1 (100) → batch 2 (100) → batch 3 (100) → batch 4 (91). One local commit per step.

## Checks per batch
| Batch | Pages | Fidelity (missing words) | Pages with problems | Overflow pages (320/390/768/1440) | Sideways scroll |
|---|---|---|---|---|---|
| 1 (+ peace-country, a later slug, so counted twice) | 101 | 0 | 0 | 18 | 0 |
| 2 | 100 | 0 | 0 | 19 | 0 |
| 3 | 100 | 0 | 0 | 19 | 0 |
| 4 | 91 | 0 | 0 | 20 | 0 |
| **Total** | **391 unique** | **0** | **0** | **76** | **0** |

Per page the fidelity check compares the rendered text (FAQ answers opened) with the source: name, address, phone, email, categories, specialties/amenities, about body, tags, hours, info items, FAQ. It also fails a page on: Google review text on the page, a visible review count, anything other than one H1, or a broken image (naturalWidth 0). Batches 2–4 used all of these; batch 1 ran without the broken-image test. Builds passed. Overflow pages in each batch: the 6 longest, centres with embeds/videos, FAQ, info items, the 2 shortest, search-listing centres, plus random ones.

Not verified: that YouTube/Vimeo/Facebook/LinkedIn embeds actually play (headless Chrome shows an empty box); only that the frame is present and does not overflow.

## Images
`public/assets/img` is **98 MB** after the final build (unchanged from before the Centre rework; WebP, max 1000 px, deduplicated).

## Province / city cards pointing at centres
Every card whose centre is published links to it. **116 card instances (57 distinct centres) point at centres that are not published** — all of them are the thin centres that 301 to a province page. They are shown unlinked (name, address, excerpt, no View link) so no card points at a redirect. List: `audit/14-cards-without-published-centre.csv` (most on Manitoba 24 + 24 duplicate page, Nova Scotia 10, New Brunswick 7, Ontario 6, Newfoundland 4, Alberta 3, BC 3, Ottawa 1, Toronto 1).

## Internal links still pointing nowhere
Crawl of all 664 published pages (`audit/scripts/link_check.py`, output `audit/14-links-still-broken.csv`): all pages return 200; 627 distinct internal link targets, **12 return 404**. Nine are in the approved design header/footer (copied from the design, present on every view) and three are single-page links.
| Target | Linked from | Cause |
|---|---|---|
| `/drugs-and-alcohol-intervention/` | 414 pages | page not built yet (intervention group) |
| `/dui-lawyers-in-canada/` | 412 | page not built (out-of-scope centres / later phase) |
| `/prince-edward-island-rehabs/` | 412 | PEI is 404 by decision |
| `/rehab/search/` | 412 | design header link, no such source page |
| `/rehab/yukon-drug-rehab-treatments/` | 412 | design header link; the source 301s it to `/yukon-drug-rehab-treatments/` |
| `/addiction-by-alcohol/` | 15 | Alcohol page not built yet |
| `/alcohol-addiction-treatment/` | 10 | page not built yet |
| `/about-us/` | 2 | page not built yet |
| `/faqs/`, `/our-philosophy/` | 1 each | page not built yet |
| `/rehab/` | 1 | design breadcrumb link |
| `/listing-category/british-columbia-rehabs/` | 1 | category archive (proposed 301 to the province page, not yet approved) |
Recommendation: pass the published-route list to `SiteHeader` / the footer so links to missing pages are hidden until those pages exist (the header already supports a `routes` prop), and repoint the Yukon header link.

## Pages with problems
None in the batch checks.
