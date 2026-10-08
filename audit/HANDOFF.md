# HANDOFF — read this first in a fresh session

Repo: `~/Downloads/arc-next` (Next.js 16 App Router, React 19, TypeScript). Reference clone of the approved design: `~/Downloads/arc-design-original` (read-only, tip `80f1ada`). **Never push.** Safety tag before the template rework: `before-template-rework` (commit `1abc84a`).

## 1. Goal
Migrate the content of https://addictionrehabcenters.ca (WordPress) into this site **using the approved design views** (`src/views/*.jsx`, the “design templates”) and **only the source’s content** (text, images, links, headings, tables, metadata). Never the source’s layout, CSS, colours, fonts, class names or Elementor/WPBakery markup. Keep every source URL (same slug, trailing slash), redirects as agreed, titles, meta descriptions, canonicals and JSON-LD.

### Rules for every page (from the owner)
1. Use the approved design views only (one view per page type, see mapping §7).
2. Take only text, images, links, headings, tables and metadata from the source.
3. No source CSS, class names, colours, fonts, layout or Elementor markup.
4. Change each view so it takes its data from `content/*.json` (props); never hard-code page content in a view.
5. **Hide any section for which the source has no data.** Never invent stats, ratings, authors, reviewers, FAQs, sliders, prices, team members, “verified” badges.
6. Keep slugs, redirects, title tags, meta descriptions, canonical URLs and JSON-LD exactly as on the source (canonicals/schema keep the source domain `https://addictionrehabcenters.ca`).
7. Responsive at 320 / 390 / 768 / 1440 px, no sideways scroll (tables scroll inside their own box); use the existing hooks in `src/app/responsive.css` (`data-cols`, `data-rc-wrap`, `data-rc-lg`, `data-rc-gap`, `data-rc-dyn`, `.rc-page`).
8. Text must match the source word for word (known exceptions: repaired mojibake, hidden UI such as review counts). Alt text = source alt.
9. Do not commit or push unless the owner says so in that message (commits have been local only; ask if unsure).
10. No `rm` on `public/assets/img/*` (blocked by the sandbox) — image cleanup lives inside `scripts/build-content.mjs`.

## 2. Where things stand (important)
- The pages built so far (664 published in `content/_index.json`) are rendered by **new components I wrote** (`src/components/*.tsx`), styled with the design’s palette but **not** by the approved design views. The owner has asked to **rework every page type onto the approved views** (§7, §8). Only **Home (`/`) and Blog (`/blog/`) have been restored to the design views** so far.
- `/` = approved `Home.jsx` untouched (sample content, no source content). Verified against the clone: same page height (11,896 px), identical text, 0.027 % pixel difference at 1440 px.
- `/blog/` = approved `Blog.jsx` **modified to take props** (`posts`, `cats`, `heading`): shows the 186 real posts (title, image, date, category, link, source excerpt) with real pagination (12 per page), category chips with counts, deep link `?category=<slug>`; hides hero eyebrow/paragraph, Featured Articles, Latest/Popular sort, Popular list, helpline card, newsletter form, Topic Hubs, author/read-time. This is the **prototype of the “view takes data via props” pattern** (see Blog.jsx `live` flag in `renderVals`, template conditionals, `src/app/blog/page.tsx`).
- Not yet reworked: province, city, city archives, centre, drug/info, blog post, treatment/support, alcohol, intervention, about, legal, FAQ, contact, promote, claim pages (they use the old components or are unbuilt).
- Design routes still live with sample content (do not change them unless told): `/alcohol /auth /centre /centre-onboarding /city /claim-listing /claim-therapist /contact /drug /intervention /join-directory /menu-options /promote /provider-dashboard /province /therapist-onboarding /therapist-profile /therapists /therapists-city /therapists-province`. The originally planned “delete all 19 design-only routes at the end” is **on hold** (the owner now wants the approved designs kept as templates; ask which to delete before launch).
- Uncommitted work at the time of writing: `src/views/Blog.jsx`, `src/app/blog/page.tsx`, `src/app/page.tsx` (restored), `audit/13-design-mapping.md`, `audit/design-contact-sheet.png`, `audit/HANDOFF.md`, `audit/08-source-issues.md` (§15–16), `audit/scripts/*`, `audit/data/*`.

## 3. Project structure
```
src/app/
  layout.tsx            fonts (Jost, Figtree), metadataBase https://addictionrehabcenters.ca, global CSS
  page.tsx              "/"  -> approved Home view (Root from @/views/Home)
  blog/page.tsx         "/blog/" -> approved Blog view + real posts
  [slug]/page.tsx       dynamic root-level pages (see §4); dynamicParams=false
  search-listing/[slug] 15 centres served at /search-listing/<slug>/
  <design routes>/      the 19 other approved design pages (static routes beat [slug])
  sitemap.ts robots.ts  sitemap from content index (noindex pages excluded); /sitemap_index.xml rewrites to /sitemap.xml
  responsive.css dc-pseudo.css globals.css   design CSS (unchanged)
src/views/              the 24 approved design views (DC runtime views: class Component + renderVals() + template()); only SiteHeader.jsx is modified (accepts `routes` prop, hides links to missing pages)
src/dc/runtime.jsx      tiny host (setState shim, $i/$A helpers, DCRoot injects the page CSS)
src/components/         OLD new-component renderers: ContentPage, ListingPage, CentrePage, PostPage, HomePage(unused), BlogIndex(unused), blocks.tsx (block renderers), PageShell, SiteFooter, ProvincesNav, CentreCards, TabsBlock
src/lib/                content.ts (loader), metadata.tsx (pageMetadata + JsonLd), blog.ts, footer.ts, provinces.ts, redirects.json (301 list read by next.config.mjs)
content/                generated: <slug>.json per page + _index.json  (DO NOT hand-edit; regenerate)
public/assets/img/      design images (top level, untouched) + generated page folders (WebP)
scripts/build-content.mjs   builds content/, images, redirects, logs
audit/                  reports, extraction output (audit/content/*.json), scripts, data
next.config.mjs         trailingSlash:true, sitemap_index rewrite, redirects from src/lib/redirects.json (statusCode 301)
```
Ports used: production build `npm run build && npx next start -p 3100`; original design clone `cd ~/Downloads/arc-design-original && npm run dev -- -p 3200`.

## 4. Content pipeline
**Extraction (offline, Python):** live HTML of every URL (sitemap + REST API + nav/footer cross-check; 1,040 URLs) → parsed → `audit/content/<slug>.json` (the persisted result; **a fresh session normally does not need to re-crawl**). Scripts are in `audit/scripts/` (`rest_pull.py`, `html_pull.py`, `parse.py`, `classify.py`, `build_parsed.py`, `finalize.py`, `image_plan.py`, `dl_images.py`, `emit_images.py`, `emit_content.py`, `listing_cards.py`, `card_images.py`, `emit_03/04/csv.py`). They were written to run from a working directory with `data/` (parsed.json, final.json, rest_*.json, image_plan.json …), `html/` (cache), `imgcache/` and a venv with `beautifulsoup4 lxml pillow`; that working directory (a scratch folder) was **not** kept — only small data files are in `audit/data/` (listing_cards.json, unknown_links.json, blog_cards.json). Re-running the crawl = recreate that layout and run the scripts in the order above; treat it as a last resort.
**Images:** originals downloaded to `audit/images/<slug>/…` (≈800 MB, git-ignored, **do not touch**); later downloads in `audit/images-phase4/`; manifest `audit/images-manifest.csv`.

**Per-page JSON (audit/content/<slug>.json)** keys: `slug, status, page_type, wp_type, template, fit, source{url,path,wp_items,robots}, new_route, seo{meta_title, meta_description, canonical_source, og, jsonld_source}, h1, word_count, features, headings, images[{role, original_url, local_path, alt, width, height, download}], links, sections, blocks[], raw_html`, plus: `rows[]` (long-form pages: kind hero-banner/content/cta-banner/help-block/row, columns[].blocks), `listing{cards[]}` (province/city), `centre{…}` (centres: name, categories, about_blocks, specialty_groups, info_items, faqs, gallery, phone/email/website/address/social, hours, tags, sponsor), `post{published, date_label, categories}` (blog), `blog_cards` (/blog/), `faqs`. Block types: h1–h6, p (html with inline links rewritten to new routes), ul/ol, table, image, link, text, iframe, video, tabs, accordion, centre-cards, cards.
**Naming:** pages/posts use their slug; centres `centre__<slug>.json`; city archives `city__<slug>.json`; home `home.json`.

**Build step:** `node scripts/build-content.mjs` reads `audit/content/*.json` and writes
- `content/<key>.json` (slim) and `content/_index.json` (`slug, route, type, title, published, reason, modified, noindex`),
- `public/assets/img/<folder>/…` WebP only for images used by published pages (max 1000 px wide, q75, dedupe by SHA-1; corrupt files omitted and logged), clearing generated folders itself,
- `src/lib/redirects.json` + `audit/thin-centre-redirects.csv` (thin-centre 301s; env `CENTRE_BATCH=n` publishes centres in batches, `WRITE_REDIRECTS=1` forces redirect output),
- logs: `audit/08-mojibake-fixes.json`, `10-omitted-images.json`, `11-corrupt-images.json`, `11-google-review-centres.json`, `12-thin-post-links-removed.json`.
Publish rules live at the top of the script: `LIVE_TYPES` (drug, treatment-support, support-service, province, city, blog-post, legal, centre), `LIVE_SLUGS` (blog, home), thin rules (centre <60 words; blog/info <300; city archive ≤1 centre; province ≤2 cards), `OUT_OF_SCOPE` centre categories (DUI Lawyers Ontario, Mexico, Prince Edward Island Rehabs). Mojibake repair (`Ã©`→`é`, “Â ”→space) is applied to all text. Review/aggregateRating schema nodes are stripped (none exist on the source). Links to the 2 thin blog posts are unwrapped.

**Rendering today:** `src/app/[slug]/page.tsx` → `getPageByRoute('/<slug>/')` (src/lib/content.ts) → by `page_type`: centre → CentrePage, blog-post → PostPage, listing → ListingPage, else ContentPage; metadata via `pageMetadata()` (source title, description, canonical, robots) and `<JsonLd>` (source JSON-LD). **This is what gets replaced by view-based rendering** (same loader/metadata, different renderer).
After any content change: `node scripts/build-content.mjs && npm run build`. If the build fails on stale types: `rm -r .next/dev`.

## 5. Decisions made so far (all in effect unless marked pending)
- **URLs:** every source URL keeps its path with trailing slash (`trailingSlash:true`; the source 301s non-slash to slash). `/sitemap_index.xml` rewrites to `/sitemap.xml` (no 301). No slug changed for SEO tidiness.
- **Redirects added (301, `src/lib/redirects.json`):** `/saskatchewan-rehabs/` → `/saskatchewan-drug-rehab-treatment/` (approved); the **63 thin centres** → their province page (`audit/thin-centre-redirects.csv`, pending client approval but active). **PEI:** `/prince-edward-island-rehabs/` is 404 for now, no redirect; options in `08-source-issues.md` §5 (owner will decide; do not publish the noindex PEI text page). **Pending approval, not added:** 101 NOT-NEEDED URLs (`06-url-exceptions.md`): 26 category archives → `/blog/`, 11 listing-category dupes → province pages, 23 empty city archives → the city’s province page (to write in `audit/empty-archive-redirects.csv`), 135 single-centre city archives → province page (CSV for client), legal/system pages.
- **Thin pages:** `07-thin-pages.md` (rules above). Thin = not published. 2 thin posts unpublished and unlinked. 63 thin centres redirected. 5 out-of-scope centres (3 DUI lawyers, 1 Mexico, 1 PEI) skipped (404), listed in `08` §11a.
- **Review counts hidden everywhere** (centre pages, province cards); Google review text/names/ratings/avatars never rendered (10 centres, `08` §11b); no rating/aggregate schema.
- **Forms removed:** the source’s “Let Us Help You” lead form, the “Contact Business” enquiry button and share buttons are not rendered. Forms to be added later must post to a single endpoint from env `FORM_ENDPOINT` (no backend exists yet; show a clear “not configured” message in dev if missing). Not built yet.
- **Schema/canonical:** source domain kept (265 canonicals; 7 noindex pages have none on the source and none is emitted). JSON-LD copied unchanged (Article, BreadcrumbList, FAQPage on 15 posts, …). Logged in `08` §10.
- **Duplicate province pages** (8, e.g. `/alcohol-drug-rehab-centres-in-alberta/`) stay published with their own canonicals (`08` §3). Duplicate-slug items: `/alcoholism-in-canada/` publishes post 12845, `/family-therapy/` the post, `/drug-detox/` the page (`08` §7).
- **Garbled characters fixed**, every fix logged (`08` §2). Headline counts that disagree with the page (e.g. “44 Best Rehab Centres in Alberta” vs 42 listed) are kept word for word and logged (`08` §1).
- **Links policy:** archive/tag/date/category links in posts and centres → text kept, link removed; links to later-phase pages kept; never-built targets unwrapped. Lists: `10-removed-links.csv`, `10/11-links-without-target.csv`.
- **Images:** all images WebP, max width 1000 px, q75, deduped, lazy loaded, same alt text; embeds (YouTube via youtube-nocookie, Vimeo/Facebook/LinkedIn) lazy-loaded in fixed-aspect boxes. `public/assets/img` ≈ 98 MB.
- **Headings:** source H1/H2 text kept; if a page has two H1s, keep the text and render the second as H2 and log it (home: “Drug Addiction”).
- **Legal pages** (privacy-policy, terms-of-use, privacy, disclaimer) published with exact source content and the source’s robots (privacy + disclaimer noindex, excluded from sitemap).
- **Home “30+” counter:** the source shows “30+” (CSS adds the +); noted for the client.
- Client questions about clashes with approved designs: `08` §15 (/contact/, /intervention/, /promote-your-centre/, /claim-your-listing/).

## 6. Reports in `audit/` (what each says)
`01-project-structure.md` original project/design structure · `02-site-inventory.csv` all 1,040 source URLs with title/H1/meta/canonical/type/status · `03-gap-report.md` built vs remaining vs not needed · `04-template-map.md/.csv` first template mapping + change codes (superseded by 13) · `05-build-plan.md` original phased plan · `06-phase0-report.md`, `09-phase1-final.md`, `10-blog-report.md`, `11-phase4-report.md` phase reports · `06-url-exceptions.md` 101 source URLs not served + proposed 301s (pending) · `07-thin-pages.md` thin pages + recommendations · `08-source-issues.md` **all source problems, fixes and client questions (§1–16)** · `11-phase4-plan.md`, `12-phase5-plan.md` plans · `13-design-mapping.md` + `design-contact-sheet.png` **the 23 design views and the source-type ↔ view mapping with fit scores** · `link-map.csv`, `old-to-new-routes.csv` · `thin-centre-redirects.csv` · `*-links-without-target.csv`, `10-removed-links.csv` · `images-manifest.csv` · `README.md` file index · `scripts/` + `scripts/checks/` (screenshot/compare helpers) · `data/` small extraction data.

## 7. Final mapping (owner-approved)
| Source type (published count) | Approved view |
|---|---|
| Home (1) | Home (done, unmodified) |
| Blog index (1) | Blog (done, props) |
| Provinces with centre cards (15) + city archives (59 to build) | **Province** |
| City ranking pages (4) | **City** |
| Centres (391, incl. 15 `/search-listing/`) | **Centre** — add a **long-body slot using BlogPost body styles** (centres have long H2/H3 text, lists, FAQ, videos) |
| Drug pages (24) + text-only provinces (5) | **Drug** |
| Treatment/support (33), About us, Our philosophy, Getting started | **Intervention** |
| Blog posts (186) | **BlogPost** |
| Alcohol pages (2) | **Alcohol** |
| Legal pages (4) + FAQs (1) | one small **new “Document” view** in the same design language — **propose it first with a screenshot; do not build until approved** |
| Contact / Promote / Claim | design pages left untouched; clashes logged for the client (`08` §15) |
Details, fit scores and hidden-section lists: `audit/13-design-mapping.md`.

## 8. How to rework a view (pattern proven on Blog.jsx)
1. Open the view in `src/views`; find `renderVals()` and the sample arrays; add a `live` flag from `this.props.<data>` and map the props into the same shapes the template already reads (title, photo, href, …).
2. Replace hard-coded copy in the JSX with values from props; **wrap every block that would show sample content in `{flag ? (…) : null}`** (flags returned from `renderVals`, added to the template’s destructuring list — careful: the destructuring is in `function template(v)`, not in `renderVals`).
3. Long-form source body (H2/H3, lists, tables, images, FAQs): render the page’s `blocks`/`rows` with the shared block renderer (`src/components/blocks.tsx`, keep `.cp-table` scroll box) inside the view’s article/body area; tables scroll inside their own box.
4. Server page (`src/app/<route>/page.tsx` or `[slug]/page.tsx`) loads the JSON, passes props to `Root`, keeps `pageMetadata()` + `<JsonLd>`.
5. Check: text equality vs source JSON (word multiset), alt text, images exist, title/description/canonical/JSON-LD, 4 widths for overflow, and compare against the clone (`audit/scripts/checks/cmp.mjs`: screenshots + text of original vs new). Design views reveal sections on scroll, so screenshot first screens or scroll before capturing.
**Order of work:** Province (then city archives with it) → City → Centre (one prototype first, show the owner) → Drug → BlogPost → treatment/support + About/Philosophy/Getting started (Intervention) → Alcohol → Document view proposal (screenshot only) last. After each type: build, check, report; commit only if asked.

## 9. Pending (not done)
Rework of all page types above; city archives (59) and their redirect CSVs (23 empty → `audit/empty-archive-redirects.csv`; 135 thin → province, CSV for client); alcohol, intervention, about, getting-started, FAQ, contact, promote, claim pages; “Document” view proposal; FORM_ENDPOINT forms; deciding the fate of the design-only routes; the pending 301s in `06-url-exceptions.md`; PEI target; full-site check (links, header/footer, 60-page overflow sample) and the Phase 5 report; the design footer/header inside views still link to design routes (SiteHeader hides missing pages only when given `routes`).

## 10. Practical notes / gotchas
- Headless Chrome for screenshots needs `--window-size=1440,1000 --force-device-scale-factor=1`, otherwise the viewport is 756 px wide. Design pages hide below-the-fold sections until scrolled.
- Next dev with Turbopack rejects a `node_modules` symlink outside the project; use a real install or `--webpack`.
- `sharp` is a dev dependency (used by build-content.mjs). macOS `sed -i` needs a suffix argument.
- Re-running `emit_images.py` rewrites `audit/images-manifest.csv` (drops the card rows); `card_images.py` re-appends them.
- Do not touch `audit/images/`; do not run `rm` on `public/assets/img/*`.
- `content/` and `public/assets/img/` are regenerated by `build-content.mjs`; edit the script or the extraction, never the output.
