import sys, os, time, hashlib, urllib.request
UA={'User-Agent':'Mozilla/5.0 (audit; contact owner)'}
urls=[]
for f in sys.argv[1:]:
    urls+=[l.strip() for l in open(f) if l.strip()]
seen=set()
for u in urls:
    if u in seen: continue
    seen.add(u)
    p='html/'+hashlib.md5(u.encode()).hexdigest()+'.html'
    if os.path.exists(p): continue
    for i in range(3):
        try:
            r=urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=60)
            open(p,'wb').write(r.read()); break
        except Exception as e:
            print('ERR',u,e,flush=True); time.sleep(3)
            if '404' in str(e): break
    time.sleep(0.8)
print('DONE',len(seen),flush=True)
