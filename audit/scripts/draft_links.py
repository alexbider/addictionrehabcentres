"""Crawl every live page (published content + live design routes) and report any link to a draft route."""
import json,re,html,urllib.request,urllib.parse,concurrent.futures as cf
B='http://localhost:3100'
D=['/therapists','/therapists-province','/therapists-city','/therapist-profile','/claim-therapist','/therapist-onboarding','/join-directory','/auth','/provider-dashboard','/centre-onboarding']
idx=[e['route'] for e in json.load(open('content/_index.json')) if e['published']]
live=idx+['/alcohol','/centre','/city','/claim-listing','/contact','/drug','/intervention','/menu-options','/promote','/province','/']
def get(r):
    try: return r,urllib.request.urlopen(urllib.request.Request(B+r),timeout=40).read().decode('utf8','replace')
    except Exception as e: return r,''
hits={}
with cf.ThreadPoolExecutor(8) as ex:
    for r,body in ex.map(get,live):
        for h in re.findall(r'href="([^"]+)"',body):
            p=urllib.parse.urlparse(html.unescape(h)).path.rstrip('/')
            if p in D: hits.setdefault(p,set()).add(r)
print('live pages crawled',len(live)); print('links to draft routes:',{k:len(v) for k,v in hits.items()} or 'none')
for k,v in hits.items(): print(k,sorted(v)[:5])
