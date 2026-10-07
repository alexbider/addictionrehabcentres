# audit/ — Phase 1 (audit & mapping only; no project code changed)

| File | What |
|---|---|
| 01-project-structure.md | How pages are built, 23 routes ↔ views, reuse analysis |
| 02-site-inventory.csv | All 1,040 source URLs: title, H1, meta, canonical, type, parent, words, images, internal links, status |
| 03-gap-report.md | BUILT / REMAINING / NOT NEEDED, counts by type, source-site issues |
| 04-template-map.md / .csv | Template + fit level + change codes (type summary / all 928 pages) |
| 05-build-plan.md | Proposed architecture, order of work, risks, open questions |
| old-to-new-routes.csv, link-map.csv | URL mapping (1,040 pages) and rewritten link targets (2,872 hrefs) |
| content/<slug>.json | Exact source content for the 928 REMAINING pages (+ raw HTML) |
| images/<slug>/…, images/_shared/ | Downloaded images (original file names); images-manifest.csv lists URL, path, alt, size, status |
| scripts/ | Python used for the crawl/parse/emit (paths point at a scratch dir; reference only) |

Content file names: `<slug>.json` for pages/posts; `centre__<slug>.json` for centre listings; `city__<slug>.json` for location archives.
`audit/images` is ~757 MB — keep it out of git.
