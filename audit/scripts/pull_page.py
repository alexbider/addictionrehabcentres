"""Pull one live WPBakery page into audit/content/<slug>.json (same shape as the audited pages).
usage: pull_page.py <path> <slug> <page_type>   e.g. /residences/ residences about-info
New images go to audit/images-phase4/<slug>/ (audit/images is frozen)."""
import sys,json,re,time,urllib.request
from pathlib import Path
from urllib.parse import urljoin,urlparse
from bs4 import BeautifulSoup,NavigableString
R=Path(__file__).resolve().parents[2]; SITE='https://addictionrehabcenters.ca'; UA={'User-Agent':'Mozilla/5.0'}
path,slug,ptype=sys.argv[1:4]
def get(u,b=False):
    for k in range(3):
        try:
            x=urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=60).read(); return x if b else x.decode('utf8','replace')
        except Exception: time.sleep(2)
    raise SystemExit('fail '+u)
url=SITE+path; h=get(url); s=BeautifulSoup(h,'html.parser')
def meta(n,attr='name'): m=s.find('meta',attrs={attr:n}); return m['content'] if m and m.get('content') else ''
images=[]
def img_local(src,alt,w,hh,role):
    src=urljoin(SITE,src); key=src.split('?')[0]
    for i in images:
        if i['original_url']==key: return i
    fn=key.split('/')[-1]; rel=f'images/{slug}/{fn}'
    out=R/'audit/images-phase4'/rel.replace('images/','',1); out.parent.mkdir(parents=True,exist_ok=True)
    st='ok'
    try: out.write_bytes(get(src,True)); time.sleep(0.7)
    except SystemExit: st='failed'
    rec={'role':role,'original_url':key,'local_path':rel,'alt':alt or '','width':int(w) if str(w or '').isdigit() else None,'height':int(hh) if str(hh or '').isdigit() else None,'download':st}
    images.append(rec); return rec
def inner(n):
    return ''.join(str(c) for c in n.children).strip()
def links_of(n):
    return [{'old':a['href'],'text':a.get_text(strip=True)} for a in n.find_all('a',href=True)]
def blocks_of(root):
    out=[]
    def walk(n):
        for c in n.children:
            if isinstance(c,NavigableString): continue
            nm=c.name
            if nm in('h1','h2','h3','h4','h5','h6'):
                out.append({'type':nm,'text':c.get_text(' ',strip=True),'html':inner(c),'id':c.get('id','')})
            elif nm=='p':
                im=c.find('img')
                if im and not c.get_text(strip=True): out.append(imgb(im)); continue
                if c.get_text(strip=True): out.append({'type':'p','text':c.get_text(' ',strip=True),'html':inner(c),'links':links_of(c),'images':[]})
            elif nm in('ul','ol'):
                out.append({'type':'ul','ordered':nm=='ol','items':[{'text':li.get_text(' ',strip=True),'html':inner(li),'links':links_of(li)} for li in c.find_all('li',recursive=False)]})
            elif nm=='img': out.append(imgb(c))
            elif nm=='a' and ('button' in ' '.join(c.get('class',[])) or 'vc_btn' in ' '.join(c.get('class',[]))):
                out.append({'type':'link','text':c.get_text(' ',strip=True),'href':c.get('href',''),'new_href':c.get('href','')})
            elif nm in('script','style','noscript','form'): continue
            else: walk(c)
    def imgb(im):
        src=im.get('data-src') or im.get('src'); rec=img_local(src,im.get('alt',''),im.get('width'),im.get('height'),'content')
        return {'type':'image','src':urljoin(SITE,src),'alt':im.get('alt',''),'width':im.get('width') or '','height':im.get('height') or ''}
    walk(root); return out
holder=s.select_one('.eltdf-page-content-holder')
h1=(s.select_one('h1.entry-title') or s.find('h1')).get_text(strip=True)
vrows=[r for r in holder.select('div.vc_row.wpb_row') if not r.find_parent('div',class_='vc_row')]
rows=[];bg=None
for r in vrows:
    st=r.get('style','')+' '+' '.join(r.get('class',[]))
    b=blocks_of(r)
    if not b: continue
    if b[0]['type']=='h1' or ('newInnerBanner' in r.get('class',[])):
        m=re.search(r'url\(([^)]+)\)',r.get('style',''))
        rows.append({'kind':'hero-banner','classes':r.get('class',[]),'columns':[{'classes':[],'blocks':[x for x in b if x['type']=='h1']}],'background_image':None}); continue
    rows.append({'kind':'content','classes':r.get('class',[]),'columns':[{'classes':[],'blocks':b}]})
hdr=[x for x in rows if x['kind']=='hero-banner']
if not hdr:
    rows.insert(0,{'kind':'hero-banner','classes':[],'columns':[{'classes':[],'blocks':[{'type':'h1','text':h1,'html':h1,'id':''}]}],'background_image':None})
words=sum(len(b.get('text','').split()) for r in rows for c in r['columns'] for b in c['columns' if False else 'blocks'])
d={'schema':'1','slug':slug,'status':'ok','page_type':ptype,'wp_type':'page','template':'(none)','fit':'fallback','template_change_codes':[],
 'source':{'url':url,'path':path,'wp_items':[],'in_sitemap':False,'in_nav_footer':False,'robots':meta('robots')},'new_route':path,
 'seo':{'meta_title':s.title.get_text(strip=True),'meta_description':meta('description'),'canonical_source':(s.find('link',rel='canonical') or {}).get('href',url),'og':{'image':meta('og:image','property')},'jsonld_source':[]},
 'h1':h1,'title_bar_h1':h1,'word_count':words,'features':[],'dup_note':'','headings':[[b['type'],b['text']] for r in rows for c in r['columns'] for b in c['blocks'] if b['type'].startswith('h')],
 'images':images,'links':[],'sections':[],'blocks':[b for r in rows for c in r['columns'] for b in c['blocks']],'rows':rows,'hero':{'h1':h1,'background_image':None},'raw_html':''}
json.dump(d,open(R/f'audit/content/{slug}.json','w'))
print(slug,words,'words',len(images),'images',meta('robots'))
