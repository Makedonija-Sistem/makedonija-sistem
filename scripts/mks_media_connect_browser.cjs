/* Media Connect isolated browser smoke: no external calls, no live media. */
"use strict";
const assert=require("node:assert/strict");
const {chromium}=require(process.env.MKS_PLAYWRIGHT_MODULE||"/tmp/mks-media-playwright/node_modules/playwright");
const entry=new URL(process.env.MKS_LOCAL_URL||"http://127.0.0.1:8786/media-connect/");
if(entry.protocol!=="http:"||!["127.0.0.1","localhost"].includes(entry.hostname)||
   !entry.pathname.endsWith("/media-connect/"))throw new Error("Loopback only");
(async()=>{
 let passes=0;const failures=[];
 const test=async(name,fn)=>{try{await fn();passes++;console.log("PASS "+name);}catch(e){failures.push({name,message:String(e)});console.error("FAIL "+name+": "+e);}};
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 try {
  const ctx=await browser.newContext({viewport:{width:1366,height:800}});
  const external=[],errors=[];
  await ctx.route("**/*",route=>{
   if(new URL(route.request().url()).origin!==entry.origin){external.push(route.request().url());return route.abort("blockedbyclient");}
   return route.continue();
  });
  const page=await ctx.newPage();page.on("pageerror",e=>errors.push(e.message));
  await test("catalog accessible",async()=>{
   const r=await page.goto(entry.href,{waitUntil:"networkidle"});assert.equal(r.status(),200);
   assert.match(await page.title(),/MEDIA CONNECT/);
   assert.equal(await page.locator("#capacity").count(),1);
  });
  await test("capacity plan reacts locally",async()=>{
   await page.locator("#speakers").evaluate(el=>{el.value="230";el.dispatchEvent(new Event("input",{bubbles:true}));});
   await page.locator("#viewers").evaluate(el=>{el.value="400";el.dispatchEvent(new Event("input",{bubbles:true}));});
   assert.equal(await page.locator("#speakerValue").textContent(),"230");
   assert.equal(await page.locator("#viewerValue").textContent(),"400");
   assert.match(await page.locator("#capacityMessage").textContent(),/630/);
  });
  await test("pilot videoroom is discoverable",async()=>{
   await page.locator('a[href="./room.html"]').click();
   assert.match(page.url(),/\/media-connect\/room.html$/);
   assert.equal(await page.locator("#joinButton").isDisabled(),true);
   assert.equal(await page.locator("#micButton").isDisabled(),true);
   assert.equal(await page.locator("#camButton").isDisabled(),true);
  });
  await test("pilot code never placed in URL or sent while disabled",async()=>{
   await page.locator("#accessCode").fill("abcdefghijklmnopqrstuvwxyzABCDEFGH1234");
   await page.locator("#role").selectOption("host");
   assert.equal(await page.locator("#joinButton").isDisabled(),true);
   assert.doesNotMatch(page.url(),/abcdefghijklmnopqrstuvwxyz/);
   assert.deepEqual(external,[]);
  });
  await test("desktop does not overflow",async()=>{
   const v=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,w:innerWidth}));
   assert.ok(v.scroll<=v.w+2,JSON.stringify(v));
  });
  await test("390px and 320px layouts do not overflow",async()=>{
   for(const width of [390,320]){
    await page.setViewportSize({width,height:760});
    const v=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,w:innerWidth}));
    assert.ok(v.scroll<=v.w+2,JSON.stringify(v));
    assert.equal(await page.locator("#joinButton").isDisabled(),true);
   }
  });
  await test("no script errors or outbound network calls",async()=>{
   assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  });
  if(process.env.MKS_MEDIA_SHOT==="1"){
   await page.screenshot({path:"/tmp/mks-media-mobile.png",fullPage:true});
   await page.setViewportSize({width:1366,height:800});
   await page.goto(entry.href,{waitUntil:"networkidle"});
   await page.screenshot({path:"/tmp/mks-media-desktop.png",fullPage:true});
  }
 }finally{await browser.close();}
 console.log(JSON.stringify({status:failures.length?"FAIL":"PASS",passed:passes,failed:failures.length,failures},null,2));
 if(failures.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
