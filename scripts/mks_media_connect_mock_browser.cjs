/* MEDIA CONNECT v0.3: real frontend operations against an IN-MEMORY mocked SDK.
 * No network to LiveKit, Cloudflare or other real providers. Loopback only.
 */
"use strict";
const assert=require("node:assert/strict");
const {chromium}=require(process.env.MKS_PLAYWRIGHT_MODULE||"/tmp/mks-media-playwright/node_modules/playwright");
const base=new URL(process.env.MKS_LOCAL_URL||"http://127.0.0.1:8786/media-connect/");
if(base.protocol!=="http:"||!["localhost","127.0.0.1"].includes(base.hostname)||
   !base.pathname.endsWith("/media-connect/"))throw new Error("Loopback only");

const FAKE_ENDPOINT="https://pilot.example.test/api/join";
const FAKE_SDK="https://cdn.jsdelivr.net/npm/livekit-client@2.23.0/dist/livekit-client.umd.min.js";
let passed=0;const failures=[];
async function check(label,fn){
 try{await fn();passed++;console.log("PASS "+label);}
 catch(e){failures.push(label+": "+String(e.stack||e));console.error("FAIL "+label+" "+e);}
}
async function scenario(browser,role){
 const context=await browser.newContext({viewport:{width:980,height:760}});
 const requests=[],pageErrors=[];
 await context.route("**/*",route=>{
  const url=new URL(route.request().url());
  if(url.origin===base.origin)return route.continue();
  requests.push(url.href);return route.abort("blockedbyclient");
 });
 const page=await context.newPage();
 page.on("pageerror",e=>pageErrors.push(e.message));
 await page.addInitScript(()=>{
  window.LivekitClient={
   RoomEvent:{TrackSubscribed:"track_subscribed",TrackUnsubscribed:"track_unsubscribed",
    ParticipantDisconnected:"participant_disconnected",Disconnected:"disconnected"},
   Room:class {
    constructor(){
     this.state="disconnected";this.handlers={};
     this.localParticipant={
      isMicrophoneEnabled:false,isCameraEnabled:false,
      setMicrophoneEnabled:async value=>{this.localParticipant.isMicrophoneEnabled=value;},
      setCameraEnabled:async value=>{this.localParticipant.isCameraEnabled=value;}
     };
     window.__mockRoom=this;
    }
    on(type,fn){this.handlers[type]=fn;return this;}
    async connect(url,token){this.state="connected";window.__mockConnected={url,token};}
    async startAudio(){window.__mockAudio=true;}
    disconnect(){
     this.state="disconnected";
     if(this.handlers.disconnected)this.handlers.disconnected();
    }
   }
  };
 });
 await page.route("**/media-connect/room-config.js",route=>route.fulfill({
   status:200,contentType:"application/javascript",
   body:"window.MKS_MEDIA_ROOM_CONFIG=Object.freeze({enabled:true,tokenEndpoint:'"+FAKE_ENDPOINT+"',clientSdkUrl:'"+FAKE_SDK+"'});"
 }));
 await page.route(FAKE_ENDPOINT,async route=>{
  const body=route.request().postDataJSON();
  assert.equal(Object.keys(body).join(","),"code");
  assert.equal(body.code,"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
  await route.fulfill({status:200,contentType:"application/json",
   headers:{"Cache-Control":"no-store"},
   body:JSON.stringify({serverUrl:"wss://livekit.mock.test",token:"FAKE.JWT.TOKEN",role,expiresIn:120})});
 });
 const res=await page.goto(new URL("room.html",base).href,{waitUntil:"networkidle"});
 assert.equal(res.status(),200);
 await check(role+" token-gated join is only on explicit submit",async()=>{
  assert.equal(await page.locator("#joinButton").isEnabled(),true);
  assert.equal(await page.locator("#role").isDisabled(),true);
  assert.equal(await page.evaluate(()=>window.__mockConnected||null),null);
  await page.locator("#accessCode").fill("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
  await page.locator("#joinButton").click();
  await page.locator("#leaveButton").waitFor({state:"visible"});
  await page.waitForFunction(()=>document.querySelector("#joinButton").disabled===true);
  assert.equal(await page.locator("#role").inputValue(),role);
  assert.equal(await page.locator("#accessCode").inputValue(),"");
  assert.deepEqual(await page.evaluate(()=>window.__mockConnected),{
   url:"wss://livekit.mock.test",token:"FAKE.JWT.TOKEN"
  });
 });
 await check(role+" camera/microphone rights enforced by UI",async()=>{
  if(role==="viewer"){
   assert.equal(await page.locator("#micButton").isDisabled(),true);
   assert.equal(await page.locator("#camButton").isDisabled(),true);
  }else{
   assert.equal(await page.locator("#micButton").isEnabled(),true);
   await page.locator("#micButton").click();
   assert.equal(await page.locator("#micButton").getAttribute("aria-pressed"),"true");
   assert.equal(await page.evaluate(()=>window.__mockRoom.localParticipant.isMicrophoneEnabled),true);
   await page.locator("#camButton").click();
   assert.equal(await page.locator("#camButton").getAttribute("aria-pressed"),"true");
   assert.equal(await page.evaluate(()=>window.__mockRoom.localParticipant.isCameraEnabled),true);
  }
 });
 await check(role+" remote subscription renders and removes media",async()=>{
  await page.evaluate(()=>{
   const track={kind:"video",sid:"T001",
    attach:()=>document.createElement("video"),detach:()=>[]};
   window.__mockRoom.handlers.track_subscribed(track,{trackSid:"T001"},{identity:"remote1",name:"Test Guest"});
  });
  assert.equal(await page.locator(".trackCard video").count(),1);
  await page.locator("#leaveButton").click();
  assert.equal(await page.locator(".trackCard video").count(),0);
  assert.equal(await page.locator("#joinButton").isEnabled(),true);
 });
 await check(role+" no real external calls or unhandled browser errors",async()=>{
  assert.deepEqual(requests,[]);
  assert.deepEqual(pageErrors,[]);
 });
 await context.close();
}
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 try{
  for(const role of ["viewer","speaker","host"])await scenario(browser,role);
 }finally{await browser.close();}
 console.log(JSON.stringify({status:failures.length?"FAIL":"PASS",passed,failed:failures.length,failures},null,2));
 if(failures.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});