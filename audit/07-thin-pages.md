# 07 — Thin pages (NOT published — waiting for your decision)

Rules used (applied in `scripts/build-content.mjs`; thin pages get `published:false` in `content/_index.json` and are never routed or put in the sitemap):

- pages/posts: fewer than 300 words of own text (no cards)
- centres: fewer than 60 words of description
- city archives: exactly 1 listed centre
- province pages: ≤2 centre cards

Each row has a recommendation: **build** (publish as is), **merge** (content folded into a parent page, source URL 301s to it) or **redirect** (301 to the parent). Nothing is built or redirected until you answer.


## A. Blog posts (2)

| URL | Words | Recommendation |
|---|---|---|
| /7-things-people-recovering-from-an-addiction-wish-you-knew/ | 141 | merge/redirect to `/category/…` parent (`/blog/`) |
| /the-seven-cs-for-helping-your-child-heal-during-your-recovery/ | 285 | build — short but a complete listicle/article; weak SEO value, harmless |


## B. Province pages with ≤2 centre cards (2)

| URL | Cards | Words | Recommendation |
|---|---|---|---|
| /prince-edward-island-rehabs/ | 1 | 4 | **merge** into the province text page `/prince-edward-island-drug-rehab-centers/` is not possible (that page is noindex on the source); recommend **build** as a small hub only if you accept a 1-centre page, otherwise **redirect** to `/` (home) |
| /saskatchewan-rehabs/ | 2 | 2 | **merge** with `/saskatchewan-drug-rehab-treatment/` (492-word text page, same province) and 301 this URL to it |

(Other province pages have 4–26 cards and are treated as strong.) Note the two province pages above are linked from the header menu, so a redirect target is needed whichever you choose.

## C. Centre profiles under 60 words (63 of 458)

Recommendation for all: **merge** — keep the centre as a card (name, address, phone, excerpt) on its province/city listing page; 301 the profile URL to that listing’s parent province page. Exception candidates (`build` if you want them): none have specialties/amenities lists in addition to the short text.


| URL | Words | Centre | Has phone |
|---|---|---|---|
| /4th-dimension-recovery/ | 35 | 4th Dimension Recovery | yes |
| /12-step-group-trinity-united-church/ | 37 | 12 Step Group Trinity United Church | yes |
| /altona-group/ | 37 | Altona Group | yes |
| /peardonville-treatment-centre-meeting/ | 38 | Peardonville Treatment Centre Meeting | no |
| /any-lengths-group/ | 39 | Any Lengths Group | no |
| /old-fashioned-aa-group/ | 39 | Old Fashioned Aa Group | no |
| /big-book-group-lantzville/ | 42 | Big Book Group (Lantzville) | yes |
| /nehiley-house/ | 42 | Nehiley House | yes |
| /railton-house/ | 42 | Railton House | yes |
| /search-listing/s-p-e-a-k/ | 47 | S.P.E.A.K | yes |
| /alcoholics-anonymous/ | 48 | Alcoholics Anonymous | yes |
| /greenfield-house/ | 50 | Greenfield House | yes |
| /southwest-community-options/ | 51 | Southwest Community Options | yes |
| /star-drug-testing-services/ | 51 | Star Drug Testing Services | yes |
| /anxiety-disorders-association/ | 52 | Anxiety Disorders Association | yes |
| /emmanuel-house/ | 52 | Emmanuel House | yes |
| /pleasant-manor/ | 52 | Pleasant Manor | yes |
| /search-listing/hope-valley/ | 52 | Hope Valley | yes |
| /obsessive-compulsive-disorder-centre/ | 53 | Obsessive Compulsive Disorder Centre | yes |
| /bayfield-clinic/ | 54 | Bayfield Clinic | yes |
| /canadian-mental-health-association/ | 54 | Canadian Mental Health Association | yes |
| /forward-house-ministries/ | 54 | Forward House Ministries | yes |
| /native-addictions-council/ | 54 | Native Addictions Council | yes |
| /bible-baptist-church/ | 55 | Bible Baptist Church | yes |
| /mood-disorders-association-of-manitoba/ | 55 | Mood Disorders Association Of Manitoba | yes |
| /addiction-centre-toronto/ | 56 | Addiction Centre Toronto | yes |
| /al-anon/ | 56 | Al – Anon | yes |
| /belmont-house/ | 56 | Belmont House | yes |
| /birch-wellness-center/ | 56 | Birch Wellness Center | yes |
| /breelove-counselling/ | 56 | Breelove Counselling | yes |
| /channal/ | 56 | Channal | yes |
| /eden-mental-health/ | 56 | Eden Mental Health | yes |
| /mylene-dastous/ | 56 | Mylene D’Astous | yes |
| /search-listing/dr-i-s-bilash/ | 56 | Dr. I.S. Bilash | yes |
| /search-listing/vitalita-health-network/ | 56 | VitalitÃ© Health Network | yes |
| /union-gospel-mission/ | 56 | Union Gospel Mission | yes |
| /cape-breton-community-housing/ | 57 | Cape Breton Community Housing | yes |
| /cedar-centre/ | 57 | Cedar Centre | yes |
| /elizabeth-fry-satellite-apartment/ | 57 | Elizabeth Fry Satellite Apartment | yes |
| /pathstone-mental-health/ | 57 | Pathstone Mental Health | yes |
| /roblin-hero-club/ | 57 | Roblin Hero Club | yes |
| /shelburne-mental-health-centre/ | 57 | Shelburne Mental Health Centre | yes |
| /vanier-childrens-services/ | 57 | Vanier Childrens Services | yes |
| /acupuncture-chinese-medical-center/ | 58 | Acupuncture & Chinese Medical Center | yes |
| /afm-starfish-project-for-youth/ | 58 | AFM Starfish Project for Youth | yes |
| /bayers-road-centre/ | 58 | Bayers Road Centre | yes |
| /brenda-gibson-counselling/ | 58 | Brenda Gibson Counselling | yes |
| /cole-harbour-place/ | 58 | Cole Harbour Place | yes |
| /hants-community-hospital/ | 58 | Hants Community Hospital | yes |
| /manitoba-addiction-treatment-centres-mbatc/ | 58 | Manitoba Addiction Treatment Centres (Mbatc) | yes |
| /north-trauma-and-resource-center/ | 58 | North Trauma And Resource Center | yes |
| /rock-counseling-services/ | 58 | Rock Counseling Services | yes |
| /selkirk-mental-health-centre/ | 58 | Selkirk Mental Health Centre | yes |
| /st-raphael-wellness-centre/ | 58 | St. Raphael Wellness Centre | yes |
| /wise-choice-counselling/ | 58 | Wise Choice Counselling | yes |
| /canadian-mental-health-association-hope-house/ | 59 | Canadian Mental Health Association – Hope House | yes |
| /caritas-project/ | 59 | Caritas Project | yes |
| /christian-counselling/ | 59 | Christian Counselling | yes |
| /family-enhancement-centre/ | 59 | Family Enhancement Centre | yes |
| /gamblers-anonymous/ | 59 | Gambler’s Anonymous | yes |
| /habitude/ | 59 | Habitude | yes |
| /maison-fraternite/ | 59 | Maison Fraternite | yes |
| /selkirk-interlake-mental-health-support-centre-inc/ | 59 | Selkirk Interlake Mental Health Support Centre Inc. | yes |


## D. City archives listing exactly 1 centre (135 of 194)

Recommendation: **redirect** each `/listing-location/<city>/` to the province page (or to the centre profile where that profile is itself published). The 59 archives with ≥2 centres are “build”. The 23 archives with 0 centres are already NOT NEEDED.


| URL | The one centre | Words (intro only) |
|---|---|---|
| /listing-location/acton/ | Adapt Halton Alcohol And Drugs | 1 |
| /listing-location/agassiz/ | Telmexw Awtexw Treatment Centre | 1 |
| /listing-location/ahousaht/ | Ahousat Holistic Recovery Centre Society | 1 |
| /listing-location/alert-bay/ | Namgis First Nation – Substance Abuse Treatment Centre | 2 |
| /listing-location/alkali-lake/ | Esketemc First Nations Health Service | 2 |
| /listing-location/altona/ | Altona Group | 1 |
| /listing-location/amherst/ | Cumberland Mental Health Authority – Mental Health & Addictions Services | 1 |
| /listing-location/armstrong/ | Round Lake Treatment Centre | 1 |
| /listing-location/bala/ | Greenestone | 1 |
| /listing-location/belleville/ | Addictions And Mental Health Services – Prince Edward | 1 |
| /listing-location/belmont/ | Anxiety Disorders Association | 1 |
| /listing-location/bonnyville/ | Bonnyville Indian Métis Rehabilitation Centre | 1 |
| /listing-location/bowen-island/ | Orchard Recovery | 2 |
| /listing-location/breadalbane/ | Irecover Newfoundland | 1 |
| /listing-location/bridgewater/ | South Shore Psychological Services | 1 |
| /listing-location/burks-falls/ | Canadian Mental Health Association – Parry Sound Branch | 2 |
| /listing-location/burns-lake/ | Southside Health And Wellness Centre | 2 |
| /listing-location/campbell-river/ | Laichwiltach Family Life Society Addiction Services | 2 |
| /listing-location/campbellton/ | VitalitÃ© Health Network – Gallant Drive | 1 |
| /listing-location/carbonear/ | U – Turn | 1 |
| /listing-location/catharines/ | Salvation Army – Booth Centre | 1 |
| /listing-location/clairmont/ | Youth Clairmont Detox | 1 |
| /listing-location/cleveland/ | Strait – Richmond Hospital | 1 |
| /listing-location/cobble-hill/ | Cedars at Cobble Hill | 2 |
| /listing-location/cobourg/ | Canadian Centre For Addictions | 1 |
| /listing-location/colwood/ | Pacific Centre Family Services Association | 1 |
| /listing-location/conception-bay-south/ | Neville’S Counselling | 3 |
| /listing-location/concord/ | Mens Sana Families For Mental Health | 1 |
| /listing-location/consecon/ | Bayfield Clinic | 1 |
| /listing-location/cookstown/ | Simcoe Addiction & Mental Health | 1 |
| /listing-location/courtenay/ | The John Howard Society Of North Island – Youth And Family Substance Use Services | 1 |
| /listing-location/creston/ | Three Voices Of Healing Society | 1 |
| /listing-location/delburne/ | Venture Academy | 1 |
| /listing-location/digby/ | Digby General Hospital | 1 |
| /listing-location/dundas/ | Salvation Army – Ellen Osler Home | 1 |
| /listing-location/eel-ground/ | Rising Sun Rehabilitation Centre | 2 |
| /listing-location/elsipogtog/ | Elsipogtog Health And Wellness Centre | 1 |
| /listing-location/erin/ | Trafalgar Addiction Treatment Centres | 1 |
| /listing-location/eskasoni/ | MiKmaw Lodge Treatment Centre | 1 |
| /listing-location/first-nations/ | Wolastoqewiyik Healing Lodge | 2 |
| /listing-location/fort-nelson/ | Fort Nelson Aboriginal Friendship Centre | 2 |
| /listing-location/frenchvale/ | Talbot House | 1 |
| /listing-location/golden/ | Golden Family Center | 1 |
| /listing-location/gores-landing/ | Victoria Wellness | 2 |
| /listing-location/grande-prairie/ | Peace Country Wilderness Program | 2 |
| /listing-location/greater-sudbury/ | Salvation Army Sudbury | 2 |
| /listing-location/griswold/ | Sioux Valley Health Centre | 1 |
| /listing-location/grouard/ | Kapown Treatment Centre | 1 |
| /listing-location/hagersville/ | Native Horizons Treatment Centre | 1 |
| /listing-location/hampton/ | Lutz Longstaff Parish | 1 |
| /listing-location/happy-valley-goose-bay/ | Mental Health And Addictions Services Community Health | 3 |
| /listing-location/hay-river/ | Community Counseling Services | 2 |
| /listing-location/hornby-island/ | Hope Place Mens Centre | 2 |
| /listing-location/jacksonville/ | Action North Recovery Centre | 1 |
| /listing-location/kaslo/ | North Kootenay Lake Community Services Society | 1 |
| /listing-location/kawartha-lakes/ | Hope Valley Healing, Addiction & Wellness | 2 |
| /listing-location/kemptville/ | Children’s Mental Health of Leeds and Grenville | 1 |
| /listing-location/king-city/ | Muskoka Recovery | 2 |
| /listing-location/kingsclear-parish/ | Kingsclear First Nation – Nnadap Program | 2 |
| /listing-location/kingston/ | Pathways For Children And Youth | 1 |
| /listing-location/langley-township/ | Any Lengths Group | 2 |
| /listing-location/lantzville/ | Big Book Group (Lantzville) | 1 |
| /listing-location/lethbridge/ | Southern Alcare Manor | 1 |
| /listing-location/lloydminster/ | Thorpe Recovery Centre | 1 |
| /listing-location/mallorytown/ | 1000 Islands Addiction Rehab & Treatment Centre | 1 |
| /listing-location/markham/ | Nelson House Medicine Lodge | 1 |
| /listing-location/maskwacis/ | Young Spirit Winds | 1 |
| /listing-location/memramcook/ | Teen Challenge Canada — Atlantic Men’s Centre | 1 |
| /listing-location/merrickville/ | Newgate 180 | 1 |
| /listing-location/merritt/ | Conayt Friendship Society | 1 |
| /listing-location/middleton/ | Mental Health And Addictions Annapolis Valley | 1 |
| /listing-location/miramichi/ | Schizophrenia Society Of New Brunswick | 1 |
| /listing-location/montague/ | Blue Skies Recovery | 1 |
| /listing-location/montreal/ | Milestone House | 1 |
| /listing-location/new-brunswick/ | God Is Able Ministries | 2 |
| /listing-location/new-glasgow/ | New Hope Site | 2 |
| /listing-location/new-westminster/ | Freedom Quest Regional Youth Services – Alcohol & Drug Day Treatment | 2 |
| /listing-location/newmarket/ | Southlake Regional Health Centre | 1 |
| /listing-location/niagara-falls/ | Segue Clinic | 2 |
| /listing-location/ninette/ | Southwest Community Options | 1 |
| /listing-location/norris-point/ | Bonne Bay Health Centre | 2 |
| /listing-location/north-sydney/ | Cape Breton District Health Authority Northside General Hospital Opiate Recovery Program | 2 |
| /listing-location/north-vancouver/ | Hollyburn Family Services | 2 |
| /listing-location/north-west-river/ | Innu Uauitshitun Alcohol And Drug Treatment | 3 |
| /listing-location/oromocto/ | Oromocto Counselling And Consulting | 1 |
| /listing-location/owen-sound/ | Mental Health And Addiction Services In Grey Bruce | 2 |
| /listing-location/paradise/ | Atlantic Counselling Services | 1 |
| /listing-location/pembroke/ | Irving House Addiction Treatment Centre | 1 |
| /listing-location/perth-andover/ | Perth – Andover Addiction And Mental Health Services | 1 |
| /listing-location/perth-road/ | Bonvie Recovery | 2 |
| /listing-location/port-alberni/ | Port Alberni Friendship Centre | 2 |
| /listing-location/port-hardy/ | Gwa’Sala-‘Nakwaxda’Xw Health And Family Services Alcohol And Drug Services | 2 |
| /listing-location/port-hope/ | Ontario Addiction Treatment Centres | 2 |
| /listing-location/port-perry/ | Another Road Addiction Recovery Centre | 2 |
| /listing-location/portage-la-prairie/ | Al – Anon | 3 |
| /listing-location/powell-river/ | Sunshine Coast Health Centre | 2 |
| /listing-location/powerview/ | Sagkeeng Mino Pimatiziwin Family Treatment Centre | 1 |
| /listing-location/regina/ | North Wind Healing Centre | 1 |
| /listing-location/roblin/ | Roblin Hero Club | 1 |
| /listing-location/saint-jean-port-joli/ | South Shore Health | 4 |
| /listing-location/saint-john/ | Ridgewood Addiction Services | 2 |
| /listing-location/sainte-marie/ | Algoma Family Services | 2 |
| /listing-location/salt-spring-island/ | Kwakiutl District Council Health | 3 |
| /listing-location/scarborough/ | Salvation Army Homestead | 1 |
| /listing-location/selkirk/ | Selkirk Mental Health Centre | 1 |
| /listing-location/sidney/ | Addictions Foundation Of Manitoba In Beausejour | 1 |
| /listing-location/simcoe/ | Holmes House Withdrawal Management | 1 |
| /listing-location/smithville/ | Community Addiction Services Of Niagara | 1 |
| /listing-location/sorrento/ | Red Road Recovery | 1 |
| /listing-location/southport/ | Afm Compass Residential Youth Program | 1 |
| /listing-location/springhill/ | Pictou County Health Authority | 1 |
| /listing-location/st-catharines/ | Twelve Mile Recovery | 2 |
| /listing-location/stephenville/ | West Bridge House | 1 |
| /listing-location/sundridge/ | Denovo Treatment Centre | 1 |
| /listing-location/sussex/ | Sussex Health Care | 1 |
| /listing-location/tees/ | iRecover Alberta | 1 |
| /listing-location/terrace/ | TDCSS – Adult Addiction Day Treatment Program | 1 |
| /listing-location/the-pas/ | Bible Baptist Church | 2 |
| /listing-location/thunder-bay/ | St Josephs Hospital | 2 |
| /listing-location/timmins/ | Center Jubilee Centre | 1 |
| /listing-location/torbay/ | Denise Sargeant Therapy Services | 1 |
| /listing-location/tracy/ | Village Of Hope | 1 |
| /listing-location/vanderhoof/ | Carrier Sekani Family Services | 1 |
| /listing-location/vegreville/ | Alberta Health Services – Youth Counseling Vegreville | 1 |
| /listing-location/wabasca-desmarais/ | Pee Kis Kwe Tan (Let’s Talk) Society | 1 |
| /listing-location/wasaga-beach/ | Metamorphosis Centre for Change | 2 |
| /listing-location/waterford/ | New Waterford Physiotherapy | 1 |
| /listing-location/waterloo/ | Lutherwood | 1 |
| /listing-location/west-kelowna/ | Top Of The World Ranch Treatment Centre | 2 |
| /listing-location/whitby/ | Renascent Treatment Centre | 1 |
| /listing-location/whitchurch-stouffville/ | The Farm Rehab | 1 |
| /listing-location/wikwemikong/ | Ngwaagan Gamig Recovery Centre | 1 |
| /listing-location/williams-lake/ | Nenqayni – Youth & Family Inhalant Program | 2 |
| /listing-location/woodbridge/ | Vita Nova Foundation | 1 |
| /listing-location/woodstock/ | Woodstock Addiction And Mental Health Services | 1 |
