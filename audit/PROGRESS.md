# Progress

## SEO migration brief — status by phase (updated after every phase)

Deploy remote: `main` tracks `deploy/main` = `Developer2marketing/addictionrehabcentres` (other remote `origin` = `alexbider/addictionrehabcentres`). Nothing has been pushed; client to confirm in Vercel which repo is connected.
Not allowed / cancelled: anything from psychologytoday.com (terms prohibit it, server returns 403). Phase 5B scrape is cancelled; a permission request to Sussex Directories is pending.

### Phase 6 — Final QA and handover (2026-10-11)
**Verified on a local production build** (`npm run build` clean, no type errors; no lint step exists in this project):
| Check | Result |
|---|---|
| `python3 audit/seo/arc_check.py` (1,029 expected URLs + 770 sitemap URLs) | **PASS**, baseline was 69 failures |
| Crawl (`audit/scripts/crawl-site.mjs`) | 0 broken links, 0 broken images, 0 orphans, 0 wrong/missing canonicals, 0 missing titles, 1 link that hits a 301 (design link to /prince-edward-island-rehabs/), 145 pages without meta description (the old site had none either) |
| Card alignment (`npm run test:cards`) | aligned at 1440/1024/768/390 on home, 2 province pages, city, drug, centre, search |
| Lightbox (`npm run test:lightbox`) | 16/16 |
| Backend e2e (`npm run test:e2e`) | all pass (30 checks: sign-up → claim → edit → approve → public page; therapist flow; access control). One run during Phase 5 reported 4 failures, the immediate re-run passed; treat the test as slightly timing-sensitive |
| Sitemap | 770 canonical `.ca` URLs, all 200; no redirected, noindex, draft or test URLs (checked by arc_check) |
| Lighthouse (local, simulated throttling; `audit/out/lh/`) | desktop performance 99–100 on all 6 page types (LCP 0.5–0.9 s); mobile performance: home 85 (LCP 4.1 s, was 3.6 s), city 87, blog 89, province 96, therapists 99, centre 75 (LCP 11.1 s, **same as before our changes: 11.4 s**); accessibility 93–97; best practices 96–100. SEO shows 61–69 only because the local host sends `X-Robots-Tag: noindex` (expected off the .ca host). No published therapist exists yet, so `/therapists/` was measured instead of a profile page. |
| Design compare (`audit/scripts/run-all.sh`) | Last full run after Phase 2/3 (`compare-phase2b.txt`): only the differences this brief asked for (cards, hidden pricing/reviews, removed claims). Not re-run after the Phase 4/5 form and header changes because it needs `next dev` on :3217; known new difference: the header gains "Sign in" / "Find a Therapist", the footer gains "Add Your Centre". |

**Regressions to know about:** mobile home LCP +0.5 s (simulated) after the shared card and footer block; the centre page's slow mobile LCP is unchanged from before and worth a separate fix (hero image size).

**What is NOT done / not verified**
- GA4/Meta/Smartsupp firing (needs the .ca host); `call_now` is a new event (the old site had none).
- Stripe, Resend, Turnstile, Vercel Blob, Google Places code paths (written to spec, fail closed, untested without keys).
- No Content-Security-Policy.
- The Google reviews that the six long listings lost (28–38 reviews on some) were not restored (see decision below).
- Home "Featured Residential Centers" (the old home page's own list) includes a criminal-defence lawyer and an AA meeting.
- Draft design routes only 404 in production; `/claim-therapist`, `/join-directory`, `/therapist-profile` stay unbuilt.

## NEEDS FROM CLIENT
1. **Database**: create Neon or Supabase Postgres (Vercel Marketplace), set `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, run `npm run db:migrate`. Until then every form shows an honest "temporarily unavailable, call 1-855-885-4747" and nothing can be saved.
2. **Resend** account + verified sending domain (`RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_NOTIFY_EMAIL`).
3. **Stripe** account, webhook secret, plan names/prices (`src/config/plans.ts`, `STRIPE_PRICE_*`); then set `PLANS_CONFIRMED=true` in code to show the Promote prices.
4. **Google Places API key** (`GOOGLE_PLACES_API_KEY`) and a place ID per centre.
5. **Vercel Blob** token for photo uploads; optional **Cloudflare Turnstile** keys.
6. **Analytics access check**: confirm GA4 `G-8RYYPCC7ZJ`, Meta pixel and Smartsupp receive data from the preview/production host.
7. **Decisions**: (a) restore or permanently drop the old Google review text on six listings; (b) moderation: "review first" (current) or "publish immediately"; (c) claiming/listing is free and the card steps were removed: confirm; (d) newsletter box stays hidden; (e) which sources in `audit/import/SOURCES.md` may be imported, and whether to ask regulators for permission; (f) a named medical reviewer if you want "medically reviewed" back (YMYL).
8. **Sussex Directories (Psychology Today)** permission request is pending; the data model (`data_sources`, `import_runs`, therapist drafts with `description_status`) supports an import later.
9. **Domain/DNS**: who switches DNS; set `REDIRECT_PREVIEW_TO_CANONICAL=true` after the domain is attached; confirm in Vercel which repo is connected (`main` tracks `deploy/main` = Developer2marketing/addictionrehabcentres).

## Launch checklist (from the audit PDF, plus what we added)
**Before DNS moves**
- [ ] Phase 1 passes: `python3 audit/seo/arc_check.py https://addictionrehabcentres.vercel.app` = PASS (it is, locally).
- [ ] Load the full Redirection-plugin export from WordPress into `src/lib/redirects.json` (the audit's test only covers URLs it could discover).
- [ ] Items 1–6 above done or consciously deferred; database migrated; admin can sign in.
- [ ] Analytics, pixel, chat and `call_now` confirmed firing on the preview (GA4 Realtime).
- [ ] Full WordPress backup taken and the old host kept online for 30 days.
- [ ] Google Business Profile and directory listings point to working URLs.
**Launch day**
- [ ] Attach the domain; set `REDIRECT_PREVIEW_TO_CANONICAL=true`; check http, www and vercel.app each 301 to https://addictionrehabcenters.ca in one hop.
- [ ] Run `python3 audit/seo/arc_check.py https://addictionrehabcenters.ca --live` (robots allows crawling and lists the sitemap; no noindex header on any page) → must PASS.
- [ ] Submit `/sitemap.xml` in Search Console, remove the old Yoast sub-sitemaps, request indexing for the home page, the 9 province hubs and the top 20 listings.
**First 30 days**
- [ ] Daily: Search Console coverage and 404 report; add a 301 the same day for any new 404.
- [ ] Weekly: track the top 50 keywords against the 9,670-visits/month baseline.
- [ ] Week 2: Core Web Vitals turn green in Search Console.
- [ ] Week 4: start the "outrank" work (schema, internal links, YMYL signals, centre LCP).

### Phase 1 — SEO migration blockers: DONE (verified locally; see numbers)
| Item | Result |
|---|---|
| 1A analytics | GA4 `G-8RYYPCC7ZJ`, Meta pixel `829671655143836`, Smartsupp key `1b60661a…` copied from the old site's source (checked 2026-10-11). `src/components/Analytics.tsx`: next/script (afterInteractive GA, lazyOnload pixel + chat), production build only, only starts when `location.hostname` is the .ca host. The old source contains **no** call-tracking event, so `call_now` is new: fires as a GA4 event and a Meta custom event on every `tel:` click (delegated listener). Env overrides: `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_SMARTSUPP_KEY`, `NEXT_PUBLIC_ANALYTICS_HOSTS`. **Not yet confirmed in GA4 Realtime** (needs a deploy on the .ca host). |
| 1B robots / noindex by host | `src/app/robots.ts` reads the Host header; `src/proxy.ts` adds `X-Robots-Tag: noindex, nofollow` on non-.ca hosts and `noindex, follow` only on /search/, /centre-onboarding/, /ecstasy-addiction/, /tranquilisers-addiction/ on the .ca. .ca robots.txt: Allow /, Disallow /admin /dashboard /api /provider-dashboard /login (+ the existing draft routes), `Sitemap: https://addictionrehabcenters.ca/sitemap.xml`. |
| 1C host redirects | One hop: http→https, www→apex always on the .ca; `*.vercel.app`→.ca when `REDIRECT_PREVIEW_TO_CANONICAL=true` (off by default so previews work; **turn on once the domain is attached**). Canonical of every page = `https://addictionrehabcenters.ca` + its own path (was 14 wrong canonicals). |
| 1D redirects | 16 dropped 301s + quebec + Saskatchewan reversed (`/saskatchewan-rehabs/` is the live page again: its 2 cards + the text of the old text page), generated by `audit/scripts/make_redirects.py` from `audit/data/superseded.json`. 265 redirects, no chains/loops (checked), targets all published. Removed duplicates are unpublished, so they are out of the sitemap, and content links to them now point straight at the target. All 301s are evaluated in `src/proxy.ts` (removed from next.config) so host + slash + case + map = one hop. |
| 1E legacy URLs | /feed/, /page/N/, /blog/page/N/, /tag/*, /YYYY/MM/ archives → /blog/; uppercase → lowercase; 8 old sitemaps → /sitemap.xml; non-slash → slash; all one hop (`src/lib/legacy-urls.ts`). |
| 1F restored pages | 19 pages now real pages (table: `audit/out/restored-vs-kept.md`). **Their source content is thin (42–59 words each, nothing else exists in the WordPress export), nothing was invented.** Optional /listing-location/wasaga-beach/, /springhill/ kept as 301 (1 listing each; the audit's expected-URL file also expects a 301); /listing-location/tracadie-sheila/ has no page in the export (stays 301). |
| 1G images | `/wp-content/uploads/*` → 301 to the published WebP (`src/lib/image-redirects.json`, generated by `audit/scripts/make_image_redirects.py` from `audit/data/img-url-map.json`; resized `-300x200` variants fall back to the original). **944 of 982 resolve (943 exact, 1 by file stem)**; 38 are not in the export at all → 410 Gone, listed with closest candidate in `audit/import/unmatched-images.csv`. Preferred "serve from the same path" was not possible: the original files are 326 MB, and the WebP copies would be served under .jpg URLs. |
| 1H on-page | MedicalBusiness JSON-LD on every centre page (name, url, address, phone, email, opening hours, sameAs, image — only fields we have; **no geo**: the export has no coordinates; **no rating/review**). MedicalWebPage + `lastReviewed` on health guides. BreadcrumbList was already on every page. Related-links block (related articles, province hubs, popular cities, start-here guides) above the footer on articles; city + "more centres" lists on province hubs; topic archives on /blog/ and category pages; "Add Your Centre" footer link. **Orphaned sitemap URLs 44 → 0.** nofollow removed everywhere. Image alt "Centre in City, Province". Casing fixed (8 names). Toronto/Ottawa/Vancouver titles → 2026. /claim-design and /promote-design are 404 in production (still served by `next dev` for the compare script); /centre-onboarding/ removed from the sitemap. |
| 1H open: lost text | The six listings that "lost 30%+ of text" lost their **Google reviews section** (e.g. Twelve Mile: 28 reviews = 5,177 words). Not restored: per the brief, reviews are hidden until they come from the Google Places API (Phase 2B), and re-publishing cached Google reviews is not allowed by Google's terms. **Decision needed from client.** |
| 1I verify | `arc_check.py` against a local production build: **69 failures → 0 (PASS)**. Crawl: 404 internal links 0 → 0, links hitting a redirect 4 → 1, broken images 0 → 0, wrong canonicals 14 → 0, orphans 44 → 0, pages without meta description 147 → 145 (the old site had none either — parity kept). Expected preview-host differences: robots.txt `Disallow: /` and `X-Robots-Tag: noindex` on vercel.app (only checked with `--live`). |


### Phase 2 — Gallery, Google reviews, identical cards: DONE
- **2A lightbox** (`src/components/Lightbox.tsx`, `GalleryGrid.tsx`): every hero tile and "Show all N photos" opens an accessible dialog (Esc, ←/→, swipe, focus trap + focus return, counter "3 / 12", close button, alt text, `next/image`, neighbours preloaded). One photo: opens without arrows. No photos: no gallery (no centre in the data lacks a photo; the empty case is the `galleryNode = null` path). `npm run test:lightbox`: 16 checks pass. Article images inside blog/guide bodies are not a gallery and are unchanged.
- **2B reviews**: nothing about Google reviews renders unless it comes from the Places API (`src/lib/reviews.ts`; env `GOOGLE_PLACES_API_KEY`; `place_id` field on the centre model, lookup in `src/data/place-ids.json`; 24 h cache; "Powered by Google", author links, text unaltered; AggregateRating/Review JSON-LD only from that data). Today: no key → rating chips, "N Google reviews", the Reviews section and tab are all hidden (the old scraped counts such as "28 Google reviews" are no longer shown). `SHOW_SAMPLE_DATA` defaults to **false** (env), so 5.0/4.9/4.8, 92/128/64, "Featured"/"Verified" badges and the fake "Most reviewed"/"Featured first" sorts are gone. README: "To enable reviews: add GOOGLE_PLACES_API_KEY".
- **2C one card**: `src/components/CentreCard.tsx` (+ `TherapistCard.tsx`, shared `centre-card.css`) replaces every centre card variant: province + city archives, city ranked list (rank shown as a "#N" badge only on ranking pages), search results, home (top 3, 20-card carousel, spotlight), centre-page "other centres", drug-page centre slider, in-article centre cards (`dc/guide.js`), and the three therapist draft grids. Fixed 16:10 image (neutral logo fallback, never "Photo: …"), name clamped to 2 lines, address 1, excerpt 3, buttons pinned to the bottom. `npm run test:cards` measured at 1440/1024/768/390 on home, 2 provinces, a city, a drug page, a centre page, search: **every row has identical card heights and identical y for "Call now" and "View centre"** (e.g. /alberta-rehabs/ @1440: cards 538 px tall, both buttons at y=1639; @1024 y=1728; @768 y=2412; @390 y=2790).
  Not changed: the draft-only design samples (JoinDirectory, TherapistProfile) still contain design placeholder strings ("photo · centre-4.jpg"); they are noindex/disallowed draft routes.
- Design compare (`audit/scripts/run-all.sh`): Promote and Centre/City/Province/Drug differ from the design only where this brief changed them (cards, hidden pricing/reviews sections, removed claims). Output: `audit/out/compare-phase2b.txt`. The extra "Related links" block is whitelisted (`--allow-extra`).

### Phase 3 — Show only what exists: DONE (changes listed below)
Removed or hidden unless real data exists (all on live pages; the design sample routes keep them so the compare script still works):
- Centre page: pricing section + tab (now only when the old listing had a cost — 6 centres — and then only the listed cost/length, no date, no table), reviews section, the three generic "setting / aftercare / people" paragraphs, the "five steps from first call to admission" panel, "Listing reviewed by Editorial team", "10,000+ people search this site every month", "respond to reviews", "A specialist calls back within the hour, 24/7".
- City pages: "How we ranked" criteria (claimed licensing/review weighting that does not exist), the compare table's Pricing and Rating columns (shown only with data), "Medically reviewed by … Registered addiction counsellor", "Est. reading time N minutes", fake "Contact for pricing / Varies / 0 Reviews" cells.
- Province and Drug pages: "Medically reviewed by", "Addiction medicine physician", reading time, "Reviewed by our clinical advisor", "Reviewed & updated … clinical advisor", "calls back within the hour".
- Home: "11.2k Lives have already changed", "Top Rated Rehabs", "Hand-picked", "Private, accredited centres".
- Kept because they are source data: costs/hours/amenities/"Verified by Addiction Rehab Centres" on the 122 listings whose old page carried that block.
- Left for the client (copy decisions): the Promote and Claim pages still show plan names/prices ($199–$1,299, "Due today $699 … refunded if not verified") from the approved designs; they become placeholder plan config in Phase 4. The home "Featured Residential Centers" list is the old home page's own list (it includes a criminal-defence lawyer and an AA meeting). `audit/scripts/scan-phrases.mjs` re-checks all 776 pages for these phrases.

### Phase 4 — Backend: DONE and tested locally (needs the client's accounts to go live)
Audit of what existed and the list of every form: `audit/22-backend-audit.md` (your understanding was correct: no auth, DB, dashboard, admin, API or payment; the forms showed success and sent nothing — the claim/onboarding wizards even collected card numbers into nothing).
Built: Postgres + Drizzle migrations (embedded PGlite for local/e2e, `DATABASE_URL` in production, no DB = static site as before), e-mail/password auth with verification and reset, rate limits, roles; forms API (zod, honeypot, Turnstile if configured, CSRF check, saved before success); provider dashboard (edit page, photos, pricing with "Updated" date, enquiries, plan & billing); moderation queue with an admin setting; master admin (claims, centres, onboarding, therapists, invites, leads + CSV, users, subscriptions, imports, SEO overrides, audit log, settings); public pages = static content + approved overrides with on-demand ISR; Stripe Checkout/portal/webhook behind env vars with "Coming soon" otherwise; header "Sign in" and "Find a Therapist"; security headers. `npm run test:e2e`: 20/20 checks (sign-up → confirm → claim → admin approval → edit → held → approval → public page changes → empty field hidden again → access control).
Decisions I made that you may want to change: claiming/listing is **free** and the card-number steps were removed (plans are chosen later in the dashboard); Promote page prices and the "Founding Partner" offer are hidden until `PLANS_CONFIRMED` (src/config/plans.ts) is set; moderation defaults to "review first"; the Blog newsletter box stays hidden (no mailing process exists).
Not done / limits: no Content-Security-Policy yet; Turnstile and Stripe/Resend/Blob code paths could not be exercised without keys (they are written to spec and fail closed); `/claim-therapist`, `/join-directory`, `/therapist-profile` remain unwired draft pages.

### Phase 5 — Therapist and centre data (permitted sources only): DONE; stopped at the research report as instructed
- Nothing is collected from psychologytoday.com (cancelled; Sussex Directories permission pending).
- **5A** `audit/import/old-therapist-drafts.json`: the "drafts" were the **design sample cards** in the four draft therapist pages: 6 records (placeholder name "Therapist name", sample fees $120–$220, `verified: true` hard-coded), identical in all four files, each with name, credentials, city, session mode, bio, tags, fee, availability. They are no longer reachable in production (all draft/design routes now answer 404 unless `ENABLE_DESIGN_ROUTES=1`; `next dev` still serves them for the compare script), so no fake therapist can be indexed or seen.
- **5B** `audit/import/therapists-from-content.csv`: 20 suggestions (19 distinct names) found in our own content, mostly researchers quoted in articles (e.g. "Dr. Nora Volkow"), one practising counsellor with credentials. Admin-review suggestions only.
- **5C** Self-service funnel: `/therapist-onboarding/` (free, card step removed) → admin queue → draft → admin publishes (only text written/approved by the therapist). `/therapist-dashboard/` lets a therapist edit or remove their profile. `/therapists/` is a real directory using the shared card (empty state until someone publishes; noindex while empty), `/therapists/<slug>/` has Person JSON-LD with real fields only, hides every empty field, never shows e-mail or registration number, has an enquiry form (delivered to the therapist by e-mail) and a "Request removal of this profile" form. Admin: invite-by-email (pre-filled onboarding/claim link), onboarding queue, therapist status, removal requests. Published profiles are added to the sitemap (rendered per request). Tested in `npm run test:e2e` (now 30 checks).
- **5D** `audit/import/SOURCES.md`: 14 sources researched with quoted terms and classification: ALLOWED (licence): StatCan ODHF, OpenStreetMap (ODbL, share-alike), government open-data catalogues; PROHIBITED: CACCF, OCSWSSW (republication), CPBAO (republication), College of Alberta Psychologists (harvesting); NEEDS PERMISSION: CRPO, CHCPBC, OPQ, BCACC, CCPA (403), ConnexOntario. Comparison against the only downloadable licensed dataset (ODHF): `audit/import/centres-vs-odhf.csv` (27 of our 409 centres match on postal code + name and would gain coordinates; 286 have no ODHF facility at their postal code). **Nothing was imported; waiting for your decision (listed at the end of SOURCES.md).**

---

# Progress

Nothing is committed or pushed. Dev server: port 3217. Re-run everything: `sh audit/scripts/run-all.sh`; article images: `node audit/scripts/check-article-images.mjs --routes ...`.

## Done
- Pages rebuilt from `designs/*.dc.html` and passing `compare-design.mjs`: Promote, Centre, City, Province, Drug, Intervention, ClaimListing, CentreOnboarding. Header/footer: `compare-header-footer.mjs` (known differences: "Sign in" / "Find a Therapist" omitted, 390px touch-target sizes).
- Fix A (stacked and blurry article images): `tidyImages()` in `src/dc/guide.js`, used by `buildBody` and `buildGuide` (Drug, Alcohol, Intervention and the treatment pages, BlogPost, Centre, City, Province). Checked by `check-article-images.mjs`.
- Fix B (Centre): Team section removed; Reviews rebuilt without invented scores or reviewers; demo text swept from `src/`. Compare script: `--skip ...,Team` and `--changed Reviews`.

## Open (needs the client)
- No `FORM_ENDPOINT` / payment processor: ClaimListing and CentreOnboarding payment steps and all callback forms are not connected.
- Header omits "Sign in" and "Find a Therapist" (draft pages).
- Rows in `DESIGN-PLACEHOLDERS.csv` marked "yes".
