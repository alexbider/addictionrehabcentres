import json,collections,sys,re,html
sys.path.insert(0,'scripts'); import emit_content as E
R=E.R; AUD=E.AUDIT
C=collections.Counter
rem=[r for r in R if r['status']=='REMAINING']
def tbl(h,rows): return '| '+' | '.join(h)+' |\n|'+'|'.join('---' for _ in h)+'|\n'+'\n'.join('| '+' | '.join(str(x) for x in r)+' |' for r in rows)+'\n'
o=[]
o.append('# 03 — Gap report: source site vs. the 23 built pages\n')
o.append('Source: https://addictionrehabcenters.ca (WordPress + Yoast + WPBakery + Elementor theme; WooCommerce installed). Crawled 2026-10-07 via sitemap + REST API + live HTML (0.8–1.5 s delay, no errors).\n')
o.append('## 1. How the full URL list was built (cross-checked)\n')
sm={'post-sitemap':189,'page-sitemap':101,'listing-item-sitemap':460,'category-sitemap':26,'listing-category-sitemap':13,'listing-location-sitemap':217}
o.append(tbl(['Source','Count'],[('Yoast sitemap_index → post / page / listing-item / category / listing-category / listing-location','189 / 101 / 460 / 26 / 13 / 217 = 1,006 entries'),('REST `/wp/v2/pages` (paginated)','139 (38 are not in the sitemap: 34 noindex + 3 indexable-but-omitted + the shadowed “Rehabs” page)'),('REST `/wp/v2/posts` (paginated)','189 (= post-sitemap)'),('Header + footer links on home','75 internal pages, all already in the registry (+ `/llms.txt`, a file)'),('Unique URLs after de-duplication','**1,040** (4 WP items share a URL: home vs. page “Rehabs”, `/drug-detox/`, `/family-therapy/`, `/alcoholism-in-canada/`)')]))
o.append('\nCentre listings (`listing-item`) and location/category archives are a custom post-type/taxonomy of the directory theme and are **not exposed in the REST API**; they were read from live HTML.\n')
o.append('## 2. Totals\n')
tot=C(r['status'] for r in R)
o.append(tbl(['Status','URLs'],[('BUILT (example only)',tot['BUILT']),('REMAINING',tot['REMAINING']),('NOT NEEDED',tot['NOT NEEDED']),('**Total**',len(R))]))
o.append('\n### By source group × status\n')
g=C((r['wp_type'],r['status']) for r in R)
names=['page','post','listing-item','listing-location','listing-category','category']
o.append(tbl(['Source group','BUILT','REMAINING','NOT NEEDED','Total'],[(n,g[(n,'BUILT')],g[(n,'REMAINING')],g[(n,'NOT NEEDED')],sum(g[(n,s)] for s in('BUILT','REMAINING','NOT NEEDED'))) for n in names]))
o.append('\n## 3. The 23 built pages ↔ source\n')
bm=[(r['built_route'],r['url'].replace(E.S,''),r['page_type']) for r in R if r['status']=='BUILT']
o.append(tbl(['Built route','Matching source URL','Type'],sorted(bm)))
o.append('\n**11 of the 23 built pages have a real counterpart on the source.** The other 12 are design-only (new product features, no source URL): '+', '.join('`%s`'%x for x in ['/blog/how-long-does-alcohol-detox-take (invented article; source has no such post)','/auth','/centre-onboarding','/claim-therapist','/join-directory','/menu-options','/provider-dashboard','/therapist-onboarding','/therapist-profile','/therapists','/therapists-city','/therapists-province'])+'. They are out of scope for the content migration (no source content exists).\n')
o.append('\n## 4. REMAINING pages by type\n')
rt=C(r['page_type'] for r in rem)
desc={'centre':'Centre profile (`/<slug>/`, 20 live under `/search-listing/<slug>/`)','city-archive':'City/location archive (`/listing-location/<city>/`) with ≥1 centre','blog-post':'Blog article (root-level slug `/<slug>/`)','treatment-support':'Treatment/service/support info pages','drug':'Drug pages (header-menu drugs, meth, “-treatment”/oxycontin variants; 6 noindex twins excluded)','province':'Province pages (10 primary not yet built + 11 alternate/duplicate; 16 have centre cards, 5 are text-only)','about-info':'About / philosophy / getting started / FAQs','city':'City ranking pages (Vancouver, Ottawa, Montreal)','support-service':'Raam Clinic, Helpline','intervention':'Intervention variants','alcohol':'Alcohol addiction treatment'}
o.append(tbl(['Type','Count','Notes'],[(k,v,desc.get(k,'')) for k,v in rt.most_common()]+[('**Total**',len(rem),'')]))
o.append('\nCentre pages = 458 (459 listings − 1 built sample). Support/info/drug/province/city/intervention/alcohol/about ≈ **88 pages**; blog posts **188**; city archives **194**.\n')
o.append('\n## 5. NOT NEEDED (101) — reasons\n')
nn=[r for r in R if r['status']=='NOT NEEDED']; rs=collections.defaultdict(list)
for r in nn: rs[r['status_reason'].split(' (')[0].split('; 301')[0][:110]].append(r['path'])
o.append(tbl(['Reason','Count','Examples'],[(k,len(v),', '.join('`%s`'%x for x in v[:4])+(' …' if len(v)>4 else '')) for k,v in sorted(rs.items(),key=lambda x:-len(x[1]))]))
o.append('\n⚠ **Decisions for you** (marked NOT NEEDED by rule, but debatable): legal pages (4: privacy-policy, privacy, terms-of-use, disclaimer — a live site normally needs them), 23 empty city archives, `/listing-category/mexico/` + `/listing-category/dui-lawyers-ontario/` (non-core), and 26 blog category archives (replace with `/blog` category filter + 301s).\n')
o.append('\n## 6. Things found on the source site that affect the build\n')
thin=[r for r in rem if 'thin(<150w)' in r['features']]
ca=[r for r in rem if r['page_type']=='city-archive']; c1=sum(1 for r in ca if len(r['cards'])==1); c2=sum(1 for r in ca if len(r['cards'])>=2)
iss=[
 '**Duplicate/competing URLs**: every province exists 2–3×: `/alberta-rehabs/` (page), `/listing-category/alberta-rehabs/` (archive, 12/page) and for 12 provinces an older `/alcohol-drug-rehab-centres-in-…` or `…-drug-rehab-centers/` page. Same for `/drug-detox/`, `/family-therapy/` (page and post share a slug; WordPress serves one) and `/alcoholism-in-canada/` (2 posts, same slug). Home has a second WP page “Rehabs” (id 4842) shadowed by the front page.',
 '**Centre pages are mostly thin, a minority are rich**: 458 centres; median **109 words** of description; 126 have >400 words and 25 have ≥1,000 (cost, therapies, philosophy, FAQs, business hours, Google-reviews widget). Only **16** show any review count. 439 have a photo gallery but **118 centres use the identical stock trio** `Rehabs-01/02/03.jpg`; every centre repeats the same “Sponsored Ad” banner image. 450 have a phone, 418 an email, 404 a website.',
 '**City archives are very thin**: of 217 location archives, 23 have 0 centres, **%d have exactly 1**, only %d have ≥2; each has one generic intro sentence. Abbotsford additionally carries a placeholder FAQ (“01 Question / 01 Answer.”) and an unrelated “Hotel-Style Rehab in Massachusetts” ad.'%(c1,c2),
 '**Province pages**: Alberta says “44 Best Rehab Centres” but only 24 cards are in the HTML (the rest paginate/lazy-load); other provinces may differ — to be checked at build time. Several province pages have almost no text (Saskatchewan 2 words, NWT 3, PEI 4, Manitoba 4 — cards only). Quebec has no cards at all (it is a text page); the Quebec centre list exists only in `/listing-category/quebec-rehabs/` (6 cards).',
 '**Drug pages are short** (≈ 500 words, 2 H2, 3 images, no FAQ/stats/effects) while the Drug design is much richer — most template sections have no source content (see 04).',
 '**REST `content.rendered` is unusable** for pages: it contains raw WPBakery shortcodes (`[vc_row …]`, curly quotes). All content in `audit/content` therefore comes from the live rendered HTML.',
 '**Internal links in REMAINING content** that are not pages in the sitemap: 210× links that 301 on the source (e.g. `/rehab/` → `/`, `/dual-diagnosis/` → `/dual-diagnosis-treatment/`), 367× `/listing-tag/*` (36 tag archives), 30× `/listing-amenity/*`, 188× `/YYYY/00/` date links (broken “00” month) (e.g. `/dual-diagnosis/` → `/dual-diagnosis-treatment/`, `/treatment-programs/` → `/`). Mapped in `audit/link-map.csv`.',
 '**noindex but linked**: 4 pages are `noindex` yet linked from the nav/footer or from our header (`/ecstasy-addiction/`, `/tranquilisers-addiction/`, `/detox-centres-in-canada/`, `/prevention-education-programs/`). Kept REMAINING; decide whether to index them.',
 '**Boilerplate blocks repeated on every page** (removed from `body_html` and noted in `boilerplate_removed`): “Drug Rehab Centres By Provinces” block, sidebar “Let Us Help You” lead form, “Sponsored Ad”.',
 '**Emails are Cloudflare-obfuscated** in the HTML; they were decoded for the content JSON (418 of 458 centres have an email).',
 '**robots.txt** on the source returns `x-robots-tag: noindex, follow` on the robots/sitemap responses (normal for Yoast files) — not on pages.',
]
o.append('\n'.join('- '+x for x in iss)+'\n')
o.append('\n## 7. Problems already present in the built (23-page) site\n')
vl=json.load(open('data/view_links.json'))
o.append('- **75** distinct internal link targets used on the built pages point at source URLs that have no route yet (they 404 today); 20 resolve to built routes.\n- Targets that **do not exist on the source** as pages: `/alcohol-rehab/`, `/rehab/` (301 → `/`), `/rehab/search/` (301 → `/search/`), `/quebec-drug-rehab-centers/` (301 → `/drug-alcohol-rehabs-in-quebec/`), `/rehab/yukon-drug-rehab-treatments/` (wrong prefix: real URL `/yukon-drug-rehab-treatments/`), `/alberta-rehabs/#`.\n- Header design links `/listing-category/ontario-rehabs/` and `/listing-category/british-columbia-rehabs/` for Toronto/Vancouver; those are archive duplicates we recommend 301-ing to `/ontario-rehabs/` etc.\n- Alcohol/Intervention hot-linked images: all 8 return 200 `image/jpeg` via curl today.\n')
open(AUD+'/03-gap-report.md','w').write('\n'.join(o))
print(len('\n'.join(o)))
