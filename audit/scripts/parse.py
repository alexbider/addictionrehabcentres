"""Parse cached live HTML of addictionrehabcenters.ca into structured records."""
import re, json, hashlib, os, html as htmlmod
from urllib.parse import urlparse, urljoin, unquote
from bs4 import BeautifulSoup
SITE='https://addictionrehabcenters.ca'
HDIR=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','html')

def cache_path(url): return os.path.join(HDIR,hashlib.md5(url.encode()).hexdigest()+'.html')
def load_html(url):
    p=cache_path(url)
    return open(p,encoding='utf-8',errors='replace').read() if os.path.exists(p) else None

def cfdecode(hexs):
    k=int(hexs[:2],16); return ''.join(chr(int(hexs[i:i+2],16)^k) for i in range(2,len(hexs),2))
def clean(t): return re.sub(r'\s+',' ',t or '').strip()
def path_of(u):
    p=urlparse(u); 
    if p.netloc and 'addictionrehabcenters.ca' not in p.netloc: return None
    pa=unquote(p.path) or '/'
    return pa if pa.endswith('/') or '.' in pa.split('/')[-1] else pa+'/'
def full_size(src):
    return re.sub(r'-\d{2,4}x\d{2,4}(\.[A-Za-z0-9]+)$',r'\1',src)

def decode_emails(root):
    for sp in root.select('.__cf_email__'):
        try: sp.replace_with(cfdecode(sp['data-cfemail']))
        except Exception: pass
    for a in root.select('a[href^="/cdn-cgi/l/email-protection"]'):
        try: a['href']='mailto:'+cfdecode(a['href'].split('#')[-1])
        except Exception: pass

def bg_map(doc):
    m={}
    for st in doc.find_all('style'):
        for cls,url in re.findall(r'\.(vc_custom_\d+)\s*\{[^}]*?background-image:\s*url\(([^)]+)\)',st.get_text()):
            m[cls]=url.strip('\'" ')
    return m

def img_rec(i,role,base=SITE):
    src=i.get('src') or i.get('data-src') or i.get('data-lazy-src') or ''
    if src.startswith('data:'): src=i.get('data-src') or i.get('data-lazy-src') or ''
    ss=i.get('srcset') or i.get('data-srcset') or ''
    best=src; bw=0
    for part in ss.split(','):
        bits=part.strip().split()
        if len(bits)==2 and bits[1].endswith('w') and int(bits[1][:-1])>bw: bw=int(bits[1][:-1]); best=bits[0]
    if not src: src=best
    return {'role':role,'src_original':urljoin(base,full_size(best or src)),'src_as_published':urljoin(base,src) if src else '',
            'alt':i.get('alt') or '', 'width':i.get('width'),'height':i.get('height')}

def parse(url,html,wp_type):
    doc=BeautifulSoup(html,'lxml')
    rec={'url':url,'path':path_of(url),'wp_type':wp_type}
    t=doc.find('title'); rec['meta_title']=clean(t.get_text()) if t else ''
    md=doc.find('meta',attrs={'name':'description'}); rec['meta_description']=clean(md['content']) if md and md.get('content') else ''
    cn=doc.find('link',rel='canonical'); rec['canonical']=cn['href'] if cn else ''
    rb=doc.find('meta',attrs={'name':'robots'}); rec['robots']=rb['content'] if rb else ''
    for k,p in [('og_title','og:title'),('og_description','og:description'),('og_image','og:image'),('og_type','og:type'),('published','article:published_time'),('modified','article:modified_time')]:
        m=doc.find('meta',property=p); rec[k]=m['content'] if m and m.get('content') else ''
    ld=[s.get_text() for s in doc.find_all('script',type='application/ld+json')]
    rec['jsonld']=[json.loads(x) for x in ld if x.strip().startswith(('{','['))] if ld else []
    rec['body_classes']=' '.join((doc.body.get('class') or [])[:6]) if doc.body else ''
    cont=doc.select_one('.eltdf-content')
    if not cont: rec['parse_error']='no .eltdf-content'; return rec
    for x in cont(['script','noscript']): x.decompose()
    decode_emails(cont)
    tb=cont.select_one('.eltdf-title-holder h1')
    rec['title_bar_h1']=clean(tb.get_text()) if tb else ''
    bgs=bg_map(doc)
    # ---- choose main body
    body=None; boiler=[]
    if wp_type=='post':
        body=cont.select_one('article .eltdf-post-content') or cont.select_one('.eltdf-post-content')
        art=cont.select_one('article'); 
        if art:
            rec['post_date']=clean((art.select_one('time,.eltdf-post-info-date') or art).get_text())[:40] if art.select_one('time,.eltdf-post-info-date') else ''
            rec['post_categories']=[clean(a.get_text()) for a in art.select('a[rel="category tag"]')]
            au=art.select_one('.eltdf-post-info-author a, [rel="author"]'); rec['post_author']=clean(au.get_text()) if au else ''
        side=cont.select_one('aside.eltdf-sidebar')
        if side: boiler.append(('sidebar-lead-form',clean(side.get_text())[:120]))
    elif wp_type=='listing-item':
        body=cont.select_one('.eltdf-ls-content-area')
    elif wp_type=='listing-location':
        body=cont.select_one('.archive-layout .inner-content') or cont
    elif wp_type=='listing-category':
        body=cont.select_one('.eltdf-ll-inner') or cont
    elif wp_type=='category':
        body=cont.select_one('.eltdf-blog-holder') or cont
    else:
        body=cont.select_one('.eltdf-page-content-holder') or cont.select_one('.eltdf-container-inner')
    if body is None: body=cont
    # remove site-wide provinces block (boilerplate) from main body
    body=BeautifulSoup(str(body),'lxml').find(True) if body else None
    for b in body.select('.featuredProvinces'):
        boiler.append(('featured-provinces-block',clean(b.get_text())[:100])); b.decompose()
    rec['boilerplate_removed']=boiler
    rec['body_html']=body.decode_contents().strip() if hasattr(body,'decode_contents') else str(body)
    # rows (WPBakery sections)
    rows=[]
    for r in body.select('.vc_row'):
        cls=[c for c in r.get('class',[]) if c not in('vc_row','wpb_row','vc_row-fluid')]
        bgimg=next((bgs[c] for c in cls if c in bgs),'')
        rows.append({'classes':cls,'bg_image':bgimg,'text_words':len(clean(r.get_text()).split())})
    rec['rows']=rows
    # headings
    rec['headings']=[[h.name,clean(h.get_text())] for h in body.find_all(['h1','h2','h3','h4','h5','h6']) if clean(h.get_text())]
    rec['h1']=(rec['headings'][0][1] if rec['headings'] and rec['headings'][0][0]=='h1' else '') or rec['title_bar_h1']
    # words (exclude centre cards / nav widgets)
    bt=BeautifulSoup(str(body),'lxml')
    for a in bt.select('article'): a.decompose()
    rec['word_count']=len(clean(bt.get_text(' ')).split())
    # images
    imgs=[]
    for r in rec['rows']:
        if r['bg_image']: imgs.append({'role':'row-background','src_original':r['bg_image'],'src_as_published':r['bg_image'],'alt':'','width':None,'height':None})
    for i in body.find_all('img'):
        if i.find_parent('article'): continue
        if (i.get('width')=='1' and i.get('height')=='1'): continue
        imgs.append(img_rec(i,'content'))
    for g in body.select('.e-gallery-image[data-thumbnail]'):   # Elementor image gallery widgets inside the text
        th=g.get('data-thumbnail','')
        if th: imgs.append({'role':'content','src_original':urljoin(base:=SITE,full_size(th)),'src_as_published':th,'alt':g.get('aria-label') or '','width':g.get('data-width'),'height':g.get('data-height')})
    gal=cont.select('.eltdf-ls-gallery-image img') if wp_type=='listing-item' else []
    for i in gal: imgs.append(img_rec(i,'gallery'))
    ids=set(); out=[]
    for im in imgs:
        k=(im['src_original'],im['role'])
        if im['src_original'] and k not in ids: ids.add(k); out.append(im)
    rec['images']=out
    # links
    links=[]
    for a in body.find_all('a',href=True):
        if a.find_parent('article'): continue
        h=a['href'].strip()
        if h.startswith(('#','javascript:')): continue
        links.append({'href':h,'text':clean(a.get_text()),'path':path_of(urljoin(SITE,h)) if not h.startswith(('mailto:','tel:')) else None})
    rec['links']=links
    # cards (centre cards in province/city pages)
    cards=[]
    for a in body.select('article'):
        l=a.select_one('.eltdf-lli-title a, a[href]'); 
        im=a.select_one('img'); ad=a.select_one('.eltdf-lli-location-address'); ex=a.select_one('.eltdf-lli-excerpt')
        cat=a.select_one('.eltdf-lli-category'); rv=a.select_one('.eltdf-reviews-number')
        cards.append({'name':clean(l.get_text()) if l else '','href':l['href'] if l else '','address':clean(ad.get_text()) if ad else '','excerpt':clean(ex.get_text()) if ex else '',
            'category':clean(cat.get_text()) if cat else '','reviews':clean(rv.get_text()) if rv else '','image':img_rec(im,'card') if im else None})
    if cards: rec['cards']=cards
    # centre
    if wp_type=='listing-item':
        c={}
        t=cont.select_one('h1.eltdf-ls-title'); c['name']=clean(t.get_text()) if t else ''
        c['categories']=[clean(a.get_text()) for a in cont.select('.eltdf-ls-categories a')]
        rn=cont.select_one('.eltdf-reviews-number'); c['reviews_count']=clean(rn.get_text()) if rn else ''
        c['rating_stars_filled']=len(cont.select('.eltdf-ls-title-info .eltdf-stars-items i.ion-android-star:not(.ion-android-star-outline)'))
        c['about_html']=''
        ci=cont.select_one('.eltdf-ls-content-inner')
        if ci: c['about_html']=ci.decode_contents().strip()
        def lst(sel): 
            e=cont.select_one(sel); return [clean(li.get_text()) for li in e.select('li')] if e else []
        c['specialties']=lst('.specialAmenities .specialties'); c['amenities']=lst('.specialAmenities .allamenities')
        # other h4 lists inside content (therapies etc.)
        groups={}
        if ci:
            for h in ci.find_all('h4'):
                if h.find_parent(class_='specialAmenities'): continue
                ul=h.find_next_sibling('ul'); 
                if ul: groups[clean(h.get_text())]=[clean(li.get_text()) for li in ul.select('li')]
        c['other_lists']=groups
        ph=cont.select_one('.eltdf-ls-location-phone-link'); c['phone']=clean(ph.get_text()) if ph else ''
        em=cont.select_one('.eltdf-ls-location-email-link'); c['email']=em['href'].replace('mailto:','') if em and em.get('href','').startswith('mailto:') else ''
        w=cont.select_one('.eltdf-ls-location-site-url-link'); c['website']=w['href'] if w else ''
        ad=cont.select_one('.eltdf-ls-location-address'); c['address']=clean(ad.get_text()) if ad else ''
        c['social']={ (a.get('class') or [''])[0].replace('eltdf-ls-location-social-',''):a['href'] for a in cont.select('.eltdf-ls-location-social a[href]')}
        c['gallery']=[img_rec(i,'gallery') for i in cont.select('.eltdf-ls-gallery-image img')]
        rec['centre']=c
        # centre about text counts as body words
        rec['word_count']=len(clean(BeautifulSoup(c['about_html'],'lxml').get_text(' ')).split())
    if wp_type=='listing-location':
        pt=cont.select_one('.golo-page-title')
        rec['h1']=clean(pt.select_one('h1,h2,.entry-title').get_text()) if pt and pt.select_one('h1,h2,.entry-title') else ''
        det=pt.select_one('.entry-detail') if pt else None
        rec['intro_text']=clean(det.get_text()) if det else ''
        fq=cont.select_one('.location-faqs'); rec['faq_text']=clean(fq.get_text()) if fq else ''
        rc=cont.select_one('.result-count .count'); rec['result_count']=clean(rc.get_text()) if rc else ''
        cards=[]
        for a in cont.select('.place-item'):
            l=a.select_one('.place-title a'); im=a.select_one('.place-thumb img'); ad=a.select_one('.place-address'); ty=a.select_one('.place-type'); rv=a.select_one('.count-reviews'); pr=a.select_one('.place-price'); rt=a.select_one('.place-rating span')
            cards.append({'name':clean(l.get_text()) if l else '','href':l['href'] if l else '','address':clean(ad.get_text()) if ad else '','category':clean(ty.get_text()) if ty else '','reviews':clean(rv.get_text()) if rv else '','rating':clean(rt.get_text()) if rt else '','price_tier':clean(pr.get_text()) if pr else '','featured':bool(a.select_one('.place-featured')) and 'golo-place-featured' in (a.get('class') or []),'image':img_rec(im,'card') if im else None})
        rec['cards']=cards
        rec['word_count']=len((rec['intro_text']+' '+rec['faq_text']).split())
        rec['images']=[c['image'] for c in cards if c['image']]
        rec['headings']=[[h.name,clean(h.get_text())] for h in cont.select('.inner-content h1,.inner-content h2,.inner-content h3')]
    if wp_type=='category':
        cards=[]
        for a in cont.select('article'):
            l=a.select_one('a[title]') or a.select_one('h2 a, h3 a, a[href]'); im=a.select_one('img'); ex=a.select_one('.eltdf-post-excerpt')
            ti=a.select_one('.eltdf-post-title a, h2 a, h3 a, h4 a')
            cards.append({'name':clean(ti.get_text()) if ti else (l.get('title','') if l else ''),'href':(ti or l)['href'] if (ti or l) else '','excerpt':clean(ex.get_text()) if ex else '','image':img_rec(im,'card') if im else None})
        rec['cards']=cards; rec['word_count']=0
    if wp_type=='listing-category':
        rec['word_count']=0
    return rec
