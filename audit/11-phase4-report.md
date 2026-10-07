# 11 — Phase 4 report: centre profiles

## 1. Result
**663 pages published** (was 272). `npm run build` passes (688 static pages). Nothing committed.

| Type | Published |
|---|---|
| Centre profiles | **391** (376 at root slugs + 15 under `/search-listing/<slug>/`) |
| Blog posts | 186 |
| Treatment/support pages | 31 |
| Drug pages | 24 |
| Province pages | 20 |
| City pages | 4 |
| Legal pages | 4 |
| Support services | 2 |
| Blog index | 1 |

Centres: 458 listings + Metamorphosis (design sample, now built from its source) = 459. Published 391; **63 thin → 301** to their province page (`audit/thin-centre-redirects.csv`, for client approval); **5 out of scope skipped** (404; listed with URLs in `audit/08-source-issues.md` §11a).

## 2. What each centre page shows (counts over the 391)
Name, province chip (links to the province page), about text (cleaned blocks, source headings/lists/tables), Specialties/Amenities/Therapies lists, contact card (phone 386, email 355, website 349, address all, social 222), gallery 374, business hours 122, tag chips 125, FAQ accordion 120, YouTube video 72, other embeds 15, program length/cost 12, sponsored banner 391 (identical on every page on the source). Hidden when the source has no data: everything else (no price, team, rating bars, badges, callback form, map, “0 Reviews”). **Google review text, reviewer names, ratings and avatars are not rendered** (10 centres, listed in `08-source-issues.md` §11b); no review/aggregateRating schema exists on the source or is emitted.
Elementor markup is gone: pages are rebuilt from clean blocks; the page HTML contains no `elementor-`/`grw-` markup (checked on all 391).

## 3. Batches and fidelity check
Batches of 100 by route: 100, 200, 300, 391. After each batch the full check ran on the new pages (title tag, meta description, canonical, H1 = centre name, **visible text word for word as a word multiset against the source HTML**, images present, JSON-LD count, no review schema, no Google/Elementor markup).
| Batch | Pages | First run | Cause / fix |
|---|---|---|---|
| 1 | 100 | 71 problems | my social icons printed letters (“f”, “X”); Specialties lists written as `<p>`; “program length / cost” info block missing → all fixed (icons now CSS, text variants handled, info items added) → 0 |
| 2 | 100 | 1 | Amenities in `.block` containers with a sub-heading “Admissions” → fixed → 0 |
| 3 | 100 | 2 | theme-native Amenities block on 3 centres → fixed → 0 |
| 4 | 91 | 3 | h4 and list directly under the wrapper; empty-heading check in my test → fixed → 0 |
Final re-run over all 391 pages after the last fix: **0 mismatches** (1,745 images checked: every file exists, every alt equals the source alt). Words that differ by design: the repaired garbled characters (86 fixes on 4 centre pages, logged), and the UI items listed in `08-source-issues.md` §11c. No batch failed at the end; each failure above was caught by the check before the next batch and fixed in my own extraction.

## 4. Images
- All images (whole site) re-encoded: **WebP, max 1000 px wide, quality 75**, deduplicated by content hash, `loading="lazy"` (the first two gallery photos load eagerly), same filenames and alt text. `audit/images/` untouched (new downloads, 70 gallery images from Elementor widgets, are in `audit/images-phase4/`).
- `public/assets/img`: **98 MB** total (1,936 files; 5 MB are the original design JPGs). Before this phase: 70 MB at 1600 px. Phase 4 added about 1,000 centre images; re-encoding to 1000 px/q75 also shrank the older ones.
- 1 corrupt source PNG omitted and logged. 2 images 404 on the source omitted earlier (blog).

## 5. Province cards and redirects
Province/city cards now link only to **published** centres: 753 linked, 116 plain (thin, out of scope or unmatched) — verified on all 24 listing pages, none links to a redirect or a 404. 64 redirects in `src/lib/redirects.json` (63 thin centres + Saskatchewan), all tested: 301 with the exact target. Out-of-scope URLs return 404. 15 `/search-listing/<slug>/` pages are served at their source URLs; sitemap lists 657 URLs (noindex pages excluded).

## 6. Responsive check
42 centres × 320/390/768/1440 = **168 page loads: no sideways scroll, no broken images, no embed wider than the screen.** Sample: the 16 longest (up to 6,666 words), the 8 with most gallery images, 8 with videos/embeds, 4 with tables, all 5 `/search-listing/` pages, 4 with ≥5 FAQ items, 14 random.

## 7. Link targets still missing (links inside published content)
6 targets, 41 links (`audit/11-links-without-target.csv`): `/alcohol-addiction-treatment/` (19) and `/addiction-by-alcohol/` (15) and `/drugs-and-alcohol-intervention/` (2) → later phase; `/about-us/`, `/our-philosophy/` → later phase; `/7-things-people-recovering-from-an-addiction-wish-you-knew/` (3) → thin, unpublished. Links to centres all resolve (published or 301).

## 8. Mismatches and open points
- No text mismatches remain (§3).
- 17 centres show the source’s “N Reviews” count; remove it if the client wants no review figures at all.
- 98 centres use the identical stock gallery; kept as on the source.
- Social links open the centre’s own Facebook/X/etc. pages with `nofollow`.
- Remaining phases: city archives (59 + 135 thin), alcohol/intervention/about/FAQ pages (Phase 6).
