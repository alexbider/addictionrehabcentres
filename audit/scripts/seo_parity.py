"""SEO parity, live source vs built page, for every published page (or a subset).
usage: seo_parity.py [--types a,b] [--slugs a,b] [--tag NAME]   -> audit/data/seo-parity.json (store) and audit/17-seo-parity.csv
Source = audit/data/source-head.json (live <head> + content outline, audit/scripts/head_pull.py). Built = http://localhost:3100 with Host: production."""
import json,re,sys,html,csv,urllib.request,urllib.parse,concurrent.futures as cf
from bs4 import BeautifulSoup
from pathlib import Path
R=Path(__file__).resolve().parents[2]
SITE='https://addictionrehabcenters.ca'
args=dict(a.split('=',1) for a in sys.argv[1:] if '=' in a)
idx=[e for e in json.load(open(R/'content/_index.json')) if e['published']]
if 'types' in args: idx=[e for e in idx if e['type'] in args['types'].split(',')]
if 'slugs' in args: idx=[e for e in idx if e['slug'] in args['slugs'].split(',')]
SRC=json.load(open(R/'audit/data/source-head.json'))
store_p=R/'audit/data/seo-parity.json'
store=json.load(open(store_p)) if store_p.exists() else {}
def norm(t): return re.sub(r'\s+',' ',(t or '').replace('’',"'").replace('‘',"'").replace(' ',' ')).strip()
IMGRX=re.compile(r'https?://[^"\s\\]*?(?:/wp-content/|/assets/img/|/assets/logo)[^"\s\\]*')
def nimg(x): return IMGRX.sub('IMG',x)
def get(route):
    req=urllib.request.Request('http://localhost:3100'+route,headers={'Host':'addictionrehabcenters.ca'})
    class NR(urllib.request.HTTPRedirectHandler):
        def redirect_request(self,*a,**k): return None
    try:
        r=urllib.request.build_opener(NR).open(req,timeout=60); return r.status,r.read().decode('utf8','replace'),dict(r.headers)
    except urllib.error.HTTPError as e: return e.code,'',dict(e.headers)
def metas(soup,rx):
    out=[]
    for m in soup.find_all('meta'):
        n=m.get('property') or m.get('name')
        if n and re.match(rx,n): out.append((n,html.unescape(m.get('content') or '')))
    return out
def walk(o,pred):
    if isinstance(o,dict):
        if pred(o): yield o
        for v in o.values(): yield from walk(v,pred)
    elif isinstance(o,list):
        for v in o: yield from walk(v,pred)
def subseq(a,b):
    it=iter(b); return all(x in it for x in a)
def check(e):
    slug=e['slug']; src=SRC.get(slug); r={'slug':slug,'route':e['route'],'type':e['type'],'notes':[]}
    status,body,hdr=get(e['route'])
    if not src or not body:
        r['url']='DIFF'; r['notes'].append(f'status {status}'); return r
    s=BeautifulSoup(body,'lxml')
    spath=urllib.parse.urlparse(src['url']).path
    r['url']='PASS' if status==200 and spath==e['route'] else 'DIFF'
    if r['url']=='DIFF': r['notes'].append(f'url {spath} vs {e["route"]} status {status}')
    bt=norm(s.title.string if s.title else None); st=norm(src['title'])
    r['title']='PASS' if bt==st else 'DIFF'
    if bt!=st: r['notes'].append(f'title: {st!r} vs {bt!r}')
    sd=[m[2] for m in src['meta'] if m[1]=='description']; bd=[c for n,c in metas(s,r'^description$')]
    r['description']='PASS' if (not sd and not bd) or (sd and bd and norm(sd[0])==norm(bd[0])) else 'DIFF'
    if r['description']=='DIFF': r['notes'].append('description differs')
    cs=src.get('canonical'); cb=s.find('link',rel='canonical'); cb=cb.get('href') if cb else None
    r['canonical']='PASS' if (cs or '')==(cb or '') else 'DIFF'
    if r['canonical']=='DIFF': r['notes'].append(f'canonical {cs} vs {cb}')
    rs=[m[2] for m in src['meta'] if m[1]=='robots']; rb=[c for n,c in metas(s,r'^robots$')]
    tok=lambda x: set(re.split(r'\s*,\s*',(x[0] if x else '').lower().replace(': ',':'))) if x else set()
    r['robots']='PASS' if tok(rs)==tok(rb) else 'DIFF'
    if r['robots']=='DIFF': r['notes'].append(f'robots {rs} vs {rb}')
    SKIPD=('og:image:width','og:image:height','og:image:type')
    so=sorted((m[1],nimg(norm(m[2]))) for m in src['meta'] if re.match(r'^(og:|article:)',m[1]) and m[1] not in SKIPD); bo=sorted((n,nimg(norm(c))) for n,c in metas(s,r'^(og:|article:)') if n not in SKIPD)
    r['og']='PASS' if so==bo else 'DIFF'
    if so!=bo: r['notes'].append('og/article: '+str([x for x in so if x not in bo][:2])+' vs '+str([x for x in bo if x not in so][:2]))
    stw=sorted((m[1],nimg(norm(m[2]))) for m in src['meta'] if m[1].startswith('twitter:')); btw=sorted((n,nimg(norm(c))) for n,c in metas(s,r'^twitter:'))
    r['twitter']='PASS' if stw==btw else 'DIFF'
    if stw!=btw: r['notes'].append('twitter: '+str([x for x in stw if x not in btw][:2])+' vs '+str([x for x in btw if x not in stw][:2]))
    # JSON-LD
    bj=[]; valid=True
    for sc in s.find_all('script',type='application/ld+json'):
        try: bj.append(json.loads(sc.string))
        except Exception: valid=False
    r['jsonld']='PASS' if valid and json.loads(nimg(json.dumps(bj)))==json.loads(nimg(json.dumps(src['jsonld']))) else 'DIFF'
    r['wp_content_in_head']='DIFF' if re.search(r'/wp-content/',str(s.head)) else 'PASS'
    if r['jsonld']=='DIFF': r['notes'].append(f'jsonld valid={valid} source {len(src["jsonld"])} blocks vs built {len(bj)}')
    # breadcrumb schema + visible
    sb=[g for g in walk(src['jsonld'],lambda o:o.get('@type')=='BreadcrumbList')]; bb=[g for g in walk(bj,lambda o:o.get('@type')=='BreadcrumbList')]
    r['breadcrumb_schema']='PASS' if sb==bb else 'DIFF'
    r['breadcrumb_visible']='MISSING-ON-SOURCE' if not src.get('breadcrumb') else 'DIFF'
    # headings (built outline excludes header, footer, nav)
    for t in s.select('footer, [data-sc-name=SiteHeader]'): t.decompose()
    bh=[[h.name,norm(h.get_text(' ',strip=True))] for h in s.find_all(re.compile(r'^h[1-6]$'))]
    # intended removals / site chrome in the source outline: footer widget headings, sponsored ad, reviews, comment form
    CHROME=re.compile(r'^(we are available 24/7|types of services|special services|other services|sponsored ad|start your journey now|reviews about center|write a review.*|post a comment.*|comments|you don.t have permission.*|\d+ reviews?)$',re.I)
    sh_all=[[h[0],norm(h[1])] for h in src['headings']]
    sh=[h for h in sh_all if not CHROME.match(h[1])]
    removed=[h[1] for h in sh_all if CHROME.match(h[1])]
    if removed: r['notes'].append('headings: intended removals/site chrome not rebuilt: '+', '.join(sorted(set(removed))))
    if bh==sh: r['headings']='PASS'
    else:
        r['headings']='DIFF'
        stx=[h[1] for h in sh]; btx=[h[1] for h in bh]
        miss=[h for h in stx if h not in btx]
        if not miss and stx==btx: kind='level only'; reason='same text and order, different heading levels: '+str([(a,b) for a,b in zip(sh,bh) if a!=b][:2])
        elif not miss and subseq(stx,btx): kind='chrome'; reason=f'design adds {len(btx)-len(stx)} heading(s): '+str([h for h in btx if h not in stx][:3])
        elif not miss: kind='order'; reason='same texts, different order'
        else: kind='missing'; reason='source heading missing: '+str(miss[:2])
        r['notes'].append('headings ('+kind+') '+reason); r['headings_kind']=kind
    r['h1_count']=f"{sum(1 for h in sh if h[0]=='h1')}/{sum(1 for h in bh if h[0]=='h1')}"
    # images
    stem=lambda n: re.sub(r'-\d+x\d+$','',re.sub(r'\.[a-z0-9]+$','',urllib.parse.unquote(n or '').lower()))
    bimgs=[(stem((i.get('src') or '').split('/')[-1]),i.get('alt'),i.get('width'),i.get('height'),i.get('loading')) for i in s.find_all('img')]
    bmap={}
    for b in bimgs: bmap.setdefault(b[0],[]).append(b)
    kept=True; altok=True; lost=[]; altbad=[]
    for im in src['images']:
        if not im[0] or im[0].startswith('data:') or 'logo' in im[0].lower(): continue
        k=stem(im[0])
        if k not in bmap and not any(k.replace('-','') == x.replace('-','') or k[:20]==x[:20] for x in bmap): kept=False; lost.append(im[0])
        else:
            cand=bmap.get(k) or next((v for x,v in bmap.items() if k[:20]==x[:20]),[])
            if cand and all((c[1] or '')!=(im[1] or '') for c in cand): altok=False; altbad.append((im[0],im[1],cand[0][1]))
    r['images_kept']='PASS' if kept else 'DIFF'; r['images_alt']='PASS' if altok else 'DIFF'
    if lost: r['notes'].append('images missing: '+str(lost[:2]))
    if altbad: r['notes'].append('alt differs: '+str(altbad[:2]))
    content=[b for b in bimgs if 'logo' not in b[0]]
    r['images_dims']='PASS' if all(b[2] and b[3] for b in content) else 'DIFF'
    if r['images_dims']=='DIFF': r['notes'].append(f'{sum(1 for b in content if not (b[2] and b[3]))} img without width/height')
    r['images_main_eager']='PASS' if (not content or content[0][4]!='lazy') else 'DIFF'
    if r['images_main_eager']=='DIFF': r['notes'].append('first image is lazy-loaded')
    # external links
    def nl(h): u=urllib.parse.urlparse(h); return (u.netloc.lower().replace('www.','')+u.path.rstrip('/')+('?'+u.query if u.query else ''))
    sext=sorted((nl(a[0]),' '.join(sorted(a[1].split())),a[2]) for a in src.get('ext_links',[]))
    s2=BeautifulSoup(body,'lxml')
    for t in s2.select('footer, [data-sc-name=SiteHeader]'): t.decompose()
    bext=sorted((nl(a['href']),' '.join(sorted(' '.join(a.get('rel') or []).split())),a.get('target') or '') for a in s2.find_all('a',href=True) if re.match(r'^https?://',a['href']) and 'addictionrehabcenters.ca' not in a['href'])
    if not sext: r['ext_links']='MISSING-ON-SOURCE'
    else:
        lost=[x for x in sext if x not in bext]
        r['ext_links']='PASS' if not lost else 'DIFF'
        if lost: r['notes'].append('external links differ: '+str(lost[:2]))
    # hreflang / pagination
    sn=[l for l in src['links'] if l[0] in ('next','prev')]; bn=[(l.get('rel')[0],l.get('href')) for l in s.find_all('link') if l.get('rel') and l.get('rel')[0] in ('next','prev')]
    r['hreflang_pagination']=('MISSING-ON-SOURCE' if not sn and not bn else 'PASS' if sorted((l[0],l[2]) for l in sn)==sorted(bn) else 'DIFF')
    # dates
    pt=[m[2] for m in src['meta'] if m[1]=='article:published_time']
    dates_ok=True
    for key in ('datePublished','dateModified'):
        sv=[o.get(key) for o in walk(src['jsonld'],lambda o:key in o)]; bv=[o.get(key) for o in walk(bj,lambda o:key in o)]
        if sv!=bv: dates_ok=False
    r['dates']='PASS' if dates_ok and (so==bo) else 'DIFF'
    if e['type']=='blog-post':
        txt=norm(s.get_text(' ')); lab=json.load(open(R/f'content/{slug}.json'))['post'].get('date_label','')
        if lab and lab not in txt: r['dates']='DIFF'; r['notes'].append('visible date missing')
    elif not pt and not sd and not src['jsonld']: r['dates']='MISSING-ON-SOURCE'
    return r
# external links: compare using raw source anchors (fetched lazily from the live page)
def ext(e,r):
    pass
with cf.ThreadPoolExecutor(6) as ex:
    for res in ex.map(check,idx): store[res['slug']]=res
json.dump(store,open(store_p,'w'))
cols=['slug','route','type','url','title','description','canonical','robots','og','twitter','jsonld','wp_content_in_head','breadcrumb_schema','breadcrumb_visible','headings','h1_count','images_kept','images_alt','images_dims','images_main_eager','ext_links','hreflang_pagination','dates','notes']
pub={e['slug'] for e in json.load(open(R/'content/_index.json')) if e['published']}
with open(R/'audit/17-seo-parity.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(cols)
    for k in sorted(store):
        if k in pub: w.writerow([ (' | '.join(store[k]['notes']) if c=='notes' else store[k].get(c,'')) for c in cols])
sel=[store[e['slug']] for e in idx]
chk=[c for c in cols[3:] if c not in('notes','h1_count')]
print('pages checked',len(sel))
for c in chk:
    cnt={}
    for r in sel: cnt[r.get(c,'')]=cnt.get(r.get(c,''),0)+1
    print(f'{c:22}',cnt)
