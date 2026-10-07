import re
PROV_PRIMARY={'alberta-rehabs':'Alberta','british-columbia-rehabs':'British Columbia','manitoba-rehabs':'Manitoba','new-brunswick-rehabs':'New Brunswick','newfoundland-and-labrador-rehabs':'Newfoundland and Labrador','northwest-territories-rehabs':'Northwest Territories','nova-scotia-rehabs':'Nova Scotia','ontario-rehabs':'Ontario','prince-edward-island-rehabs':'Prince Edward Island','saskatchewan-rehabs':'Saskatchewan','drug-alcohol-rehabs-in-quebec':'Quebec'}
PROV_ALT={'alcohol-drug-rehab-centres-in-ontario','alcohol-drug-rehab-centres-in-manitoba','alcohol-drug-rehab-centres-in-british-columbia','alcohol-drug-rehab-centres-in-alberta','drug-rehab-centres-in-new-brunswick','yukon-drug-rehab-treatments','saskatchewan-drug-rehab-treatment','prince-edward-island-drug-rehab-centers','nunavut-drug-rehab-centers','nova-scotia-drug-rehab-centers','northwest-territories-drug-rehabs','newfoundland-drug-rehab-centers','30-days-treatment-by-canadian-provinces'}
CITY_PAGES={'toronto-rehabs','ottawa-rehabs','montreal-rehabs','7-best-drug-alcohol-rehab-centres-in-vancouver-2025','detox-center-in-ottawa'}
DRUG={'benzodiazepine-addiction','cocaine-addiction','ecstasy-addiction','ghb-addiction','heroin-addiction','ketamine-addiction','lortab-addiction','lsd-addiction','marijuana-addiction','methadone-addiction','mescaline','opioids-addiction','opium-addiction','oxycodone-addiction','pcp-addiction','percocet-treatment','prescription-drugs-addiction','ritalin-addiction','steroids-addiction','street-drugs-addiction','tranquilisers-addiction','vicodin-addiction','meth-addiction',
 'oxycontin-addiction','heroin-addiction-treatment','cocaine-addiction-treatment','marijuana-addiction-treatment','meth-addiction-treatment','prescription-drug-addiction-treatment','prescription-drug-rehab'}
ALCOHOL={'addiction-by-alcohol','alcohol-addiction-treatment'}
INTERV={'intervention','how-to-stage-an-intervention','drugs-and-alcohol-intervention','drug-intervention-treatment-centres'}
SYSTEM={'my-account','checkout','cart','shop','user-dashboard','search','thank-you'}
LEGAL={'privacy-policy','privacy','terms-of-use','disclaimer'}
HOME={'','home'}
BUILT_MAP={ # source path -> built route(s)
 '/':'/', '/addiction-by-alcohol/':'/alcohol', '/blog/':'/blog','/metamorphosis-centre-for-change/':'/centre','/toronto-rehabs/':'/city','/alberta-rehabs/':'/province',
 '/benzodiazepine-addiction/':'/drug','/intervention/':'/intervention','/contact/':'/contact','/promote-your-centre/':'/promote','/claim-your-listing/':'/claim-listing'}
def slug_of(path): return path.strip('/').split('/')[-1] if path!='/' else ''
def classify(path,wp_type,title=''):
    s=slug_of(path)
    if wp_type=='listing-item': return ('directory-index','') if path=='/search-listing/' else ('centre','')
    if wp_type=='listing-location': return ('city-archive','')
    if wp_type=='listing-category': return ('province-archive','') if s.endswith('-rehabs') else ('other-archive','')
    if wp_type=='category': return ('blog-category','')
    if wp_type=='post': return ('blog-post','')
    if path=='/': return ('home','')
    if s in PROV_PRIMARY: return ('province','primary')
    if s in PROV_ALT: return ('province','alternate')
    if s in CITY_PAGES: return ('city','')
    if s in DRUG: return ('drug','')
    if s in ALCOHOL: return ('alcohol','')
    if s in INTERV: return ('intervention','')
    if s in SYSTEM: return ('system','')
    if s in LEGAL: return ('legal','')
    if s in('contact','blog','promote-your-centre','claim-your-listing','pricing'): return ('site-utility','')
    if s in ('about-us','our-philosophy','why-choose-us','faqs','getting-started','guarantee','admissions','testimonials','testimonials-2'): return ('about-info','')
    if s=='raam-clinic' or s in{'drug-alcohol-helpline'}: return ('support-service','')
    return ('treatment-support','')
