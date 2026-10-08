# SEO parity: live source vs built site

Baseline: live <head> and content outline pulled from addictionrehabcenters.ca (audit/data/source-head.json, refreshed in the last pass). Built site checked on localhost:3100 with the production Host header. Per-page results: audit/17-seo-parity.csv (PASS / DIFF / MISSING-ON-SOURCE). Script: audit/scripts/seo_parity.py.

Pages checked: 771 (published pages; 208 unpublished pages are 301-redirected, see audit/18-redirects.csv).

## Totals by check

| Check | PASS | DIFF | MISSING-ON-SOURCE |
|---|---|---|---|
| url | 771 | 0 | 0 |
| title | 771 | 0 | 0 |
| description | 771 | 0 | 0 |
| canonical | 771 | 0 | 0 |
| robots | 771 | 0 | 0 |
| og | 771 | 0 | 0 |
| twitter | 771 | 0 | 0 |
| jsonld | 767 | 4 | 0 |
| wp_content_in_head | 771 | 0 | 0 |
| breadcrumb_schema | 771 | 0 | 0 |
| breadcrumb_visible | 0 | 0 | 771 |
| headings | 247 | 524 | 0 |
| images_kept | 679 | 92 | 0 |
| images_alt | 763 | 8 | 0 |
| images_dims | 765 | 6 | 0 |
| images_main_eager | 764 | 7 | 0 |
| ext_links | 420 | 12 | 339 |
| hreflang_pagination | 36 | 0 | 735 |
| dates | 771 | 0 | 0 |

## Pages with at least one DIFF, by type (count of pages differing per check)

| Type | Pages | Differences |
|---|---|---|
| about-info | 7 | headings 4, images_dims 3 |
| alcohol | 2 | headings 1, images_dims 1 |
| blog-post | 186 | headings 7, images_kept 4, ext_links 3 |
| category | 29 | headings 29, images_kept 16, images_main_eager 6, images_alt 2 |
| centre | 391 | headings 391, images_kept 63, jsonld 4, ext_links 9, images_alt 5, images_main_eager 1 |
| city | 4 | headings 4 |
| city-archive | 66 | headings 66, images_kept 7 |
| drug | 24 | none |
| home | 1 | headings 1, images_kept 1, images_alt 1 |
| intervention | 3 | headings 2, images_dims 1 |
| legal | 4 | headings 1, images_dims 1 |
| province | 20 | headings 15 |
| site-utility | 1 | headings 1, images_kept 1 |
| support-service | 2 | headings 1 |
| treatment-support | 31 | headings 1 |

Head-level checks (URL, title, description, canonical, robots, Open Graph, Twitter, breadcrumb schema, dates) pass on every page, and no head carries a wp-content URL (Open Graph, Twitter and schema images are self-hosted copies). JSON-LD differs on 4 centres only (their source schema images are truncated, 404 URLs; see audit/08-source-issues.md §30).

## Remaining DIFFs and why
- headings (524): source outlines contain chrome that the shared header/footer replaces (footer widget headings, login-modal heading, review form, sponsored ad), empty headings the source prints without content ("Specialties"/"Amenities"/"Social" with no items), and, on 353 centres, the same headings in a different order because the design places the sidebar blocks differently. Province/city/category pages also add the design's "Rehab Centres by Provinces" navigation headings.
- images_kept (92): old-theme sidebar/banner artwork that is not part of the content; 63 centres, the rest on province/city/category pages.
- images_alt (8) and images_main_eager (7): source thumbnails with empty or numbered alt text for files whose full-size copy we render with the correct alt; on category pages with a leading post that has no image the first visible image is a lazy card.
- ext_links (12): source external links to Google maps with truncated queries / reviewer profiles (not output by decision).
- hreflang_pagination: 36 pages pass (the six paginated city archives with 7 extra pages, 29 category pages); the other pages have no rel=next/prev on the source.
- Home: uses the source's own images and featured centres; the design shows a city instead of the full address on its cards (3 addresses not printed), so Home has fewer exact words than the source in that slot.

## Site-level findings
- Sitemap: 762 URLs. Compared with the source sitemap (1003): the 267 source URLs we do not list are the 267 intentional 301s (thin city archives, thin centres, duplicate province archives, thin categories, commerce/search pages); the 26 we list that the source sitemap does not are paginated /category/ pages. Lists: audit/data/sitemap-source-only.txt and sitemap-ours-only.txt (refresh).
- Source URL accounting: all 1003 source sitemap URLs: 736 return 200, 267 return a single-hop 301, none 404 (audit/18-source-url-accounting.csv). Redirect list for approval: audit/18-redirects.csv (271 rows, all verified: one hop, target 200, no chains or loops).
- robots.txt: allow all; drafts and the design sample routes disallowed (trailing-slash paths only, so real slugs such as /centres-for-health-and-healing/ are never blocked); Sitemap line -> /sitemap_index.xml (rewrites to sitemap.xml).
- Drafts and design sample routes: noindex (meta + X-Robots-Tag), not in the sitemap or llms.txt.
- Lighthouse mobile (report-only): see audit/19-performance.md.
