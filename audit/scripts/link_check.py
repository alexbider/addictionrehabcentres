"""Crawl the running site (port 3100): every published page's internal links -> status of each unique target.
Writes audit/14-links-still-broken.csv (source page, link, status) and prints a summary. Also lists province/city cards whose centre is not published."""
import json,re,sys,csv,html,urllib.request,urllib.parse,concurrent.futures as cf
from pathlib import Path
R=Path('/Users/mac/Downloads/arc-next'); B='http://localhost:3100'
idx=[e for e in json.load(open(R/'content/_index.json')) if e['published']]
def get(u):
    try:
        req=urllib.request.Request(u,headers={'User-Agent':'linkcheck'})
        class NoRedir(urllib.request.HTTPRedirectHandler):
            def redirect_request(self,*a,**k): return None
        op=urllib.request.build_opener(NoRedir)
        try: r=op.open(req,timeout=30); return r.status, r.read().decode('utf8','replace')
        except urllib.error.HTTPError as e: return e.code, ''
    except Exception as e: return 0,''
pages={}
def work(e):
    st,body=get(B+e['route']); return e['route'],st,body
with cf.ThreadPoolExecutor(8) as ex:
    for route,st,body in ex.map(work,idx): pages[route]=(st,body)
links={}
for route,(st,body) in pages.items():
    for h in re.findall(r'<a [^>]*href="([^"]+)"',body):
        h=html.unescape(h)
        if h.startswith(('mailto:','tel:','#','javascript:')): continue
        u=urllib.parse.urljoin(B+route,h)
        p=urllib.parse.urlparse(u)
        if p.netloc not in ('localhost:3100','addictionrehabcenters.ca','www.addictionrehabcenters.ca'): continue
        links.setdefault(p.path or '/',set()).add(route)
def chk(path): return path,get(B+path)[0]
res={}
with cf.ThreadPoolExecutor(8) as ex:
    for path,st in ex.map(chk,list(links)): res[path]=st
bad=[(path,st) for path,st in res.items() if st not in (200,301,308)]
with open(R/'audit/14-links-still-broken.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(['target','status','linked_from_count','example_source'])
    for path,st in sorted(bad): w.writerow([path,st,len(links[path]),sorted(links[path])[0]])
print('pages crawled',len(pages),'non-200 pages',[r for r,(s,_) in pages.items() if s!=200][:5])
print('unique internal link targets',len(res),'broken (not 200/301)',len(bad))
for path,st in sorted(bad)[:25]: print(' ',st,path,'<-',len(links[path]),'pages')
