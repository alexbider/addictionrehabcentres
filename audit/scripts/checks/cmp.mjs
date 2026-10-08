import fs from 'node:fs'; import { createRequire } from 'node:module';
const sharp=createRequire('/Users/mac/Downloads/arc-next/package.json')('sharp');
const SP=process.argv[2]; const route=process.argv[3]||'/';
const tabs = await (await fetch('http://localhost:9333/json')).json();
const ws = new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
await new Promise(r=>ws.onopen=r);
let id=0; const pend={}; ws.onmessage=e=>{const m=JSON.parse(e.data); if(m.id&&pend[m.id]){pend[m.id](m.result);delete pend[m.id];}};
const send=(method,params={})=>new Promise(r=>{const i=++id;pend[i]=r;ws.send(JSON.stringify({id:i,method,params}));});
const ev=async(x)=>(await send('Runtime.evaluate',{expression:x,returnByValue:true,awaitPromise:true})).result.value;
const out={};
for (const [k,port] of [['orig',3200],['new',3100]]) {
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1});
  await send('Page.navigate',{url:`http://localhost:${port}${route}`}); await new Promise(r=>setTimeout(r,5500));
  await ev('(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}window.scrollTo(0,0)})()');
  await new Promise(r=>setTimeout(r,800));
  const h=await ev('document.documentElement.scrollHeight'); const text=await ev('document.body.innerText.replace(/\\s+/g," ")');
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:Math.min(h,3000),deviceScaleFactor:1});
  await new Promise(r=>setTimeout(r,600));
  const s=await send('Page.captureScreenshot',{format:'png',clip:{x:0,y:0,width:1440,height:Math.min(h,3000),scale:1}});
  fs.writeFileSync(`${SP}/shots/cmp-${k}.png`,Buffer.from(s.data,'base64')); out[k]={h,text};
}
const a=await sharp(`${SP}/shots/cmp-orig.png`).raw().toBuffer({resolveWithObject:true}); const b=await sharp(`${SP}/shots/cmp-new.png`).raw().toBuffer({resolveWithObject:true});
let diff=0,n=Math.min(a.data.length,b.data.length); for(let i=0;i<n;i+=3){ if(Math.abs(a.data[i]-b.data[i])+Math.abs(a.data[i+1]-b.data[i+1])+Math.abs(a.data[i+2]-b.data[i+2])>40) diff++; }
console.log(route,'heights',out.orig.h,out.new.h,'| text identical:',out.orig.text===out.new.text,'| pixel diff %',(100*diff/(n/3)).toFixed(3),'| sizes',a.info.width+'x'+a.info.height,b.info.width+'x'+b.info.height);
fs.writeFileSync(SP+'/shots/cmp-text.json',JSON.stringify({o:out.orig.text.slice(0,300),n:out.new.text.slice(0,300)}));
process.exit(0);
