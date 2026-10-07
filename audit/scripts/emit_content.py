import json,re,sys,os,copy,shutil,hashlib,collections,csv
sys.path.insert(0,'scripts'); import parse
from bs4 import BeautifulSoup, NavigableString, Tag
from urllib.parse import urlparse, urljoin, unquote
AUDIT='/Users/mac/Downloads/arc-next/audit'
S='https://addictionrehabcenters.ca'
R=json.load(open('data/final.json')); plan=json.load(open('data/image_plan.json'))
byurl={r['url']:r for r in R}; bypath={r['path']:r for r in R}
clean=parse.clean
UNK=json.load(open('data/unknown_links.json'))
INFO=json.load(open('data/imginfo.json')) if os.path.exists('data/imginfo.json') else {}
REDIR={}
for r in R:
    if r['page_type']=='province-archive': REDIR[r['path']]='/%s/'%r['slug']
    if r['page_type']=='blog-category': REDIR[r['path']]='/blog/'
REDIR['/listing-category/quebec-rehabs/']='/drug-alcohol-rehabs-in-quebec/'
REDIR['/search-listing/']='/'
def map_link(href):
    h=(href or '').strip()
    if not h: return {'kind':'empty','new':h}
    if h.startswith('tel:') or h.startswith('mailto:'): return {'kind':h.split(':')[0],'new':h}
    if h.startswith('#'): return {'kind':'anchor','new':h}
    u=urljoin(S+'/',h); p=urlparse(u)
    host=p.netloc.lower().replace('www.','')
    if host!='addictionrehabcenters.ca': return {'kind':'external','new':h}
    path=unquote(p.path) or '/'
    if '/wp-content/' in path: return {'kind':'asset','new':path}
    pp=path if path.endswith('/') else path+'/'
    frag=('#'+p.fragment) if p.fragment else ''
    t=bypath.get(pp)
    if t is None:
        if re.match(r'^/(listing-tag|listing-amenity)/',pp) or re.match(r'^/\d{4}/\d{2}/',pp) or pp.startswith('/category/') or pp.startswith('/author/'):
            return {'kind':'taxonomy-dropped','new':pp+frag,'target_status':'NOT NEEDED','note':'taxonomy/date archive not in sitemap; render as plain label or drop link'}
        c=UNK['chk'].get(pp.rstrip('/') if pp=='/0/' else pp)
        if c and c[0] in(301,302) and c[1]:
            tp=urlparse(c[1]).path or '/'
            return {'kind':'source-redirect','new':tp,'target_status':'redirected on source','note':'source 301s %s -> %s'%(pp,tp)}
        return {'kind':'internal-unknown','new':path+frag,'note':'path not found in source registry'}
    if t['status'] in('REMAINING','BUILT'): return {'kind':'internal','new':pp+frag,'target_status':t['status']}
    if pp in REDIR: return {'kind':'internal-redirect','new':REDIR[pp]+frag,'target_status':'NOT NEEDED -> 301','note':t['status_reason']}
    return {'kind':'internal-dropped','new':pp+frag,'target_status':'NOT NEEDED','note':t['status_reason']}
def rewrite_html(frag):
    s=BeautifulSoup(frag,'lxml')
    for a in s.find_all('a',href=True):
        m=map_link(a['href'])
        if m['kind'] in('internal','internal-redirect','internal-dropped','internal-unknown','asset','source-redirect','taxonomy-dropped'): a['href']=m['new']
    b=s.find('body'); return b.decode_contents() if b else str(s)
BLOCK={'h1','h2','h3','h4','h5','h6','p','ul','ol','table','blockquote','iframe','dl','pre','figure'}
def inner(el): return el.decode_contents().strip()
def img_info(i): 
    r=parse.img_rec(i,'content'); return {'type':'image','src':r['src_original'],'alt':r['alt'],'width':r['width'],'height':r['height']}
def blocks_of(el):
    out=[]
    for ch in el.children:
        if isinstance(ch,NavigableString):
            t=clean(str(ch))
            if t: out.append({'type':'text','text':t})
            continue
        if not isinstance(ch,Tag): continue
        n=ch.name
        if n in('script','style','noscript','form','svg'): continue
        if n in BLOCK:
            if n=='p':
                if not clean(ch.get_text()) and ch.find('img'):
                    for i in ch.find_all('img'): out.append(img_info(i))
                    continue
                if not clean(ch.get_text()): continue
            if n=='ul' or n=='ol':
                items=[{'text':clean(li.get_text()),'html':rewrite_html(inner(li)),'links':[{'old':a['href'],'text':clean(a.get_text())} for a in li.find_all('a',href=True)]} for li in ch.find_all('li',recursive=False)]
                out.append({'type':n,'ordered':n=='ol','items':items}); continue
            if n=='iframe': out.append({'type':'iframe','src':ch.get('src') or ch.get('data-src') or '','title':ch.get('title','')}); continue
            if n=='figure':
                for tb in ch.find_all('table'): out.append({'type':'table','text':clean(tb.get_text()),'html':rewrite_html(str(tb))})
                for i in ch.find_all('img'): out.append(img_info(i))
                cap=ch.find('figcaption')
                if cap: out.append({'type':'p','text':clean(cap.get_text()),'html':inner(cap),'links':[]})
                continue
            b={'type':n,'text':clean(ch.get_text()),'html':rewrite_html(inner(ch)) if n!='table' else rewrite_html(str(ch))}
            if n[0]=='h' and len(n)==2: b['id']=ch.get('id','')
            if n in('p','blockquote'): b['links']=[{'old':a['href'],'text':clean(a.get_text())} for a in ch.find_all('a',href=True)]; b['images']=[img_info(i)['src'] for i in ch.find_all('img')]
            out.append(b); continue
        if n=='a':
            if clean(ch.get_text()): out.append({'type':'link','text':clean(ch.get_text()),'href':ch.get('href',''),'new_href':map_link(ch.get('href',''))['new']})
            elif ch.find('img'):
                for i in ch.find_all('img'): d=img_info(i); d['link_href']=ch.get('href',''); out.append(d)
            continue
        if n=='img': out.append(img_info(ch)); continue
        out+=blocks_of(ch)
    return out
def sections_of(blocks):
    root={'level':0,'heading':None,'blocks':[],'children':[]}; stack=[root]
    for b in blocks:
        if b['type'] in('h1','h2','h3','h4','h5','h6'):
            lv=int(b['type'][1]); 
            while len(stack)>1 and stack[-1]['level']>=lv: stack.pop()
            sec={'level':lv,'heading':b['text'],'blocks':[],'children':[]}; stack[-1]['children'].append(sec); stack.append(sec)
        else: stack[-1]['blocks'].append(b)
    return root
BOILER={'more tags','business hours','social','sponsored ad','let us help you'}
def faqs_dom(body):
    res=[]
    for it in body.select('.elementor-toggle-item, .elementor-accordion-item'):
        q=it.select_one('.elementor-toggle-title, .elementor-accordion-title, .elementor-tab-title'); a=it.select_one('.elementor-tab-content')
        if q and a: res.append({'question':clean(q.get_text()),'answer_text':clean(a.get_text()),'answer_html':rewrite_html(a.decode_contents().strip()),'source':'elementor-toggle'})
    return res
def faqs_of(root):
    res=[]
    def rec(sec):
        if sec['heading'] and re.search(r'faq|frequently asked|common questions',sec['heading'],re.I):
            for q in [c for c in sec['children'] if c['heading'].strip().lower() not in BOILER]:
                ans=[b['text'] for b in q['blocks'] if 'text' in b and b['text']]
                for g in q['children']: ans+= [b['text'] for b in g['blocks'] if b.get('text')]
                res.append({'question':q['heading'],'answer_blocks':q['blocks'],'answer_text':' '.join(ans)})
            if not sec['children']:
                pass
        for c in sec['children']: rec(c)
    rec(root); return res
def rows_of(body):
    rows=[]
    for row in body.select('.vc_row'):
        if row.find_parent(class_='vc_row'): continue
        cl=[c for c in row.get('class',[]) if c not in('vc_row','wpb_row','vc_row-fluid')]
        kind=('hero-banner' if 'newInnerBanner' in cl else 'listing-banner' if 'innerBanner' in cl else 'content' if 'innerContent' in cl else 'cta-banner' if any(c in cl for c in('newHomeBanner','bottomHomeBanner','innerBottomBanner')) else 'help-block' if 'innerBlueContent' in cl else 'listing' if 'innerListingBox' in cl else 'row')
        cols=[]
        for col in row.select('.wpb_column'):
            if col.find_parent(class_='wpb_column') and col.find_parent(class_='wpb_column').find_parent(class_='vc_row')==row and False: continue
            ccl=[c for c in col.get('class',[]) if c.startswith(('vc_col','innerContent'))]
            ect=[c for t in col.select('.wpb_text_column') for c in t.get('class',[]) if c.startswith(('innerContent','newHome','inner'))]
            bl=blocks_of(col) if not col.select('.wpb_column') else []
            if bl or not col.select('.wpb_column'): cols.append({'classes':ccl+ect,'blocks':bl})
        if not cols: cols=[{'classes':[],'blocks':blocks_of(row)}]
        rows.append({'kind':kind,'classes':cl,'columns':cols})
    return rows
def post_meta(r):
    m={'published':r.get('published') or (r['rest'][0]['date'] if r.get('rest') else ''),'modified':r.get('modified') or (r['rest'][0]['modified'] if r.get('rest') else ''),'date_label':r.get('post_date',''),'categories':r.get('post_categories',[]),'featured_image':r.get('og_image','')}
    for g in r.get('jsonld',[]):
        for n in (g.get('@graph') or [g]):
            ty=n.get('@type'); ty=ty if isinstance(ty,list) else [ty]
            if 'Article' in ty or 'BlogPosting' in ty:
                m['jsonld_author']=(n.get('author') or {}).get('name') if isinstance(n.get('author'),dict) else None; m['jsonld_wordCount']=n.get('wordCount'); m['jsonld_thumbnailUrl']=n.get('thumbnailUrl')
    return m
def centre_extra(r):
    h=parse.load_html(r['url']); d=BeautifulSoup(h,'lxml'); cont=d.select_one('.eltdf-content'); c=copy.deepcopy(r['centre'])
    revs=[]
    for rv in cont.select('.grw-review'):
        st=rv.select_one('.rpi-stars'); m=re.search(r'--rating:\s*([\d.]+)',st.get('style','')) if st else None
        n=rv.select_one('.wp-google-name'); tm=rv.select_one('.wp-google-time'); tx=rv.select_one('.wp-google-text'); im=rv.select_one('img.grw-img')
        revs.append({'author':clean(n.get_text()) if n else '','rating':float(m.group(1)) if m else None,'time_label':clean(tm.get_text()) if tm else '','time_epoch':tm.get('data-time') if tm else '','text':clean(tx.get_text()) if tx else '','avatar_url_not_downloaded':im.get('src') if im else ''})
    hd=cont.select_one('.grw-header .rpi-stars'); 
    c['google_reviews']={'rating':float(re.search(r'--rating:\s*([\d.]+)',hd['style']).group(1)) if hd and hd.get('style') and re.search(r'--rating:\s*([\d.]+)',hd['style']) else None,'items':revs}
    for title in ('More Tags','Business Hours'):
        e=[x for x in cont.find_all(['h4','h5']) if clean(x.get_text())==title]
        if e:
            par=e[0].find_parent(class_='eltdf-ls-title-holder') or e[0].parent; sib=par.find_next_sibling()
            c[title.lower().replace(' ','_')]=clean(sib.get_text(' ')) if sib else ''
    return c
def build(r):
    pt=r['page_type']; sl=plan['slugs'][r['url']]
    body=BeautifulSoup(r['body_html'],'lxml').find('body')
    if body is None: body=BeautifulSoup('<div></div>','lxml')
    for a in body.select('article'): 
        if pt in('province','city','city-archive'): a.decompose()
    blocks=blocks_of(body)
    root=sections_of(blocks)
    links=[]
    for l in r.get('links',[]):
        m=map_link(l['href']); links.append({'old_href':l['href'],'text':l['text'],**m})
    loc=plan['pages'][r['url']]
    imgs=[]
    from image_plan import page_images
    for i in page_images(r):
        u=i['src_original']; inf=INFO.get(u,{}); lp=loc.get(u)
        imgs.append({'role':i.get('role'),'original_url':u,'local_path':lp if inf.get('status')=='ok' else None,'alt':i.get('alt',''),'width':inf.get('width') or i.get('width'),'height':inf.get('height') or i.get('height'),'download':inf.get('status','pending'),**({'note':inf['note']} if inf.get('note') else {})})
    d={'schema':'arc-content/1','slug':sl,'status':r['status'],'page_type':pt,'wp_type':r['wp_type'],'template':r['template'],'fit':r['fit'],'template_change_codes':r['changes'],
       'source':{'url':r['url'],'path':r['path'],'wp_items':r.get('rest',[]),'in_sitemap':r['in_sitemap'],'in_nav_footer':r['in_nav_footer'],'robots':r.get('robots','')},
       'new_route':r['path'],
       'seo':{'meta_title':r['meta_title'],'meta_description':r['meta_description'],'canonical_source':r['canonical'],'og':{'title':r.get('og_title',''),'description':r.get('og_description',''),'image':r.get('og_image',''),'type':r.get('og_type','')},'jsonld_source':r.get('jsonld',[])},
       'h1':r.get('h1',''),'title_bar_h1':r.get('title_bar_h1',''),'word_count':r.get('word_count',0),'features':r['features'],'dup_note':r['dup_note'],
       'headings':r.get('headings',[]),'images':imgs,'links':links,'sections':root['children'] if root['blocks']==[] else [{'level':0,'heading':None,'blocks':root['blocks'],'children':[]}]+root['children'],'blocks':blocks}
    if r['layout']=='L1-banner-content' or r['layout']=='L2-listing':
        rows=rows_of(body); d['rows']=rows
        for rw,rr in zip(rows,r.get('rows',[])): rw['background_image']=rr.get('bg_image','') if rr.get('bg_image') else ''
        hero=next((rw for rw in rows if rw['kind']=='hero-banner'),None)
        d['hero']={'h1':r.get('h1',''),'background_image':hero.get('background_image','') if hero else ''}
    if pt=='blog-post': d['post']=post_meta(r)
    if pt=='centre': d['centre']=centre_extra(r)
    if r.get('cards'): 
        d['cards']=r['cards']
        if pt in('province','city','city-archive'):
            d['template_data']={'raw':[[c['name'],c['href'].replace(S,'').strip('/'),c['address'],c.get('excerpt',''),c.get('reviews',''),c.get('rating',0),'',[c.get('category')] if c.get('category') else []] for c in r['cards']],'note':'tuple order = Province.jsx raw: [name, slug, address, excerpt, reviewsLabel, rating, city, tags]'}
    if pt=='city-archive': d['city']={'intro_text':r.get('intro_text',''),'result_count':r.get('result_count',''),'faq_text_placeholder':r.get('faq_text','')}
    fq=faqs_dom(body) or faqs_of(root)
    if fq: d['faqs']=fq
    d['raw_html']=r['body_html']
    return d
if __name__=='__main__':
    os.makedirs(AUDIT+'/content',exist_ok=True)
    names=collections.Counter(plan['slugs'].values()); n=0
    for r in R:
        if r['status']!='REMAINING': continue
        d=build(r); fn=plan['slugs'][r['url']]
        json.dump(d,open(f'{AUDIT}/content/{fn}.json','w'),ensure_ascii=False,indent=1); n+=1
    print('content json',n)
