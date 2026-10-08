import json,os,hashlib,time,urllib.request,urllib.parse,shutil,csv,sys
from urllib.parse import urlparse,unquote
from PIL import Image
AUD='/Users/mac/Downloads/arc-next/audit'
L=json.load(open('data/listing_cards.json'))
UA={'User-Agent':'Mozilla/5.0 (audit)','Accept':'image/*,*/*'}
seen=set(); rows=[]; fails=[]
for p,v in L.items():
    uniq=[]; hs=set()
    for c in v['cards']:
        if c['href'] in hs: continue
        hs.add(c['href']); uniq.append(c)
    v['unique']=uniq
    for c in uniq:
        im=c['image']; slug=c['href'].strip('/').split('/')[-1]; c['slug']=slug
        if not im: c['local']=None; continue
        u=im['src_original'].split('?')[0]; fn=unquote(urlparse(u).path.split('/')[-1]); rel=f'images/{slug}/{fn}'; c['local']=rel
        if (u,rel) in seen: continue
        seen.add((u,rel))
        cp='imgcache/'+hashlib.md5(u.encode()).hexdigest(); dst=os.path.join(AUD,rel)
        if not os.path.exists(cp):
            try:
                r=urllib.request.urlopen(urllib.request.Request(urllib.parse.quote(u,safe=':/%'),headers=UA),timeout=60); open(cp,'wb').write(r.read()); time.sleep(0.25)
            except Exception as e: fails.append((u,str(e))); c['local']=None; continue
        os.makedirs(os.path.dirname(dst),exist_ok=True); shutil.copyfile(cp,dst)
        try:
            with Image.open(cp) as i: w,h=i.size
        except Exception: w=h=''
        rows.append([p,c['href'],'card',u,rel,im.get('alt',''),w,h,os.path.getsize(cp),'ok',''])
json.dump(L,open('data/listing_cards.json','w'),ensure_ascii=False)
with open(AUD+'/images-manifest.csv','a',newline='') as f: csv.writer(f).writerows(rows)
print('card images',len(rows),'fails',fails)
