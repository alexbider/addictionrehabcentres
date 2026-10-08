"""Scrape /page/N/ of the paginated city archives into audit/content/city__<city>__page-N.json (cards only; same JSON shape as page 1).
New card images go to audit/images-phase4/ (audit/images is frozen). Polite: 1.5s between requests."""
import json,re,time,copy,urllib.request,os,glob,html
from bs4 import BeautifulSoup
from pathlib import Path
R=Path(__file__).resolve().parents[2]
UA={'User-Agent':'Mozilla/5.0'}
def get(u,binary=False):
    for k in range(3):
        try:
            b=urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=60).read()
            return b if binary else b.decode('utf8','replace')
        except Exception as e: time.sleep(2)
    raise SystemExit('fail '+u)
known={}
for f in glob.glob(str(R/'audit/content/*.json')):
    try: d=json.load(open(f))
    except: continue
    for im in d.get('images',[]) or []:
        if im.get('local_path') and im.get('original_url'): known[im['original_url'].split('?')[0]]=im
pages={'calgary':2,'ottawa':2,'st-johns':2,'toronto':2,'vancouver':2,'winnipeg':3}
made=[]
for city,n in pages.items():
    base=json.load(open(R/f'audit/content/city__{city}.json'))
    for p in range(2,n+1):
        url=f'https://addictionrehabcenters.ca/listing-location/{city}/page/{p}/'
        h=get(url); time.sleep(1.5)
        s=BeautifulSoup(h,'html.parser')
        cards=[];imgs=[]
        for it in s.select('.place-item'):
            a=it.select_one('h5.place-title a')
            if not a: continue
            im=it.select_one('.entry-thumb img')
            c={'name':a.get_text(strip=True),'href':a['href'],'address':(it.select_one('.place-address') or it).get_text(' ',strip=True) if it.select_one('.place-address') else '',
               'category':''.join(sp.get_text() for sp in it.select('.place-type span')),'reviews':'','rating':(it.select_one('.place-rating span') or {}).get_text(strip=True) if it.select_one('.place-rating span') else '',
               'featured':bool(it.select_one('.place-featured'))}
            if im and im.get('src'):
                src=im['src']; key=src.split('?')[0]
                rec=known.get(key)
                if not rec:
                    fn=key.split('/')[-1]; rel=f'images/city__{city}__page-{p}/{fn}'
                    out=R/'audit/images-phase4'/rel.replace('images/','',1); out.parent.mkdir(parents=True,exist_ok=True)
                    try: out.write_bytes(get(src,True)); time.sleep(0.5); st='ok'
                    except SystemExit: st='failed'
                    rec={'role':'card','original_url':src,'local_path':rel,'alt':im.get('alt',''),'width':int(im.get('width') or 0) or None,'height':int(im.get('height') or 0) or None,'download':st}
                    known[key]=rec
                imgs.append({**rec,'alt':im.get('alt','')})
                c['image']={'role':'card','src_original':src,'src_as_published':src,'alt':im.get('alt',''),'width':im.get('width'),'height':im.get('height')}
            cards.append(c)
        t=s.title.get_text(strip=True) if s.title else ''
        md=s.find('meta',attrs={'name':'description'})
        d=copy.deepcopy(base); slug=f'city__{city}__page-{p}'
        d['slug']=slug; d['new_route']=f'/listing-location/{city}/page/{p}/'
        d['source']={**base['source'],'url':url,'path':f'/listing-location/{city}/page/{p}/'}
        d['seo']={**base['seo'],'meta_title':t,'meta_description':md['content'] if md else base['seo']['meta_description'],'canonical_source':url}
        d['cards']=cards; d['images']=imgs; d['blocks']=base.get('blocks'); d['page_type']='city-archive'; d['raw_html']=''
        json.dump(d,open(R/f'audit/content/{slug}.json','w')); made.append((slug,len(cards)))
        print(slug,len(cards),t)
