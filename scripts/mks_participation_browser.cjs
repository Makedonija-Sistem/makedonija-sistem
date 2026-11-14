/* MKS participation browser tests. Loopback only, no real people, no submissions. */
'use strict';
const assert = require('node:assert/strict');
const { chromium } = require(process.env.MKS_PLAYWRIGHT_MODULE || '/tmp/mks-participation-browser/node_modules/playwright');

const base = process.env.MKS_LOCAL_URL || 'http://127.0.0.1:8791/world/participate/';
const location = new URL(base);
if (location.protocol !== 'http:' || !['127.0.0.1','localhost'].includes(location.hostname) || !location.pathname.endsWith('/world/participate/')) {
  throw new Error('Only loopback participation test paths are allowed');
}
const results = {passed:0,failed:0,errors:[]};
async function check(name,fn) {
  try { await fn(); results.passed++; console.log('PASS '+name); }
  catch(error) { results.failed++; results.errors.push(name+': '+String(error.stack || error)); console.error('FAIL '+name+': '+error.message); }
}

(async()=>{
  const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
  try {
    const ctx = await browser.newContext({viewport:{width:1440,height:900},permissions:['clipboard-read','clipboard-write']});
    const external = [];
    await ctx.route('**/*', route=>{
      if (new URL(route.request().url()).origin !== location.origin) {
        external.push(route.request().url());
        return route.abort('blockedbyclient');
      }
      return route.continue();
    });
    const page = await ctx.newPage();
    const runtimeErrors = [];
    page.on('pageerror', error=>runtimeErrors.push(error.message));
    await check('review status, noindex, no sign-up fields',async()=>{
      const response=await page.goto(base,{waitUntil:'domcontentloaded',timeout:45000});
      assert.equal(response.status(),200);
      assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex,nofollow');
      assert.equal(await page.locator('form').count(),0);
      assert.equal(await page.locator('input').count(),0);
      assert.equal(await page.locator('.choice').count(),3);
      assert.match(await page.locator('.status-strip').innerText(),/БЕЗ ЗАЧЛЕНУВАЊЕ/);
      assert.equal(await page.locator('#choice-result').isHidden(),true);
      assert.equal(await page.locator('#copy-template').isDisabled(),true);
      assert.deepEqual(runtimeErrors,[]);
      if (process.env.MKS_CAPTURE_REVIEW === '1') {
        await page.screenshot({path:'/tmp/mks-participation-desktop.png',fullPage:true});
      }
    });
    await check('five languages translate heading and change HTML language',async()=>{
      const cases=[['en','en','Participation is your choice'],
                   ['al','sq','Pjesëmarrja është'],
                   ['sr','sr','Учешће је твој'],
                   ['de','de','Beteiligung ist deine'],
                   ['mk','mk','Учеството е твоја']];
      for (const [locale,lang,heading] of cases) {
        const button=page.locator('.language[data-lang="'+locale+'"]');
        await button.click();
        assert.equal(await page.locator('html').getAttribute('lang'),lang);
        assert.equal(await button.getAttribute('aria-pressed'),'true');
        assert.ok((await page.locator('h1').innerText()).includes(heading));
        assert.equal(await page.locator('.language[aria-pressed="true"]').count(),1);
      }
      assert.deepEqual(runtimeErrors,[]);
    });
    await check('URL locale is explicit, not stored between visits',async()=>{
      await page.goto(base+'?lang=de',{waitUntil:'domcontentloaded'});
      assert.equal(await page.locator('html').getAttribute('lang'),'de');
      await page.goto(base,{waitUntil:'domcontentloaded'});
      assert.equal(await page.locator('html').getAttribute('lang'),'mk');
      assert.equal(await page.evaluate(()=>localStorage.length),0);
      assert.equal(await page.evaluate(()=>sessionStorage.length),0);
    });
    await check('local choices are independent and do not submit',async()=>{
      for (const topic of ['learn','contribute','membership']) {
        const choice=page.locator('.choice[data-choice="'+topic+'"]');
        await choice.click();
        assert.equal(await page.locator('#choice-result').isVisible(),true);
        assert.equal(await choice.getAttribute('aria-pressed'),'true');
        assert.ok((await page.locator('#result-description').innerText()).length>30);
        assert.equal(await page.locator('.choice[aria-pressed="true"]').count(),1);
      }
      assert.match(await page.locator('#result-title').innerText(),/Членство/);
      assert.match(await page.locator('#result-description').innerText(),/блокирано/);
      await page.locator('#clear-choice').click();
      assert.equal(await page.locator('#choice-result').isHidden(),true);
      assert.equal(await page.locator('.choice.selected').count(),0);
    });
    await check('rights draft is local, typed, not submitted and user-edit-free',async()=>{
      await page.locator('#right-type').selectOption('deletion');
      await page.locator('#build-template').click();
      assert.equal(await page.locator('#copy-template').isEnabled(),true);
      const output=await page.locator('#template-output').innerText();
      assert.match(output,/Бришење/);
      assert.match(output,/само нацрт/);
      assert.ok(!output.includes('@'));
      await page.locator('.language[data-lang="en"]').click();
      const translated=await page.locator('#template-output').innerText();
      assert.match(translated,/Erasure/);
      assert.match(translated,/not been submitted/);
    });
    await check('portability and withdrawal templates remain non-submitted and local',async()=>{
      for (const [kind, phrase] of [['portability','Data portability'],['withdraw','Withdrawal of consent']]) {
        await page.locator('#right-type').selectOption(kind);
        assert.equal(await page.locator('#copy-template').isDisabled(),true);
        await page.locator('#build-template').click();
        assert.match(await page.locator('#template-output').innerText(),new RegExp(phrase));
        assert.equal(await page.locator('#copy-template').isEnabled(),true);
      }
      assert.equal(await page.locator('form').count(),0);
    });
    await check('copy is a direct local clipboard action with feedback',async()=>{
      await page.locator('#copy-template').click();
      // Clipboard writes are asynchronous; verify the settled result, not a racing empty status.
      await page.waitForFunction(() => document.getElementById('copy-state').textContent.length > 0, null, {timeout:5000});
      assert.match(await page.locator('#copy-state').innerText(),/Text copied/);
      const clipboard=await page.evaluate(()=>navigator.clipboard.readText());
      assert.equal(clipboard,await page.locator('#template-output').innerText());
    });
    await check('reset clears choice and unsent draft without server call',async()=>{
      await page.locator('.choice[data-choice="learn"]').click();
      await page.locator('#reset-local').click();
      assert.equal(await page.locator('#choice-result').isHidden(),true);
      assert.equal(await page.locator('#copy-template').isDisabled(),true);
      assert.equal(await page.locator('#right-type').inputValue(),'information');
      assert.match(await page.locator('#reset-state').innerText(),/Local choices cleared/);
      assert.equal(await page.locator('.choice.selected').count(),0);
      assert.deepEqual(runtimeErrors,[]);
    });
    await check('privacy links and authority references are explicit',async()=>{
      for (const rel of ['../../legal/PRIVACY.html','../../legal/TERMS.html','../']) {
        const r=await page.request.get(new URL(rel,base).href);
        assert.equal(r.status(),200,rel);
      }
      assert.equal(await page.locator('a[href="https://azlp.mk/vashite-prava/"]').count(),1);
    });
    await check('AI Advokat is a visible user-initiated external legal module with no data transfer',async()=>{
      const action=page.locator('#ai-advokat-launch');
      assert.equal(await action.isVisible(),true);
      assert.equal(await action.getAttribute('href'),'https://ai-advokat.github.io/#ai-advokat-chat');
      assert.equal(await action.getAttribute('target'),'_blank');
      assert.equal(await action.getAttribute('rel'),'noopener noreferrer');
      assert.equal(await action.getAttribute('referrerpolicy'),'no-referrer');
      assert.equal(await action.getAttribute('aria-describedby'),'ai-advokat-warning');
      assert.equal(await page.locator('#ai-advokat iframe, #ai-advokat form').count(),0);
      assert.equal(await page.locator('a[href="https://ai-advokat.github.io/legal-notice.html"]').count(),1);
      assert.equal(await page.locator('a[href="https://ai-advokat.github.io/privacy-policy.html"]').count(),1);
      await page.locator('.language[data-lang="de"]').click();
      assert.match(await action.innerText(),/AI Advokat öffnen/);
      await page.locator('.language[data-lang="en"]').click();
      assert.match(await action.innerText(),/Open AI Advokat/);
      assert.match(await page.locator('#ai-advokat-warning').innerText(),/separate website/);
      assert.deepEqual(external,[]);
      assert.deepEqual(runtimeErrors,[]);
    });
    await check('no outbound requests or local storage, and no runtime errors',async()=>{
      await page.waitForTimeout(250);
      assert.deepEqual(external,[]);
      assert.deepEqual(runtimeErrors,[]);
      assert.equal((await ctx.cookies()).length,0);
      assert.equal(await page.evaluate(()=>localStorage.length),0);
      assert.equal(await page.evaluate(()=>sessionStorage.length),0);
      assert.equal(await page.locator('script:not([src])').count(),0);
      assert.equal(await page.locator('form').count(),0);
    });
    await check('desktop layout fits viewport horizontally',async()=>{
      const box=await page.evaluate(()=>({viewport:innerWidth,doc:document.documentElement.scrollWidth}));
      assert.ok(box.doc <= box.viewport + 3,JSON.stringify(box));
    });
    await ctx.close();

    const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    const small=await mobile.newPage();
    await check('mobile 390px remains usable',async()=>{
      assert.equal((await small.goto(base,{waitUntil:'domcontentloaded'})).status(),200);
      let dims=await small.evaluate(()=>({viewport:innerWidth,doc:document.documentElement.scrollWidth}));
      assert.ok(dims.doc<=dims.viewport+3,JSON.stringify(dims));
      await small.locator('.language[data-lang="al"]').click();
      assert.equal(await small.locator('html').getAttribute('lang'),'sq');
      await small.locator('.choice[data-choice="membership"]').click();
      assert.equal(await small.locator('#choice-result').isVisible(),true);
      if (process.env.MKS_CAPTURE_REVIEW === '1') {
        await small.screenshot({path:'/tmp/mks-participation-mobile.png',fullPage:true});
      }
    });
    await check('compact 320px viewport has no horizontal overflow',async()=>{
      await small.setViewportSize({width:320,height:690});
      const dims=await small.evaluate(()=>({viewport:innerWidth,doc:document.documentElement.scrollWidth}));
      assert.ok(dims.doc<=dims.viewport+3,JSON.stringify(dims));
      assert.equal(await small.locator('#reset-local').isVisible(),true);
    });
    await mobile.close();

    const plainCtx=await browser.newContext({javaScriptEnabled:false,viewport:{width:1280,height:800}});
    const plain=await plainCtx.newPage();
    await check('no-JavaScript readable rights and legal status remain',async()=>{
      assert.equal((await plain.goto(base,{waitUntil:'domcontentloaded'})).status(),200);
      assert.ok((await plain.locator('h1').innerText()).length>20);
      assert.equal(await plain.locator('#gate').isVisible(),true);
      assert.match(await plain.locator('#gate').innerText(),/ПРИЈАВИ: БЛОКИРАНИ/);
      assert.equal(await plain.locator('a[href="../../legal/PRIVACY.html"]').count(),1);
      assert.equal(await plain.locator('form').count(),0);
      // The explicit external link remains usable without any MKS JavaScript.
      assert.equal(await plain.locator('#ai-advokat-launch').getAttribute('href'),
        'https://ai-advokat.github.io/#ai-advokat-chat');
    });
    await plainCtx.close();
  } finally { await browser.close(); }
  console.log(JSON.stringify({status:results.failed?'FAIL':'PASS',passed:results.passed,failed:results.failed,failures:results.errors},null,2));
  if(results.failed) process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});
