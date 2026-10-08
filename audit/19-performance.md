# 19 — Performance and accessibility pass (Lighthouse, mobile)

Lab runs on the production build served locally (`next start`), Lighthouse default mobile profile (simulated slow 4G, 4x CPU), one page per type. Scripts: audit/scripts/checks/lh.sh; raw reports in audit/data/lh-before and audit/data/lh-after2. Scores vary by about ±3 between runs.

| Page type (URL) | Performance before → after | Accessibility before → after | LCP before → after | CLS before → after |
|---|---|---|---|---|

## What changed
1. **First paint no longer waits for JavaScript on phones.** The design hid every page (`visibility:hidden`) until React had hydrated, so the largest paint arrived after all scripts ran. The server HTML is now rendered for a phone width (390 px initial state in the views that measure width; header, Home, City, Alcohol, Contact, Intervention, ClaimListing, Blog, BlogPost) and phones (up to 680 px) show it immediately; wider screens still wait for hydration, as before, so the layout never flashes the wrong breakpoint. Removing the gate without this change gave a layout shift of 0.18-0.37, so the two go together. Mobile CLS is now 0-0.07.
2. **Global stylesheet inlined** (27 KB, `experimental.inlineCss`): one render-blocking request less.
3. **Home**: the 73 KB map data is fetched only when the Locations section is about to scroll into view; the image-slot script (22 KB, only for placeholder photos) is no longer loaded when Home has real photos.
4. **Card thumbnails** (listing, blog, category cards) are published at 800 px wide instead of 1000 px (same WebP quality 75); hero and article images are unchanged.
5. **Sizes**: header logo has explicit width/height.
6. **Accessibility**: contrast (grey #6b7f95 → #566b82, blue text and white-on-blue buttons #0890E8 → #0670b8, the design's own hover blue; faint grey #9aabbd → #5d7188), underlined links inside running text, `<main>` landmark, header/footer column titles no longer skip heading levels, names for image-only and icon links and the sort select, accessible names that include the visible text.
7. Header menu images now use the source's real images (step 7).

## Not changed / remaining
- Blog posts with a source `h3` right after the title keep the source's heading level (accessibility 98 on blog posts).
- The design's brand blue is darkened for text and white-on-blue buttons only (about 5.2:1 instead of 3.4:1); gradients, borders and large decorative fills keep #0890E8. Client to confirm this accessibility shade.
- Lantern's simulated LCP (2.3-3.6 s) is higher than what a phone measures (under 1 s locally); scores are the lab numbers.
