/* May 2026 preservation: real Chromium navigation and inert archival smoke. */
"use strict";
const assert=require("node:assert/strict");
const {chromium}=require(process.env.MKS_PLAYWRIGHT_MODULE||"/tmp/mks-may-playwright/node_modules/playwright");
const root=new URL(process.env.MKS_LOCAL_URL||"http://127.0.0.1:8786/");
if(root.protocol!=="http:"||!["localhost","127.0.0.1"].includes(root.hostname))throw Error("loopback HTTP only");
let passed=0;const failures=[];
async function check(name,task){try{await task();passed++;console.log("PASS "+name);}catch(e){failures.push({name,error:String(e.stack||e)});console.error("FAIL "+name+" "+e);}}
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 try{
  const context=await browser.newContext({viewport:{width:1366,height:900}});
  const external=[],errors=[];
  await context.route("**/*",route=>{
    const url=new URL(route.request().url());
    if(url.origin===root.origin)return route.continue();
    external.push(url.href);return route.abort("blockedbyclient");
  });
  const page=await context.newPage();page.on("pageerror",e=>errors.push(e.message));
  const lib=new URL("heritage/index.html",root).href, archive=new URL("heritage/may-2026-v17-readonly.html",root).href;
  await check("root contains 16 real May content modules and heritage entry",async()=>{
   const response=await page.goto(root.href,{waitUntil:"domcontentloaded",timeout:45000});
   assert.equal(response.status(),200);
   assert.equal(await page.locator('[data-mks-may-origin="historical"]').count(),16);
   assert.equal(await page.locator("#heritage-may").count(),1);
   assert.equal(await page.locator("#wpGrid .wp-card").count(),61);
   const h=await page.locator("#robotika-macedonia").innerText();assert.ok(h.length>600);
  });
  await check("recovered 42-media directory filters locally with no bulk send",async()=>{
   const media=page.locator("#media-hub");
   await page.waitForFunction(()=>document.querySelector("#media-hub")?.dataset.mksMayMediaReady==="true");
   assert.equal(await media.locator(".mh-card").count(),42);
   const input=media.locator("#mhSearch");assert.equal(await input.isEnabled(),true);
   await media.locator('button[data-may-safe-filter][data-cat="tv"]').click();
   assert.equal(await media.locator(".mh-card:not([hidden])").count(),10);
   await input.fill("Sitel");
   assert.equal(await media.locator(".mh-card:not([hidden])").count(),1);
   assert.equal(await media.locator(".mh-bulk-actions button:not([disabled])").count(),0);
   await input.fill("");
   await media.locator('button[data-may-safe-filter][data-cat="all"]').click();
   assert.equal(await media.locator(".mh-card:not([hidden])").count(),42);
  });
  await check("May archive directly accessible from main menu",async()=>{
   const nav=page.locator('#navLinks details[data-group="home"]');
   // The link belongs to an existing nav group; find the parent via its own href.
   const a=page.locator('#navLinks a[href="./heritage/index.html"]');
   assert.equal(await a.count(),1);
   const parent=a.locator("xpath=ancestor::details[1]");
   await parent.locator("summary").click();
   await a.click();
   await page.waitForURL(lib);
   assert.match(await page.title(),/Мајска ризница/);
  });
  await check("search shows all 58 original sections and 26 documents",async()=>{
   await page.waitForFunction(()=>document.querySelectorAll(".library-card").length===58);
   assert.equal(await page.locator(".library-card").count(),58);
   assert.equal(await page.locator("#documentList .doc-row").count(),26);
   assert.match(await page.locator("#summary").textContent(),/58 од 58/);
  });
  await check("May library search, status filters and reset work",async()=>{
   await page.locator("#state").selectOption("gated");
   assert.equal(await page.locator(".library-card").count(),27);
   await page.locator("#state").selectOption("restored");
   assert.equal(await page.locator(".library-card").count(),16);
   await page.locator("#search").fill("robotika");
   assert.ok((await page.locator(".library-card").count())>=1);
   await page.locator("#reset").click();
   assert.equal(await page.locator(".library-card").count(),58);
  });
  await check("May full historical portal retains all 58 anchors",async()=>{
   const response=await page.locator('a[href="./may-2026-v17-readonly.html"]').click();
   await page.waitForURL(archive);
   assert.equal(await page.locator("section[id]").count(),58);
   assert.equal(await page.locator("#may-recovery-nav a[href^='#']").count(),58);
   assert.equal(await page.locator('script').count(),0);
   assert.ok((await page.locator("body").innerText()).length>45000);
  });
  await check("original forms and buttons are inert, historic status visible",async()=>{
   assert.equal(await page.locator('button:not([disabled])').count(),0);
   assert.equal(await page.locator('input:not([disabled])').count(),0);
   assert.equal(await page.locator('form').count()>0,true);
   assert.match(await page.locator("#may-recovery-nav").innerText(),/не активна јавна/);
   const source=await page.locator('meta[http-equiv="Content-Security-Policy"]').last().getAttribute("content");
   assert.match(source,/script-src 'none'/);
   assert.match(source,/form-action 'none'/);
  });
  await check("navigating to old section preserves anchor",async()=>{
   await page.locator('#may-recovery-nav a[href="#municipalities"]').click();
   await page.waitForFunction(()=>location.hash==="#municipalities");
   assert.equal(await page.locator('#municipalities').count(),1);
  });
  await check("dedicated library works on 320px mobile width",async()=>{
   await page.setViewportSize({width:320,height:740});
   await page.goto(lib,{waitUntil:"domcontentloaded",timeout:45000});
   await page.waitForFunction(()=>document.querySelectorAll(".library-card").length===58);
   const dims=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(dims.scroll<=dims.w+2,JSON.stringify(dims));
   await page.locator("#search").fill("municipalities");
   assert.ok((await page.locator(".library-card").count())>=1);
   await page.locator("#reset").click();
  });
  await check("archive and library do not make uncaught runtime errors",async()=>{
   assert.deepEqual(errors,[]);
   assert.ok(external.every(url=>["fonts.googleapis.com","www.gstatic.com","challenges.cloudflare.com"].includes(new URL(url).hostname)),JSON.stringify(external.slice(0,10)));
  });
  await context.close();
 }finally{await browser.close();}
 console.log(JSON.stringify({status:failures.length?"FAIL":"PASS",passed,failed:failures.length,failures},null,2));
 if(failures.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
