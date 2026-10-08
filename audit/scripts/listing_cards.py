"""Collect the full centre-card list of every province/city listing page (page 1 from the HTML + the source's own
'Load More' ajax pages), parsed robustly. Output: data/listing_cards.json"""
import sys,json,time,urllib.request,urllib.parse,re
sys.path.insert(0,'scripts')
import emit_content as E, parse
from bs4 import BeautifulSoup
UA={'User-Agent':'Mozilla/5.0 (audit)','X-Requested-With':'XMLHttpRequest'}
def clean(t): return re.sub(r'\s+',' ',t or '').strip()
def card(a):
    t=a.select_one('.eltdf-lli-title'); l=t.select_one('a') if t else None
    im=a.select_one('.eltdf-lli-image img'); ad=a.select_one('.eltdf-lli-location-address'); ex=a.select_one('.eltdf-lli-excerpt')
    cat=a.select_one('.eltdf-lli-category'); rv=a.select_one('.eltdf-reviews-number')
    stars=len(a.select('.eltdf-stars-items i.ion-android-star:not(.ion-android-star-outline)'))
    return {'name':clean(t.get_text()) if t else '','href':(l['href'] if l else ''),'address':clean(ad.get_text()) if ad else '','excerpt':clean(ex.get_text()) if ex else '',
            'category':clean(cat.get_text()) if cat else '','category_href':cat['href'] if cat else '','reviews':int(clean(rv.get_text()) or 0) if rv else 0,'stars':stars,
            'image':parse.img_rec(im,'card') if im else None}
def camel(k):
    p=k[5:].split('-'); return p[0]+''.join(x.title() for x in p[1:])
out={}
TARGETS=[r['path'] for r in E.R if r['page_type'] in('province','city') and r.get('cards') and r['layout']=='L2-listing']
for p in TARGETS:
    r=E.bypath[p]; soup=BeautifulSoup(r['body_html'],'lxml')
    holders=soup.select('.eltdf-listing-list-holder'); H=[]; cards=[]
    for h in holders:
        first=[card(a) for a in h.select('article.eltdf-ll-item')]; extra=[]
        maxp=int(h.get('data-max-num-pages') or 1)
        if maxp>1:
            d={camel(k):v for k,v in h.attrs.items() if k.startswith('data-')}; d['action']='findall_listing_init_listing_list_ajax_load_more'
            for n in range(2,maxp+1):
                d['nextPage']=str(n); time.sleep(1)
                j=json.loads(urllib.request.urlopen(urllib.request.Request('https://addictionrehabcenters.ca/wp-admin/admin-ajax.php',data=urllib.parse.urlencode(d).encode(),headers=UA),timeout=60).read().decode())
                extra+=[card(a) for a in BeautifulSoup(j['html'],'lxml').select('article')]
        H.append({'first':[c['href'] for c in first],'extra':extra}); cards+=first+extra
    maxp=max([1]+[int(h.get('data-max-num-pages') or 1) for h in holders])
    names=[c['name'] for c in cards]
    out[p]={'holders':H,'cards':cards,'pages':maxp,'shown_first_page':sum(len(h['first']) for h in H),'dupes':len(names)-len(set(c['href'] for c in cards)),'empty_names':sum(1 for n in names if not n)}
    print(p,len(cards),'pages',maxp,'dupes',out[p]['dupes'],'noname',out[p]['empty_names'])
json.dump(out,open('data/listing_cards.json','w'),ensure_ascii=False)
