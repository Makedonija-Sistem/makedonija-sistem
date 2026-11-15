/* Browser integration: one original 61-card atlas + evidence layer. No live APIs. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require(process.env.MKS_PLAYWRIGHT_MODULE||'/tmp/mks-party-tech-playwright/node_modules/playwright');
const url=new URL(process.env.MKS_LOCAL_URL||'http://127.0.0.1:8796/research/party-tech/');
if(url.protocol!=='http:'||!['localhost','127.0.0.1'].includes(url.hostname)
  ||!url.pathname.endsWith('/research/party-tech/')) {
  throw new Error('Browser test accepts only loopback research paths');
}
let passed=0;
const failures=[];
async function check(name,fn){
  try {await fn(); passed++; console.log('PASS '+name)}
  catch(err){failures.push(name+': '+String(err.stack||err));console.error('FAIL '+name+': '+err.message)}
}
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try {
  const ctx=await browser.newContext({viewport:{width:1440,height:900},acceptDownloads:true});
  const outbound=[],pageErrors=[],consoleErrors=[];
  await ctx.route('**/*',r=>{
    const req=r.request().url();
    if(new URL(req).origin!==url.origin){outbound.push(req);return r.abort('blockedbyclient')}
    return r.continue();
  });
  const page=await ctx.newPage();
  page.on('pageerror',err=>pageErrors.push(err.message));
  page.on('console',msg=>{if(msg.type()==='error')consoleErrors.push(msg.text())});
  await check('research page loads and parses original 61-card master',async()=>{
    const response=await page.goto(url.href,{waitUntil:'networkidle',timeout:45000});
    assert.equal(response.status(),200);
    await page.locator('.research-card').first().waitFor({state:'visible',timeout:12000});
    assert.equal(await page.locator('.research-card').count(),61);
    assert.equal(await page.locator('#count-atlas').innerText(),'61');
    assert.equal(await page.locator('#count-researched').innerText(),'15');
    assert.equal(await page.locator('#count-signals').innerText(),'24');
    assert.equal(await page.locator('#count-sources').innerText(),'25');
    assert.deepEqual(pageErrors,[]);
    assert.deepEqual(consoleErrors,[]);
  });
  await check('default cards are unchanged original party profiles',async()=>{
    assert.equal(await page.locator('.research-card').count(),61);
    assert.equal(await page.locator('.research-card h3').first().innerText(),'CDU/CSU');
    assert.equal(await page.locator('a.card-link[href="https://cdu.de/"]').count(),1);
    assert.equal(await page.locator('a[href="../../index.html#world-parties"]').count(),3);
    assert.equal(await page.locator('form, iframe').count(),0);
  });
  await check('exact 15 researched and 46 not-researched, not falsely absent',async()=>{
    await page.locator('#evidence').selectOption('researched');
    assert.equal(await page.locator('.research-card').count(),15);
    await page.locator('#evidence').selectOption('unresearched');
    assert.equal(await page.locator('.research-card').count(),46);
    assert.match(await page.locator('.no-evidence').first().innerText(),/не докажува отсуство/);
    await page.locator('#evidence').selectOption('all');
  });
  await check('region counts align to canonical 61: Europe 42, Americas 8, Asia 5, Africa 2, Oceania 4',async()=>{
    const cases=[['europe',42],['americas',8],['asia',5],['africa',2],['oceania',4]];
    for(const [region,count] of cases){
      await page.locator('#region').selectOption(region);
      assert.equal(await page.locator('.research-card').count(),count,region);
    }
    await page.locator('#region').selectOption('all');
  });
  await check('search finds only canonical party by name without external lookup',async()=>{
    await page.locator('#search').fill('CDU');
    assert.equal(await page.locator('.research-card').count(),1);
    assert.equal(await page.locator('.research-card h3').first().innerText(),'CDU/CSU');
    assert.deepEqual(outbound,[]);
    await page.locator('#search').fill('');
  });
  await check('digital function filter works without ranking',async()=>{
    await page.locator('#dimension').selectOption('funding');
    assert.equal(await page.locator('.research-card').count(),2);
    const names=await page.locator('.research-card h3').allInnerTexts();
    assert.deepEqual(names,['Democratic Party','Republican Party']);
    await page.locator('#dimension').selectOption('deliberation');
    assert.equal(await page.locator('.research-card').count(),2);
    await page.locator('#dimension').selectOption('all');
  });
  await check('source evidence expands with safe external original references',async()=>{
    const cdu=page.locator('.research-card').first();
    assert.equal(await cdu.locator('details.evidence').count(),2);
    await cdu.locator('details.evidence').first().locator('summary').click();
    assert.match(await cdu.locator('.evidence-content p').first().innerText(),/CDU/);
    const a=cdu.locator('a.evidence-source').first();
    assert.equal(await a.getAttribute('target'),'_blank');
    assert.equal(await a.getAttribute('rel'),'noopener noreferrer');
    assert.equal(await a.getAttribute('referrerpolicy'),'no-referrer');
    assert.ok((await a.getAttribute('href')).startsWith('https://'));
    assert.deepEqual(outbound,[]);
  });
  await check('external vendor funding is transparently distinguished from party-owned systems',async()=>{
    await page.locator('#dimension').selectOption('funding');
    assert.equal(await page.locator('.research-card').count(),2);
    await page.locator('.research-card').first().locator('summary').click();
    assert.match(await page.locator('.research-card').first().locator('.source-type').innerText(),/Надворешен доставувач/);
    await page.locator('#dimension').selectOption('all');
  });
  await check('empty results and filter reset work',async()=>{
    await page.locator('#search').fill('unmatched-antimaterial-zzzz');
    assert.equal(await page.locator('.research-card').count(),0);
    assert.match(await page.locator('.empty').innerText(),/Нема совпаѓања/);
    assert.equal(await page.locator('#csv').isDisabled(),true);
    await page.locator('#reset').click();
    assert.equal(await page.locator('.research-card').count(),61);
    assert.equal(await page.locator('#search').inputValue(),'');
    assert.equal(await page.locator('#csv').isEnabled(),true);
  });
  await check('downloaded CSV contains source-linked entries without active network posting',async()=>{
    const [dl]=await Promise.all([
      page.waitForEvent('download',{timeout:15000}),
      page.locator('#csv').click()
    ]);
    assert.equal(dl.suggestedFilename(),'MKS_Party_Tech_Research_2026-11-15.csv');
    const p=await dl.path();
    const csv=fs.readFileSync(p,'utf8');
    assert.match(csv,/"party","country","region","atlas_block"/);
    assert.match(csv,/https:\/\/www\.meine\.cdu\.de/);
    const lines=csv.trim().split(/\r?\n/);
    assert.equal(lines.length,71,'24 sourced signal rows + 46 unresearched + header');
    assert.deepEqual(outbound,[]);
  });
  await check('five language controls preserve dataset and translated synthesis statuses',async()=>{
    const names=[['en','en','Digital technologies'],['al','sq','Teknologjitë'],['sr','sr','Дигиталне технологије'],['de','de','Digitale Technologien'],['mk','mk','Дигиталните технологии']];
    for(const [lang,htmlLang,headline] of names){
      const button=page.locator('.lang[data-lang="'+lang+'"]');
      await button.click();
      assert.equal(await page.locator('html').getAttribute('lang'),htmlLang);
      assert.equal(await button.getAttribute('aria-pressed'),'true');
      assert.ok((await page.locator('h1').innerText()).includes(headline));
      assert.equal(await page.locator('.research-card').count(),61);
      assert.equal(await page.locator('.synth-card').count(),9);
      assert.equal(await page.locator('.lang[aria-pressed="true"]').count(),1);
      assert.ok((await page.locator('.synth-card .synth-state').first().innerText()).length>3);
    }
    assert.deepEqual(pageErrors,[]);
  });
  await check('nine-layer synthesis has four review, three planned, two blocked',async()=>{
    assert.equal(await page.locator('.synth-card').count(),9);
    assert.equal(await page.locator('.synth-card[data-state="review"]').count(),4);
    assert.equal(await page.locator('.synth-card[data-state="planned"]').count(),3);
    assert.equal(await page.locator('.synth-card[data-state="blocked"]').count(),2);
    assert.equal(await page.locator('input[type="password"],input[type="email"],input[type="tel"]').count(),0);
  });
  await check('three additional researched examples remain outside 61-card atlas',async()=>{
    assert.equal(await page.locator('#extra-cases .extra-card').count(),3);
    const names=await page.locator('#extra-cases h3').allInnerTexts();
    assert.deepEqual(names,['La France insoumise','Movimento 5 Stelle','Podemos']);
    assert.equal(await page.locator('.research-card').count(),61);
  });
  await check('zero tracking, external requests, cookies, storage or script errors',async()=>{
    await page.waitForTimeout(100);
    assert.deepEqual(pageErrors,[]);
    assert.deepEqual(consoleErrors,[]);
    assert.deepEqual(outbound,[]);
    assert.equal((await ctx.cookies()).length,0);
    assert.equal(await page.evaluate(()=>localStorage.length),0);
    assert.equal(await page.evaluate(()=>sessionStorage.length),0);
    assert.equal(await page.locator('script:not([src])').count(),0);
    assert.equal(await page.locator('form, iframe').count(),0);
  });
  await check('desktop has no horizontal overflow',async()=>{
    const box=await page.evaluate(()=>({vw:innerWidth,scroll:document.documentElement.scrollWidth}));
    assert.ok(box.scroll<=box.vw+4,JSON.stringify(box));
    if(process.env.MKS_SCREENSHOT_RESEARCH==='1'){
      await page.screenshot({path:'/tmp/mks-party-tech-desktop.png',fullPage:true});
    }
  });
  await ctx.close();
  const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const mp=await mobile.newPage();
  await check('390px mobile renders all cards, filters and synthesis without overflow',async()=>{
    assert.equal((await mp.goto(url.href,{waitUntil:'networkidle',timeout:45000})).status(),200);
    await mp.locator('.research-card').first().waitFor({state:'visible'});
    assert.equal(await mp.locator('.research-card').count(),61);
    assert.equal(await mp.locator('.synth-card').count(),9);
    assert.equal(await mp.locator('#search').isVisible(),true);
    const b=await mp.evaluate(()=>({vw:innerWidth,scroll:document.documentElement.scrollWidth}));
    assert.ok(b.scroll<=b.vw+4,JSON.stringify(b));
    if(process.env.MKS_SCREENSHOT_RESEARCH==='1')await mp.screenshot({path:'/tmp/mks-party-tech-mobile.png',fullPage:true});
  });
  await check('320px mobile supports keyboard and navigation',async()=>{
    await mp.setViewportSize({width:320,height:760});
    await mp.locator('#search').fill('SPD');
    assert.equal(await mp.locator('.research-card').count(),1);
    const b=await mp.evaluate(()=>({vw:innerWidth,scroll:document.documentElement.scrollWidth}));
    assert.ok(b.scroll<=b.vw+4,JSON.stringify(b));
    assert.equal(await mp.locator('a.brand').getAttribute('href'),'../../index.html#world-parties');
  });
  await mobile.close();
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:900,height:720}});
  const jp=await nojs.newPage();
  await check('no JavaScript fallback points to original atlas',async()=>{
    assert.equal((await jp.goto(url.href,{waitUntil:'domcontentloaded'})).status(),200);
    assert.equal(await jp.locator('#initial-fallback').isVisible(),true);
    assert.equal(await jp.locator('#initial-fallback a').getAttribute('href'),'../../index.html#world-parties');
    assert.equal(await jp.locator('#csv').isDisabled(),true);
    assert.equal(await jp.locator('noscript a').getAttribute('href'),'../../index.html#world-parties');
  });
  await check('original giant portal remains intact with all 61 cards and one research link (JS disabled)',async()=>{
    const original=new URL('../../index.html',url);
    assert.equal((await jp.goto(original.href,{waitUntil:'domcontentloaded',timeout:45000})).status(),200);
    assert.equal(await jp.locator('#world-parties #wpGrid > article.wp-card').count(),61);
    assert.equal(await jp.locator('#world-party-technology a[href="./research/party-tech/"]').count(),1);
    assert.equal(await jp.locator('.wp-filter[data-filter="all"]').count(),1);
  });
  await nojs.close();
 } finally {await browser.close()}
 console.log(JSON.stringify({status:failures.length?'FAIL':'PASS',passed,failed:failures.length,failures},null,2));
 if(failures.length)process.exitCode=1;
})().catch(err=>{console.error(err);process.exitCode=1});
