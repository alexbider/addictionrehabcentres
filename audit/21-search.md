# 21 — Site search

## Entry points (all lead to /search/)
| Where | Before | Now |
|---|---|---|
| Home hero form (Location + Treatment for + "Start Your Journey") | form to /rehab/search, selects had no names | GET /search/?province=…&type=…; submits without JavaScript |
| Header "Find a Rehab" button (desktop and tablet/phone bars) | /rehab/search | /search/ |
| Header mega-menu "All rehab centres" link and menu search box | /rehab/search?s= | /search/ and /search/?q= |
| Header mobile menu search box | /rehab/search?s= | /search/?q= |
| Home "See all centres", Blog band link, Contact link | /rehab/search | /search/ |
| Alcohol / Drug / Intervention / Province page hero buttons | /rehab (source 301 to Home) | /search/ |
| Home program buttons (Drug, Alcohol, Prescription, Dual diagnosis) | /rehab (301 to Home: "did nothing") | the matching topic pages (no query-string links) |
| 404 page | none | search box (GET /search/) |
| Province and city pages | no search box in the design | none added; the header search is on every page |
Source /rehab/search/ 301s to /search/ on the source (its own search page), so /rehab/search/ → /search/ (audit/18-redirects.csv); /search-listing/ → /search/.

## Home design fields and how they map to data
| Field | Options in the design | Mapping | Hidden |
|---|---|---|---|
| Location (select) | Anywhere in Canada + 13 provinces/territories | province from the centre's listing category ("X Rehabs") | Prince Edward Island, Nunavut, Yukon (0 centres) |
| Treatment for (select) | Any addiction, Alcohol, Drugs, Prescription drugs, Dual diagnosis, Intervention, Detox | a centre matches a type when its tags/services, name or first description paragraph contain: alcohol; drug/substance/opioid/cocaine/meth/fentanyl/heroin; prescription/opioid/benzodiazepine/methadone/suboxone; dual diagnosis/concurrent/co-occurring/mental health/trauma/depression/anxiety; intervention; detox/withdrawal | none (every type has centres) |
No location autocomplete: the design has no suggestions list. On /search/ a free-text box (name, city or keyword) and a sort (relevance, A to Z) are added.

## Index
public/assets/search-index.json, built by scripts/build-search-index.mjs (after build-content). 391 centres, fields: name, route, city, province code, address (without the repeated name), tags/services, whole-word description, card image, phone, matched types. See audit/data/search-index-stats.json for sizes. Fetched only on /search/ (not on Home or any other page; checked with Lighthouse network list).

## Matching
Case- and accent-insensitive ("Montréal" = "montreal"), partial words (prefix), all words must match, one- and two-letter words match whole words only so "ON"/"BC" mean the province code. Rank: name 100, city 60, province 40, tags/services 20, address 10, description 5; no query = A to Z. No synonyms. All text is rendered by React (escaped); the query is never interpreted as HTML.

## SEO
/search/ is noindex,follow, not in the sitemap or llms.txt, `Disallow: /search/` and query-string patterns in robots.txt. No page links to /search/?… (only the search form submits there).
