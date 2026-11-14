import test from 'node:test';
import assert from 'node:assert/strict';
import api from './participation-review-worker.mjs';

const endpoint = 'https://demo.invalid/api/participation/';
async function call(method, path, body) {
  return api.fetch(new Request(endpoint + path, {
    method,
    ...(body === undefined ? {} : {
      body, headers:{'content-type':'application/json','origin':'https://untrusted.invalid'}
    })
  }));
}

test('read-only status is explicit and not a valid registration', async () => {
  const response = await call('GET','status');
  assert.equal(response.status,200);
  assert.equal(response.headers.get('cache-control'),'no-store');
  const json = await response.json();
  assert.equal(json.phase,'review-only');
  assert.equal(json.accepting_submissions,false);
  assert.equal(json.accepting_membership,false);
  assert.equal(json.storing_personal_data,false);
  assert.equal(json.automated_decisions,false);
  assert.equal(json.human_gate,'not-approved');
});

test('no POST request can become a membership, including fake sensitive payloads', async () => {
  const secret = 'FAKE_TEST_PERSONAL_MARKER_7a9e';
  for (const path of ['join','application','submit','interest','volunteer','consent','rights','rights/erase']) {
    const response = await call('POST',path,JSON.stringify({name:secret,political_opinion:'test'}));
    assert.equal(response.status,423,path);
    assert.equal((await response.json()).code,'COLLECTION_NOT_AUTHORIZED',path);
    assert.equal(response.headers.get('set-cookie'),null);
    assert.equal(response.headers.get('access-control-allow-origin'),null);
    assert.ok(!(await call('GET','status')).headers.get('set-cookie'));
  }
});

test('PUT/PATCH/DELETE are also blocked without reading or echoing request body', async () => {
  for (const method of ['PUT','PATCH','DELETE']) {
    const r=await call(method,'join','NEVER_ECHO_THIS_STRING');
    assert.equal(r.status,423);
    assert.ok(!(await r.text()).includes('NEVER_ECHO_THIS_STRING'));
  }
});

test('OPTIONS is not an implicit CORS authorization', async () => {
  const r = await call('OPTIONS','join');
  assert.equal(r.status,405);
  assert.equal(r.headers.get('access-control-allow-origin'),null);
  assert.equal(r.headers.get('access-control-allow-credentials'),null);
});

test('HEAD status is bodyless and sets security headers', async () => {
  const r=await call('HEAD','status');
  assert.equal(r.status,200);
  assert.equal(await r.text(),'');
  assert.match(r.headers.get('content-security-policy'),/default-src 'none'/);
  assert.equal(r.headers.get('x-frame-options'),'DENY');
  assert.equal(r.headers.get('x-content-type-options'),'nosniff');
  assert.equal(r.headers.get('referrer-policy'),'no-referrer');
  assert.equal(r.headers.get('x-robots-tag'),'noindex, nofollow');
});

test('unknown or forged paths return only 404', async () => {
  for (const path of ['unknown','users','admin','status/secret']) {
    const r=await call('GET',path);
    assert.equal(r.status,404);
  }
});
