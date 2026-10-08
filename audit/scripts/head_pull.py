"""Pull the live source head + content outline of every page in content/_index.json (the SEO baseline).
Output: audit/data/source-head.json  {slug: {url,status,title,meta[],canonical,links[],jsonld[],breadcrumb[],headings[],images[]}}"""
import json,sys,time,re,urllib.request,concurrent.futures as cf
from bs4 import BeautifulSoup
from pathlib import Path
R=Path(__file__).resolve().parents[2]
idx=json.load(open(R/'content/_index.json'))
out=json.load(open(R/'audit/data/source-head.json')) if (R/'audit/data/source-head.json').exists() and '--fresh' not in sys.argv else {}
todo=[e for e in idx if e['slug'] not in out]
def fetch(e):
    src=json.load(open(R/f"audit/content/{e['slug']}.json"))['source']['url']
    for k in range(3):
        try:
            r=urllib.request.urlopen(urllib.request.Request(src,headers={'User-Agent':'Mozilla/5.0'}),timeout=40); body=r.read().decode('utf8','replace'); return e['slug'],src,r.status,body
        except urllib.error.HTTPError as ex: return e['slug'],src,ex.code,''
        except Exception: time.sleep(1.5)
    return e['slug'],src,0,''
def parse(slug,url,status,body):
    d={'url':url,'status':status}
    if not body: return d
    s=BeautifulSoup(body,'lxml')
    d['title']=(s.title.string or '').strip() if s.title else None
    d['meta']=[[('name' if m.get('name') else 'property'),m.get('name') or m.get('property'),m.get('content')] for m in s.head.find_all('meta') if (m.get('name') or m.get('property')) and re.match(r'^(robots|description|og:|article:|twitter:|keywords)',(m.get('name') or m.get('property') or ''))]
    c=s.head.find('link',rel='canonical'); d['canonical']=c.get('href') if c else None
    d['links']=[[ ' '.join(l.get('rel')),l.get('hreflang'),l.get('href')] for l in s.head.find_all('link') if set(l.get('rel') or [])&{'next','prev','alternate'} and not l.get('type')]
    d['jsonld']=[]
    for sc in s.find_all('script',type='application/ld+json'):
        try: d['jsonld'].append(json.loads(sc.string))
        except Exception: d['jsonld'].append({'_invalid':True})
    h=s.select_one('.eltdf-page-content-holder') or s.body
    d['headings']=[[x.name,x.get_text(' ',strip=True)] for x in h.find_all(re.compile(r'^h[1-6]$'))]
    d['images']=[[ (i.get('src') or i.get('data-src') or '').split('/')[-1].split('?')[0],i.get('alt'),i.get('width'),i.get('height'),i.get('loading')] for i in h.find_all('img')]
    d['ext_links']=[[a.get('href'),' '.join(a.get('rel') or []),a.get('target') or ''] for a in h.find_all('a',href=True) if re.match(r'^https?://',a['href']) and 'addictionrehabcenters.ca' not in a['href']]
    rel=[]
    for it in s.select('.eltdf-related-posts-holder .eltdf-related-post'):
        a=it.select_one('h4 a'); im=it.select_one('img'); dt=it.select_one('.eltdf-post-info-date a')
        if a: rel.append({'title':a.get_text(' ',strip=True),'href':a.get('href'),'alt':(im.get('alt') if im else None),'date':dt.get_text(' ',strip=True) if dt else ''})
    d['related']=rel
    nav={}
    for k in ('prev','next'):
        a=s.select_one('a.eltdf-blog-single-'+k)
        if a:
            im=a.select_one('img'); t=a.select_one('.eltdf-blog-single-nav-title')
            nav[k]={'title':t.get_text(' ',strip=True) if t else '','href':a.get('href'),'alt':im.get('alt') if im else None}
    d['nav']=nav
    b=s.select_one('.eltdf-breadcrumbs-info'); d['breadcrumb']=[x.get_text(' ',strip=True) for x in b.find_all(['a','span'],recursive=True)] if b else []
    d['nav_headings']=[[x.name,x.get_text(' ',strip=True)] for x in s.body.find_all(re.compile(r'^h[1-6]$')) if x not in h.find_all(re.compile(r'^h[1-6]$'))][:5]
    return d
t0=time.time(); n=0
with cf.ThreadPoolExecutor(8) as ex:
    for slug,url,status,body in ex.map(fetch,todo):
        out[slug]=parse(slug,url,status,body); n+=1
        if n%100==0:
            json.dump(out,open(R/'audit/data/source-head.json','w')); print(n,'/',len(todo),round(time.time()-t0),'s',flush=True)
json.dump(out,open(R/'audit/data/source-head.json','w'))
bad=[k for k,v in out.items() if v.get('status')!=200]
print('pages',len(out),'non-200',len(bad),bad[:10])
