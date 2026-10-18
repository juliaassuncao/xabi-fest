import fs from 'node:fs';
import path from 'node:path';
const pages=await(await fetch('http://127.0.0.1:9222/json/list')).json();
const ws=new WebSocket(pages.find(p=>p.type==='page').webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let id=0;const pending=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}};
const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id:n,method,params}))});
const run=async expression=>{const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw r.exceptionDetails;return r.result.value};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
await call('Page.enable');await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
const output=[];
const sizes=[[384,741],[320,568],[360,640],[375,667],[390,844],[412,915],[430,932],[768,1024],[1280,800],[350,760],[400,700],[400,701],[600,800],[820,1180],[384,641],[384,841]];
for(const [width,height]of sizes){
 await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:width===384&&height===741?3.75:1,mobile:width<960});
 await call('Page.navigate',{url:process.env.QA_URL||'http://127.0.0.1:5174/'});await pause(650);await run('Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))).then(()=>document.fonts.ready)');
 if(width===384&&height===741){await run(`document.querySelector('.site').style.height='741.5999755859375px'`);await pause(100)}
 for(const state of ['initial','final']){
  if(state==='final'){await run('document.querySelector(".primary-button").click()');await pause(100)}
  const snapshot=await run(`(()=>{const box=e=>e.getBoundingClientRect().toJSON(),q=s=>document.querySelector(s),stage=q('.party-scene');return{viewport:[innerWidth,innerHeight],scroll:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],scene:{...box(stage),clientWidth:stage.clientWidth,clientHeight:stage.clientHeight},paper:box(q('.birthday-message')),paperHeight:q('.birthday-message').offsetHeight,paperPadding:getComputedStyle(q('.birthday-message')).padding,free:stage.clientHeight-q('.birthday-message').offsetHeight-10,header:box(q('.birthday-card__header')),footer:box(q('.birthday-card__footer')),banner:box(q('.party-scene__banner')),items:Object.fromEntries([...document.querySelectorAll('.party-item')].map(e=>{const s=getComputedStyle(e),img=e.querySelector('img');return[e.dataset.collageItem,{left:parseFloat(s.left),top:parseFloat(s.top),width:parseFloat(s.width),height:parseFloat(s.height),tilt:s.getPropertyValue('--sticker-tilt'),z:s.zIndex,ratio:img.naturalHeight/img.naturalWidth,...{rect:box(e)}}]})),audio:!!q('.audio-button'),replay:q('.replay-button')?box(q('.replay-button')):null};})()`);
  output.push({width,height,state,...snapshot});console.log(JSON.stringify({width,height,state,scene:[snapshot.scene.clientWidth,snapshot.scene.clientHeight],paper:snapshot.paper.height,free:snapshot.free,scroll:snapshot.scroll}));
  if(width===384&&height===741){const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(process.env.TEMP,`xabi-reference-${process.argv[2]||'before'}-${state}.png`),Buffer.from(shot.data,'base64'));}
 }
 if(process.argv[2]!=='before'&&[320,375,430,768,1280,350,600].includes(width)){const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(process.env.TEMP,`xabi-composition-${width}-${height}.png`),Buffer.from(shot.data,'base64'));}
}
fs.writeFileSync(path.join(process.env.TEMP,'xabi-composition-'+(process.argv[2]||'after')+'.json'),JSON.stringify(output));ws.close();
