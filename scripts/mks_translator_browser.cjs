/* MKS i18n browser checks: loopback only, no deployment. */
'use strict';
const assert=require('node:assert/strict');
const {chromium}=require(process.env.MKS_PLAYWRIGHT_MODULE||'/tmp/mks-i18n-browser/node_modules/playwright');
const target=process.env.MKS_URL||'http://127.0.0.1:8785/';
const loc=new URL(target);
if(loc.protocol!=='http:'||!['localhost','127.0.0.1'].includes(loc.hostname))throw Error('Only loopback is permitted');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const findings=[];
 async function doTest(name,run){
  try{await run();console.log('PASS '+name);}
  catch(e){findings.push(name+': '+(e.stack||String(e)));console.error('FAIL '+name+': '+e.message);}
 }
 try{
  const context=await browser.newContext({viewport:{width:1440,height:900}});
  await context.route('**/*',route=>{
   const url=new URL(route.request().url());
   if(url.origin!==loc.origin)return route.abort('blockedbyclient');
   return route.continue();
  });
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await doTest('page loads five buttons and extension',async()=>{
   const res=await page.goto(target,{waitUntil:'domcontentloaded',timeout:45000});
   assert.equal(res.status(),200);
   await page.waitForFunction(()=>window.MKSi18nRepair && window.MKSi18nRepair.extendedKeys===61,{timeout:12000});
   assert.equal(await page.locator('.lang-btn').count(),5);
   assert.equal(await page.locator('html').getAttribute('data-lang'),'mk');
  });
  await doTest('switch back and forth, 4 translated locales',async()=>{
   const cases=[['en','en','Range:'],['al','sq','Autonomia:'],['sr','sr','Домет:'],['de','de','Reichweite:'],['mk','mk','Опсег:']];
   for(const [lang,tag,needle] of cases){
    const button=page.locator('.lang-btn[data-lang="'+lang+'"]');
    await button.evaluate(el=>el.click());
    assert.equal(await page.locator('html').getAttribute('lang'),tag);
    assert.equal(await button.getAttribute('aria-pressed'),'true');
    const txt=await page.locator('[data-i18n="ind.c1.f1"]').first().textContent();
    assert.ok(txt.includes(needle),lang+' got '+txt);
   }
  });
  await doTest('dynamic keyed elements receive correct locale and restore MK',async()=>{
   await page.locator('.lang-btn[data-lang="de"]').first().evaluate(e=>e.click());
   await page.evaluate(()=>{
    const node=document.createElement('p');
    node.id='i18n-dynamic-probe';node.setAttribute('data-i18n','nav.group.home');
    node.textContent='Почеток';document.body.appendChild(node);
   });
   await page.waitForFunction(()=>{
    const el=document.getElementById('i18n-dynamic-probe');
    return el&&el.textContent===window.t('nav.group.home','de');
   },{timeout:8000});
   await page.locator('.lang-btn[data-lang="mk"]').first().evaluate(e=>e.click());
   await page.waitForFunction(()=>document.getElementById('i18n-dynamic-probe')?.textContent===window.t('nav.group.home','mk'),{timeout:8000});
  });
  await doTest('original navigation, controls and no unhandled script errors',async()=>{
   assert.ok(await page.locator('#navLinks').count());
   assert.ok(await page.locator('svg use[href="#ms-sigil"]').count());
   assert.deepEqual(errors,[]);
  });
  await context.close();
  const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  await mobile.route('**/*',route=>{
   const url=new URL(route.request().url());
   if(url.origin!==loc.origin)return route.abort('blockedbyclient');
   return route.continue();
  });
  const small=await mobile.newPage();
  await doTest('mobile 390px language toggle',async()=>{
   const res=await small.goto(target,{waitUntil:'domcontentloaded',timeout:45000});
   assert.equal(res.status(),200);
   await small.waitForFunction(()=>window.MKSi18nRepair?.extendedKeys===61,{timeout:12000});
   await small.locator('.lang-btn[data-lang="en"]').first().evaluate(e=>e.click());
   assert.equal(await small.locator('html').getAttribute('lang'),'en');
   const txt=await small.locator('[data-i18n="ind.c1.f1"]').first().textContent();
   assert.ok(txt.includes('Range:'));
  });
  await mobile.close();
 }finally{await browser.close();}
 console.log(JSON.stringify({result:findings.length?'FAIL':'PASS',failed:findings.length,failures:findings},null,2));
 if(findings.length)process.exitCode=1;
})().catch(err=>{console.error(err);process.exitCode=1;});
