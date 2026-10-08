# 19 — Demo content in the 23 approved design pages

Method: every approved page was checked for demo listings, stock/placeholder images and invented facts. Live pages (the ones with source content) already render through `props.data` and hide the design's sample sections (see audit/15-design-gap.md). This pass covers what a visitor can still reach with demo content: Home, the shared header, and the static-copy pages. DOM structure was recorded before and after (audit/scripts/dom_structure.py, audit/data/dom-before.json / dom-after.json): section order is identical on all 10 routes compared; the only structure signatures that changed are on Home (Hero, Top Rated Rehabs, Featured Residential Centers), where rating, badge and "Google" elements were removed because there is no source data for them.

## Shared header and footer
| Item | Demo | Replaced by |
|---|---|---|
| Header mega-menu feature images (5) | stock photos menu-1…6.jpg | the source site's own published images (home/*.webp), alt text updated |
| Footer Google icon | link to the Google review profile (ludocid) | removed (Google review content is excluded); Facebook link kept with the source rel |
| Footer / header phone, copy | design copy = source phone and wording | unchanged |
| "© 2025" | design year | unchanged — client to confirm |

## Home (live data from the source home page: src/lib/home.ts)
| Section | Demo shown | Now |
|---|---|---|
| Hero | stock photo "forest at golden hour"; "Coast to coast / Centres in all 13 provinces" card (a claim the source does not make) | source hero image (addiction-rehab-centers-canada); card hidden. "11.2k Lives" is the source's counter and stays |
| Top Rated Rehabs | 3 centres with 5.0 / 4.9 / 4.8 Google ratings, review counts, "AD" sponsored tooltip | the source's one "Top Rated Rehab" (Metamorphosis Centre for Change), real photo and phone from its centre page; ratings, review counts and the ad tooltip hidden |
| Intro | stock photo | source image (Addiction-rehab-centers-in-Canada) |
| Featured Residential Centers | 6 slots (3 real names + 3 "Centre slot" placeholders), ratings, Featured/Verified badges, placeholder photos, one shared phone number | the 3 centres the source home features, with each centre's photo, city, source excerpt and own phone; ratings and badges hidden |
| Locations | provinces/cities (real), Yukon link to a redirecting URL | unchanged; /rehab/yukon-drug-rehab-treatments/ now 301s as on the source |
| Programs (4) | stock photos | source images and source text (the design copy already equalled the source text) |
| Drug Addiction card | placeholder photo, Verified badge | real photo, badge hidden; address, excerpt and "1 Review" are source text |
| Addiction Treatments tabs | stock photos tr-*.jpg | source tab images (Marijuana-Addiction … Prescription-Drug-Addiction) |
| Kind of Rehab, Detox, Hope | stock photo | source image (Addiction-rehab-program); text is source text |
| Ready CTA | stock photo | source image (addiction-rehab-canada) |
Still design copy on Home: section eyebrows/headings that are not in the source ("Featured treatment centres across Canada", "Browse by province"), button labels, the 5 "kinds of rehab" blurbs (equal to the source accordion text). Home's blog row: the design has none.

## Static-copy pages (copy stays as designed; listings and images only)
| Page | Demo listings / images | Action | Design copy still shown (needs client confirmation) |
|---|---|---|---|
| Contact (/contact/) | none | none needed | all copy and response-time promises ("1 business day / 2 business days"), "Answered live, 24/7" |
| Promote (/promote/) | unused sample centre array only (not rendered); no photos | none rendered | pricing ($199 / $399 / $699 / $1,299, add-ons), analytics mock numbers (8,420 views, +18%…), testimonials, "Founding partner", plan comparison — all invented by the design, not source facts |
| ClaimListing (/claim-listing/) | stock hero photo; sample search results are real Toronto centres | photo replaced by source image | "$699" price and steps are design copy |
| Intervention | the old /intervention route showed the design's sample with hot-linked source images | replaced by the real page /intervention/ built from the source (857 words), on the Intervention view | none |

## The other approved pages (templates)
Alcohol, Blog, BlogPost, Centre, City, Drug, Intervention, Province render only source data on the live routes. Their design-sample routes (/alcohol, /centre, /city, /drug, /province) still exist for design comparison; they are now noindex, disallowed in robots.txt, X-Robots-Tag noindex, and not in the sitemap. Alcohol was converted to live data in step 5.

## Draft pages (not touched)
Auth, CentreOnboarding, ClaimTherapist, JoinDirectory, MenuOptions, ProviderDashboard, TherapistOnboarding, TherapistProfile, Therapists, TherapistsCity, TherapistsProvince: unchanged, noindex, unlinked.

## Facts the source lacks (hidden, for the client)
Google ratings and review counts, Verified / Featured / Top-rated medal badges, "paid placement" disclosures, "all 13 provinces" claim, hero statistics (4.1% etc. on Alcohol), analytics numbers, testimonials, prices.

## Home: the 20 featured centres (rule)
1. The centres the source home page features come first (Inspire Change Wellness Center, Rose City Recovery, Metamorphosis Centre for Change; the source's single "Top Rated Rehab" is the same Metamorphosis centre).
2. The list is then filled up to 20 with real published centres that have a card image at least 600 px wide, a full description (at least 120 characters of the centre's own text) and a phone number, taken round-robin across provinces: provinces with the most centres go first and, within a province, the longest description first (ties alphabetical). Result: 3 from the source plus 17 spread over BC, ON, NS, AB, NB, MB, NL, QC, NT and SK.
3. Cards show the centre's own photo (the 800 px card copy), city, whole-word description, its own phone number and a link to its page. No ratings, badges or rankings.
The carousel shows 1 card per view below 680 px, 2 below 1000 px and 3 above; the counter shows pages ("1 / 7" on desktop, "1 / 20" on phones), arrows, dots (up to 10 pages) and the keyboard arrows work, and a single page hides the counter and buttons.
