# 13 — Design mapping: approved design views ↔ source page types (read-only analysis; nothing was built)

Reference: the original design clone `~/Downloads/arc-design-original` (tip `80f1ada`, identical to this project except `SiteHeader.jsx`). Contact sheet: `audit/design-contact-sheet.png` (all 23 views, 1440 px, first screen of each).

*Method note:* the design pages reveal their lower sections on scroll, so the sheet shows the first screen; section lists below come from the `data-screen-label` markers in each view’s code.

## 1. The 23 design views

| # | View | Route | What it is for | Main sections | Data it needs | List area | Long-text body | Hero image | Sidebar | Form |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Home** | `/` | Landing page: find a centre, featured centres, programs, locations | Hero (search card, stat, photo) · Top Rated Rehabs · Intro · Featured Residential Centers (carousel) · Locations (province list + map) · Programs · Drug Addiction · Addiction Treatments · Kind of Rehab · Detox · Hope · Ready CTA | hero copy, featured centres (name, city, photo, rating), provinces/cities, 4 program blurbs, treatment tiles, counts | yes (centres, provinces) | partial (intro/hope text) | yes | no | light (location/treatment selector) |
| 2 | **Alcohol** | `/alcohol` | Alcohol-addiction information page | Hero (stat card, photo) · Alcohol topics (tiles) · Article (sticky TOC) · Call strip · Provinces · Let us help | article sections (types, effects, signs, treatment), FAQ, topic tiles, provinces | yes (topics, provinces) | **yes** (article + TOC) | yes | yes (sticky TOC) | yes (Let us help) |
| 3 | **Auth** | `/auth` | Login / sign-up for centres and therapists (demo) | Brand panel · Form | none (front-end only) | no | no | yes (brand panel photo) | left brand panel | yes |
| 4 | **Blog** | `/blog` | Blog index | Blog Hero (search, filters) · Featured Articles · Latest Articles · Topic Hubs | posts (title, category, excerpt, author, date, image), categories, hubs | **yes** (post grid) | no | no (post thumbnails) | no | search + newsletter |
| 5 | **BlogPost** | `/blog/how-long-…` | Single article | Article Header · Hero Image · Article Body (TOC, timeline) · Main Featured Business · Featured Businesses Slider · Related Articles | title, author/reviewer, dates, body chunks, FAQ, featured centres, related posts | yes (slider, related) | **yes** | yes | yes (sticky TOC/share) | no |
| 6 | **Centre** | `/centre` | Single centre profile | Centre Hero (gallery mosaic, rating, price) · About · Team · Reviews · Location · Request a callback · Claim this listing · FAQ · Sponsored Centres | name, category, gallery, about, services, price tabs, team, reviews, address/phone, FAQ | yes (team, reviews, sponsored) | medium (About) | yes (gallery) | yes (sticky contact/price card) | yes (callback) |
| 7 | **CentreOnboarding** | `/centre-onboarding` | Multi-step listing builder with live preview | Intro · Builder (6 steps) | form state only | no | no | no (preview card) | live-preview panel | **yes** |
| 8 | **City** | `/city` | City ranking page “N Best Rehab Centres in {City}” | City Hero (at-a-glance card) · How we ranked · Ranked list · Compare (table) · Guide · FAQ · Nearby | city, ranked centres (rank, name, price, duration, rating, tags), criteria, compare rows, guide text, FAQ, nearby cities | **yes** (ranked list) | yes (Guide) | no (glance card) | yes (sticky card) | no |
| 9 | **ClaimListing** | `/claim-listing` | Find and claim a centre listing (search → details → plan → pay) | Claim hero (preview card) · Claim flow | listings to search, plans | yes (search results) | no | yes (preview card) | summary panel | **yes** |
| 10 | **ClaimTherapist** | `/claim-therapist` | Same flow for therapists | Therapist claim hero · Claim flow | profiles to search, plans | yes | no | yes | summary panel | **yes** |
| 11 | **Contact** | `/contact` | Contact page with message form | Hero · Message form · Who we help · What to expect · FAQ | channels (phone/email), topics, SLA, FAQ | yes (channels, FAQ) | no | no | channel cards | **yes** |
| 12 | **Drug** | `/drug` | Single drug information page | Drug Hero (photo, stats) · Sponsored Centres · Effects (cards + article) · Let Us Help You · FAQ · Provinces · Other Drugs | drug name, article paragraphs, stats, effect cards, sponsored centres, FAQ | yes (centres, effects, other drugs) | **yes** | yes | yes (sticky TOC/form card) | yes (Let Us Help You) |
| 13 | **Intervention** | `/intervention` | Long-form guide: how to do an intervention | Hero · Article (steps, TOC) · Call strip · Provinces · Let us help | article sections, steps, reading list, provinces | yes (provinces, steps) | **yes** | yes | yes (sticky TOC) | yes |
| 14 | **JoinDirectory** | `/join-directory` | Marketing + pricing for therapists | Hero · Reach · Why join · Where you appear · Plans · Your profile · How it works · Plan comparison · Testimonials · Trust · FAQ · Sign up | plans/prices, benefits, testimonials, FAQ | yes (plans, testimonials) | marketing copy | yes (profile preview) | no | yes (sign up) |
| 15 | **MenuOptions** | `/menu-options` | Internal header-design board (not a public page) | two header layouts | — | — | no | no | no | no |
| 16 | **Promote** | `/promote` | Marketing page selling promotion to centres | Hero · Benefits · Where you appear · Plans · Placements · Sponsored vs organic · How it works · Analytics · Availability · Testimonials · Trust · Founding Partner · About · Plan comparison · FAQ · Final CTA | plans/prices, placements, KPIs, testimonials, FAQ | yes (plans, placements) | marketing copy | yes (mock) | no | no |
| 17 | **ProviderDashboard** | `/provider-dashboard` | Logged-in provider dashboard (client-only demo) | Sidebar · Lead detail · KPIs · charts | app state | yes | no | no | **yes** (nav) | yes |
| 18 | **Province** | `/province` | Province page: centre directory | Province Hero (stats, photo) · Why trust us · Listings (filters, sort, grid) · Cities · Guide · FAQ · Other Provinces | province, centres (name, address, excerpt, rating, tags), cities, guide text, FAQ | **yes** (card grid) | yes (Guide) | yes (photo) | no | 1 select (sort) |
| 19 | **TherapistOnboarding** | `/therapist-onboarding` | Therapist profile builder with preview | Intro · Builder | form state | no | no | no | live preview | **yes** |
| 20 | **TherapistProfile** | `/therapist-profile` | Single therapist profile | Profile Hero · About · Similar therapists · For professionals · FAQ | therapist fields, fees, hours, FAQ | yes (similar) | medium | yes (portrait) | yes (booking card) | yes (message) |
| 21 | **Therapists** | `/therapists` | Therapist directory home | Hero · Why trust us · Featured therapists · By location · By concern · Therapist or rehab · For professionals · FAQ | therapists, locations, concerns | yes | no | yes | no | search |
| 22 | **TherapistsCity** | `/therapists-city` | Therapists in a city | Hero · Why trust us · Featured · Nearby · By concern · Therapist or rehab · For professionals · Guide · FAQ | as above + guide | yes | yes (Guide) | yes | no | search |
| 23 | **TherapistsProvince** | `/therapists-province` | Therapists in a province | same sections as TherapistsCity | as above | yes | yes (Guide) | yes | no | search |

(SiteHeader is the shared header, not a page; MenuOptions is an internal board, so 22 are real pages.)


## 2. Source page types → best design view

| Source type | Count | Best view | Runner-up | Fit /10 |
|---|---|---|---|---|
| Home | 1 (built) | Home | Drug | 7 |
| Province pages with centre cards | 15 built (+2 thin: PEI, Sask.) | Province | City | 7 |
| Province pages, text only (Quebec, Yukon, Nunavut, 2 others) | 5 built | Drug | Intervention | 6 |
| City ranking pages | 4 built | City | Province | 7 |
| City archives (/listing-location/) | 0 built: 59 buildable, 135 thin, 23 empty | Province | City | 5 |
| Centre profiles (incl. 15 under /search-listing/) | 391 built (+63 thin, 5 skipped) | Centre | BlogPost | 6 |
| Drug pages | 24 built | Drug | Alcohol | 8 |
| Treatment / support / service pages | 33 built (31 + 2) | Intervention | Alcohol | 7 |
| Blog posts | 186 built (+2 thin) | BlogPost | Intervention | 8 |
| Blog index | 1 built | Blog | BlogPost | 8 |
| Alcohol pages | 2 unbuilt | Alcohol | Intervention | 8 |
| Intervention pages | 3 unbuilt (one embeds 3 centre cards) | Intervention | Alcohol | 8 |
| About us / Our philosophy / Getting started | 3 unbuilt | Intervention | Alcohol | 6 |
| FAQs page | 1 unbuilt | Contact (FAQ accordion) | Promote (FAQ) | 5 |
| Legal pages (privacy, terms, disclaimer, privacy-policy) | 4 built | Intervention | Alcohol | 5 |
| Contact (/contact/) | 1 unbuilt | Promote | Contact | 5 |
| Promote your centre | 1 unbuilt | Promote | JoinDirectory | 5 |
| Claim your listing | 1 unbuilt (published, no redirect) | ClaimListing | Promote | 4 |

### Detail per type

**Home** — 1 (built). Best: **Home** (runner-up Drug), fit **7/10**.  
- Design sections hidden (no source data): location/treatment search card, “Locations” map, ratings/review counts, “Ad” badge  
- Source content with no obvious place: accordion panels (2 long text panels), six-tab drug block with images, “Struggling / For loved ones” link lists, “30+” counter  
- Would look like: Hero (headline, phone line, “11.2k Lives” stat) → intro heading → text+image rows (the 4 program rows map directly to the design’s Programs rows) → centre cards → tabs; tabs/accordion need a place in “Drug Addiction / Addiction Treatments / Kind of Rehab” sections

**Province pages with centre cards** — 15 built (+2 thin: PEI, Sask.). Best: **Province** (runner-up City), fit **7/10**.  
- Design sections hidden (no source data): Why trust us, hero stats (centres/cities/updated), photo slot, filter chips + sort, Cities block, FAQ  
- Source content with no obvious place: none lost: the guide text (H2/H3, paragraphs, lists) goes in “Guide”; some provinces have 25–116 cards (more than the design’s page-size)  
- Would look like: Hero (H1 + H2) → card grid (name, image, address, excerpt) → long guide text → Other Provinces; no filters

**Province pages, text only (Quebec, Yukon, Nunavut, 2 others)** — 5 built. Best: **Drug** (runner-up Intervention), fit **6/10**.  
- Design sections hidden (no source data): Sponsored Centres, Effects cards, FAQ, Other Drugs  
- Source content with no obvious place: 2-column text rows with images, CTA banner, help band  
- Would look like: Banner hero → alternating text/image rows → CTA band (this is the WPBakery layout)

**City ranking pages** — 4 built. Best: **City** (runner-up Province), fit **7/10**.  
- Design sections hidden (no source data): How we ranked, Compare table, FAQ, Nearby, price/duration columns, rank badges  
- Source content with no obvious place: benefits text with H2/H3 (fits Guide)  
- Would look like: Hero → card list (no ranks/prices) → Guide text

**City archives (/listing-location/)** — 0 built: 59 buildable, 135 thin, 23 empty. Best: **Province** (runner-up City), fit **5/10**.  
- Design sections hidden (no source data): everything except hero + card grid (source = title, 1 sentence, 1–12 cards; “$$$” tier is a theme default)  
- Source content with no obvious place: none (almost no text)  
- Would look like: Hero + a short card grid; weak pages — see §4

**Centre profiles (incl. 15 under /search-listing/)** — 391 built (+63 thin, 5 skipped). Best: **Centre** (runner-up BlogPost), fit **6/10**.  
- Design sections hidden (no source data): Team, Reviews/rating bars, price tabs, callback form, Claim banner, “Sponsored Centres”, stats  
- Source content with no obvious place: long About with H2/H3 and lists (126 centres >400 words), Elementor FAQ accordion (120), videos/embeds (87), business hours, tag chips, 10 Google-review widgets (not shown)  
- Would look like: Hero (name, province chip, gallery) → wide About body → lists → FAQ → sidebar card with phone/email/website/address/hours → sponsored banner

**Drug pages** — 24 built. Best: **Drug** (runner-up Alcohol), fit **8/10**.  
- Design sections hidden (no source data): Sponsored Centres, Effects cards, stats strip, FAQ, Other Drugs, form  
- Source content with no obvious place: 2–4 text+image rows, CTA banner, help band  
- Would look like: Hero (banner image + H1) → two-column rows → CTA band → help band

**Treatment / support / service pages** — 33 built (31 + 2). Best: **Intervention** (runner-up Alcohol), fit **7/10**.  
- Design sections hidden (no source data): TOC (optional), Provinces strip, form, stats  
- Source content with no obvious place: long articles with H2/H3, lists and tables (Raam Clinic: 3,900 words, 4 tables, 6 images)  
- Would look like: Hero → long article column (tables scroll inside their own box) → call strip

**Blog posts** — 186 built (+2 thin). Best: **BlogPost** (runner-up Intervention), fit **8/10**.  
- Design sections hidden (no source data): Main Featured Business, Featured Businesses Slider, Related, author/reviewer, listen button, timeline  
- Source content with no obvious place: 88 tables (19 posts), FAQ sections (19 with FAQPage schema), 462 body images  
- Would look like: Header (category chips, title, date) → hero image → body (H2/H3, lists, tables, images, FAQ headings as plain sections)

**Blog index** — 1 built. Best: **Blog** (runner-up BlogPost), fit **8/10**.  
- Design sections hidden (no source data): Featured Articles (source has none), Topic Hubs, search/newsletter  
- Source content with no obvious place: 189 post cards (image, title, excerpt) instead of 11; 26 categories → filter chips  
- Would look like: Hero → category chips → card grid with “Show more”

**Alcohol pages** — 2 unbuilt. Best: **Alcohol** (runner-up Intervention), fit **8/10**.  
- Design sections hidden (no source data): Alcohol topics tiles, stat card, form  
- Source content with no obvious place: text+image rows, CTA band  
- Would look like: Hero → article body → call strip

**Intervention pages** — 3 unbuilt (one embeds 3 centre cards). Best: **Intervention** (runner-up Alcohol), fit **8/10**.  
- Design sections hidden (no source data): steps tiles, reading list, form  
- Source content with no obvious place: 3 centre cards inside the text  
- Would look like: Hero → article → call strip

**About us / Our philosophy / Getting started** — 3 unbuilt. Best: **Intervention** (runner-up Alcohol), fit **6/10**.  
- Design sections hidden (no source data): all design-specific blocks  
- Source content with no obvious place: long text with 5–10 H2 and 4–7 images  
- Would look like: Hero → article column (no TOC) → call strip

**FAQs page** — 1 unbuilt. Best: **Contact (FAQ accordion)** (runner-up Promote (FAQ)), fit **5/10**.  
- Design sections hidden (no source data): message form, channels, “What to expect”  
- Source content with no obvious place: 21 questions (H4) + answers; FAQPage schema  
- Would look like: Simple hero → accordion list

**Legal pages (privacy, terms, disclaimer, privacy-policy)** — 4 built. Best: **Intervention** (runner-up Alcohol), fit **5/10**.  
- Design sections hidden (no source data): hero image, TOC, form, call strip  
- Source content with no obvious place: plain long text (300–1,600 words)  
- Would look like: Plain heading → one article column

**Contact (/contact/)** — 1 unbuilt. Best: **Promote** (runner-up Contact), fit **5/10**.  
- Design sections hidden (no source data): Contact’s message form/channels/SLA don’t exist on the source page  
- Source content with no obvious place: the source page is a promo landing page: “Choose the plan…”, Why Choose Us (4 points), Trusted By, testimonials, 5+ FAQ, 10 images  
- Would look like: Promote-style page; the design’s Contact page would be mostly empty

**Promote your centre** — 1 unbuilt. Best: **Promote** (runner-up JoinDirectory), fit **5/10**.  
- Design sections hidden (no source data): plans/prices, placements, analytics, compare table (all invented in the design)  
- Source content with no obvious place: 519 words: two H1s, About Us, Why list, testimonials, “Promote Your Treatment Program”  
- Would look like: Hero + Benefits + Testimonials only

**Claim your listing** — 1 unbuilt (published, no redirect). Best: **ClaimListing** (runner-up Promote), fit **4/10**.  
- Design sections hidden (no source data): claim flow (search, steps, plans, payment)  
- Source content with no obvious place: 92 words: H3 + 2 H2 + 1 image  
- Would look like: Hero only

## 3. Types with no good approved design (score ≤5) and proposals (nothing built)
| Source type | Problem | Proposal |
|---|---|---|
| City archives (59) | design pages are rich editorial/ranking pages; archives are a title + a few cards | reuse **Province** listing section inside a short page (hero + grid); or merge the 59 into province pages (fewer thin pages) |
| About / Philosophy / Getting started (3) | no About design exists | reuse the **Intervention** article layout (hero + long text + call strip); no new view needed |
| FAQs page | only embedded FAQ sections exist | a **new simple view** in the same language: hero + the FAQ accordion section taken from Contact/Province |
| Legal pages (4) | no plain-document design | reuse **Intervention/Alcohol** article column without hero image/TOC — or a new 30-line “Document” view |
| Contact (/contact/) | the source page is a promo page; the design Contact page needs channels/form | use **Promote**’s sections (Why choose us, testimonials, FAQ); keep the design Contact view for a real contact form only if a form endpoint is added |
| Promote your centre / Claim your listing | designs are product flows with invented plans, prices, analytics; sources are short promo text | **Promote** with most sections hidden; **ClaimListing** reduced to hero (or redirect, decision already made: stays published) |
| Centre profiles (6/10) | design About is a summary; sources have long H2/H3 bodies, lists, FAQ, videos | keep **Centre**, but add a wide “long body” slot (the BlogPost article body styles) |

## 4. Clashes between source URLs and approved design routes
Static design routes take precedence over the dynamic `[slug]` route, so a real source page at the same URL never renders until the design route is removed.
| Source URL | Design route | Status in this project (`arc-next`) |
|---|---|---|
| `/` | `/` (Home) | already replaced by the source-based home |
| `/blog/` | `/blog` (Blog) | already replaced by the real index |
| `/contact/` | `/contact` (Contact) | **still the design page — clash** |
| `/intervention/` | `/intervention` (Intervention) | **still the design page — clash** |
No other source slug equals a design route name (checked against all 1,040 source paths). Design routes that have no source URL (and still serve placeholder content): `/alcohol`, `/drug`, `/city`, `/province`, `/centre`, `/promote`, `/claim-listing`, `/auth`, `/centre-onboarding`, `/claim-therapist`, `/join-directory`, `/menu-options`, `/provider-dashboard`, `/therapist-onboarding`, `/therapist-profile`, `/therapists`, `/therapists-city`, `/therapists-province`, `/blog/how-long-does-alcohol-detox-take` (the last one is already deleted in `arc-next`).
