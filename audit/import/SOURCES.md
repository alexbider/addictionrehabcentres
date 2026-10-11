# Candidate data sources for therapists and centres (research only, nothing imported)

Researched 2026-10-11. For each source only robots.txt, the terms page and one landing page were read (through a page-summarising fetch tool, so quotes are as returned by it and should be re-checked on the live pages before any decision). **Nothing was scraped or imported. Psychology Today is excluded (its Terms of Use prohibit automated collection and its server returns 403; a permission request to Sussex Directories is pending).**

Classification: **ALLOWED** = a licence or published terms permit reuse; **NEEDS PERMISSION** = no licence, silent or unverifiable terms, or personal data of individuals: ask the owner in writing first; **PROHIBITED** = the terms forbid this use.

A note that applies to every register of individuals: even where a register is public, collecting individuals' names and contact details in bulk is "personal information" under PIPEDA / provincial privacy law. A register is made for verifying one person at a time; building our own directory from it needs the regulator's written consent or the individuals' own opt-in (which is what our self-service profiles and the invite-by-email feature provide).

## Summary

| # | Source | Kind | Data access | Our classification |
|---|---|---|---|---|
| 1 | Open Database of Healthcare Facilities, Statistics Canada | Open data (CSV) | Download, Open Government Licence – Canada | **ALLOWED** (licence) — but 2019–20 data, no addiction-specific category |
| 2 | OpenStreetMap (ODbL), via planet extracts / Overpass | Open data | Download / API (fair use) | **ALLOWED** with attribution and share-alike (legal check needed) |
| 3 | Federal / provincial open-data catalogues (Open Government Licences of Canada, Ontario, BC, Alberta) | Open data | Download | **ALLOWED** by licence; no relevant addiction-treatment dataset located yet |
| 4 | CACCF (Canadian Addiction Counsellors Certification Federation) directory | Association directory | none | **PROHIBITED** |
| 5 | OCSWSSW (Ontario social workers) register | Regulator register | none | **PROHIBITED** for republication without written consent |
| 6 | CPBAO (psychologists, Ontario) register | Regulator register | none | **PROHIBITED** for republication |
| 7 | College of Alberta Psychologists directory | Regulator register | none | **PROHIBITED** (no harvesting) without written permission |
| 8 | CRPO (Ontario psychotherapists) register | Regulator register | none | **NEEDS PERMISSION** |
| 9 | CHCPBC (BC psychologists and other colleges) register | Regulator register | none | **NEEDS PERMISSION** |
| 10 | Ordre des psychologues du Québec register | Regulator register | none | **NEEDS PERMISSION** |
| 11 | BCACC (BC clinical counsellors) directory | Association directory | none | **NEEDS PERMISSION** |
| 12 | CCPA (Canadian Certified Counsellors) | Association directory | none | **NEEDS PERMISSION** (site returns 403, nothing verifiable) |
| 13 | ConnexOntario service directory | Government-funded helpline directory | "Request Reports" only | **NEEDS PERMISSION** |
| 14 | Health-authority and provincial addiction-service directories (AHS, Nova Scotia Health, Saskatchewan Health Authority, AFM, HealthLink BC …) | Government | web pages | **NOT RESEARCHED** (next step if you want them) |

## Details

### 1. Open Database of Healthcare Facilities (ODHF v1.1), Statistics Canada — ALLOWED
Landing page: <https://www.statcan.gc.ca/en/lode/databases/odhf>. States the data "is released under the Open Government License - Canada". Download is a CSV (`ODHF_v1.1.zip`, 7,033 facilities, fields: name, facility type, provider, address, postal code, city, province, latitude, longitude). Facility types are only "ambulatory health care services", "hospitals", "nursing and residential care facilities"; substance-use facilities are not a named category. Collected November 2019 – June 2020 (currency depends on each source).
Licence (Open Government Licence – Canada): you may "Copy, modify, publish, translate, adapt, distribute or otherwise use the Information", commercial use included; you must acknowledge the source ("Contains information licensed under the Open Government Licence – Canada."); personal information and third-party rights are excluded.
**Comparison with our listings (report only, `audit/import/centres-vs-odhf.csv`):** of our 409 centre pages, 27 match an ODHF facility on postal code and name (those 27 would gain latitude/longitude, which would allow `geo` in the centre structured data), 44 share a postal code with a differently named facility, 286 have no ODHF facility at their postal code, 52 have no postal code in our address.

### 2. OpenStreetMap — ALLOWED, with conditions
<https://www.openstreetmap.org/copyright>: ODbL — "You are free to copy, distribute, transmit and adapt our data, as long as you credit OpenStreetMap and its contributors."; "If you alter or build upon our data, you may distribute the result only under the same license." (share-alike: a legal opinion is needed on whether merging OSM data into our centre database creates a derived database). Public Overpass API fair use (<https://wiki.openstreetmap.org/wiki/Overpass_API>): identify the app, no parallel scripts, "divide those numbers by 100" for regular use; bulk country-sized requests are discouraged (use planet/regional extracts); commercial users should self-host. Tags to look for (to be verified in the OSM wiki before use): `healthcare=psychotherapist`, `healthcare=counselling`, `amenity=clinic`, `social_facility=*`. OSM contains individuals' practices only where a mapper added them; coverage in Canada is thin.

### 3. Government open-data catalogues — ALLOWED by licence, dataset not located
The Open Government Licence – Canada (above) and the equivalent Ontario, BC and Alberta licences allow reuse with attribution. This research did not locate a current dataset of addiction-treatment providers or counsellors in these catalogues; searching data.ontario.ca, the BC Data Catalogue, Alberta Open Data and open.canada.ca is the next step.

### 4. CACCF — PROHIBITED
Terms of Use (last updated 11/20/2025), <https://caccf.ca/terms-of-use/>: users may not "harvest data, scrape, or use automated tools to collect information"; "provide CACCF content to third parties without authorization"; "Any other use is prohibited unless expressly authorized by CACCF in writing." robots.txt blocks only admin/WooCommerce paths. Directory: <https://caccf.ca/for-the-public/>. Route: ask CACCF in writing, or invite certified counsellors individually.

### 5. OCSWSSW — PROHIBITED for republication
<https://www.ocswssw.org/terms-conditions/>: "Commercial or for-profit redistribution of the materials on this site, in part or in whole, is prohibited"; reproduction for personal or educational use only with the College identified as source; "For permission to reproduce the materials on this site for redistribution or republication, contact the College."; the site may not be used "to send any type of mass email". robots.txt: `Allow` for css/js, `Crawl-delay: 3`, sitemap. Register: <https://www.ocswssw.org/online-register/>. Nothing about automated access to the register itself.

### 6. CPBAO (College of Psychologists and Behaviour Analysts of Ontario) — PROHIBITED for republication
Terms of Use, <https://cpbao.ca/about-cpbao/terms-of-use/>: "You may download, store and use the material on the Site for Your own personal use and research."; "You may not republish, retransmit, redistribute or otherwise make this material available to any other party" without express prior written consent. robots.txt: `Disallow: /*?`, `Crawl-delay: 3`. Register: <https://members.cpbao.ca/public_register/>. (cpo.on.ca now redirects here.)

### 7. College of Alberta Psychologists — PROHIBITED without written permission
<https://www.cap.ab.ca/cap-terms-of-use>: users may not "Harvest or otherwise collect information about others, including e-mail addresses, without their consent."; may not "obtain or attempt to obtain any materials or information through any means not intentionally made available"; all rights reserved. The Member Directory is a third-party app (<https://cap.alinityapp.com/Client/PublicDirectory>) for individual look-ups. robots.txt of cap.ab.ca could not be read (the fetch tool summarised a long multi-agent file: `/admin/`, `/bin/`, `/Config/` disallowed, `Crawl-delay: 5` for some bots).

### 8. CRPO — NEEDS PERMISSION
Public register: <https://my.crpo.ca/publicregister>. The site has a privacy statement but no terms-of-use page was found ("© 2026 College of Registered Psychotherapists of Ontario. All Rights Reserved."). robots.txt of crpo.ca: `User-agent: *`, empty `Disallow:`, `Crawl-delay: 60` (the register runs on another host that was not checked).

### 9. CHCPBC (College of Health and Care Professionals of BC; collegeofpsychologists.bc.ca redirects here) — NEEDS PERMISSION
<https://chcpbc.org/terms-of-use/> grants no reuse rights: "Use of this website does not grant users ownership, a licence, or any other rights to the website, its content". Nothing on automated access. Register: <https://chcpbc.alinityapp.com/client/publicdirectory>. robots.txt of collegeofpsychologists.bc.ca: `Disallow: /wp-admin/`, `/applicants101/`.

### 10. Ordre des psychologues du Québec — NEEDS PERMISSION
Terms (<https://www.ordrepsy.qc.ca/conditions-generales-utilisation>): nothing on reuse or automated access; © Ordre des psychologues du Québec 2025. Register: "Vérifier le droit d'exercice" (<https://www.ordrepsy.qc.ca/verifier-le-droit-d-exercice>). robots.txt: `Disallow: /trouver-de-aide*`, `/recherche*`, `/view*`, `/avis-disciplinaires`. Quebec's Law 25 adds consent requirements for personal data.

### 11. BCACC — NEEDS PERMISSION
Directory: <https://bcacc.ca/counsellors/>. Footer has only a privacy policy and accessibility page, no terms. robots.txt (bc-counsellors.org): `Crawl-Delay: 20`.

### 12. CCPA — NEEDS PERMISSION (unverifiable)
robots.txt and the home page returned HTTP 403 to the fetch tool; nothing could be read.

### 13. ConnexOntario — NEEDS PERMISSION
<https://connexontario.ca/search/> is a searchable service directory run for the Ontario government; no terms-of-use page or API is linked (privacy policy and a "Database Inclusion Criteria" PDF only). A "Request Reports" service exists (<https://connexontario.ca/data-and-report-service-lp/>): the proper route is to ask them. robots.txt: empty `Disallow:`, `Crawl-delay: 10`.

### 14. Not researched
Health-authority and provincial directories (Alberta Health Services, Nova Scotia Health, Saskatchewan Health Authority, Addictions Foundation of Manitoba, HealthLink BC, Government of New Brunswick, Newfoundland and Labrador Health Services …) and Health Canada's "find help" page. They publish service listings as web pages; their terms were not read. Say which provinces matter and I will research them the same way.

## Decision needed from you
1. Which sources may be imported at all (only ODHF and OSM are licensed for reuse; neither lists individual therapists).
2. Whether to write to the regulators/associations (CRPO, CHCPBC, OPQ, BCACC, CCPA, ConnexOntario) asking for permission or a data feed.
3. Whether the 27 ODHF coordinates should be added to our centre pages (with the OGL attribution).
Until then nothing is imported; the import tables (`data_sources`, `import_runs`) and the admin "Imports" screen are ready for approved sources.
