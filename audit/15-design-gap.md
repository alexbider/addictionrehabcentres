# 15 — Design gap audit (built pages vs approved designs)

Method: each approved view (`src/views/*.jsx`, original clone `~/Downloads/arc-design-original`) was compared section by section with the page type built on it. A section is **hidden** only when the source has no data for it, or when showing it would need an invented fact (number, rating, author, reviewer, FAQ, testimonial, price, claim). Design chrome (hero treatment, CTA/helpline bands, card styling, buttons, typography, spacing) is kept as designed.

Status: ✅ present as designed · ♻ present, filled with source data · 🚫 hidden (reason) · ➕ closed in this pass.

## Province (`Province.jsx`, 15 pages)
| Design section | Status |
|---|---|
| Header, breadcrumb | ✅ (middle crumb “Rehabs By Provinces” hidden: its target `/rehab/` does not exist) |
| Hero (H1, H2, call + browse buttons) | ♻ H1/H2/intro from source |
| Hero stats strip, province photo, “Independently listed” badge | 🚫 numbers/photo/claim not in source |
| “Why trust us” row | 🚫 four claims not in source |
| Listings: eyebrow, sort, filter chips, “Showing N of M”, Load more | 🚫 no source data (all cards are listed) |
| Centre cards (photo, name, address, excerpt, View) | ♻ |
| Card rating chip, review count, Featured/Verified badges, Call button | 🚫 not in source (review counts hidden by decision) |
| “Need help choosing between these centres?” helpline band | ➕ restored (design chrome; the count was removed) |
| Cities block | 🚫 no source data |
| Guide (TOC, article) | ♻ TOC shown when ≥2 headings |
| Author/reviewer card | 🚫 not in source |
| FAQ | 🚫 no source FAQ on province pages |
| Other provinces | ♻ source “Drug Rehab Centres By Provinces” block |

## City (`City.jsx`, 4 pages)
| Design section | Status |
|---|---|
| Hero (H1, call + “See the ranking”) | ♻ (design H1 formula “N Best … (With Pricing)” not used; source H1) |
| Hero stats, “At a glance” card, Ranked/Updated chips | 🚫 not in source |
| “How we ranked” | 🚫 criteria not in source |
| Ranked list cards (photo, category, name, address, excerpt, View centre) | ♻ |
| Rank badges, ratings, tags, price/length/site-review cells, “Details verified”, Call for availability | 🚫 not in source |
| “Not sure which centre is right for you?” helpline band | ➕ restored (city name removed) |
| Compare table | 🚫 no price/length data |
| Guide + TOC | ♻ |
| FAQ, “Popular types” | 🚫 not in source |
| Nearby | ♻ replaced by the source province list |

## Centre (`Centre.jsx`, 391 pages)
| Design section | Status |
|---|---|
| Breadcrumb, gallery mosaic, name, category, address | ♻ |
| Contact card (call, website, email, social) | ♻ ; “Request a callback”, “Save to wishlist”, price “From” 🚫 |
| Verified/Top rated badges, logo box, rating chip, review counts | 🚫 not in source |
| At-a-glance row | ♻ only the source “info items”, label-less |
| Tab bar | 🚫 single-section pages |
| About (long body, BlogPost article styles), tags, hours, specialties/amenities | ♻ |
| Facility at a glance, “listing reviewed by” card | 🚫 reviewer not in source |
| Programs & Pricing, Team, Reviews, Location/map | 🚫 not in source |
| Request a callback form, Claim banner | 🚫 forms removed by decision / claim copy is a promise not in the source |
| FAQ accordion | ♻ source FAQ (JSON-LD kept) |
| Sponsored centres | 🚫 ad copy not wanted |

## Blog index (`Blog.jsx`)
| Design section | Status |
|---|---|
| Hero, search, category chips, post grid, pagination | ♻ |
| Eyebrow, intro paragraph, “N articles” | 🚫 not in source |
| Featured Articles, Latest/Popular sort, author, read time | 🚫 not in source |
| Sidebar: helpline card, Popular list, newsletter form | 🚫 (popular = no data; form removed by decision) |
| Topic Hubs | 🚫 invented groupings |

## Blog post (`BlogPost.jsx`) — rebuilt in this pass (prototype on 2 posts, others still on the old component)
| Design section | Status |
|---|---|
| Header: breadcrumb (Home / Blog / category / title), category chip, H1, dates | ➕ ♻ |
| “Medically reviewed”, dek, author/reviewer row, read time, share buttons | 🚫 not in source (share buttons removed by decision) |
| Hero image (21:9 with rounded bottom) | ➕ source featured image; caption 🚫 |
| Sticky TOC “In this article” + reading progress | ➕ built from the post’s H2s; “min left” 🚫 |
| “Listen to this article” player | ➕ kept (browser speech, no data needed) |
| Key takeaways, timeline, pull quote, FAQ block, tags, author card, sources, disclaimer | 🚫 not in source |
| Article body (H2/H3, lists, tables, images, links) | ➕ BlogPost article typography |
| Sidebar: featured centre card | 🚫 no source link between post and centre |
| Sidebar: Related reading | ➕ real posts of the same category |
| Sidebar: “Own a centre?” promo | 🚫 promises a feature the site does not sell on the source |
| Featured centre band, featured businesses slider | 🚫 invented selection |
| Related articles grid + previous/next | ➕ real posts, same category only |
