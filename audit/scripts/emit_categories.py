"""Emit audit/content/category__<slug>[__page-N].json for source /category/ archives with >= 3 posts (fewer = thin, 301 to /blog/)."""
import json,re,urllib.request,time
from bs4 import BeautifulSoup
from pathlib import Path
R=Path(__file__).resolve().parents[2]
cats=json.load(open(R/'audit/data/categories.json'))
made=[];thin=[]
def meta(s,n,a='name'):
    m=s.find('meta',attrs={a:n}); return m['content'] if m and m.get('content') else ''
for p,c in cats.items():
    total=sum(len(x['posts']) for x in c['pages']); slug=p.strip('/').split('/')[1]
    if total<3: thin.append((p,total)); continue
    name=re.sub(r'\s*Archives.*$','',c['pages'][0]['title'].split(' - ')[0]).replace(' Archives','') or c['h1']
    for pg in c['pages']:
        n=pg['n']; route=p if n==1 else f'{p}page/{n}/'
        h=urllib.request.urlopen(urllib.request.Request(pg['url'],headers={'User-Agent':'Mozilla/5.0'}),timeout=60).read().decode('utf8','replace'); time.sleep(1)
        s=BeautifulSoup(h,'html.parser'); key=f'category__{slug}'+('' if n==1 else f'__page-{n}')
        d={'schema':'1','slug':key,'status':'ok','page_type':'category','wp_type':'category','template':'(none)','fit':'blog listing','template_change_codes':[],
           'source':{'url':pg['url'],'path':route,'wp_items':[],'in_sitemap':True,'in_nav_footer':False,'robots':meta(s,'robots')},'new_route':route,
           'seo':{'meta_title':s.title.get_text(strip=True),'meta_description':meta(s,'description'),'canonical_source':(s.find('link',rel='canonical') or {}).get('href',pg['url']),
                  'og':{'title':meta(s,'og:title','property'),'description':meta(s,'og:description','property'),'image':meta(s,'og:image','property'),'type':meta(s,'og:type','property')},'jsonld_source':[]},
           'h1':name,'title_bar_h1':name,'word_count':400,'features':[],'dup_note':'','headings':[['h1',name]],'images':[],'links':[],'sections':[],'blocks':[],'rows':[],'hero':{'h1':name,'background_image':None},'raw_html':'',
           'category':{'slug':slug,'name':name,'page':n,'pages':len(c['pages']),'posts':pg['posts'],'total':total}}
        json.dump(d,open(R/f'audit/content/{key}.json','w')); made.append(key)
print(len(made),'pages;',len(thin),'thin:',thin)
json.dump(thin,open(R/'audit/data/categories-thin.json','w'))
