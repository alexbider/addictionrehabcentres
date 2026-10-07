import json,os,shutil,hashlib,csv,sys
sys.path.insert(0,'scripts')
from PIL import Image
AUD='/Users/mac/Downloads/arc-next/audit'
plan=json.load(open('data/image_plan.json'))
import emit_content as E
from image_plan import page_images
R=[r for r in E.R if r['status']=='REMAINING']
info={}
def get(u):
    p='imgcache/'+hashlib.md5(u.encode()).hexdigest()
    if os.path.exists(p):
        w=h=None
        try:
            with Image.open(p) as im: w,h=im.size
        except Exception: pass
        return p,{'status':'ok','width':w,'height':h,'bytes':os.path.getsize(p)}
    err=open(p+'.fail').read() if os.path.exists(p+'.fail') else 'not downloaded'
    return None,{'status':'FAILED','note':err,'width':None,'height':None,'bytes':0}
copied=set(); rows=[]; shared_pages={}
for r in R:
    loc=plan['pages'][r['url']]; sl=plan['slugs'][r['url']]
    for i in page_images(r):
        u=i['src_original']; lp=loc.get(u)
        if lp is None:
            info[u]={'status':'skipped','note':'third-party Google reviewer avatar (personal photo, not site content)','width':None,'height':None,'bytes':0}
            rows.append([sl,r['url'],i.get('role'),u,'',i.get('alt',''),'','', '', 'skipped',info[u]['note']]); continue
        src,inf=get(u); info[u]=inf
        if src and lp not in copied:
            dst=os.path.join(AUD,lp); os.makedirs(os.path.dirname(dst),exist_ok=True); shutil.copyfile(src,dst); copied.add(lp)
        rows.append([sl,r['url'],i.get('role'),u,lp if src else '',i.get('alt',''),inf['width'] or i.get('width') or '',inf['height'] or i.get('height') or '',inf['bytes'],inf['status'],inf.get('note','')])
json.dump(info,open('data/imginfo.json','w'))
with open(AUD+'/images-manifest.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(['page_slug','page_url','role','original_url','local_path','alt','width_px','height_px','bytes','status','note']); w.writerows(rows)
import collections
print('files written',len(copied),'manifest rows',len(rows),collections.Counter(r[9] for r in rows))
print('failed:',sorted({r[3] for r in rows if r[9]=='FAILED'}))
