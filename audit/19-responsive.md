# 19 — Responsive check

Scope: the 21 design routes (23 approved pages; Menu Options and the other drafts included, fixed in CSS only), all 70 city archive/city pages, and one page of every other type — 106 URLs at 320, 390, 768, 1024 and 1440 px (audit/scripts/checks/responsive.mjs; results in audit/data/resp-before.json and resp-after8.json).

Overlap between elements is not measured automatically (it was reviewed in the earlier per-type screenshot passes). Checks per page and width: sideways scroll; elements outside the viewport; clipped text; tap targets under 44px (phones/tablets, inline text links in sentences exempt); text under 14px (phones); images that lose their ratio; header menu and footer on phone widths (opened and measured at 320/390/768: menu opens, every item inside the viewport, footer links all inside).

Fixes are in src/app/responsive.css only (sections 3-5 added): 44px minimum height for links/buttons/inputs at 1024px and below, footer and breadcrumb links as 44px rows, 44px slide dots and 40px icon buttons (visual unchanged, hit area larger), a 14px minimum for the design's smaller inline font sizes at 480px and below (matches both the server and hydrated style serialisation), and header text at 14px on the smallest phones. Nothing changes at desktop width (1440px results are clean before and after).

## Pages with a problem, before → after

| Width | Sideways scroll | Tap target <44px (pages / elements) | Text <14px (pages / elements) | Outside viewport | Clipped text | Image ratio |
|---|---|---|---|---|---|---|
| 320 | 0 → 0 | 105 / 5142 → 3 / 8 | 105 / 4595 → 0 / 0 | 0 → 0 | 0 → 0 | 0 → 0 |
| 390 | 0 → 0 | 105 / 5245 → 3 / 5 | 105 / 4498 → 0 / 0 | 0 → 0 | 0 → 0 | 0 → 0 |
| 768 | 0 → 0 | 105 / 5356 → 3 / 5 | 0 / 0 → 0 / 0 | 0 → 0 | 0 → 0 | 0 → 0 |
| 1024 | 0 → 0 | 105 / 3886 → 3 / 5 | 0 / 0 → 0 / 0 | 0 → 0 | 0 → 0 | 0 → 0 |
| 1440 | 0 → 0 | 0 / 0 → 0 / 0 | 0 / 0 → 0 / 0 | 0 → 0 | 0 → 0 | 0 → 0 |

(Menu Options is excluded from the counts: it is a draft layout board that is 1328px wide by design and cannot fit a phone.)

## Remaining, by design
- "Dispute" on ClaimListing/ClaimTherapist (3 tiny inline links in a sentence-like line "Claimed · Dispute"): inline text link, exempt from the target-size rule.
- Video-speed button "1×" on blog posts with a video is 35px wide (44px high).
- Menu Options (draft board) scrolls sideways by design.
- Nothing else is flagged: no clipped text, no distorted images, no horizontal page scroll on any live page at any width.
