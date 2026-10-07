# Phase 0 report (state before Phase 1)

## 1. Published vs unpublished — 928 remaining pages

**56 published, 872 unpublished.**

| Page type | Status / reason | Pages |
|---|---|---|
| about-info | other: no template exists (needs design) — Phase 6 | 4 |
| alcohol | planned: own view (Alcohol / Intervention) — Phase 6 | 1 |
| blog-post | planned: Phase 3 (blog) | 186 |
| blog-post | thin content (see 07-thin-pages.md) | 2 |
| centre | planned: Phase 4 (centres) | 395 |
| centre | thin content (see 07-thin-pages.md) | 63 |
| city | planned: Phase 1 (province/city) | 3 |
| city-archive | planned: Phase 5 (city archives, ≥2 centres) | 59 |
| city-archive | thin content (see 07-thin-pages.md) | 135 |
| drug | published | 23 |
| intervention | planned: own view (Alcohol / Intervention) — Phase 6 | 2 |
| province | duplicate of a primary province page — Phase 1 (decision flagged) | 8 |
| province | planned: Phase 1 (province/city) | 11 |
| province | thin content (see 07-thin-pages.md) | 2 |
| support-service | published | 2 |
| treatment-support | other: embeds centre cards (needs card component) — Phase 1/2 | 1 |
| treatment-support | published | 31 |


Summary by reason:

| Reason | Pages |
|---|---|
| planned: Phase 4 | 395 |
| thin content | 202 |
| planned: Phase 3 | 186 |
| planned: Phase 5 | 59 |
| published | 56 |
| planned: Phase 1 | 14 |
| duplicate of a primary province page | 8 |
| other: no template exists | 4 |
| planned: own view | 3 |
| other: embeds centre cards | 1 |


Notes: “utility page” is empty — all 7 utility pages (cart, checkout, account, search, thank-you…) were already classed NOT NEEDED, i.e. outside the 928. 8 province pages that duplicate a primary province page are listed as “duplicate”; they exist on the source as separate indexed URLs, so I kept them in scope.


## 2. Images

- **245 files copied** = 189 distinct `<img>` files + 57 CSS background images (hero and blue-band backgrounds) − 1 file used both ways.
- **198 checked for alt** = 198 `<img>` occurrences on the 56 pages (some images repeat). The 57 backgrounds are CSS backgrounds in the source too and have no alt attribute; they are decorative.
- **All 198 alt attributes equal the source alt exactly** (0 mismatches).
- **13 `<img>` have an empty alt in the source** (kept empty, not invented):

  - christian-faith-based-rehabs-in-canada → Rehab-Difference.jpg
  - cocaine-addiction → common-problems.jpg, Addiction-Withdrawal.jpg, overdosed.jpg
  - drug-addiction-treatment-programs → Many-addicts.jpg, Time-for-Drug-Rehab.jpg
  - drug-rehab → drug-addiction-community-issue.jpg
  - ecstasy-addiction → long-term-use-of-ecstasy.jpg, ecstasy-fast-facts.jpg
  - lortab-addiction → lortab-addiction-withdrawal-sign.jpg
  - methadone-addiction → survey-of-methadone-addiction.jpg, methadone-addiction-treatment.jpg
  - opium-addiction → Contact-Us.jpg

- **Failed downloads among the 56 published pages: none.** (Across all 928 pages: 3 images 404 on the source itself — `Life-Science-Addiction-Treatment1.webp`, `Sober-Bar-Activities.jpg`, `Child-Coping-with-Addiction.jpg` — none on a published page; 50 Google reviewer avatars skipped on purpose.)


## 3. Route clashes: design routes vs source slugs vs `[slug]`

| Design route | Clash | What happens |
|---|---|---|
| /blog | same URL as source `/blog/` | Static route wins over `[slug]`; becomes the real blog page in Phase 3 (placeholder posts replaced) |
| /contact | same URL as source `/contact/` | Static route wins; keeps working; source copy to be applied when I rework it (Phase 6) |
| /intervention | same URL as source `/intervention/` | Static route wins; design page was built from the source page |
| the other 18 design routes (/alcohol, /auth, /centre, /centre-onboarding, /city, /claim-listing, /claim-therapist, /drug, /join-directory, /menu-options, /promote, /provider-dashboard, /province, /therapist-*, /therapists*) | none — no source slug has these names | Static routes keep working until replaced; `[slug]` has `dynamicParams=false`, so it never shadows them. Source URL equivalents (`/addiction-by-alcohol/`, `/benzodiazepine-addiction/`, `/toronto-rehabs/`…) are different slugs and do not clash. |
| /blog/how-long-does-alcohol-detox-take | no source URL | nested static route, unaffected |


## 4. Text that does not match the source word for word

Initial check found 3 pages with differences; **all were my extraction bugs and are now fixed**:
- `raam-clinic`: two HTML comments in the source (`<!-- RAAM vs Traditional Referral, quick comparison -->`, `<!-- Which RAAM option … -->`) were shown as visible text. Fixed (comments are never rendered).
- `drug-alcohol-helpline`: one paragraph (“Recovering from alcoholism is a long term process…”) was moved to the wrong position because of nested columns. Fixed (source order kept).
- `dui-lawyers-in-canada`: contains lawyer cards — kept unpublished.

After the fix I re-extracted all 928 pages and re-checked: **0 of the 56 published pages differ** (whitespace-insensitive, order-sensitive comparison of the rendered `<main>` text against the source body text), and on the other 872 only the embedded centre cards differ from the card-free source text, by design.


This check also changed `content/` (regenerated) — no published page content changed except the two fixes above.
