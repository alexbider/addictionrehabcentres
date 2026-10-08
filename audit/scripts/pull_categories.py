"""Scrape the source /category/<slug>/ archives (all pages): posts in order, head, pagination. -> audit/data/categories.json. 1.5s delay."""
import json,time,urllib.request,re
from bs4 import BeautifulSoup
from pathlib import Path
R=Path(__file__).resolve().parents[2]
ins=json.load(open(R/'audit/data/missing-inspect.json'))
cats=[x['path'] for x in ins if x['path'].startswith('/category/')]
def get(u):
    for k in range(3):
        try: return urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=60).read().decode('utf8','replace')
        except Exception: time.sleep(2)
    return None
out={}
for p in cats:
    pages=[];n=1
    while True:
        u='https://addictionrehabcenters.ca'+p+(f'page/{n}/' if n>1 else '')
        h=get(u); time.sleep(1.5)
        if not h: break
        s=BeautifulSoup(h,'html.parser')
        posts=[re.sub(r'^https://addictionrehabcenters\.ca','',a['href']) for a in s.select('article h2 a, article h3 a, article .eltdf-post-title a') if a.get('href')]
        posts=list(dict.fromkeys(posts))
        pages.append({'n':n,'url':u,'posts':posts,'title':s.title.get_text(strip=True),'next':bool(s.find('link',rel='next'))})
        if not s.find('link',rel='next'): break
        n+=1
    out[p]={'h1':(s.find('h1') or s.find('h2')).get_text(strip=True),'pages':pages}
    print(p,[len(x['posts']) for x in pages])
json.dump(out,open(R/'audit/data/categories.json','w'),indent=1)
