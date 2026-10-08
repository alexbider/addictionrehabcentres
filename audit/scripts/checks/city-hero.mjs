// City / archive hero check: left column vs "At a glance" card (vertical centring, card height, scroll), name repeated in the list, overflow.
import fs from 'node:fs';
const R='/Users/mac/Downloads/arc-next';
const urls=JSON.parse(fs.readFileSync(`${R}/content/_index.json`,'utf8')).filter(e=>e.published&&(e.type==='city-archive'||e.type==='city')).map(e=>e.route);
const widths=(process.argv[3]||'1440,1024,768,390').split(',').map(Number);
async function tab(){const t=await (await fetch('http://localhost:9333/json/new?about:blank',{method:'PUT'})).json();const ws=new WebSocket(t.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);let id=0;const pend={};const waiters=[];
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pend[m.id]){pend[m.id](m.result);delete pend[m.id]}else if(m.method==='Page.loadEventFired')waiters.splice(0).forEach(f=>f())};
const send=(method,params={})=>new Promise(r=>{const i=++id;pend[i]=r;ws.send(JSON.stringify({id:i,method,params}))});await send('Page.enable');
return {ev:async x=>(await send('Runtime.evaluate',{expression:x,returnByValue:true})).result.value,go:async(u,w)=>{await send('Emulation.setDeviceMetricsOverride',{width:w,height:900,deviceScaleFactor:1,mobile:w<500});const p=new Promise(r=>waiters.push(r));await send('Page.navigate',{url:u});await Promise.race([p,new Promise(r=>setTimeout(r,20000))]);await new Promise(r=>setTimeout(r,500))}}}
const PROBE=`(()=>{const s=document.querySelector('[data-screen-label="City Hero"]');if(!s)return null;const g=s.querySelector('[data-rc-gap][data-cols]');const k=g?[...g.children]:[];const r=e=>e.getBoundingClientRect();
const card=k[1];const left=k[0];const ol=s.querySelector('ol[aria-label="Centres on this page"]');
const out={hero:Math.round(r(s).height),over:document.documentElement.scrollWidth-innerWidth,cols:g?getComputedStyle(g).gridTemplateColumns.split(' ').length:0};
if(left&&card&&out.cols>1){out.left=Math.round(r(left).height);out.card=Math.round(r(card).height);out.topGap=Math.round(r(left).top-r(g).top);out.botGap=Math.round(r(g).bottom-r(left).bottom);}
if(ol){out.listItems=ol.children.length;out.scrolls=ol.scrollHeight>ol.clientHeight+1;out.listH=Math.round(r(ol).height);
out.dup=[...ol.children].filter(li=>{const sp=li.querySelectorAll('a > span:nth-child(2) > span');if(sp.length<2)return false;const n=sp[0].innerText.trim().toLowerCase(),a=sp[1].innerText.trim().toLowerCase();return n&&a.startsWith(n)}).length;
out.dots=[...ol.querySelectorAll('li a > span:first-child')].filter(x=>x.innerText.trim()==='•').length}
return out})()`;
const res={};let next=0;
async function worker(){const t=await tab();while(next<urls.length){const u=urls[next++];res[u]={};for(const w of widths){await t.go('http://localhost:3100'+u,w);res[u][w]=await t.ev(PROBE)}}}
await Promise.all(Array.from({length:6},worker));
fs.writeFileSync(process.argv[2],JSON.stringify(res));
for(const w of widths){const rows=Object.values(res).map(r=>r[w]).filter(Boolean);const two=rows.filter(r=>r.left!=null);
console.log(w,JSON.stringify({pages:rows.length,over:rows.filter(r=>r.over>1).length,twoCol:two.length,maxTopGapDiff:two.length?Math.max(...two.map(r=>Math.abs(r.topGap-r.botGap))):0,cardTallerThanLeftBy:two.length?Math.max(...two.map(r=>r.card-r.left)):0,dupNames:rows.reduce((a,r)=>a+(r.dup||0),0),dots:rows.reduce((a,r)=>a+(r.dots||0),0),scrollLists:rows.filter(r=>r.scrolls).length,maxListH:Math.max(...rows.map(r=>r.listH||0))}))}
