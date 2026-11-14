/* MKS diaspora: loopback-only legal path smoke test, never processes membership. */
'use strict';
const assert = require('node:assert/strict');
const { chromium } = require(process.env.MKS_PLAYWRIGHT_MODULE || '/tmp/mks-participation-browser/node_modules/playwright');
const parent = new URL(process.env.MKS_LOCAL_URL || 'http://127.0.0.1:8791/world/participate/');
const base = new URL('diaspora/',parent);
if(parent.protocol!=='http:'||!['127.0.0.1','localhost'].includes(parent.hostname)
  ||!parent.pathname.endsWith('/world/participate/')
  ||!base.pathname.endsWith('/world/participate/diaspora/')) {
  throw new Error('Only local MKS diaspora path accepted');
}
let passed = 0;
const failures=[];
async function check(name, fn) {
  try { await fn(); ++passed; console.log('PASS '+name); }
  catch (e) { failures.push(name+': '+String(e.stack||e)); console.error('FAIL '+name+': '+e.message); }
}
(async()=>{
  const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  try {
    const ctx=await browser.newContext({viewport:{width:1440,height:900}});
    const unexpected=[];
    await ctx.route('**/*', route=>{
      if(new URL(route.request().url()).origin!==base.origin) {
        unexpected.push(route.request().url());
        return route.abort('blockedbyclient');
      }
      return route.continue();
    });
    const page=await ctx.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));

    await check('local guide loads in blocked info-only mode',async()=>{
      const r=await page.goto(base.href,{waitUntil:'domcontentloaded',timeout:45000});
      assert.equal(r.status(),200);
      assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex,nofollow');
      assert.equal(await page.locator('form, textarea, iframe, input:not([type="checkbox"])').count(),0);
      assert.equal(await page.locator('input[type="checkbox"]').count(),5);
      assert.equal(await page.locator('#video-locked').isDisabled(),true);
      assert.match(await page.locator('.review-line').innerText(),/БЕЗ ОНЛАЈН НОТАРСКА ЗАВЕРКА/);
      assert.match(await page.locator('.not-live').innerText(),/ЧЛЕНСТВО: НЕАКТИВНО/);
      assert.deepEqual(errors,[]);
    });

    await check('US Canada Australia routes use official country-specific mission pages',async()=>{
      for(const [country,url,marker] of [
        ['us','north_america','САД'],
        ['ca','north_america','Канада'],
        ['au','australia_and_oceania','Австралија']
      ]) {
        await page.locator('#country').selectOption(country);
        assert.equal(await page.locator('#result-country').innerText(),marker);
        const href=await page.locator('#country-official').getAttribute('href');
        assert.equal(new URL(href).hostname,'mfa.gov.mk');
        assert.ok(href.includes(url),href);
        assert.equal(await page.locator('#country-official').getAttribute('referrerpolicy'),'no-referrer');
        assert.ok((await page.locator('#result-description').innerText()).length>70);
      }
    });

    await check('membership and founding are separated without automatic enrolment',async()=>{
      await page.locator('#purpose').selectOption('founding');
      assert.match(await page.locator('#result-purpose').innerText(),/Основачките потписи/);
      await page.locator('#purpose').selectOption('membership');
      assert.match(await page.locator('#result-purpose').innerText(),/доброволно членство/);
      assert.equal(await page.locator('button:has-text("Зачлени")').count(),0);
      assert.equal(await page.locator('form').count(),0);
      assert.equal(await page.locator('#video-locked').isDisabled(),true);
    });

    await check('five languages translate warnings and headings in place',async()=>{
      const cases=[
        ['en','en','From abroad'],
        ['al','sq','Nga jashtë'],
        ['sr','sr','Из иностранства'],
        ['de','de','Aus dem Ausland'],
        ['mk','mk','Од било каде']
      ];
      for(const [code,lang,title] of cases) {
        const button=page.locator('.language[data-lang="'+code+'"]');
        await button.click();
        assert.equal(await page.locator('html').getAttribute('lang'),lang);
        assert.equal(await button.getAttribute('aria-pressed'),'true');
        assert.ok((await page.locator('h1').innerText()).includes(title));
        assert.equal(await page.locator('.language[aria-pressed="true"]').count(),1);
        assert.ok((await page.locator('#result-purpose').innerText()).length>50);
        assert.equal(await page.locator('#video-locked').isDisabled(),true);
      }
      assert.deepEqual(errors,[]);
    });

    await check('explicit language URL does not store a country or purpose choice',async()=>{
      await page.goto(base.href+'?lang=de',{waitUntil:'domcontentloaded'});
      assert.equal(await page.locator('html').getAttribute('lang'),'de');
      await page.locator('#country').selectOption('au');
      await page.locator('#purpose').selectOption('founding');
      await page.goto(base.href,{waitUntil:'domcontentloaded'});
      assert.equal(await page.locator('#country').inputValue(),'us');
      assert.equal(await page.locator('#purpose').inputValue(),'membership');
      assert.equal(await page.locator('html').getAttribute('lang'),'mk');
    });

    await check('five checks stay on device and reset entirely',async()=>{
      for(const check of await page.locator('#check-items input[type="checkbox"]').all()) await check.check();
      assert.equal(await page.locator('#check-items input:checked').count(),5);
      await page.locator('#country').selectOption('ca');
      await page.locator('#purpose').selectOption('founding');
      await page.locator('#reset').click();
      assert.equal(await page.locator('#country').inputValue(),'us');
      assert.equal(await page.locator('#purpose').inputValue(),'membership');
      assert.equal(await page.locator('#check-items input:checked').count(),0);
      assert.match(await page.locator('#reset-status').innerText(),/Локалните избори се исчистени/);
    });

    await check('AI Advokat opens only after explicit action, without personalized parameters',async()=>{
      const link=page.locator('#diaspora-ai-link');
      assert.equal(await link.getAttribute('href'),'https://ai-advokat.github.io/#ai-advokat-chat');
      assert.equal(await link.getAttribute('target'),'_blank');
      assert.equal(await link.getAttribute('rel'),'noopener noreferrer');
      assert.equal(await link.getAttribute('referrerpolicy'),'no-referrer');
      assert.deepEqual(unexpected,[]);
    });

    await check('official sources, consular and chamber links have no referrer leaks',async()=>{
      const external=page.locator('a[href^="https://"]');
      const n=await external.count();
      assert.ok(n>=6,n);
      for(let i=0;i<n;i++){
        const link=external.nth(i);
        assert.equal(await link.getAttribute('target'),'_blank');
        assert.equal(await link.getAttribute('rel'),'noopener noreferrer');
        assert.equal(await link.getAttribute('referrerpolicy'),'no-referrer');
      }
      assert.equal(await page.locator('a[href="https://www.nkrm.org.mk/"]').count(),1);
      assert.equal(await page.locator('a[href="https://mfa.gov.mk/mk-MK/konzularni-uslugi/notarski-uslugi"]').count(),2);
    });

    await check('no third-party requests, cookies, storage or JS errors',async()=>{
      await page.waitForTimeout(250);
      assert.deepEqual(unexpected,[]);
      assert.deepEqual(errors,[]);
      assert.equal((await ctx.cookies()).length,0);
      assert.equal(await page.evaluate(()=>localStorage.length),0);
      assert.equal(await page.evaluate(()=>sessionStorage.length),0);
      assert.equal(await page.locator('script:not([src])').count(),0);
      assert.equal(await page.locator('form').count(),0);
    });

    await check('desktop fits viewport',async()=>{
      const box=await page.evaluate(()=>({width:innerWidth,document:document.documentElement.scrollWidth}));
      assert.ok(box.document<=box.width+4,JSON.stringify(box));
    });
    await ctx.close();

    const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    const m=await mobile.newPage();
    await check('mobile 390 layout and country switching work',async()=>{
      assert.equal((await m.goto(base.href,{waitUntil:'domcontentloaded'})).status(),200);
      await m.locator('#country').selectOption('au');
      assert.match(await m.locator('#result-country').innerText(),/Австралија/);
      const b=await m.evaluate(()=>({width:innerWidth,doc:document.documentElement.scrollWidth}));
      assert.ok(b.doc<=b.width+4,JSON.stringify(b));
      assert.equal(await m.locator('#video-locked').isDisabled(),true);
    });
    await check('compact 320 layout remains navigable',async()=>{
      await m.setViewportSize({width:320,height:700});
      const b=await m.evaluate(()=>({width:innerWidth,doc:document.documentElement.scrollWidth}));
      assert.ok(b.doc<=b.width+4,JSON.stringify(b));
      await m.locator('.language[data-lang="en"]').click();
      assert.equal(await m.locator('html').getAttribute('lang'),'en');
      assert.equal(await m.locator('#country').isVisible(),true);
    });
    await mobile.close();

    const nocode=await browser.newContext({javaScriptEnabled:false});
    const plain=await nocode.newPage();
    await check('no-JavaScript still displays warning, legal sources and disabled video',async()=>{
      assert.equal((await plain.goto(base.href,{waitUntil:'domcontentloaded'})).status(),200);
      assert.match(await plain.locator('.review-line').innerText(),/БЕЗ ОНЛАЈН НОТАРСКА ЗАВЕРКА/);
      assert.equal(await plain.locator('#video-locked').isDisabled(),true);
      assert.equal(await plain.locator('#diaspora-ai-link').getAttribute('href'),
        'https://ai-advokat.github.io/#ai-advokat-chat');
      assert.equal(await plain.locator('form').count(),0);
    });
    await nocode.close();
  } finally {
    await browser.close();
  }
  console.log(JSON.stringify({status:failures.length?'FAIL':'PASS',passed,failed:failures.length,failures},null,2));
  if(failures.length) process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
