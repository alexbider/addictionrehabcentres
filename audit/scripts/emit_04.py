import json,collections,sys
sys.path.insert(0,'scripts'); import emit_content as E
R=E.R; AUD=E.AUDIT; rem=[r for r in R if r['status']=='REMAINING']
C=collections.Counter
def tbl(h,rows): return '| '+' | '.join(h)+' |\n|'+'|'.join('---' for _ in h)+'|\n'+'\n'.join('| '+' | '.join(str(x) for x in r)+' |' for r in rows)+'\n'
n=lambda f: sum(1 for r in rem if f(r))
o=['# 04 — Template map\n']
o.append('Full per-URL table (928 rows: source URL, page type, template, fit level, change codes, page-specific notes): **`audit/04-template-map.csv`**. This file is the type-level summary + the change-code legend + section-by-section comparison.\n')
o.append('## 1. Fit summary (REMAINING pages)\n')
fit=C(r['fit'] for r in rem)
o.append(tbl(['Fit level','Pages'],[('FULL FIT',0),('FIT WITH CHANGES',fit['FIT WITH CHANGES']),('NO TEMPLATE',fit['NO TEMPLATE'])]))
o.append('\n**No page is a FULL FIT.** Every existing view hard-codes its sample content (Benzodiazepine, Alberta, Toronto, Metamorphosis, one alcohol-detox article), and each template has blocks the source never had. The *layouts* fit; the *data layer* does not exist yet.\n')
o.append('\n## 2. By page type\n')
rows=[]
def row(label,cnt,tpl,fit,codes,why): rows.append((label,cnt,tpl,fit,codes,why))
row('Drug pages (incl. 6 “-treatment” variants)',n(lambda r:r['page_type']=='drug'),'Drug','FIT WITH CHANGES','D1–D6','Hero/intro/2-col text/CTA match; source lacks stats, effects, FAQ, sponsored centres')
row('Treatment / support / service info pages',n(lambda r:r['page_type']=='treatment-support'),'Drug (L1 layout)','FIT WITH CHANGES','D1–D6, G1','Same WPBakery layout as drug pages (banner → 2-col rows → CTA banner → help block); strip drug-specific labels')
row('Support services (Raam Clinic, Helpline)',n(lambda r:r['page_type']=='support-service'),'Drug (L1 layout)','FIT WITH CHANGES','D1–D6, G1','Raam Clinic is 3,900 words with 6 H2 + H3s — needs TOC/long-form support')
row('Province pages with centre cards',n(lambda r:r['page_type']=='province' and r['layout']=='L2-listing'),'Province','FIT WITH CHANGES','P1–P5','Listings + guide text match; no filters/FAQ/“why trust”/cities in source')
row('Province pages, text only (alternates, Quebec, Yukon…)',n(lambda r:r['page_type']=='province' and r['layout']!='L2-listing'),'Drug (L1 layout)','FIT WITH CHANGES','D1–D6, G1','No centre cards on these pages — they are text pages')
row('City ranking pages (Vancouver, Ottawa, Montreal)',n(lambda r:r['page_type']=='city'),'City','FIT WITH CHANGES','P1–P5, A1','“N best centres” list + benefits text; no pricing, criteria, compare table, FAQ')
row('City/location archives (≥1 centre)',n(lambda r:r['page_type']=='city-archive'),'City','FIT WITH CHANGES (heavy)','A1–A5','Source = intro sentence + 1–12 plain cards; City design is a ranked editorial page')
row('Centre profiles',n(lambda r:r['page_type']=='centre'),'Centre','FIT WITH CHANGES (heavy)','C1–C7','Source has about/specialties/amenities/therapies/contact/3 stock photos; template adds pricing, team, reviews, FAQ, programs')
row('Blog posts',n(lambda r:r['page_type']=='blog-post'),'BlogPost','FIT WITH CHANGES','B1–B6','Article header/hero image/body match; template hard-codes one article + TOC/timeline/featured centres/author')
row('Alcohol addiction treatment',n(lambda r:r['page_type']=='alcohol'),'Alcohol','FIT WITH CHANGES','X1–X3','Sister page of the built `/addiction-by-alcohol/`')
row('Intervention variants',n(lambda r:r['page_type']=='intervention'),'Intervention','FIT WITH CHANGES','X1–X3','Sister pages of built `/intervention/`')
row('About / philosophy / getting started / guarantee',n(lambda r:r['page_type']=='about-info' and r['path']!='/faqs/'),'none (fallback L1)','NO TEMPLATE','G2–G3','No About/Philosophy design exists')
row('FAQs index (/faqs/)',1,'none','NO TEMPLATE','F1,G3','21 Q&A (H4 questions); reuse Contact’s FAQ accordion inside a new page shell')
o.append(tbl(['Type','Pages','Template','Fit','Codes','Why'],rows))
tot=sum(r[1] for r in rows); o.append('\n(Total %d.)\n'%tot)
o.append('\n## 3. Change-code legend\n')
leg=[('D1','Drug/L1: move the Benzodiazepine prose out of the JSX into per-page data (`rows[]`/`blocks[]`); keep only layout in the view'),
('D2','Render source layout: hero banner (bg image + H1) → intro H2 + 2 text columns with inline links and side images → extra content rows → bottom CTA banner (`newHomeBanner`) → blue help block'),
('D3','Make template-only blocks optional (hidden when no data): Sponsored Centres, Effects cards, stats strip, FAQ, author/reviewer line, Other Drugs, TOC'),
('D4','Hero image from the row background (`rows[0].background_image`, e.g. `*-banner.jpg`) instead of local `/assets/img/drug-benzo-hero.jpg`'),
('D5','Use rewritten link HTML; drop hard-coded self links (`/drug`, `/prescription-drugs-addiction`)'),
('D6','Per-page SEO: `generateMetadata` from `seo` (title, description, canonical, OG) + JSON-LD'),
('G1','Replace drug-specific wording (“{drug} Addiction” H1/H2 pattern, breadcrumb) with `h1`/`headings` from JSON'),
('G2','No design exists for this page kind (About/Philosophy/Getting started/Guarantee/Admissions)'),
('G3','New layout needed — recommend one generic “ContentPage” cut from the Drug L1 layout + BlogPost typography'),
('F1','FAQ accordion (21 items on /faqs/)'),
('P1','Replace hard-coded Alberta `raw` list with `cards[]` (name, slug, address, excerpt, reviews, rating, category); implement “show more”/pagination to the real total'),
('P2','Filter chips (`filterNames`) have no source data — derive from card categories or hide'),
('P3','Hide “Why trust us”, FAQ, Cities blocks (not in source) unless data present'),
('P4','Long SEO text (H2/H3 + paragraphs) → “Guide” section from `sections[]`'),
('P5','Province/city name, counts (“44 Best…”), titles from JSON; `year`/`cityCount` defaults removed'),
('A1','City: cards with price tier ($/$$/$$$), rating 0, “(0 Reviews)” → ranked list without ranks/pricing'),
('A2','Hide ranking criteria, compare table, FAQ, nearby cities, popular types (none in source)'),
('A3','Intro = one generic sentence (`city.intro_text`)'),
('A4','135 of 194 archives list exactly 1 centre (only 59 list ≥2) — decide: build, noindex, or merge into province page'),
('A5','Title/meta from JSON (“{City} Archives - Addiction Rehab Centers” style on source)'),
('C1','Drive hero/about/location from `centre` JSON (name, categories, address, phone, email, website, social)'),
('C2','Hide Team, Reviews, Rating bars, Pricing tabs, Programs, FAQ, “Verified” unless data exists'),
('C3','Gallery = 3 shared stock photos (118 centres) — hide or use featured image only'),
('C4','Render `about_html` (rich text, H2/H3 on ~126 rich pages)'),
('C5','Specialties / amenities / therapies lists → chips / service groups'),
('C6','Contact card + sponsored-ad banner + business hours + tags'),
('C7','Google-reviews widget (rating + review items) — present on 9 centres; 16 show a review count'),
('B1','Render `blocks[]`/`raw_html` with auto-TOC from headings (replace hard-coded detox article)'),
('B2','Hide timeline, featured-business slider, author/reviewer, FAQ, TTS unless present'),
('B3','Hero image = `og_image`/first image'),
('B4','Date + category from JSON; reading time computed'),
('B5','Related articles by category'),
('B6','Metadata + Article/Breadcrumb JSON-LD per post (source Yoast graph kept in `seo.jsonld_source`)'),
('X1','Map source `rows` into the template’s existing sections (these views were designed from the source page)'),
('X2','Self-host the 8 hot-linked images'),('X3','Per-page metadata from JSON')]
o.append(tbl(['Code','Change'],leg))
o.append('\n## 4. Section-by-section: template vs. source\n')
o.append('✓ both · **S** source only (template has no block) · **T** template only (source has no content → hide)\n')
def sec(title,rows):
    o.append('\n### %s\n'%title); o.append(tbl(['Section','Source','Template','Status'],rows))
sec('Drug / L1 layout (23 drug + 39 info/province-text/support pages) — Drug.jsx: Hero, Sponsored Centres, Effects, Let Us Help You, FAQ, Provinces, Other Drugs',[
('Hero','Banner row with bg image + H1','Hero with local photo, H1, H2, intro, CTAs','✓ (D4)'),
('Intro + body','H2 intro + 2 text columns, inline links, 2–4 content rows, 2–6 images (e.g. cocaine: 4)','Prose hard-coded for Benzodiazepine + 3 images','✓ after D1/D2'),
('Bottom CTA banner','`newHomeBanner` H2 + text + phone','Call strip','✓'),
('Blue help block','`innerBlueContent` text + phone CTA','“Let Us Help You” form block','✓ (source = text/CTA; form is a lead form)'),
('Provinces block','“Drug Rehab Centres By Provinces” (boilerplate)','Provinces','✓ (shared component)'),
('Sponsored centres slider','—','Sponsored Centres','**T**'),('Effects cards / stats','—','Effects + stats strip','**T**'),('FAQ','—','FAQ','**T**'),('Other drugs','—','Other Drugs','**T** (derive from drug list)'),('Author / reviewer','—','Editorial Team / reviewer placeholders','**T**')])
sec('Province / City ranking (L2 listing) — Province.jsx: Hero, Why trust us, Listings, Cities, Guide, FAQ, Other Provinces',[
('Hero','Banner + H1 (“Alberta Rehabs”) + H2 “N Best Rehab Centres in X”','Hero H1 + H2 + CTA','✓'),
('Listings','Card grid (image, category, address, excerpt, 0 reviews, stars)','Listings with filter chips, show-more, ratings','✓ cards; **T** filters'),
('Guide','H2/H3 SEO text (e.g. “Addiction Treatment Centres in Alberta”)','Guide','✓'),
('Other provinces','Boilerplate block','Other Provinces','✓'),
('Why trust us / Cities / FAQ','—','Present','**T**')])
sec('City ranking — City.jsx: Hero, How we ranked, Ranked list, Compare, Guide, FAQ, Nearby',[
('Hero + list','H1 “Addiction Rehab Centres {City}”, H2 “N Best…”, cards (7–11)','Hero + ranked list with prices/durations','✓ cards; **T** price/duration'),
('Benefits text','H2 “The Benefits of Rehab Centres in {City}”','Guide','✓'),
('How we ranked / Compare / FAQ / Nearby','—','Present','**T**')])
sec('Centre — Centre.jsx: Hero, About, Team, Reviews, Location, Request a callback, Claim this listing, FAQ, Sponsored Centres',[
('Hero','H1 name, category (province), 0–N reviews, gallery (3 stock photos)','Hero with rating, photos, price from','✓ partial'),
('About','“About Center” rich text (≈100 words; 126 pages >400 words with H2/H3)','About','✓'),
('Specialties / amenities / therapies','H4 lists','Services, program elements','✓ (C5)'),
('Location / contact','Address, phone, email, website, social (no map data in HTML)','Location + map placeholder','✓'),
('Reviews','Google widget on 9 centres; review count on 16','Reviews list + rating bars','✓ (few) / **T**'),
('Pricing, Team, Programs, FAQ, callback form, claim banner','FAQ accordion on 120 centres (1,094 Q&A items across the site); “Programs Cost” only on rich pages; no team/callback/claim','All present','**T** mostly; FAQ ✓ on 120'),
('Business hours / tags','Present on some','—','**S**')])
sec('Blog post — BlogPost.jsx: Article Header, Hero Image, Article Body, Main Featured Business, Featured Businesses Slider, Related Articles',[
('Header','Site-name title bar, date, category, H1','Title, author, reviewer, dates, reading time','✓ partial; **T** author/reviewer'),
('Hero image','Featured image (og_image)','Hero image','✓'),
('Body','Rich WP content: H2/H3, images, lists, links (avg ≈1,300 words, up to 5,700)','Article body + auto TOC + timeline','✓ (B1)'),
('Featured business / slider / related','Sidebar “Let Us Help You” lead form only','Present','**T** (+ **S** lead form)')])
o.append('\n## 5. Sections the source has that **no** template has\n- WPBakery CTA banner + blue “help” block (exists in Drug as call strip — OK).\n- Sidebar “Let Us Help You” lead form on every blog post (Contact’s form could be reused).\n- Sponsored-ad banner on every centre (static image + `tel:` link).\n- Business hours + tag chips on rich centre pages.\n- Date archives / tag archives / amenity archives (treated as NOT NEEDED).\n')
open(AUD+'/04-template-map.md','w').write('\n'.join(o)); print('ok',tot,len(rem))
