import fs from 'node:fs';
const SP=process.argv[2]+'/shots/';
const pages=[['Home','/'],['Alcohol','/alcohol'],['Auth','/auth'],['Blog','/blog'],['BlogPost','/blog/how-long-does-alcohol-detox-take'],['Centre','/centre'],['CentreOnboarding','/centre-onboarding'],['City','/city'],['ClaimListing','/claim-listing'],['ClaimTherapist','/claim-therapist'],['Contact','/contact'],['Drug','/drug'],['Intervention','/intervention'],['JoinDirectory','/join-directory'],['MenuOptions','/menu-options'],['Promote','/promote'],['ProviderDashboard','/provider-dashboard'],['Province','/province'],['TherapistOnboarding','/therapist-onboarding'],['TherapistProfile','/therapist-profile'],['Therapists','/therapists'],['TherapistsCity','/therapists-city'],['TherapistsProvince','/therapists-province']];
const tabs = await (await fetch('http://localhost:9333/json')).json();
const ws = new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
await new Promise(r=>ws.onopen=r);
let id=0; const pend={}; ws.onmessage=e=>{const m=JSON.parse(e.data); if(m.id&&pend[m.id]){pend[m.id](m.result);delete pend[m.id];}};
const send=(method,params={})=>new Promise(r=>{const i=++id;pend[i]=r;ws.send(JSON.stringify({id:i,method,params}));});
const ev=async(x)=>(await send('Runtime.evaluate',{expression:x,returnByValue:true,awaitPromise:true})).result.value;
const heights={};
for (const [name,route] of pages) {
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1});
  await send('Page.navigate',{url:'http://localhost:3200'+route}); await new Promise(r=>setTimeout(r,name==='ProviderDashboard'?7000:5000));
  await ev('(async()=>{for(let y=0;y<Math.min(document.body.scrollHeight,5000);y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,70));}window.scrollTo(0,0)})()');
  await new Promise(r=>setTimeout(r,600));
  const h=await ev('document.documentElement.scrollHeight'); heights[name]=h;
  const ch=Math.min(h,2300);
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:ch,deviceScaleFactor:1});
  await new Promise(r=>setTimeout(r,400));
  const s=await send('Page.captureScreenshot',{format:'png',clip:{x:0,y:0,width:1440,height:ch,scale:1}});
  fs.writeFileSync(SP+'design-'+name+'.png',Buffer.from(s.data,'base64'));
  console.log(name,h);
}
fs.writeFileSync(SP+'design-heights.json',JSON.stringify(heights));
process.exit(0);
