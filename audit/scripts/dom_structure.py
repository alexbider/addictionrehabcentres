"""Record each page's DOM structure (section order + component classes) so a content swap can be shown to change content only.
usage: dom_structure.py <out.json> <route>...    Built site on :3100."""
import sys,json,re,urllib.request
from bs4 import BeautifulSoup
def sig(el,depth=0):
    # structural signature: tag + component classes (scp*), children (3 levels), no text, no attribute values other than class tokens
    cls=[c for c in (el.get('class') or []) if re.match(r'^(scp|scpd|sc-)',c)]
    s=el.name+('.'+'.'.join(sorted(cls)) if cls else '')
    if depth<3:
        kids=[sig(c,depth+1) for c in el.find_all(recursive=False) if c.name not in('script','style','noscript')]
        if kids: s+='['+','.join(kids)+']'
    return s
out={}
for r in sys.argv[2:]:
    h=urllib.request.urlopen(urllib.request.Request('http://localhost:3100'+r,headers={'Host':'addictionrehabcenters.ca'}),timeout=60).read().decode()
    s=BeautifulSoup(h,'html.parser')
    secs=[]
    for e in s.find_all(['section','header','footer','main','nav']):
        if e.find_parent(['section']) and e.name=='section': continue
        secs.append({'tag':e.name,'label':e.get('data-screen-label') or e.get('id') or '','sig':sig(e)})
    out[r]={'sections':secs}
json.dump(out,open(sys.argv[1],'w'),indent=1)
print({r:len(v['sections']) for r,v in out.items()})
