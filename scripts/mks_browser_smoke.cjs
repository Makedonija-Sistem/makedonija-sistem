'use strict';
// MKS LOCAL-ONLY Chromium review. Never touches the Cloudflare Worker.
const assert = require('node:assert/strict');
const { chromium } = require(process.env.MKS_PLAYWRIGHT_MODULE || '/tmp/mks-browser-tools/node_modules/playwright');
const base = process.env.MKS_LOCAL_URL || 'http://127.0.0.1:8765/';
const origin = new URL(base);
if (origin.protocol !== 'http:' || !['127.0.0.1','localhost'].includes(origin.hostname)) {
  throw new Error('LOCALHOST only: refusing non-local browser target');
}
let passed = 0;
const failures = [];
async function check(label, run) {
  try {
    await run();
    passed++;
    console.log('PASS ' + label);
  } catch (e) {
    failures.push(label + ': ' + (e.stack || String(e)));
    console.error('FAIL ' + label + ': ' + e.message);
  }
}
function restrict(context) {
  return context.route('**/*', route => {
    const u = new URL(route.request().url());
    return u.origin === origin.origin ? route.continue() : route.abort('blockedbyclient');
  });
}
function trackErrors(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  return errors;
}
(async () => {
  const browser = await chromium.launch({headless:true, args:['--no-sandbox']});
  try {
    const desktop = await browser.newContext({viewport:{width:1440,height:900}});
    await restrict(desktop);
    const page = await desktop.newPage();
    const errors = trackErrors(page);
    await check('desktop root, review robots and app initialization', async () => {
      const response = await page.goto(base, {waitUntil:'domcontentloaded', timeout:45000});
      assert.equal(response.status(),200);
      await page.waitForFunction(() => typeof window.getCurrentLang === 'function', null, {timeout:45000});
      assert.equal(await page.locator('body').isVisible(),true);
      assert.equal(await page.locator('#navLinks').count(),1);
      assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex,nofollow');
    });
    await check('desktop no uncaught JavaScript exceptions', async () => {
      await page.waitForTimeout(600);
      assert.deepEqual(errors, []);
    });
    await check('five language selectors and accessible pressed state', async () => {
      for (const [locale,html] of [['en','en'],['al','sq'],['sr','sr'],['de','de'],['mk','mk']]) {
        const button = page.locator('.lang-btn[data-lang="' + locale + '"]');
        await button.click({timeout:15000});
        assert.equal(await page.evaluate(() => window.getCurrentLang()), locale);
        assert.equal(await page.locator('html').getAttribute('data-lang'), locale);
        assert.equal(await page.locator('html').getAttribute('lang'), html);
        assert.equal(await button.getAttribute('aria-pressed'),'true');
      }
      assert.deepEqual(errors,[]);
    });
    await check('language choice persists after refresh', async () => {
      await page.locator('.lang-btn[data-lang="de"]').click();
      await page.reload({waitUntil:'domcontentloaded'});
      await page.waitForFunction(() => typeof window.getCurrentLang === 'function');
      assert.equal(await page.evaluate(() => window.getCurrentLang()),'de');
      assert.deepEqual(errors,[]);
    });
    await check('explicit URL language overrides stored choice', async () => {
      await page.goto(base+'?lang=en',{waitUntil:'domcontentloaded'});
      await page.waitForFunction(() => typeof window.getCurrentLang === 'function');
      assert.equal(await page.evaluate(() => window.getCurrentLang()),'en');
      assert.deepEqual(errors,[]);
    });
    await check('grouped navigation opens, closes, and follows anchor', async () => {
      const groups = page.locator('#navLinks details.mks-nav-group');
      assert.ok((await groups.count()) >= 2);
      await groups.first().locator('summary').click();
      assert.equal(await groups.first().evaluate(el => el.open),true);
      await groups.nth(1).locator('summary').click();
      assert.equal(await groups.nth(1).evaluate(el => el.open),true);
      assert.equal(await groups.first().evaluate(el => el.open),false);
      const a = groups.nth(1).locator('.mks-nav-panel a').first();
      const hash = await a.getAttribute('href');
      assert.ok(hash.startsWith('#'));
      await a.click();
      assert.equal(await page.evaluate(() => location.hash),hash);
      assert.equal(await groups.nth(1).evaluate(el => el.open),false);
    });
    await check('fragment targets exist and IDs are not duplicated', async () => {
      const result = await page.evaluate(() => {
        const ids = Array.from(document.querySelectorAll('[id]')).map(e=>e.id);
        const targets = Array.from(document.querySelectorAll('a[href^="#"]')).map(e=>decodeURIComponent(e.getAttribute('href').slice(1))).filter(Boolean);
        return {missing:targets.filter(id=>!ids.includes(id)), duplicates:ids.filter((id,i)=>ids.indexOf(id)!==i)};
      });
      assert.deepEqual(result.missing,[]);
      assert.deepEqual(result.duplicates,[]);
    });
    await check('privacy/terms route and 404 remain local and available', async () => {
      for (const route of ['legal/PRIVACY.html','legal/TERMS.html']) {
        const response = await page.request.get(base+route);
        assert.equal(response.status(),200);
        assert.match(await response.text(),/noindex/i);
      }
      assert.equal((await page.request.get(base+'unavailable-mks-check.html')).status(),404);
    });
    await desktop.close();

    const mobile = await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    await restrict(mobile);
    const small = await mobile.newPage();
    const mobileErrors = trackErrors(small);
    await check('mobile renders without horizontal overflow', async () => {
      const response = await small.goto(base,{waitUntil:'domcontentloaded',timeout:45000});
      assert.equal(response.status(),200);
      await small.waitForFunction(() => typeof window.getCurrentLang === 'function');
      const dimensions = await small.evaluate(() => ({viewport:innerWidth, document:document.documentElement.scrollWidth}));
      assert.ok(dimensions.document <= dimensions.viewport + 4,JSON.stringify(dimensions));
      assert.deepEqual(mobileErrors,[]);
    });
    await check('mobile hamburger toggles and updates ARIA', async () => {
      const toggle = small.locator('#menuToggle');
      assert.equal(await toggle.isVisible(),true);
      await toggle.click();
      assert.equal(await toggle.getAttribute('aria-expanded'),'true');
      assert.equal(await small.locator('#navLinks').evaluate(el=>el.classList.contains('open')),true);
      await toggle.click();
      assert.equal(await toggle.getAttribute('aria-expanded'),'false');
      assert.equal(await small.locator('#navLinks').evaluate(el=>el.classList.contains('open')),false);
      assert.deepEqual(mobileErrors,[]);
    });
    await mobile.close();
  } finally {
    await browser.close();
  }
  console.log(JSON.stringify({status:failures.length?'FAIL':'PASS',passed,failed:failures.length,failures},null,2));
  if (failures.length) process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});
