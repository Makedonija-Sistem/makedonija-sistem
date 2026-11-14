/* Browser QA for SYSTEM Navigator, loopback-only. Not a production or live Cloudflare check. */
'use strict';
const assert = require('node:assert/strict');
const { chromium } = require(process.env.MKS_PLAYWRIGHT_MODULE || '/tmp/mks-world-browser/node_modules/playwright');
const base = process.env.MKS_LOCAL_URL || 'http://127.0.0.1:8783/world/';
const origin = new URL(base);
if (origin.protocol !== 'http:' || !['127.0.0.1','localhost'].includes(origin.hostname) || !origin.pathname.endsWith('/world/')) {
  throw new Error('Unsafe browser destination: loopback world/ is required');
}
let pass = 0;
let fail = [];
async function check(label, fn) {
  try { await fn(); pass++; console.log('PASS ' + label); }
  catch (error) { fail.push(label + ': ' + String(error.stack || error)); console.error('FAIL ' + label + ': ' + error.message); }
}
(async () => {
  const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
  try {
    const context = await browser.newContext({viewport:{width:1440,height:900}});
    const offsite = [];
    await context.route('**/*', route => {
      const url = new URL(route.request().url());
      if (url.origin !== origin.origin) {
        offsite.push(route.request().url());
        return route.abort('blockedbyclient');
      }
      return route.continue();
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror',error=>errors.push(error.message));

    await check('root, title and honest review status', async ()=>{
      const response=await page.goto(base,{waitUntil:'domcontentloaded',timeout:45000});
      assert.equal(response.status(),200);
      assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex,nofollow');
      assert.equal(await page.locator('.topic-card').count(),6);
      assert.equal(await page.locator('#selection').isHidden(),true);
      assert.match(await page.locator('.topline').innerText(),/НЕМА АКТИВНО ЗАЧЛЕНУВАЊЕ/);
    });
    await check('five manual language choices, localized headings and buttons', async ()=>{
      const tests=[['en','en','Ideas become clearer'],['al','sq','Idetë bëhen'],['sr','sr','Идеје постају'],['de','de','Ideen werden klarer'],['mk','mk','Идеите стануваат']];
      for (const [lang,html,heading] of tests) {
        const button=page.locator('.lang[data-lang="'+lang+'"]');
        await button.click();
        assert.equal(await page.locator('html').getAttribute('lang'),html);
        assert.equal(await button.getAttribute('aria-pressed'),'true');
        assert.match(await page.locator('h1').innerText(),new RegExp(heading));
        assert.ok((await page.title()).length>=20);
      }
      assert.deepEqual(errors,[]);
    });
    await check('language query option selects supported language without persistence', async()=>{
      await page.goto(base+'?lang=de',{waitUntil:'domcontentloaded'});
      assert.equal(await page.locator('html').getAttribute('lang'),'de');
      await page.goto(base,{waitUntil:'domcontentloaded'});
      assert.equal(await page.locator('html').getAttribute('lang'),'mk');
      assert.equal(await page.evaluate(()=>localStorage.length),0);
      assert.equal(await page.evaluate(()=>sessionStorage.length),0);
    });
    await check('deterministic six-topic explorer with source links', async ()=>{
      const known={
        institutions:'#principles',economy:'#industrial-champions',
        education:'#programme',health:'#wellbeing',
        diaspora:'#diaspora-hub',local:'#municipalities'
      };
      for (const [topic,hash] of Object.entries(known)) {
        await page.locator('.topic-card[data-topic="'+topic+'"]').click();
        assert.equal(await page.locator('#selection').isVisible(),true);
        assert.equal(await page.locator('#selection-link').getAttribute('href'),'../index.html'+hash);
        assert.ok((await page.locator('#selection-desc').innerText()).length>35);
      }
      const target=await page.locator('#selection-link').getAttribute('href');
      const targetURL=new URL(target,base);
      const response=await page.request.get(targetURL.href.split('#')[0]);
      assert.equal(response.status(),200);
      await page.locator('#selection-close').click();
      assert.equal(await page.locator('#selection').isHidden(),true);
      assert.equal(await page.locator('.topic-card.selected').count(),0);
    });
    await check('privacy and terms links exist at either hosting base',async()=>{
      for(const path of ['../legal/PRIVACY.html','../legal/TERMS.html']){
        const response=await page.request.get(new URL(path,base).href);
        assert.equal(response.status(),200);
        assert.match(await response.text(),/noindex/i);
      }
    });
    await check('all resources stay on localhost, no cookies, scripts or page exceptions',async()=>{
      await page.waitForTimeout(300);
      assert.deepEqual(offsite,[]);
      assert.deepEqual(errors,[]);
      assert.equal(await page.evaluate(()=>document.cookie),'');
      assert.equal(await page.evaluate(()=>localStorage.length),0);
      assert.equal(await page.evaluate(()=>sessionStorage.length),0);
      assert.equal(await page.locator('script[src]').count(),1);
      assert.equal(await page.locator('script:not([src])').count(),0);
    });
    await check('desktop does not horizontally overflow',async()=>{
      const box=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
      assert.ok(box.scrollWidth<=box.width+3,JSON.stringify(box));
    });
    await context.close();

    const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    const small=await mobile.newPage();
    await check('390px mobile cards, language choices and overflow',async()=>{
      const response=await small.goto(base,{waitUntil:'domcontentloaded'});
      assert.equal(response.status(),200);
      assert.equal(await small.locator('.topic-card').count(),6);
      const box=await small.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
      assert.ok(box.scrollWidth<=box.width+3,JSON.stringify(box));
      await small.locator('.lang[data-lang="en"]').click();
      assert.equal(await small.locator('html').getAttribute('lang'),'en');
    });
    await check('320px compact viewport remains navigable',async()=>{
      await small.setViewportSize({width:320,height:700});
      const box=await small.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
      assert.ok(box.scrollWidth<=box.width+3,JSON.stringify(box));
      await small.locator('.topic-card[data-topic="local"]').click();
      assert.equal(await small.locator('#selection').isVisible(),true);
    });
    await mobile.close();

    const noScript=await browser.newContext({javaScriptEnabled:false,viewport:{width:1200,height:900}});
    const fallback=await noScript.newPage();
    await check('progressive enhancement: no-JS topic links still navigate',async()=>{
      const response=await fallback.goto(base,{waitUntil:'domcontentloaded'});
      assert.equal(response.status(),200);
      const first=fallback.locator('.topic-card').first();
      assert.equal(await first.getAttribute('href'),'../index.html#principles');
      const res=await fallback.goto(new URL('../index.html#principles',base).href,{waitUntil:'domcontentloaded'});
      assert.equal(res.status(),200);
    });
    await noScript.close();
  } finally { await browser.close(); }
  console.log(JSON.stringify({status:fail.length?'FAIL':'PASS',passed:pass,failed:fail.length,failures:fail},null,2));
  if(fail.length) process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});
