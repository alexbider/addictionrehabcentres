import json,csv,sys,html,re,collections
sys.path.insert(0,'scripts'); import emit_content as E
AUD=E.AUDIT
R=E.R
CATMAP=lambda lab: '/'+re.sub(r'[^a-z0-9]+','-',lab.lower()).strip('-')+'/'
def title_of(r):
    if r.get('rest'): return html.unescape(r['rest'][0]['title'])
    if r['wp_type']=='listing-item': return r.get('centre',{}).get('name','')
    return r.get('h1') or r.get('title_bar_h1') or r['meta_title']
def parent(r):
    p=r['path'].strip('/').split('/')
    return '/' if len(p)<=1 else '/'+'/'.join(p[:-1])+'/'
def logical_parent(r):
    if r['wp_type']=='listing-item':
        cs=r.get('centre',{}).get('categories',[])
        if cs:
            pp=CATMAP(cs[0]); 
            return {'/quebec-rehabs/':'/drug-alcohol-rehabs-in-quebec/'}.get(pp,pp)
    if r['wp_type']=='post' and r.get('post_categories'): return '/category/'+re.sub(r'[^a-z0-9]+','-',r['post_categories'][0].lower()).strip('-')+'/'
    return parent(r)
rows=[]
for r in R:
    ls=r.get('links',[]); mp=[E.map_link(l['href']) for l in ls]
    ip=sorted({m['new'].split('#')[0] for m in mp if m['kind'].startswith('internal') or m['kind'] in('source-redirect','taxonomy-dropped')})
    ex=sum(1 for m in mp if m['kind']=='external')
    ni=len({(i.get('src_original') or '').split('?')[0] for i in r.get('images',[])})
    rows.append({'url':r['url'],'path':r['path'],'slug':r['slug'],'wp_type':r['wp_type'],'wp_ids':';'.join(str(x['id']) for x in r.get('rest',[])),
      'in_sitemap':r['in_sitemap'],'in_nav_footer':r['in_nav_footer'],'page_type':r['page_type'],'subtype':r['subtype'],'layout':r['layout'],
      'page_title':title_of(r),'h1':r.get('h1',''),'meta_title':r['meta_title'],'meta_description':r['meta_description'],'canonical':r['canonical'],
      'canonical_ok':(r['canonical'].rstrip('/')==r['url'].rstrip('/')),'robots':r.get('robots',''),
      'parent_path_url':parent(r),'logical_parent':logical_parent(r),'word_count':r.get('word_count',0),'images':ni,
      'cards_listed':len(r.get('cards',[])) if r['wp_type']!='listing-item' else '',
      'internal_links':len([m for m in mp if m['kind'].startswith('internal') or m['kind'] in('source-redirect','taxonomy-dropped')]),'internal_link_targets':';'.join(ip),'external_links':ex,
      'published':(r.get('published') or (r['rest'][0]['date'] if r.get('rest') else ''))[:10],'modified':(r.get('modified') or (r['rest'][0]['modified'] if r.get('rest') else ''))[:10],
      'status':r['status'],'built_route':r['built_route'],'status_reason':r['status_reason'],'features':';'.join(r['features']),'dup_note':r['dup_note']})
with open(AUD+'/02-site-inventory.csv','w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
print('02 rows',len(rows))
# 04 csv
with open(AUD+'/04-template-map.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(['source_url','page_type','layout','template','fit','change_codes','page_specific_notes'])
    for r in R:
        if r['status']!='REMAINING': continue
        n=[]
        if 'thin(<150w)' in r['features']: n.append('thin page (%d words)'%r['word_count'])
        if 'RAW-SHORTCODE' in r['features']: n.append('raw shortcode leaked in HTML')
        if r['page_type']=='city-archive' and len(r.get('cards',[]))==1: n.append('only 1 listing')
        if r['page_type']=='centre':
            c=r.get('centre',{}); 
            if r['word_count']>400: n.append('rich centre page (%d words, sections: %s)'%(r['word_count'],', '.join(h[1][:25] for h in r['headings'] if h[0]=='h3')[:90]))
            if not c.get('phone'): n.append('no phone')
            if not r.get('images') : n.append('no gallery')
        if 'noindex' in r.get('robots',''): n.append('noindex on source')
        if r['dup_note']: n.append(r['dup_note'])
        if r['page_type'] in('province','city') and r['layout']=='L2-listing': n.append('%d cards shown'%len(r.get('cards',[])))
        if r['page_type']=='blog-post': n.append('%d words'%r['word_count']+('; FAQ heading' if 'faq-heading' in r['features'] else ''))
        w.writerow([r['url'],r['page_type'],r['layout'],r['template'],r['fit'],r['changes'],'; '.join(n)])
# mapping csv
with open(AUD+'/old-to-new-routes.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(['old_url','old_path','recommended_new_route','status','current_built_example_route','action'])
    for r in R:
        act='serve at same path'
        if r['status']=='NOT NEEDED':
            tgt=E.REDIR.get(r['path'])
            act='301 -> '+tgt if tgt else ('not migrated; 301 -> / (decide)' )
            if r['page_type'] in('system','legal'): act='not migrated (%s)'%r['status_reason'][:50]
            rt=''
        else: rt=r['path']
        if r['status']=='BUILT': act='replace design example route %s with real path %s (+ 301 from design route if it was ever public)'%(r['built_route'],r['path'])
        w.writerow([r['url'],r['path'],rt,r['status'],r['built_route'],act])
