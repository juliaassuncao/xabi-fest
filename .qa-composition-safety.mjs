import fs from 'node:fs';
import path from 'node:path';
const pages=await(await fetch('http://127.0.0.1:9222/json/list')).json();
const ws=new WebSocket(pages.find(p=>p.type==='page').webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let id=0;const pending=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}};
const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id:n,method,params}))});
const run=async expression=>{const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw r.exceptionDetails;return r.result.value};
const pause=ms=>new Promise(r=>setTimeout(r,ms));

function inspect(){
 const paper=document.querySelector('.birthday-message'),cup=document.querySelector('.party-item--drink'),image=cup.querySelector('img');
 const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);const rgba=ctx.getImageData(0,0,canvas.width,canvas.height).data;
 const rect=image.getBoundingClientRect(),style=getComputedStyle(image),cardMatrix=new DOMMatrix(getComputedStyle(document.querySelector('.birthday-card')).transform);const w=parseFloat(style.width)*cardMatrix.a,h=parseFloat(style.height)*cardMatrix.a,angle=parseFloat(getComputedStyle(cup).getPropertyValue('--sticker-tilt'))*Math.PI/180,cos=Math.cos(angle),sin=Math.sin(angle);let covered=0;
 const walker=document.createTreeWalker(paper,NodeFilter.SHOW_TEXT);for(let node=walker.nextNode();node;node=walker.nextNode())for(let i=0;i<node.length;i++){if(!node.textContent[i].trim())continue;const r=document.createRange();r.setStart(node,i);r.setEnd(node,i+1);const b=r.getBoundingClientRect();for(const fx of [.2,.5,.8])for(const fy of [.2,.5,.8]){const dx=b.x+b.width*fx-rect.x-rect.width/2,dy=b.y+b.height*fy-rect.y-rect.height/2,x=(cos*dx+sin*dy+w/2)/w,y=(-sin*dx+cos*dy+h/2)/h;if(x>=0&&x<1&&y>=0&&y<1&&rgba[(Math.floor(y*canvas.height)*canvas.width+Math.floor(x*canvas.width))*4+3]>24)covered++;}}
 const scene=document.querySelector('.party-scene'),site=document.querySelector('.site'),pr=paper.getBoundingClientRect(),ar=document.querySelector('.audio-button')?.getBoundingClientRect(),rr=document.querySelector('.replay-button')?.getBoundingClientRect();
 return{covered,scroll:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],viewport:[innerWidth,innerHeight],paperVisible:pr.top>=0&&pr.bottom<=innerHeight&&pr.left>=0&&pr.right<=innerWidth,audioVisible:!!ar&&ar.bottom<=innerHeight,replayVisible:!!rr&&rr.bottom<=innerHeight,bodyFont:getComputedStyle(paper.querySelector('p')).fontSize,density:site.style.getPropertyValue('--message-density'),guard:[scene.style.getPropertyValue('--drink-safe-x'),scene.style.getPropertyValue('--drink-safe-y')],broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src)};
}
await call('Page.enable');await call('Runtime.enable');await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
const errors=[];const listener=ws.onmessage;ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params);listener(e)};
for(const [width,height]of [[320,568],[360,640],[375,667],[384,741],[390,844],[412,915],[430,932],[768,1024],[1280,800],[350,760],[400,700],[400,701],[600,800],[820,1180]]){
 await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:width===384?3.75:1,mobile:width<960});await call('Page.navigate',{url:process.env.QA_URL||'http://127.0.0.1:5174/'});await pause(800);await run('Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))).then(()=>document.fonts.ready)');await run(`document.querySelector('.primary-button').click()`);await pause(100);const result=await run('('+inspect.toString()+')()');console.log(JSON.stringify({width,height,...result}));if(result.covered||!result.paperVisible||!result.audioVisible||!result.replayVisible||result.scroll[0]>width||result.scroll[1]>height||result.broken.length)process.exitCode=1;
}
console.log('RUNTIME ERRORS',errors.length);if(errors.length)process.exitCode=1;ws.close();
