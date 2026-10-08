"""Internal link check for a batch: every internal link in the page body (header/footer excluded) must return 200 or an intended 301.
usage: internal_links.py types=blog-post[,..]  -> prints totals, writes audit/data/links-<types>.json"""
import json,re,sys,html,urllib.request,urllib.parse,concurrent.futures as cf
from bs4 import BeautifulSoup
from pathlib import Path
R=Path(__file__).resolve().parents[2]; B='http://localhost:3100'
args=dict(a.split('=',1) for a in sys.argv[1:] if '=' in a)
idx=[e for e in json.load(open(R/'content/_index.json')) if e['published'] and (('types' not in args) or e['type'] in args['types'].split(','))]
def get(path):
    req=urllib.request.Request(B+path,headers={'Host':'addictionrehabcenters.ca'})
    class NR(urllib.request.HTTPRedirectHandler):
        def redirect_request(self,*a,**k): return None
    try:
        r=urllib.request.build_opener(NR).open(req,timeout=60); return r.status,r.read().decode('utf8','replace')
    except urllib.error.HTTPError as e: return e.code,''
    except Exception: return 0,''
links={}
def page(e):
    st,body=get(e['route'])
    s=BeautifulSoup(body,'lxml')
    for t in s.select('footer, [data-sc-name=SiteHeader]'): t.decompose()
    out=set()
    for a in s.find_all('a',href=True):
        h=html.unescape(a['href']).strip()
        if h.startswith(('mailto:','tel:','#','javascript:')): continue
        u=urllib.parse.urljoin('https://addictionrehabcenters.ca'+e['route'],h); p=urllib.parse.urlparse(u)
        if p.netloc.replace('www.','')!='addictionrehabcenters.ca': continue
        out.add(p.path or '/')
    return e['route'],out
with cf.ThreadPoolExecutor(8) as ex:
    for route,out in ex.map(page,idx):
        for p in out: links.setdefault(p,set()).add(route)
res={}
def chk(p): return p,get(p)[0]
with cf.ThreadPoolExecutor(8) as ex:
    for p,st in ex.map(chk,list(links)): res[p]=st
bad={p:st for p,st in res.items() if st not in (200,301,308)}
tag=args.get('types','all').replace(',','+')
json.dump({'pages':len(idx),'targets':len(res),'bad':{p:{'status':st,'from':sorted(links[p])[:5],'count':len(links[p])} for p,st in bad.items()}},open(R/f'audit/data/links-{tag}.json','w'),indent=1)
print('pages',len(idx),'unique internal targets',len(res),'broken (not 200/301)',len(bad))
for p,st in sorted(bad.items(),key=lambda x:-len(links[x[0]]))[:15]: print(' ',st,p,'<-',len(links[p]),'pages')
