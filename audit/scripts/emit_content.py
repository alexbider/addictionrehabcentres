import json,re,sys,os,copy,shutil,hashlib,collections,csv
sys.path.insert(0,'scripts'); import parse
from bs4 import BeautifulSoup, NavigableString, Tag, Comment, Doctype
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
STRICT=[False]; CUR=['']; DROPPED=[]
NEVER={'/dual-diagnosis-treatment/','/prescription-drug-addiction-treatment/'}  # approved: pages that are never built — unwrap on every page, keep the text
def never(h):
    m=map_link(h); return m['new'].split('#')[0] in NEVER
def decide(href):
    """(keep, new_href, reason). Used for blog posts: archive/redirect/unmigrated links lose the anchor but keep their text."""
    m=map_link(href); k=m['kind']
    if k in('tel','mailto','external','anchor','empty'): return True,href,''
    if k=='asset': return False,'','link to an uploaded file'
    if k=='taxonomy-dropped': return False,'','category/tag/amenity/date archive'
    if k=='internal-redirect':
        if m['new'].split('#')[0]=='/blog/': return False,'','category archive'
        return True,m['new'],''
    if k=='internal-dropped': return False,'','page not migrated (%s)'%m.get('note','')[:60]
    if k=='source-redirect':
        tp=m['new'].split('#')[0]
        if tp=='/': return False,'','source redirects this URL to the home page'
        tr=bypath.get(tp)
        if tr is not None and tr['status']=='NOT NEEDED': return False,'','redirect target not migrated'
        return True,m['new'],''
    if k=='internal-unknown': return False,'','URL not in the source sitemap/registry'
    return True,m['new'],''
def rewrite_html(frag):
    s=BeautifulSoup(frag,'lxml')
    for a in list(s.find_all('a',href=True)):
        if STRICT[0]:
            keep,new,why=decide(a['href'])
            if not keep:
                DROPPED.append({'page':CUR[0],'href':a['href'],'text':clean(a.get_text()),'reason':why}); a.unwrap(); continue
            a['href']=new; continue
        if never(a['href']):
            DROPPED.append({'page':CUR[0],'href':a['href'],'text':clean(a.get_text()),'reason':'page never built (approved)'}); a.unwrap(); continue
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
        if isinstance(ch,(Comment,Doctype)): continue
        if isinstance(ch,NavigableString):
            t=clean(str(ch))
            if t: out.append({'type':'text','text':t})
            continue
        if not isinstance(ch,Tag): continue
        n=ch.name
        if n in('script','style','noscript','form','svg'): continue
        cls=ch.get('class') or []
        if n=='article' and 'eltdf-ll-item' in cls:
            if not out or out[-1].get('type')!='cards':
                hs=[]
                for a in ch.parent.select(':scope > article.eltdf-ll-item'):
                    l=a.select_one('.eltdf-lli-title a')
                    if l and l['href'] not in hs: hs.append(l['href'])
                out.append({'type':'cards','hrefs':hs,'_holder_first':hs[0] if hs else ''})
            continue
        if 'eltdf-ll-load-more' in cls: continue
        if n=='x-tabs':
            tabs=[]
            for tb in ch.find_all('x-tab',recursive=False): tabs.append({'title':tb.get('data-title',''),'blocks':blocks_of(tb)})
            out.append({'type':'tabs','tabs':tabs}); continue
        if n=='x-accordion':
            items=[]
            for it in ch.find_all('x-item',recursive=False): items.append({'title':it.get('data-title',''),'blocks':blocks_of(it)})
            out.append({'type':'accordion','items':items}); continue
        if n=='x-cards':
            out.append({'type':'centre-cards','items':json.loads(ch.get('data-json','[]'))}); continue
        if n=='x-video': out.append({'type':'video','provider':ch.get('data-provider',''),'url':ch.get('data-url',''),'id':ch.get('data-id','')}); continue
        if n in BLOCK:
            if n=='p':
                if not clean(ch.get_text()) and ch.find('img'):
                    for i in ch.find_all('img'): out.append(img_info(i))
                    continue
                if not clean(ch.get_text()): continue
            if n=='ul' or n=='ol':
                items=[{'text':clean(li.get_text()),'html':rewrite_html(inner(li)),'links':[{'old':a['href'],'text':clean(a.get_text())} for a in li.find_all('a',href=True)]} for li in ch.find_all('li',recursive=False)]
                out.append({'type':n,'ordered':n=='ol','items':items}); continue
            if n=='iframe': out.append({'type':'iframe','src':ch.get('src') or ch.get('data-src') or '','title':ch.get('title',''),'width':ch.get('width'),'height':ch.get('height')}); continue
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
            if clean(ch.get_text()):
                if STRICT[0]:
                    keep,new,why=decide(ch.get('href',''))
                    if not keep:
                        DROPPED.append({'page':CUR[0],'href':ch.get('href',''),'text':clean(ch.get_text()),'reason':why}); out.append({'type':'text','text':clean(ch.get_text()),'was_link':True}); continue
                    out.append({'type':'link','text':clean(ch.get_text()),'href':ch.get('href',''),'new_href':new})
                elif never(ch.get('href','')):
                    DROPPED.append({'page':CUR[0],'href':ch.get('href',''),'text':clean(ch.get_text()),'reason':'page never built (approved)'}); out.append({'type':'text','text':clean(ch.get_text()),'was_link':True})
                else: out.append({'type':'link','text':clean(ch.get_text()),'href':ch.get('href',''),'new_href':map_link(ch.get('href',''))['new']})
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
            anc=col.find_parent(class_='wpb_column')
            if anc is not None and row in anc.parents: continue   # nested column: its blocks are part of the outer column, in source order
            bl=blocks_of(col)
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

def centre_full(r,c):
    """Clean, structured centre data (no Elementor markup). Reviews widgets, share buttons, spacers, the enquiry button and the live clock are not carried over."""
    d=BeautifulSoup(parse.load_html(r['url']),'lxml'); cont=d.select_one('.eltdf-content')
    for x in cont(['script','noscript','style']): x.decompose()
    parse.decode_emails(cont)
    ci=cont.select_one('.eltdf-ls-content-inner')
    work=BeautifulSoup(str(ci),'lxml').find(True) if ci else BeautifulSoup('<div></div>','lxml').find('div')
    # FAQ accordions (Elementor toggle) -> structured items; the heading widget just before them is the FAQ title
    faq_heading=''; faqs=[]
    for tg in work.select('.elementor-widget-toggle'):
        hd=tg.find_previous(class_='elementor-widget-heading')
        if hd is not None and re.search(r'frequently|faq',hd.get_text(),re.I) and not faq_heading:
            faq_heading=clean(hd.get_text()); hd.decompose()
        for it in tg.select('.elementor-toggle-item'):
            q=it.select_one('.elementor-toggle-title'); a=it.select_one('.elementor-tab-content')
            if q and a: faqs.append({'question':clean(q.get_text()),'answer_blocks':blocks_of(BeautifulSoup(str(a),'lxml').find(True)),'answer_text':clean(a.get_text())})
        tg.decompose()
    # widgets that are not content
    for sel in ['.elementor-widget-spacer','.elementor-widget-divider','.elementor-widget-share-buttons','.specialAmenities','.wp-gr','[class*="grw-"]']:
        for x in work.select(sel): x.decompose()
    for w in work.select('.elementor-widget-video'):
        try: u=json.loads(w.get('data-settings','{}')).get('youtube_url','')
        except Exception: u=''
        m=re.search(r'(?:youtu\.be/|v=|embed/)([A-Za-z0-9_-]{6,})',u)
        if m:
            tag=BeautifulSoup('<x-video></x-video>','lxml').find('x-video'); tag['data-provider']='youtube'; tag['data-url']=u; tag['data-id']=m.group(1); w.replace_with(tag)
        else: w.decompose()
    for g in work.select('.elementor-widget-gallery'):
        new=BeautifulSoup('<div></div>','lxml').find('div')
        for it in g.select('.e-gallery-image[data-thumbnail]'):
            im=BeautifulSoup('<img/>','lxml').find('img'); im['src']=it['data-thumbnail']; im['alt']=it.get('aria-label') or ''; im['width']=it.get('data-width') or ''; im['height']=it.get('data-height') or ''; new.append(im)
        g.replace_with(new)
    c['about_blocks']=blocks_of(work)
    c['faq_heading']=faq_heading; c['faqs']=faqs
    # specialties / amenities (headings as the source words them)
    sa=ci.select_one('.specialAmenities') if ci else None
    groups=[]; cur=None
    for e in (sa.descendants if sa else []):
        if not isinstance(e,Tag): continue
        if e.name=='h4':
            cur={'heading':clean(e.get_text()),'items':[],'text':''}; groups.append(cur); continue
        leaf=(e.name=='li') or (e.name=='p') or (e.name=='div' and 'text' in (e.get('class') or []))
        if leaf and e.find(['p','div','li']) is None and clean(e.get_text()):
            if cur is None: cur={'heading':'','items':[],'text':''}; groups.append(cur)
            cur['items'].append(clean(e.get_text()))
    for am in cont.select('.eltdf-ls-amenities'):   # theme-native amenities block (3 centres)
        hh=am.select_one('.eltdf-ls-parts-title'); its=[clean(x.get_text()) for x in am.select('.eltdf-ls-amenity-label') if clean(x.get_text())]
        if its: groups.append({'heading':clean(hh.get_text()) if hh else '','items':its,'text':''})
    groups=[g for g in groups if g['heading'] or g['items']]
    c['specialty_groups']=groups
    ai=[]
    for it in cont.select('.eltdf-ls-ai-item'):
        l=it.select_one('.eltdf-ls-ai-label'); v=it.select_one('.eltdf-ls-ai-value')
        lt=clean(l.get_text()) if l else ''; vt=clean(v.get_text()) if v else ''
        if vt or lt: ai.append({'label':lt,'value':vt})
    c['info_items']=ai
    # contact
    ph=cont.select_one('.eltdf-ls-location-phone-link'); c['phone_text']=clean(ph.get_text()) if ph else ''; c['phone_href']=ph['href'] if ph else ''
    w=cont.select_one('.eltdf-ls-location-site-url-link'); c['website_text']=clean(w.get_text()) if w else ''
    soc=cont.select_one('.eltdf-ls-location-social'); c['social_title']=clean(soc.select_one('.eltdf-ls-location-social-title').get_text()) if soc and soc.select_one('.eltdf-ls-location-social-title') else ''
    # business hours
    hrs=[]
    for it in cont.select('.eltdf-ls-bg-item'):
        day=it.select_one('.eltdf-ls-bg-day'); tm=it.select_one('.eltdf-ls-bg-time')
        hrs.append([clean(day.get_text()) if day else '',clean(tm.get_text(' ')) if tm else ''])
    bl=cont.select_one('.eltdf-ls-business-label'); c['hours']={'heading':clean(bl.get_text()) if bl else '','rows':hrs}
    # tags
    tg=cont.select_one('.eltdf-ls-tags'); th=tg.select_one('.eltdf-ls-parts-title') if tg else None
    c['tags']={'heading':clean(th.get_text()) if th else '','items':[clean(a.get_text()) for a in tg.select('.eltdf-ls-tag-label')] if tg else []}
    # sponsored ad (identical on every centre page)
    ad=cont.select_one('.eltdf-ls-ads')
    if ad:
        im=ad.select_one('img'); ti=ad.select_one('.eltdf-ls-ads-title'); tx=ad.select_one('.eltdf-ls-ads-text'); lk=ad.select_one('a.eltdf-ls-ads-link[href]'); hd=ad.select_one('.eltdf-ls-parts-title')
        c['sponsor']={'label':clean(hd.get_text()) if hd else '','title':clean(ti.get_text()) if ti else '','text_html':tx.decode_contents().strip() if tx else '','text':clean(tx.get_text()) if tx else '','href':lk['href'] if lk else '','image':parse.img_rec(im,'content') if im else None}
    return c

def home_prep(body):
    """Home page: turn the theme tabs / accordions / listing grids into plain markers that blocks_of understands."""
    for tb in body.select('.eltdf-tabs'):
        nav=[clean(a.get_text()) for a in tb.select('ul.eltdf-tabs-nav li a')]
        new=BeautifulSoup('<x-tabs></x-tabs>','lxml').find('x-tabs')
        for title,cont in zip(nav,tb.select('div.eltdf-tab-container')):
            x=BeautifulSoup('<x-tab></x-tab>','lxml').find('x-tab'); x['data-title']=title
            for c in list(cont.children): x.append(copy.copy(c))
            new.append(x)
        tb.replace_with(new)
    for ac in body.select('.eltdf-accordion-holder'):
        new=BeautifulSoup('<x-accordion></x-accordion>','lxml').find('x-accordion')
        for ti in ac.select(':scope > .eltdf-accordion-title'):
            ct=ti.find_next_sibling('div',class_='eltdf-accordion-content')
            x=BeautifulSoup('<x-item></x-item>','lxml').find('x-item'); x['data-title']=clean(ti.get_text())
            if ct is not None:
                for c in list(ct.children): x.append(copy.copy(c))
            new.append(x)
        ac.replace_with(new)
    for h in body.select('.eltdf-listing-list-holder'):
        items=[]
        for a in h.select('article.eltdf-ll-item'):
            t_=a.select_one('.eltdf-lli-title'); l=t_.select_one('a') if t_ else None
            im=a.select_one('.eltdf-lli-image img'); ad=a.select_one('.eltdf-lli-location-address'); ex=a.select_one('.eltdf-lli-excerpt'); cat=a.select_one('.eltdf-lli-category')
            r_=parse.img_rec(im,'card') if im else None
            items.append({'name':clean(t_.get_text()) if t_ else '','href':l['href'] if l else '','address':clean(ad.get_text()) if ad else '','excerpt':clean(ex.get_text()) if ex else '','category':clean(cat.get_text()) if cat else '','image':({'original_url':r_['src_original'].split('?')[0],'alt':r_['alt'],'width':r_['width'],'height':r_['height']} if r_ else None)})
        x=BeautifulSoup('<x-cards></x-cards>','lxml').find('x-cards'); x['data-json']=json.dumps(items,ensure_ascii=False); h.replace_with(x)
def build(r):
    pt=r['page_type']; sl=plan['slugs'].get(r['url']) or r['slug'] or 'home'
    STRICT[0]=(pt in('blog-post','centre')); CUR[0]=r['path']
    body=BeautifulSoup(r['body_html'],'lxml').find('body')
    if body is None: body=BeautifulSoup('<div></div>','lxml')
    if r['path']=='/': home_prep(body)
    blocks=blocks_of(body)
    root=sections_of(blocks)
    links=[]
    for l in r.get('links',[]):
        m=map_link(l['href']); links.append({'old_href':l['href'],'text':l['text'],**m})
    loc=plan['pages'].get(r['url'],{})
    imgs=[]
    from image_plan import page_images
    for i in (page_images(r) if r['url'] in plan['pages'] else []):
        u=i['src_original']; inf=INFO.get(u,{}); lp=loc.get(u)
        imgs.append({'role':i.get('role'),'original_url':u,'local_path':lp if inf.get('status')=='ok' else None,'alt':i.get('alt',''),'width':inf.get('width') or i.get('width'),'height':inf.get('height') or i.get('height'),'download':inf.get('status','pending'),**({'note':inf['note']} if inf.get('note') else {})})
    d={'schema':'arc-content/1','slug':sl,'status':r['status'],'page_type':pt,'wp_type':r['wp_type'],'template':r['template'],'fit':r['fit'],'template_change_codes':r['changes'],
       'source':{'url':r['url'],'path':r['path'],'wp_items':r.get('rest',[]),'in_sitemap':r['in_sitemap'],'in_nav_footer':r['in_nav_footer'],'robots':r.get('robots','')},
       'new_route':r['path'],
       'seo':{'meta_title':r['meta_title'],'meta_description':r['meta_description'],'canonical_source':r['canonical'],'og':{'title':r.get('og_title',''),'description':r.get('og_description',''),'image':r.get('og_image',''),'type':r.get('og_type','')},'jsonld_source':r.get('jsonld',[])},
       'h1':r.get('h1',''),'title_bar_h1':r.get('title_bar_h1',''),'word_count':r.get('word_count',0),'features':r['features'],'dup_note':r['dup_note'],
       'headings':r.get('headings',[]),'images':imgs,'links':links,'sections':root['children'] if root['blocks']==[] else [{'level':0,'heading':None,'blocks':root['blocks'],'children':[]}]+root['children'],'blocks':blocks}
    if r['layout']=='L1-banner-content' or r['layout']=='L2-listing' or r['path']=='/':
        rows=rows_of(body); d['rows']=rows
        for rw,rr in zip(rows,r.get('rows',[])): rw['background_image']=rr.get('bg_image','') if rr.get('bg_image') else ''
        hero=next((rw for rw in rows if rw['kind']=='hero-banner'),None)
        d['hero']={'h1':r.get('h1',''),'background_image':hero.get('background_image','') if hero else ''}
    if pt=='blog-post': d['post']=post_meta(r)
    if pt=='centre': d['centre']=centre_full(r,centre_extra(r))
    if r.get('cards'): 
        d['cards']=r['cards']
        if pt in('province','city','city-archive'):
            d['template_data']={'raw':[[c['name'],c['href'].replace(S,'').strip('/'),c['address'],c.get('excerpt',''),c.get('reviews',''),c.get('rating',0),'',[c.get('category')] if c.get('category') else []] for c in r['cards']],'note':'tuple order = Province.jsx raw: [name, slug, address, excerpt, reviewsLabel, rating, city, tags]'}
    if pt=='city-archive': d['city']={'intro_text':r.get('intro_text',''),'result_count':r.get('result_count',''),'faq_text_placeholder':r.get('faq_text','')}
    LC=json.load(open('data/listing_cards.json')).get(r['path'])
    if LC:
        ex={h['first'][0]:[c['href'] for c in h['extra']] for h in LC['holders'] if h['first']}
        def fix(bl):
            for b in bl:
                if b.get('type')=='cards':
                    for h in ex.get(b.pop('_holder_first',''),[]):
                        if h not in b['hrefs']: b['hrefs'].append(h)
        for rw in d.get('rows',[]):
            for c in rw['columns']: fix(c['blocks'])
        fix(d['blocks'])
    if LC:
        d['listing']={'cards':[{'name':c['name'],'href':c['href'],'slug':c['slug'],'address':c['address'],'excerpt':c['excerpt'],'category':c['category'],'reviews':c['reviews'],'image':({'local_path':c['local'],'alt':c['image']['alt'],'width':c['image'].get('width'),'height':c['image'].get('height'),'original_url':c['image']['src_original']} if c.get('image') and c.get('local') else None)} for c in LC['unique']],'source_listing_count':len(LC['cards']),'duplicates_removed':len(LC['cards'])-len(LC['unique'])}
    if r['path']=='/blog/':
        cards=[]
        for it in BeautifulSoup(r['body_html'],'lxml').select('.vc_grid-item'):
            a=it.select_one('a.vc_gitem-link[href]'); ti=it.select_one('h4'); im=it.select_one('img.vc_gitem-zone-img')
            ps=[clean(x.get_text()) for x in it.select('.vc_gitem-post-data-source-post_excerpt p') if clean(x.get_text())]
            if not a: continue
            src=parse.full_size(im['src']).split('?')[0] if im and im.get('src') else ''
            lp=loc.get(src)
            cards.append({'href':a['href'],'path':parse.path_of(a['href']),'title':clean(ti.get_text()) if ti else '','excerpt':ps[-1] if ps else '','image':({'original_url':src,'local_path':lp,'alt':im.get('alt','')} if src else None)})
        d['blog_cards']=cards
    fq=faqs_dom(body) or faqs_of(root)
    if fq: d['faqs']=fq
    d['raw_html']=r['body_html']
    return d
if __name__=='__main__':
    os.makedirs(AUDIT+'/content',exist_ok=True)
    names=collections.Counter(plan['slugs'].values()); n=0
    for r in R:
        if r['status']!='REMAINING' and r['path'] not in('/alberta-rehabs/','/toronto-rehabs/','/benzodiazepine-addiction/','/blog/','/privacy-policy/','/privacy/','/terms-of-use/','/disclaimer/','/metamorphosis-centre-for-change/','/'): continue
        d=build(r); fn=plan['slugs'].get(r['url']) or r['slug'] or 'home'
        json.dump(d,open(f'{AUDIT}/content/{fn}.json','w'),ensure_ascii=False,indent=1); n+=1
    json.dump(DROPPED,open('data/dropped_links.json','w'),ensure_ascii=False)
    print('content json',n,'dropped links',len(DROPPED))
