"""Build src/lib/redirects.json + audit/18-redirects.csv: every source URL that is not a published page gets a single-hop 301 to the closest published parent.
Targets are always published pages (no chains)."""
import json,re,csv,glob
from pathlib import Path
R=Path(__file__).resolve().parents[2]
idx={e['route']:e for e in json.load(open(R/'content/_index.json'))}
pub={r for r,e in idx.items() if e['published']}|{'/','/contact/','/intervention/','/blog/','/promote/','/claim-listing/'}
PROV={'AB':'/alberta-rehabs/','BC':'/british-columbia-rehabs/','MB':'/manitoba-rehabs/','NB':'/new-brunswick-rehabs/','NL':'/newfoundland-and-labrador-rehabs/','NS':'/nova-scotia-rehabs/','NT':'/northwest-territories-rehabs/','NU':'/nunavut-drug-rehab-centers/','ON':'/ontario-rehabs/','QC':'/drug-alcohol-rehabs-in-quebec/','SK':'/saskatchewan-drug-rehab-treatment/','YT':'/yukon-drug-rehab-treatments/','PE':'/'}
red={}  # source(path with trailing slash) -> (target, reason)
def add(src,dst,why):
    assert dst in pub,(src,dst)
    red[src]=(dst,why)
def prov_of(addresses):
    n={}
    for a in addresses:
        m=re.search(r',\s*([A-Z]{2})\b',a or '')
        if m and m.group(1) in PROV: n[m.group(1)]=n.get(m.group(1),0)+1
    return max(n,key=n.get) if n else None
slugify=lambda s:re.sub(r'[^a-z0-9]+','-',s.lower().replace("'",'')).strip('-')
# 1. thin / empty city archives -> province page
EMPTY={'annapolis-royal':'NS','annapolis-valley':'NS','aurora':'ON','coldstream':'BC','corner-brook':'NL','deer-lake':'NL','fort-steele':'BC','grand-falls-windsor':'NL','head-of-jeddore':'NS','kitwanga':'BC','lawrencetown':'NS','mission':'BC','quebec':'QC','saint-adolphe':'MB','salmon-arm':'BC','squamish':'BC','swan-river':'MB','thamesville':'ON','thousand-islands':'ON','tracadie-sheila':'NB','vernon':'BC','wilkie':'SK','winkler':'MB'}
MANUAL={'/listing-location/breadalbane/':'PE','/listing-location/jacksonville/':'NB','/listing-location/kingsclear-parish/':'NB'}
for r,e in idx.items():
    if e['type']=='city-archive' and not e['published']:
        d=json.load(open(R/f"audit/content/{e['slug']}.json")); pc=prov_of([c['address'] for c in d.get('cards',[])])
        pc=pc or MANUAL.get(r)
        if pc: add(r,PROV[pc],f"thin city archive ({len(d.get('cards',[]))} centre) -> province page")
        else: print('no province for',r)
for c,pc in EMPTY.items(): add(f'/listing-location/{c}/',PROV[pc],'empty city archive (no centres listed) -> province page')
# 2. thin / out-of-scope centres -> city archive if published, else province page
for r,e in idx.items():
    if e['type']=='centre' and not e['published']:
        d=json.load(open(R/f"audit/content/{e['slug']}.json")); ad=(d.get('centre') or {}).get('address') or ''
        cats=(d.get('centre') or {}).get('categories') or []
        parts=[x.strip() for x in ad.split(',')]
        city=parts[-3] if len(parts)>=3 else ''
        pc=prov_of([ad]); tgt=None
        if city and f'/listing-location/{slugify(city)}/' in pub: tgt=f'/listing-location/{slugify(city)}/'; why='thin centre -> city archive'
        elif pc and PROV[pc]!='/': tgt=PROV[pc]; why='thin centre -> province page'
        else: tgt='/'; why='out-of-scope centre (approved: skipped) -> home'
        if e['reason'].startswith('out-of-scope'): why='out-of-scope centre (approved: skipped) -> '+('city archive' if 'listing-location' in tgt else 'province page' if tgt!='/' else 'home')
        add(r,tgt,why)
# 3. thin posts, thin provinces
for r,e in idx.items():
    if not e['published'] and e['type']=='blog-post': add(r,'/blog/','thin blog post -> blog index')
add('/saskatchewan-rehabs/','/saskatchewan-drug-rehab-treatment/','approved: thin province page -> text page for the same province')
add('/prince-edward-island-rehabs/','/','thin province page (no PEI listings or text page) -> home')
# 4. /listing-category/ province archives duplicate the province pages
LC={'alberta-rehabs':'AB','british-columbia-rehabs':'BC','manitoba-rehabs':'MB','new-brunswick-rehabs':'NB','newfoundland-and-labrador-rehabs':'NL','northwest-territories-rehabs':'NT','nova-scotia-rehabs':'NS','ontario-rehabs':'ON','quebec-rehabs':'QC','saskatchewan-rehabs':'SK'}
for k,pc in LC.items(): add(f'/listing-category/{k}/',PROV[pc],'province listing archive duplicates the province page -> province page')
add('/listing-category/prince-edward-island-rehabs/','/','province archive with 1 centre and no PEI page -> home')
add('/listing-category/mexico/','/','out-of-scope (approved: skipped) -> home')
add('/listing-category/dui-lawyers-ontario/','/','out-of-scope (approved: skipped) -> home')
# 5. thin /category/ archives (fewer than 3 posts)
for p,n in json.load(open(R/'audit/data/categories-thin.json')): add(p,'/blog/',f'thin blog category ({n} post) -> blog index')
# 6. utility / commerce / design-only URLs
for p,t,w in [('/rehab/yukon-drug-rehab-treatments/','/yukon-drug-rehab-treatments/','source 301s this URL (design menus link to it)'),('/rehab/search/','/','source has no search page here; design links to it -> home'),('/rehab/','/','source 301s /rehab/ -> / (the design buttons link to it)'),('/cart/','/','WooCommerce utility page (noindex on source) -> home'),('/checkout/','/','WooCommerce utility page (302 to /cart/ on source) -> home'),('/my-account/','/','WooCommerce utility page (noindex on source) -> home'),('/shop/','/','empty WooCommerce shop (8 words) -> home'),('/user-dashboard/','/','account dashboard (21 words, needs login) -> home'),('/search/','/','dynamic search page, no static content -> home'),('/search-listing/','/','dynamic search page, no static content -> home'),('/pricing/','/promote/','pricing plans (64 words) -> Promote page'),('/promote-your-centre/','/promote/','same purpose as the Promote design page -> /promote/'),('/claim-your-listing/','/claim-listing/','same purpose as the Claim Listing design page -> /claim-listing/'),('/dui-lawyers-in-canada/','/','out-of-scope (approved: skipped) -> home')]:
    if (p not in pub): add(p,t,w)
# merge into redirects.json (sources without trailing slash)
out=[{'source':s.rstrip('/'),'destination':d,'note':w} for s,(d,w) in sorted(red.items()) if s not in pub]
json.dump(out,open(R/'src/lib/redirects.json','w'),indent=1)
with open(R/'audit/18-redirects.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(['source','target','reason'])
    for o in out: w.writerow([o['source']+'/',o['destination'],o['note']])
print(len(out),'redirects')
import collections; print(collections.Counter(o['note'].split(' -> ')[0][:50] for o in out).most_common(12))
