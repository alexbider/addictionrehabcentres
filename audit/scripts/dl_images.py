import json,os,hashlib,time,urllib.request,threading,queue,sys
UA={'User-Agent':'Mozilla/5.0 (audit; contact owner)','Accept':'image/avif,image/webp,image/*,*/*'}
L=json.load(open('data/download_list.json'))
urls=sorted({u for u,_ in L})
q=queue.Queue(); [q.put(u) for u in urls]
log=open('data/dl_images.log','a'); lock=threading.Lock(); done=[0]
def work():
    while True:
        try: u=q.get_nowait()
        except queue.Empty: return
        p='imgcache/'+hashlib.md5(u.encode()).hexdigest()
        if os.path.exists(p) or os.path.exists(p+'.fail'): continue
        err=None
        for a in range(3):
            try:
                r=urllib.request.urlopen(urllib.request.Request(u.replace(' ','%20'),headers=UA),timeout=60)
                d=r.read(); ct=r.headers.get('Content-Type','')
                if not ct.startswith('image/') and 'svg' not in ct and 'octet' not in ct: raise Exception('content-type '+ct)
                open(p,'wb').write(d); open(p+'.ct','w').write(ct); err=None; break
            except Exception as e:
                err=str(e); time.sleep(2*(a+1))
                if '404' in err or '403' in err: break
        if err:
            open(p+'.fail','w').write(err)
            with lock: log.write(f'FAIL\t{u}\t{err}\n'); log.flush()
        with lock: done[0]+=1
        time.sleep(0.25)
ts=[threading.Thread(target=work) for _ in range(3)]
[t.start() for t in ts]; [t.join() for t in ts]
print('DONE',len(urls),flush=True)
