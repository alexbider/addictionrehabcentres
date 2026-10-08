"""Rewrite internal hrefs in a pulled page JSON that the source itself 301s (follow once, keep the target path). usage: fix_links.py slug..."""
import sys,json,re,time,urllib.request
from pathlib import Path
R=Path(__file__).resolve().parents[2]
idx={e['route'] for e in json.load(open(R/'content/_index.json'))}
class NR(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,*a,**k): return None
op=urllib.request.build_opener(NR)
def loc(path):
    try: op.open(urllib.request.Request('https://addictionrehabcenters.ca'+path,headers={'User-Agent':'Mozilla/5.0'}),timeout=30); return None
    except urllib.error.HTTPError as e:
        l=e.headers.get('Location'); return re.sub(r'^https://addictionrehabcenters\.ca','',l) if l and e.code in(301,302) else None
for slug in sys.argv[1:]:
    f=R/f'audit/content/{slug}.json'; t=f.read_text()
    hrefs=set(re.findall(r'href=\\"((?:https://addictionrehabcenters\.ca)?/[^"\\#?]*)\\"',t))|set(re.findall(r'"href": "((?:https://addictionrehabcenters\.ca)?/[^"#?]*)"',t))
    for h in sorted(hrefs):
        p=re.sub(r'^https://addictionrehabcenters\.ca','',h)
        if p in idx or p=='/' or p.startswith('/wp-'): continue
        n=loc(p); time.sleep(0.5)
        if n: print(slug,p,'->',n); t=t.replace(h,n)
    f.write_text(t)
