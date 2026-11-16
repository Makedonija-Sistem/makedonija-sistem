/* Browser QA: May archive five-language titles, no network or deployment. */
"use strict";
const assert=require("node:assert/strict");
const {chromium}=require(process.env.MKS_PLAYWRIGHT_MODULE||"/tmp/mks-heritage-playwright/node_modules/playwright");
const origin=new URL(process.env.MKS_HERITAGE_LOCAL_URL||"http://127.0.0.1:8795/");
if(origin.protocol!=="http:"||!["localhost","127.0.0.1"].includes(origin.hostname))throw Error("Loopback only");
const site=new URL("heritage/index.html",origin);
const archive=new URL("heritage/may-2026-v17-readonly.html",origin);
let passed=0;const failures=[];
async function check(name,task){
  try{await task();passed++;console.log("PASS "+name);}
  catch(err){failures.push({name,error:String(err.stack||err)});console.error("FAIL "+name+" "+err);}
}
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 try{
  const ctx=await browser.newContext({viewport:{width:1440,height:900}});
  const offsite=[],errors=[];
  await ctx.route("**/*",route=>{
    const url=new URL(route.request().url());
    if(url.origin!==origin.origin){offsite.push(url.href);return route.abort("blockedbyclient");}
    return route.continue();
  });
  const page=await ctx.newPage();page.on("pageerror",e=>errors.push(e.message));
  await check("five-language catalogue and all source documents",async()=>{
    const r=await page.goto(site.href,{waitUntil:"domcontentloaded",timeout:45000});
    assert.equal(r.status(),200);
    await page.waitForFunction(()=>document.querySelectorAll(".library-card").length===58,{timeout:12000});
    assert.equal(await page.locator(".heritage-lang-btn").count(),5);
    assert.equal(await page.locator(".library-card").count(),58);
    assert.equal(await page.locator("#documentList .doc-row").count(),26);
    assert.match(await page.locator("#summary").innerText(),/58 од 58/);
  });
  await check("all language choices and return to original MK",async()=>{
    const checks=[
      ["en","en","May Heritage Library","Map of municipalities"],
      ["al","sq","Arkivi i majit","Harta e komunave"],
      ["sr","sr","Мајска ризница","Мапа општина"],
      ["de","de","Archivschatz Mai 2026","Karte der Gemeinden"],
      ["mk","mk","Мајска ризница","Карта на општини"]
    ];
    for(const [lang,langTag,heading,needle] of checks){
      await page.locator('.heritage-lang-btn[data-lang="'+lang+'"]').click();
      assert.equal(await page.locator("html").getAttribute("lang"),langTag);
      assert.equal(await page.locator('.heritage-lang-btn[data-lang="'+lang+'"]').getAttribute("aria-pressed"),"true");
      assert.equal(await page.locator("h1").innerText(),heading);
      assert.ok((await page.locator("#sectionList").innerText()).includes(needle),lang+" title not found");
      assert.equal(await page.locator(".library-card").count(),58);
    }
  });
  await check("localized and source-language search, status filter and reset",async()=>{
    await page.locator('.heritage-lang-btn[data-lang="en"]').click();
    await page.locator("#search").fill("municipalities");
    assert.ok((await page.locator(".library-card").count())>=1);
    await page.locator("#search").fill("општини");
    assert.ok((await page.locator(".library-card").count())>=1);
    await page.locator("#search").fill("");
    for(const [status,count] of [["gated",27],["restored",16],["preserved",15]]){
      await page.locator("#state").selectOption(status);
      assert.equal(await page.locator(".library-card").count(),count);
    }
    await page.locator("#reset").click();
    assert.equal(await page.locator(".library-card").count(),58);
  });
  await check("deep links distinguish original full text from translated catalogue",async()=>{
    const card=page.locator(".library-card").first();
    const hrefs=await card.locator("a").evaluateAll(nodes=>nodes.map(n=>n.getAttribute("href")));
    assert.equal(hrefs.length,2);
    assert.equal(hrefs[0],"../index.html?lang=en#dashboard");
    assert.equal(hrefs[1],"./may-2026-v17-readonly.html#dashboard");
    assert.match(await page.locator("#translationScope").innerText(),/not full machine translation/i);
    assert.match(await card.locator(".translation-state").innerText(),/full text remains/i);
    assert.ok((await card.locator(".original-title").innerText()).includes("Пулс на Македонија"));
  });
  await check("URL-selected language works without cookies or persisted data",async()=>{
    await page.goto(site.href+"?lang=de",{waitUntil:"domcontentloaded"});
    await page.waitForFunction(()=>document.querySelector("html")?.getAttribute("lang")==="de");
    assert.equal(await page.locator("h1").innerText(),"Archivschatz Mai 2026");
    assert.equal(await page.evaluate(()=>localStorage.length),0);
    assert.equal(await page.evaluate(()=>sessionStorage.length),0);
    assert.equal(await page.evaluate(()=>document.cookie),"");
  });
  const archiveExternalStart=offsite.length;
  await check("historic original is still inert and has all 58 anchors",async()=>{
    const r=await page.goto(archive.href+"#municipalities",{waitUntil:"domcontentloaded",timeout:45000});
    assert.equal(r.status(),200);
    assert.equal(await page.locator("section[id]").count(),58);
    assert.equal(await page.locator("script").count(),0);
    assert.equal(await page.locator('form button:not([disabled])').count(),0);
    assert.equal(await page.locator("#municipalities").count(),1);
  });
  await check("no unsafe third-party requests or JavaScript exceptions",async()=>{
    assert.deepEqual(offsite.slice(0,archiveExternalStart),[]);
    assert.ok(offsite.slice(archiveExternalStart).every(u=>["fonts.googleapis.com","fonts.gstatic.com","www.gstatic.com","challenges.cloudflare.com"].includes(new URL(u).hostname)),JSON.stringify(offsite.slice(archiveExternalStart)));
    assert.deepEqual(errors,[]);
  });
  await ctx.close();
  const mobile=await browser.newContext({viewport:{width:320,height:740},isMobile:true,hasTouch:true});
  const small=await mobile.newPage(),mobileErr=[];
  small.on("pageerror",e=>mobileErr.push(e.message));
  await check("320px mobile language toolbar stays usable without overflow",async()=>{
    const r=await small.goto(site.href+"?lang=al",{waitUntil:"domcontentloaded",timeout:45000});
    assert.equal(r.status(),200);
    await small.waitForFunction(()=>document.querySelectorAll(".library-card").length===58);
    assert.equal(await small.locator("html").getAttribute("lang"),"sq");
    const dim=await small.evaluate(()=>({w:innerWidth,sw:document.documentElement.scrollWidth}));
    assert.ok(dim.sw<=dim.w+2,JSON.stringify(dim));
    await small.locator('.heritage-lang-btn[data-lang="de"]').click();
    assert.equal(await small.locator("html").getAttribute("lang"),"de");
    assert.deepEqual(mobileErr,[]);
  });
  await mobile.close();
 }finally{await browser.close();}
 console.log(JSON.stringify({status:failures.length?"FAIL":"PASS",passed,failed:failures.length,failures},null,2));
 if(failures.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
