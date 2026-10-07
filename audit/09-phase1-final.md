# 09 — Phase 1 final report

## 1. State of the site
**81 pages published** (of 931 with source content): city 4, drug 24, province 20, support-service 2, treatment-support 31.
Phase 1 pages: 20 province pages (15 with centre cards, 5 text-only) and 4 city pages (Toronto, Vancouver, Ottawa, Montreal). Alberta and Toronto now run from their real source content; `/benzodiazepine-addiction/` was added as the sixth source page that had only existed as a design sample (it is a normal drug page).
Build: `npm run build` passes (108 static pages). Nothing is committed.

## 2. Decisions applied
| # | Decision | Result |
|---|---|---|
| 1 | Keep headings word for word, log count mismatches | 32 mismatches (headings, meta titles, meta descriptions) logged in `08-source-issues.md` §1; text unchanged |
| 2 | Fix garbled characters | **61 occurrences on 8 published pages fixed**, plus 117 on unpublished pages. Every fix (page, before, after) in `08-source-issues.md` §2. 0 garbled sequences left in published content |
| 3 | Keep the 8 duplicate province pages, canonicals unchanged | published; listed in `08-source-issues.md` §3 |
| 4 | Saskatchewan / PEI | `/saskatchewan-rehabs/` → **301** `/saskatchewan-drug-rehab-treatment/` (in `next.config.mjs`, data in `src/lib/redirects.json`). PEI: **no redirect yet** — what the source page contains and three options in `08-source-issues.md` §5 (recommended: 301 to `/prince-edward-island-drug-rehab-centers/` and publish that 506-word page). `/prince-edward-island-rehabs/` currently returns 404 until you decide |
| 5 | Images | see §3 |
| 6 | Header/footer links | see §4 |

## 3. Images
| | Before | After |
|---|---|---|
| `public/assets/img` total | 229 MB | **41 MB** (553 files) |
| of which generated page images | 224 MB, 1,119 copies | **36 MB, 520 unique WebP files** |
| of which design JPGs (untouched) | 5 MB | 5 MB |
Method (all inside `scripts/build-content.mjs`): content-hash dedupe (identical files share one copy), WebP quality 80, max width 1600 px (no upscaling), same base file names (`name.jpg` → `name.webp`), alt text mapping unchanged (0 mismatches over 1077 `<img>` on the published pages). The script also clears and regenerates the generated folders itself, so no `rm` was run. `audit/images/` was not touched. Width/height attributes now describe the converted file.

## 4. Header and footer links
- **Header** (`SiteHeader.jsx`): it now receives the list of existing routes and hides any link, menu item, group or whole menu that has no target; “Find a Rehab”, the search boxes, “Claim Your Listing”, “Sign in” and the “All …” buttons are hidden when their target does not exist. Pages that do not pass `routes` (the 23 design pages) are unchanged.
- **Footer**: same rule.
- Checked in a real browser at 1440 (all five menus opened) and 390 (every section expanded): **every remaining header/footer link resolves** (115 internal links, 0 without a target).
- **Links hidden because their target is not published yet** (15 header, 2 footer): header — `/alcohol-rehab/` (also dead on the source), `/alcohol/` (design route), `/am-i-an-alcoholic/` (blog post, Phase 3), `/drug-intervention-treatment-centres/`, `/drugs-and-alcohol-intervention/` (Phase 6), `/faqs/` (Phase 6), `/auth`, `/join-directory`, `/promote`, `/claim-listing`, `/therapists*`, `/therapist-profile`, `/rehab/search/` (source 301s it to `/search/`, not migrated). Footer — Drugs and Alcohol Intervention, DUI Lawyers in Canada, plus the legal links (Privacy Policy, Terms of Use) and Promote Your Centre.
- Still linked but they are **design pages with sample content**: `/`, `/contact/`, `/blog/`, `/intervention/` (same URLs as the source; content to be replaced in their phases).
- Body-text links inside source content that point to unpublished pages (e.g. `/about-us/`) are kept and will resolve when those pages exist.

## 5. Responsive
Tested in headless Chrome at 320 / 390 / 768 / 1440 px on 11 pages (Alberta, Ontario, Nova Scotia, Manitoba, Ottawa, Vancouver, Toronto, Quebec text page, Cocaine, Raam Clinic, Benzodiazepine): **no sideways scroll, no broken images** at any width. Card grid 1 / 1 / 2 / 3 columns; mobile menu opens with the hidden items removed.

## 6. Still open
- PEI target (above). Legal pages (4) still not published — footer hides their links.
- 8 duplicate provinces and 32 count mismatches are for you to raise with the client.
- The 23 design pages keep sample/placeholder content until their phases.
