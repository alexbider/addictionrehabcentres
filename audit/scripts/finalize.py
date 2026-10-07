import json,re,sys,collections
sys.path.insert(0,'scripts'); import classify
R=json.load(open('data/parsed.json'))
BM=classify.BUILT_MAP
VL={x[0].rstrip('/')+'/' for x in json.load(open('data/view_links.json'))}
L1_SIG={'newInnerBanner'}
def layout(r):
    cl=[c for row in r.get('rows',[]) for c in row['classes']]
    if r['wp_type']=='post': return 'article'
    if r['wp_type']=='listing-item': return 'centre-listing'
    if r['wp_type']=='listing-location': return 'city-archive'
    if r['wp_type'] in('listing-category','category'): return 'archive'
    if 'innerListingBox' in cl: return 'L2-listing'
    if 'newInnerBanner' in cl: return 'L1-banner-content'
    return 'other'
def feats(r):
    f=[]; b=r.get('body_html','')
    if re.search(r'<iframe',b): f.append('iframe')
    if re.search(r'<table',b): f.append('table')
    if re.search(r'<form',b): f.append('form')
    if re.search(r'\[(vc_|gravityform|contact-form|elementor|woocommerce)',b): f.append('RAW-SHORTCODE')
    if any(re.search(r'faq|frequently',h[1],re.I) for h in r.get('headings',[])): f.append('faq-heading')
    if r.get('word_count',0)<150 and r['wp_type'] in('page','post') and not r.get('cards'): f.append('thin(<150w)')
    if r.get('cards') and r['wp_type']=='page': f.append('listing-cards:%d'%len(r['cards']))
    if r.get('word_count',0)>3000: f.append('very-long(>3000w)')
    return f
for r in R:
    r['page_type'],r['subtype']=classify.classify(r['path'],r['wp_type'])
    r['slug']=classify.slug_of(r['path']); r['layout']=layout(r); r['features']=feats(r)
    pt=r['page_type']; st=reason=''; built=''
    ncards=len(r.get('cards',[]))
    if r['path'] in BM: st,built,reason='BUILT',BM[r['path']],'Design example exists (single sample page, not data-driven)'
    elif pt=='system': st,reason='NOT NEEDED','WooCommerce / account / search / thank-you utility page'
    elif pt=='legal': st,reason='NOT NEEDED','Legal boilerplate (brief lists privacy policy as not needed). CONFIRM: a live site normally needs privacy/terms/disclaimer'
    elif 'noindex' in r.get('robots','') and not (r['in_nav_footer'] or r['path'] in VL): st,reason='NOT NEEDED','noindex on source site and not linked from nav/footer/built pages'
    elif r['path']=='/pricing/': st,reason='NOT NEEDED','Old listing-package stub (63 words); replaced by /promote pricing'
    elif pt=='blog-category': st,reason='NOT NEEDED','Taxonomy archive: covered by /blog category filter; 301 old URL'
    elif pt=='province-archive': st,reason='NOT NEEDED','Duplicate listing archive of the province page (same centres); 301 to /%s/'%r['slug']
    elif pt=='other-archive': st,reason='NOT NEEDED','Non-core listing category (%s): out of scope - CONFIRM'%r['slug']
    elif pt=='directory-index': st,reason='NOT NEEDED','Directory search UI; replaced by site search'
    elif pt=='city-archive' and ncards==0: st,reason='NOT NEEDED','Empty location archive (0 listings)'
    else: st='REMAINING'
    if st=='REMAINING' and 'noindex' in r.get('robots',''): reason='noindex on source but linked from nav/footer or built header - decide whether to index'
    r['status']=st; r['status_reason']=reason; r['built_route']=built
    # duplicates / shadowed
    r['dup_note']=''
    if len(r.get('rest',[]))>1: r['dup_note']='Slug shared by %d WP items (ids %s); live URL serves %s'%(len(r['rest']),', '.join(str(x['id']) for x in r['rest']),r['wp_type'])
# template mapping
def tmpl(r):
    pt,lay,st=r['page_type'],r['layout'],r['status']
    if st!='REMAINING': return ('','','')
    if pt=='centre': return ('Centre','FIT WITH CHANGES','C1-C6')
    if pt=='city-archive': return ('City','FIT WITH CHANGES','A1-A5')
    if pt=='blog-post': return ('BlogPost','FIT WITH CHANGES','B1-B6')
    if pt=='drug': return ('Drug','FIT WITH CHANGES','D1-D6')
    if pt=='alcohol': return ('Alcohol','FIT WITH CHANGES','X1-X3')
    if pt=='intervention': return ('Intervention','FIT WITH CHANGES','X1-X3')
    if pt=='province' and lay=='L2-listing': return ('Province','FIT WITH CHANGES','P1-P5')
    if pt=='city' and lay=='L2-listing': return ('City','FIT WITH CHANGES','P1-P5,A1')
    if pt=='about-info': return ('(none) fallback: Drug L1 layout','NO TEMPLATE','G1-G3')
    if lay=='L1-banner-content': return ('Drug (L1 layout)','FIT WITH CHANGES','D1-D6,G1')
    return ('(none)','NO TEMPLATE','G1-G3')
for r in R:
    r['template'],r['fit'],r['changes']=tmpl(r)
    if r['path']=='/faqs/': r['template'],r['fit'],r['changes']=('(none) FAQ index','NO TEMPLATE','G1-G3,F1')
    if r['path'] in('/raam-clinic/',): r['features'].append('very-long')
json.dump(R,open('data/final.json','w'),ensure_ascii=False)
cnt=collections.Counter((r['status']) for r in R); print(cnt)
rem=[r for r in R if r['status']=='REMAINING']
print(collections.Counter(r['page_type'] for r in rem))
print(collections.Counter(r['fit'] for r in rem))
print(collections.Counter(r['template'] for r in rem))
print(collections.Counter(r['page_type']+':'+r['status'] for r in R if r['status']!='REMAINING'))
