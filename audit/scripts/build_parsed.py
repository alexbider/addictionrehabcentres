import sys, json, re, collections
sys.path.insert(0,'scripts')
import parse, classify
from urllib.parse import urlparse
S='https://addictionrehabcenters.ca'
def norm(u):
    u=u.split('#')[0].split('?')[0]
    return u if u.endswith('/') else u+'/'
seed={}   # url -> dict(seed types)
def add(u,t,src):
    u=norm(u); d=seed.setdefault(u,{'url':u,'seed_types':set(),'sitemaps':set(),'rest':[]}); d['seed_types'].add(t); d['sitemaps'].add(src)
for f,t in [('page','page'),('post','post'),('listing-item','listing-item'),('category','category'),('listing-category','listing-category'),('listing-location','listing-location')]:
    for l in open(f'src/{f}.urls'): add(l.strip(),t,f+'-sitemap')
rest={}
for t,wt in [('pages','page'),('posts','post')]:
    for x in json.load(open(f'data/rest_{t}.json')):
        u=norm(x['link']); 
        if u=='https://addictionrehabcenters.ca//': u=S+'/'
        add(u,wt,'rest-api'); seed[u]['rest'].append({'id':x['id'],'type':wt,'title':x['title']['rendered'],'date':x['date'],'modified':x['modified'],'status':x['status'],'yoast_title':x.get('yoast_head_json',{}).get('title','') if x.get('yoast_head_json') else '','words_rest':len(re.sub(r'<[^>]+>',' ',x['content']['rendered']).split())})
# home nav / footer cross-check
home=parse.load_html(S+'/')
nav_links=set()
if home:
    from bs4 import BeautifulSoup
    d=BeautifulSoup(home,'lxml')
    for sel in ['#menu-new-main-menu','header','footer','.eltdf-mobile-nav','.eltdf-page-footer','nav']:
        for a in d.select(sel+' a[href]'):
            p=parse.path_of(a['href'] if a['href'].startswith('http') else S+a['href'])
            if p and not p.startswith(('/wp-','/cdn-cgi')) and not a['href'].startswith(('#','mailto','tel')): nav_links.add(S+p)
json.dump(sorted(nav_links),open('data/nav_links.json','w'))
out=[]; missing=[]
for u,d in sorted(seed.items()):
    html=parse.load_html(u)
    seedt=sorted(d['seed_types'])[0] if len(d['seed_types'])==1 else ('page' if 'page' in d['seed_types'] else sorted(d['seed_types'])[0])
    if html is None: missing.append(u); rec={'url':u,'path':parse.path_of(u),'wp_type':seedt,'no_html':True}
    else:
        bc=re.search(r'<body[^>]*class="([^"]*)"',html); bc=bc.group(1) if bc else ''
        live='listing-item' if 'single-listing-item' in bc else 'listing-location' if 'tax-listing-location' in bc else 'listing-category' if 'tax-listing-category' in bc else 'category' if 'category' in bc.split() and 'archive' in bc.split() else 'post' if 'single-post' in bc else 'page' if re.search(r'\bpage\b',bc) else seedt
        rec=parse.parse(u,html,live); rec['seed_type']=seedt
        if live=='category' and 'archive' not in bc: pass
    rec['in_sitemap']=any(s.endswith('sitemap') for s in d['sitemaps']); rec['sitemaps']=sorted(d['sitemaps']); rec['rest']=d['rest']
    rec['in_nav_footer']=u in nav_links
    out.append(rec)
json.dump(out,open('data/parsed.json','w'),ensure_ascii=False)
print(len(out),'records; missing html:',len(missing))
print(collections.Counter(r.get('wp_type') for r in out))
print('nav/footer links not in registry:',sorted(l for l in nav_links if norm(l) not in seed)[:40])
