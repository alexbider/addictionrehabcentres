import fs from 'node:fs'; import { createRequire } from 'node:module';
const sharp=createRequire('/Users/mac/Downloads/arc-next/package.json')('sharp');
const SP=process.argv[2]+'/shots/'; const H=JSON.parse(fs.readFileSync(SP+'design-heights.json'));
const items=[['Home','/'],['Alcohol','/alcohol'],['Auth','/auth'],['Blog','/blog'],['BlogPost','/blog/how-long-does-alcohol-detox-take'],['Centre','/centre'],['CentreOnboarding','/centre-onboarding'],['City','/city'],['ClaimListing','/claim-listing'],['ClaimTherapist','/claim-therapist'],['Contact','/contact'],['Drug','/drug'],['Intervention','/intervention'],['JoinDirectory','/join-directory'],['MenuOptions','/menu-options'],['Promote','/promote'],['ProviderDashboard','/provider-dashboard'],['Province','/province'],['TherapistOnboarding','/therapist-onboarding'],['TherapistProfile','/therapist-profile'],['Therapists','/therapists'],['TherapistsCity','/therapists-city'],['TherapistsProvince','/therapists-province']];
const W=420,TH=292,LB=34,G=12,COLS=6; const rows=Math.ceil(items.length/COLS);
const CW=COLS*(W+G)+G, CH=rows*(TH+LB+G)+G+54;
const comps=[];
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
comps.push({input:Buffer.from(`<svg width="${CW}" height="54"><text x="${G}" y="36" font-family="Helvetica,Arial" font-size="26" font-weight="700" fill="#10233a">Approved design views (23) — original clone, 1440px wide, first screen (top 1000px) of each. Label: view · route · full page height</text></svg>`),top:0,left:0});
for (let i=0;i<items.length;i++){
  const [name,route]=items[i]; const c=i%COLS, r=Math.floor(i/COLS);
  const x=G+c*(W+G), y=54+G+r*(TH+LB+G);
  const top=await sharp(SP+'design-'+name+'.png').extract({left:0,top:0,width:1440,height:Math.min(1000,Math.min(H[name],2300))}).png().toBuffer(); const rz=await sharp(top).resize({width:W}).png().toBuffer(); const meta=await sharp(rz).metadata();
  const crop=await sharp(rz).extract({left:0,top:0,width:W,height:Math.min(TH,meta.height)}).png().toBuffer();
  const buf=await sharp({create:{width:W,height:TH,channels:3,background:'#e5e9ee'}}).composite([{input:crop,top:0,left:0}]).png().toBuffer();
  comps.push({input:buf,top:y+LB,left:x});
  comps.push({input:Buffer.from(`<svg width="${W}" height="${LB}"><rect width="${W}" height="${LB}" fill="#10233a"/><text x="8" y="14" font-family="Helvetica,Arial" font-size="13" font-weight="700" fill="#fff">${i+1}. ${esc(name)}</text><text x="8" y="29" font-family="Helvetica,Arial" font-size="11" fill="#b7c7d8">${esc(route)} · ${H[name]}px</text></svg>`),top:y,left:x});
}
await sharp({create:{width:CW,height:CH,channels:3,background:'#ffffff'}}).composite(comps).png().toFile('/Users/mac/Downloads/arc-next/audit/design-contact-sheet.png');
console.log(CW,CH);
