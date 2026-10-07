# 12 — Next phase plan (not built): city archives + alcohol / intervention / about / FAQ (+ home, contact, promote, claim)

## A. City archives (`/listing-location/<city>/`) — 217 archives
| Group | Count | Handling |
|---|---|---|
| ≥2 centres | **59** (237 cards) | build |
| exactly 1 centre | **135** (124 point to a published centre, 11 to an unpublished one) | not built: 301 → the centre’s page when published (124), else its province page (11); CSV for client approval, same as thin centres |
| 0 centres | 23 | already NOT NEEDED; 301 to `/` (or province) — your call |
- **Template:** City design (ListingPage card grid) with the archive’s own content: title, the one-sentence intro (only 1 archive in 3 has it; “Abbotsford” also carries a placeholder FAQ “01 Question / 01 Answer.” and an unrelated Massachusetts ad — both left out), cards = name, address, excerpt-less (source cards have none), category, image. Card links go only to published centres (190 of 237 cards today, rest plain).
- **Hidden (not real data):** the “$$$” price tier (236 of 237 cards carry the same theme default), rating/“0 Reviews”, “Featured”, filter sidebar, empty FAQ.
- **Route:** new `app/listing-location/[slug]/`. No clash with the 23 design pages (`/city` is a different path).
- **Images:** 236 card images, 166 unique, **154 already published** → ~12 new images ≈ **+1 MB**.
- **Risks:** weak pages (name + a few cards, 1-word intro) → thin-content/SEO risk even at ≥2; odd city labels on the source (“Canada”, “Catharines”, “Cleveland”); card centres from out-of-scope categories (3 “DUI Lawyers” cards) must stay plain; duplicate listing of the same centre across city + province pages.

## B. Alcohol, intervention, about and FAQ pages
| Page | Words | Source layout | Notes |
|---|---|---|---|
| `/alcohol-addiction-treatment/` | 1,187 | long-form (banner + rows) | 7 images |
| `/addiction-by-alcohol/` (design sample today) | 503 | long-form | 5 images; the old Alcohol design copy is replaced |
| `/drugs-and-alcohol-intervention/` | 510 | long-form | 5 images |
| `/drug-intervention-treatment-centres/` | 1,124 | long-form + **3 centre cards** | needs the card block (centres are published) |
| `/intervention/` (design sample today) | 1,120 | long-form | 7 images |
| `/about-us/` | 850 | long-form | 7 images |
| `/our-philosophy/` | 1,272 | long-form, 10 H2 | 4 images |
| `/getting-started/` | 1,315 | long-form | 7 images |
| `/faqs/` | 1,987 | 21 Q&A (H4) | accordion; FAQPage schema (2 JSON-LD blocks) |
Also still design samples at real source URLs: **home `/`** (1,513 words, 19 images, 4 centre cards), `/contact/` (608 words, 10 images), `/promote-your-centre/` (519), `/claim-your-listing/` (92 words). I recommend adding them to this phase (they are on the header/footer).
- **Template:** the existing long-form `ContentPage` (identical WPBakery layout to the 56 drug/info pages already built) — **not** the Alcohol/Intervention design views (they hold invented copy). FAQ page: accordion (same `<details>` pattern as centres). Home: needs its own layout (hero, sections, province/city cards) from source sections only.
- **Thin pages:** none — all ≥510 words except `/claim-your-listing/` (92 words, a promo stub: recommend 301 → `/promote-your-centre/` or skip; your call). Noindex pages stay out (`/guarantee/`, `/admissions/`, `/why-choose-us/`, testimonials, thank-you).
- **Route clashes with the 23 design pages (static routes beat `[slug]`):** `/` (design Home), `/contact` and `/intervention` are the **same URLs** as source pages → the design routes must be deleted/replaced or the real pages never render. No clash for `/alcohol`, `/promote`, `/claim-listing`, `/drug`, `/city`, `/centre`, `/province` (different paths) but they still serve placeholder pages: recommend deleting all 19 design-only routes before launch (decision).
- **Forms:** lead form (“Let Us Help You”) is on most pages and has no endpoint — left out so far. `/contact/` and claim/promote flows need a decision on a form backend before they can work.
- **Images:** ~50 for group B + ~34 for home/contact/promote/claim ≈ 84 images ≈ **+5 MB** at 1000 px/q75 (≈58 KB average). With A the phase adds ≈ **+6 MB** (98 → ~104 MB).
- **Risks:** home page has the most visual structure (needs design care, 19 images); Contact/Promote/Claim depend on forms and on the paid-listing/claim flow the source has but this build does not; `/faqs/` has two H1s and an FAQPage block; links from published pages to `/alcohol-addiction-treatment/`, `/addiction-by-alcohol/` (34 links) resolve once built.
