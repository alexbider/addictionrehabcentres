import json,collections,re,os
from urllib.parse import urlparse,unquote
R=json.load(open('data/final.json'))
rem=[r for r in R if r['status']=='REMAINING']
# card thumb (featured image) per centre URL from any archive/province/city page
card_img={}
for r in R:
    for c in r.get('cards',[]):
        if c.get('image') and c.get('href') and c['image'].get('src_original'): card_img.setdefault(c['href'].split('?')[0],c['image'])
def page_images(r):
    out=[]
    for i in r.get('images',[]): out.append(dict(i))
    if r['page_type']=='centre':
        for i in r.get('centre',{}).get('gallery',[]): out.append(dict(i,role='gallery'))
        ci=card_img.get(r['url'])
        if ci: out.append(dict(ci,role='featured'))
        if r.get('og_image'): out.append({'role':'og','src_original':r['og_image'],'alt':'','width':None,'height':None})
    elif r['page_type']=='blog-post' and r.get('og_image'):
        out.append({'role':'og','src_original':r['og_image'],'alt':'','width':None,'height':None})
    elif r['page_type'] in('province','city','city-archive'):
        pass
    seen=set(); res=[]
    for i in out:
        u=(i.get('src_original') or '').split('?')[0]
        if not u or u in seen: continue
        seen.add(u); i['src_original']=u; res.append(i)
    return res
use=collections.defaultdict(list)
P={}
for r in rem:
    P[r['url']]=page_images(r)
    for i in P[r['url']]: use[i['src_original']].append(r['url'])
SHARED={u for u,p in use.items() if len(p)>=5}
SKIP_HOSTS=('lh3.googleusercontent.com','googleusercontent.com','gstatic.com')
def fname(u):
    n=unquote(urlparse(u).path.split('/')[-1]); return re.sub(r'[^\w.\-()+ ]','_',n)
def ym(u):
    m=re.search(r'/uploads/(\d{4})/(\d{2})/',u); return (m.group(1)+m.group(2)) if m else 'x'
def slug_for(r):
    return r['slug'] if r['wp_type'] in('page','post') else r['wp_type'].replace('listing-item','centre').replace('listing-location','city')+'__'+r['slug']
plan={}  # url -> local relative path (under audit/)
used=collections.defaultdict(dict)  # folder -> fname -> url
def assign(folder,u):
    f=fname(u); d=used[folder]
    if f in d and d[f]!=u: f=ym(u)+'_'+f
    d[f]=u; return f'images/{folder}/{f}'
pages_local={}
for r in rem:
    sl=slug_for(r); loc={}
    for i in P[r['url']]:
        u=i['src_original']
        host=urlparse(u).netloc
        if host.endswith(SKIP_HOSTS): loc[u]=None; continue
        if u in SHARED:
            if u not in plan: plan[u]=assign('_shared',u)
            loc[u]=plan[u]
        else:
            key=(sl,u)
            p=assign(sl,u); loc[u]=p; plan.setdefault(('p',sl,u) if False else u+'||'+sl,p)
    pages_local[r['url']]=loc
json.dump({'pages':{u:{k:v for k,v in loc.items()} for u,loc in pages_local.items()},'shared':sorted(SHARED),'slugs':{r['url']:slug_for(r) for r in rem}},open('data/image_plan.json','w'))
# download list: unique (url,local)
dl={}
for u,loc in pages_local.items():
    for k,v in loc.items():
        if v: dl[(k,v)]=1
print('pages',len(rem),'unique url',len(use),'shared',len(SHARED),'files to write',len(dl),'skipped avatars',sum(1 for loc in pages_local.values() for v in loc.values() if v is None))
json.dump([list(k) for k in dl],open('data/download_list.json','w'))
