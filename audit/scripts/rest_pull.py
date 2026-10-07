import json, time, urllib.request, sys
UA={'User-Agent':'Mozilla/5.0 (audit; contact owner)'}
B='https://addictionrehabcenters.ca/wp-json/wp/v2/'
def get(u):
    for i in range(3):
        try:
            r=urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=60); return json.load(r)
        except Exception as e:
            print('retry',u,e); time.sleep(3)
    raise SystemExit('fail '+u)
for t in ['pages','posts','categories','media']:
    out=[]; p=1
    while True:
        if t=='media': break
        f='' if t=='categories' else '&_fields=id,link,slug,type,title,parent,date,modified,status,content,excerpt,yoast_head_json,featured_media,categories,author'
        try: d=get(f'{B}{t}?per_page=100&page={p}{f}')
        except SystemExit: break
        out+=d; print(t,p,len(d),flush=True)
        if len(d)<100: break
        p+=1; time.sleep(1.5)
    json.dump(out,open(f'data/rest_{t}.json','w'))
