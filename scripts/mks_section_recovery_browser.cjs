"use strict";
const assert=require("node:assert/strict");
const {chromium}=require(process.env.MKS_PLAYWRIGHT_MODULE||"/tmp/mks-section-playwright/node_modules/playwright");
const base=new URL(process.env.MKS_LOCAL_URL||"http://127.0.0.1:8786/");
if(base.protocol!=="http:"||!["127.0.0.1","localhost"].includes(base.hostname))throw Error("Loopback only");
const directory=new URL("research/municipalities/index.html",base).href;
const errs=[],unexpected=[];
let passed=0;const failures=[];
async function check(name,fn){try{await fn();passed++;console.log("PASS "+name);}catch(e){failures.push({name,error:String(e.stack||e)});console.error("FAIL "+name+": "+e);}}
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 try{
  const context=await browser.newContext({viewport:{width:1366,height:800}});
  await context.route("**/*",route=>{
   const u=new URL(route.request().url());
   if(u.origin===base.origin)return route.continue();
   unexpected.push(u.href);return route.abort("blockedbyclient");
  });
  const page=await context.newPage();
  page.on("pageerror",e=>errs.push(e.message));
  await check("desktop portal opens and municipality link follows fragment",async()=>{
   let r=await page.goto(base.href,{waitUntil:"domcontentloaded",timeout:45000});assert.equal(r.status(),200);
   const nav=page.locator('#navLinks details[data-group="citizens"]');
   await nav.locator("summary").click();
   await nav.locator('a[href="#municipalities"]').click();
   await page.waitForFunction(()=>location.hash==="#municipalities");
   assert.equal(await page.locator("#municipalities").isVisible(),true);
   assert.equal(await page.locator('#municipalities a[href="./research/municipalities/index.html"]').isVisible(),true);
  });
  await check("municipality page is functional and contains 80 names",async()=>{
   let r=await page.locator('#municipalities a[href="./research/municipalities/index.html"]').click();
   await page.waitForURL(directory);
   await page.waitForFunction(()=>document.querySelectorAll("#regionResults li").length===80);
   assert.equal(await page.locator("#regionResults .region-card").count(),8);
   assert.equal(await page.locator("#regionResults li").count(),80);
   assert.match(await page.locator("#resultsSummary").textContent(),/80/);
   assert.match(await page.locator("main").textContent(),/Државен завод за статистика/);
   assert.doesNotMatch(await page.locator("main").textContent(),/Активен координатор|59 координатори|ЗЕЛС — Партнер/);
  });
  await check("archive restores 80 per-municipality gov.mk website contacts",async()=>{
   const links=page.locator("#regionResults li .web-link");
   assert.equal(await links.count(),80);
   const hrefs=await links.evaluateAll(items=>items.map(a=>a.getAttribute("href")));
   assert.equal(new Set(hrefs).size,80);
   assert.ok(hrefs.every(h=>/^https:\/\/[a-z0-9.-]+\.gov\.mk\/$/.test(h)),hrefs.join(","));
   assert.equal(await page.locator("#municipalityMap .region-shape").count(),8);
   assert.equal(await page.locator("#municipalityMap .region-shape[aria-pressed='true']").count(),0);
 });
  await check("original SVG region click and keyboard selection filter the directory",async()=>{
   const polog=page.locator('#municipalityMap .region-shape[data-region="polog"]');
   await polog.click();
   assert.equal(await page.locator("#regionSelect").inputValue(),"polog");
   assert.equal(await page.locator("#regionResults li").count(),9);
   assert.equal(await polog.getAttribute("aria-pressed"),"true");
   await polog.focus();await polog.press("Enter");
   assert.equal(await page.locator("#regionSelect").inputValue(),"all");
   assert.equal(await page.locator("#regionResults li").count(),80);
   const skopje=page.locator('#municipalityMap .region-shape[data-region="skopje"]');
   await skopje.focus();await skopje.press("Space");
   assert.equal(await page.locator("#regionSelect").inputValue(),"skopje");
   assert.equal(await page.locator("#regionResults li").count(),17);
   await page.locator("#mapReset").click();
   assert.equal(await page.locator("#regionResults li").count(),80);
 });
  await check("archived municipality detail opens without invented live statuses",async()=>{
   const items=page.locator("#regionResults li");
   await items.first().locator("details summary").click();
   const text=await items.first().locator("details").innerText();
   assert.match(text,/Седиште\/центар/);
   assert.match(text,/архивски запис/);
   assert.doesNotMatch(text,/Активен координатор|ЗЕЛС — Партнер/);
 });
  await check("search and reset",async()=>{
   await page.locator("#munSearch").fill("Охрид");
   assert.equal(await page.locator("#regionResults li").count(),1);
   assert.equal(await page.locator("#regionResults li strong").first().textContent(),"Охрид");
   await page.locator("#clearFilters").click();
   assert.equal(await page.locator("#regionResults li").count(),80);
  });
  await check("region filter has exact counts",async()=>{
   await page.locator("#regionSelect").selectOption("skopje");
   assert.equal(await page.locator("#regionResults li").count(),17);
   await page.locator("#regionSelect").selectOption("polog");
   assert.equal(await page.locator("#regionResults li").count(),9);
   await page.locator("#regionSelect").selectOption("northeast");
   assert.equal(await page.locator("#regionResults li").count(),6);
  });
  await check("zero-results feedback accessible",async()=>{
   await page.locator("#regionSelect").selectOption("all");
   await page.locator("#munSearch").fill("Нема-Таква-Општина-ХХХ");
   assert.equal(await page.locator("#regionResults li").count(),0);
   assert.equal(await page.locator("#emptyResults").isVisible(),true);
   await page.locator("#clearFilters").click();
  });
  await check("320 and 390 px municipality layout has no horizontal overflow",async()=>{
   for(const width of [320,390]){
    await page.setViewportSize({width,height:780});
    const v=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
    assert.ok(v.scroll<=v.width+2,JSON.stringify(v));
    assert.equal(await page.locator("#munSearch").isVisible(),true);
   }
  });
  await check("no exceptions or external network calls in directory",async()=>{
   assert.deepEqual(errs,[]);
   // The existing root HTML requests Google Fonts; the test blocks it.
   // The new directory itself has no external network dependency.
   assert.ok(unexpected.every(url=>new URL(url).hostname==="fonts.googleapis.com"),JSON.stringify(unexpected));
  });
  await context.close();
  const mctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const other=[];
  await mctx.route("**/*",route=>{
   const u=new URL(route.request().url());
   if(u.origin===base.origin)return route.continue();
   other.push(u.href);return route.abort("blockedbyclient");
  });
  const mobile=await mctx.newPage();
  const mobileErrors=[];
  mobile.on("pageerror",e=>mobileErrors.push(e.message));
  await check("mobile municipality nav closes drawer and scrolls to anchor",async()=>{
   let r=await mobile.goto(base.href,{waitUntil:"domcontentloaded",timeout:45000});assert.equal(r.status(),200);
   const toggle=mobile.locator("#menuToggle");
   await toggle.click();
   await mobile.locator('#navLinks details[data-group="citizens"] summary').click();
   await mobile.locator('#navLinks a[href="#municipalities"]').click();
   await mobile.waitForFunction(()=>location.hash==="#municipalities");
   await mobile.waitForFunction(()=>!document.querySelector("#navLinks").classList.contains("open"));
   assert.equal(await mobile.locator("#municipalities").isVisible(),true);
   assert.deepEqual(mobileErrors,[]);
   assert.ok(other.every(url=>new URL(url).hostname==="fonts.googleapis.com"),JSON.stringify(other));
  });
  await mctx.close();
 }finally{await browser.close();}
 console.log(JSON.stringify({status:failures.length?"FAIL":"PASS",passed,failed:failures.length,failures},null,2));
 if(failures.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});