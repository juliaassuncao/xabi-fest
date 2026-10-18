import fs from 'node:fs';
import path from 'node:path';
const pages=await(await fetch('http://127.0.0.1:9222/json/list')).json();
const ws=new WebSocket(pages.find(p=>p.type==='page').webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let id=0;const pending=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}};
const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id:n,method,params}))});
const run=async expression=>{const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw r.exceptionDetails;return r.result.value};
const pause=ms=>new Promise(r=>setTimeout(r,ms));

await call('Page.enable');await call('Runtime.enable');const errors=[];const base=ws.onmessage;ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params);base(e)};
await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
for(const [width,height]of [[320,568],[360,640],[375,667],[384,741],[390,844],[412,915],[430,932],[768,1024],[1280,800]]){
 await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:width===384?3.75:1,mobile:width<960});await call('Page.navigate',{url:'http://127.0.0.1:4173/'});await pause(800);await run('Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))).then(()=>document.fonts.ready)');
 if(await run(`!!document.querySelector('.audio-button')||!document.querySelector('audio').paused`))throw new Error('Initial audio incorrect');
 for(const selector of ['.primary-button','.replay-button']){
  const result=await run(`new Promise(resolve=>{const t=performance.now();let frames=0,overflow=0,controlLost=0,bgLost=0,seen=${selector==='.replay-button'};document.querySelector('${selector}').click();function frame(){frames++;if(document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight)overflow++;const button=document.querySelector('.audio-button'),r=button?.getBoundingClientRect();if(!r||r.top<0||r.bottom>innerHeight+.1)controlLost++;const bg=Number(getComputedStyle(document.querySelector('.party-scene__doodles')).opacity);if(bg>.074)seen=true;if(seen&&bg<.074)bgLost++;if(document.querySelector('.replay-button')&&performance.now()-t>500){const p=document.querySelector('.birthday-message').getBoundingClientRect(),rr=document.querySelector('.replay-button').getBoundingClientRect();resolve({frames,overflow,controlLost,bgLost,elapsed:performance.now()-t,paperVisible:p.top>=0&&p.bottom<=innerHeight,replayVisible:rr.bottom<=innerHeight,audioCount:document.querySelectorAll('audio').length,cupZ:getComputedStyle(document.querySelector('.party-item--drink')).zIndex});return;}if(performance.now()-t>14000){resolve({timeout:true});return;}requestAnimationFrame(frame)}requestAnimationFrame(frame)})`);console.log(JSON.stringify({width,height,selector,...result}));if(result.timeout||result.overflow||result.controlLost||result.bgLost||!result.paperVisible||!result.replayVisible||result.audioCount!==1||result.cupZ!=='50')process.exitCode=1;
 }
}
console.log('RUNTIME ERRORS',errors.length);if(errors.length)process.exitCode=1;ws.close();
