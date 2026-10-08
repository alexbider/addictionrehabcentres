# 15 — Design parity: what is built, what is hidden and why

Rule (owner, current): build every section the design has **except** a section that asserts facts the source does not give. Built = navigation, layout, buttons, CTAs, helpline, claim banner, filters/sort/tabs/anchors, card grids, category lists, Load more, and anything fillable from scraped data or counts we compute. Hidden = needs data the source lacks (ratings, review counts, prices, pricing tables, team, reviews, “How we ranked”, rank badges, comparisons, FAQs the source lacks, analytics such as “most read”, sponsored/paid placements, “verified/trusted” claims).
Reference = the client design folder (`~/Downloads/Addiction Rehab Centers Redesign`, read-only). Page height will differ where data is missing; component, spacing and style parity is the target.

Footer: **Home’s rich footer is the only footer** (one component, `src/views/SiteFooter.jsx`, used on every route). Header: identical on every page (no per-page active dot).

## What was added in this pass
| Page type | Built now (new or restored) |
|---|---|
| Blog post (`BlogPost`, 2 prototype posts) | breadcrumb, category chips, real title/dates, real share row (Facebook/X/LinkedIn links + Copy link), full-width 21:9 hero image, sticky “In this article” + progress, audio player, article typography, sticky sidebar with **helpline card (1-855-885-4747)** and related reading (same category), related-articles grid and previous/next (same category) |
| Centre | anchor menu (About / Location / FAQ, only those that exist), sticky contact card and sticky side column, claim card → `/claim-your-listing/`, **Location** block from the real address (address/phone/website/email cells, “Get directions” link, map embed built from the address), FAQ accordion, hours/tags/specialties cards |
| City | hero with real stats (centres listed, 24/7), “At a glance” jump list of the real centres, real cards with “Call for availability” + “View centre”, helpline band, guide, “Popular types of rehab” links (only pages that exist) |
| Blog index | Featured lead + two side cards (3 latest posts), Latest/A–Z sort, sidebar with helpline card and “Guides by topic” (real categories and counts), “Browse by topic” band (real categories, real counts, links to the filtered list), real pagination |
| Province | stats strip (real counts + source “last updated”), directory header with real count, **city filter chips** and **A–Z sort** (cities parsed from the source addresses), **Load more** (all cards stay in the HTML, extra ones are `display:none`), cities grid with real counts that filters the list, cards with Call + View, helpline band |

## Hidden sections (these are the questions for the client)
| Page type | Section hidden | Data that is missing |
|---|---|---|
| Blog post | “Medically reviewed” pill | no medical review stated on the source |
| Blog post | Dek (sub-title) | source posts have no excerpt/standfirst on the page |
| Blog post | Author / reviewer row, author card | source gives no author (JSON-LD only says “Addiction Rehab Centre”), no reviewer |
| Blog post | Read time, “min left” | not in source |
| Blog post | Key takeaways, timeline cards, pull quote, in-article helpline strip | editorial blocks that do not exist in the source posts |
| Blog post | FAQ block, Tags row, Sources, Disclaimer | the 186 posts carry no FAQ/tags/sources fields (15 have FAQPage JSON-LD but no on-page FAQ block) |
| Blog post | Featured-centre card (sidebar), dark “Featured centre” band, “Hand-picked” centres carousel | sponsored/featured placement; no source link between a post and a centre |
| Blog post | “Own a centre?” promo | sells a paid featured placement the source does not offer |
| Centre | Verified / Top rated badges, rating chip, review counts | ratings and verification not in source (Google review text never shown) |
| Centre | Price card (“From $…”), Programs & Pricing, Team, Reviews | no price tables, staff or reviews in source (info items such as “$500+ / Day” are shown label-less on 12 centres) |
| Centre | “Request a callback” form, big Claim form band | **no FORM_ENDPOINT** (no form backend); the claim *card* links to `/claim-your-listing/` instead |
| Centre | Logo box, “Show all N photos”, About pillars/video poster/“What’s included”/week-by-week, “Facility at a glance”, “Listing reviewed by”, Sponsored centres | invented sample content or sponsored placement |
| City | Hero chips (“Ranked list”, “Updated”), design H1 formula, hero paragraph | a ranking/date the source does not state; source H1 used |
| City | “How we ranked”, rank badges, Featured/Verified badges, ratings, tags, pricing / program length / site-review cells, “Details verified…”, Compare table | no ranking method, ratings, prices or lengths in source |
| City | FAQ, author/reviewer card | not in source |
| Blog index | Intro paragraph with “N articles”, “Editor’s pick”, author initials, read time | not in source |
| Blog index | “Popular” sort, “Most read this month” | needs analytics we do not have |
| Blog index | Newsletter form | no FORM_ENDPOINT |
| Blog index | “Find a rehab near you” link in the band | its target `/rehab/search/` does not exist (link cleanup rule) |
| Province | Hero photo slot and “Independently listed” badge, hero paragraph | claim / no province photo in source |
| Province | “Why trust …” row | four claims (independent, verified, reviewed) not stated by the source |
| Province | Card ratings, review text, Featured/Verified badges | not in source |
| Province | Tag filters (Residential, Detox, Men…) | the source cards carry no tags (city filter used instead) |
| Province | Author/reviewer card, FAQ | not in source |
| All | Any form (callback, newsletter, claim, lead) | FORM_ENDPOINT not configured |

## Findings to put to the client
1. The design folder has **two footers**: the rich rounded footer on Home, CentreOnboarding, ClaimListing, ClaimTherapist, TherapistOnboarding and a flat dark footer on the other 15 pages. Per the owner’s rule the Home footer is used everywhere; please confirm.
2. Forms (callback, claim, newsletter, lead) need a backend endpoint; until then they stay hidden.
3. Which centre photos/ratings may be shown (Google review text and counts are excluded by decision).
4. Single blog post: should author/reviewer, key takeaways and FAQ be supplied for the editorial posts?
5. Therapist, onboarding, login and dashboard designs are kept as draft pages, hidden from navigation and search, until you confirm scope (drafts: Therapists, TherapistsProvince, TherapistsCity, TherapistProfile, ClaimTherapist, TherapistOnboarding, JoinDirectory, Auth, ProviderDashboard, CentreOnboarding).


## Final rollout: additional hidden / not-built items
| Page type | Section hidden or not built | Reason |
|---|---|---|
| City archive | "Rehab Centres by City" band | a single-city archive has no cities to browse |
| City archive | /page/N/ pages for Calgary, Ottawa, St. John's, Toronto, Vancouver (2 each) and Winnipeg (3); rel=next/prev | only page 1 scraped (08 §25) |
| Alcohol | Alcohol view not converted to live data | page renders on the Drug view (08 §28) |
| About / FAQ / legal | Dedicated Document view | rendered on the Intervention layout with source text only |
| /drug-intervention-treatment-centres/ | whole page | embeds centre cards; needs a card component |
| Drug / Intervention / Document | Sample FAQ, reviewer, rating, stats sections | not in source |
| Home | Entire page uses design sample copy | no approved source mapping |
| Centre / city archive | Source sidebar and footer widgets, review form, login modal | replaced by shared header/footer, no reviews |
| All forms | Callback, claim, newsletter, lead | no FORM_ENDPOINT |
