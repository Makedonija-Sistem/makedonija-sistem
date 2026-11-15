import test from "node:test";
import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import worker from "../worker/token-worker.mjs";

// Node environments without WebCrypto global (Worker runtime has it).
if (!globalThis.crypto) globalThis.crypto=webcrypto;
const ORIGIN="https://preview.example.test";
const CODES={
  HOST_JOIN_CODE:"HostCode_ABCDEFGHIJKLMNOPQRSTUVWXYZ-2026",
  SPEAKER_JOIN_CODE:"SpeakerCode_ABCDEFGHIJKLMNOPQRSTUVWXYZ-2026",
  VIEWER_JOIN_CODE:"ViewerCode_ABCDEFGHIJKLMNOPQRSTUVWXYZ-2026"
};
const env=()=>({
  ENABLED:"true",HUMAN_GATE_APPROVED:"true",
  ALLOWED_ORIGIN:ORIGIN, LIVEKIT_URL:"wss://pilot.example.test",
  ROOM_NAME:"mks_pilot",LIVEKIT_API_KEY:"API_TEST_KEY_12345",
  LIVEKIT_API_SECRET:"LIVEKIT_API_SECRET_LONG_FOR_TESTING_123456",
  ...CODES,JOIN_LIMITER:{limit:async()=>({success:true})}
});
const request=(role,code,origin=ORIGIN)=>new Request("https://token.example.test/api/join",{
  method:"POST",headers:{"Origin":origin,"Content-Type":"application/json"},
  body:JSON.stringify({role,code})
});
const call=(role,code,e=env())=>worker.fetch(request(role,code),e);
const un64=s=>Buffer.from(s.replace(/-/g,"+").replace(/_/g,"/"),"base64");
const payload=jwt=>JSON.parse(un64(jwt.split(".")[1]).toString("utf-8"));
async function validSignature(jwt,secret) {
  const parts=jwt.split(".");
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["verify"]);
  return await crypto.subtle.verify("HMAC",key,un64(parts[2]),new TextEncoder().encode(parts[0]+"."+parts[1]));
}
test("disabled-by-default gate and neutral health",async()=>{
  const e=env();e.ENABLED="false";
  const res=await call("viewer",CODES.VIEWER_JOIN_CODE,e);
  assert.equal(res.status,503); assert.equal((await res.json()).error,"pilot_disabled");
  const health=await worker.fetch(new Request("https://token.example.test/health"),e);
  assert.equal(health.status,200); assert.equal((await health.json()).enabled,false);
});
test("human approval required",async()=>{
  const e=env();e.HUMAN_GATE_APPROVED="false";
  assert.equal((await call("viewer",CODES.VIEWER_JOIN_CODE,e)).status,503);
});
test("missing ratelimiter or credentials fail closed",async()=>{
  const e=env();delete e.JOIN_LIMITER;
  assert.equal((await call("viewer",CODES.VIEWER_JOIN_CODE,e)).status,503);
  e.JOIN_LIMITER=env().JOIN_LIMITER;delete e.LIVEKIT_API_SECRET;
  assert.equal((await call("viewer",CODES.VIEWER_JOIN_CODE,e)).status,503);
});
test("origin denied and preflight exact origin",async()=>{
  const res=await worker.fetch(request("viewer",CODES.VIEWER_JOIN_CODE,"https://elsewhere.test"),env());
  assert.equal(res.status,403);assert.equal(res.headers.get("Access-Control-Allow-Origin"),null);
  const preflight=await worker.fetch(new Request("https://token.example.test/api/join",{method:"OPTIONS",headers:{Origin:ORIGIN}}),env());
  assert.equal(preflight.status,204);
  assert.equal(preflight.headers.get("Access-Control-Allow-Origin"),ORIGIN);
});
test("strict role and invitation controls",async()=>{
  assert.equal((await call("administrator",CODES.HOST_JOIN_CODE)).status,400);
  assert.equal((await call("host",CODES.VIEWER_JOIN_CODE)).status,403);
  assert.equal((await call("viewer","1234")).status,403);
  assert.equal((await call("viewer",CODES.VIEWER_JOIN_CODE)).status,200);
});
test("viewer is subscribe-only and JWT verified",async()=>{
  const res=await call("viewer",CODES.VIEWER_JOIN_CODE);assert.equal(res.status,200);
  assert.match(res.headers.get("Cache-Control"),/no-store/);
  const data=await res.json(), p=payload(data.token);
  assert.equal(data.role,"viewer");
  assert.equal(data.serverUrl,"wss://pilot.example.test");
  assert.equal(p.video.room,"mks_pilot");
  assert.equal(p.video.roomJoin,true);
  assert.equal(p.video.canPublish,false);
  assert.equal(p.video.canPublishData,false);
  assert.equal(p.video.canSubscribe,true);
  assert.equal(p.video.roomAdmin,false);
  assert.match(p.sub,/^mc_[0-9a-f]{32}$/);
  assert.equal(p.exp-p.iat,300);
  assert.equal(await validSignature(data.token,env().LIVEKIT_API_SECRET),true);
});
test("speaker may publish, cannot administer or publish data",async()=>{
  const data=await (await call("speaker",CODES.SPEAKER_JOIN_CODE)).json(),p=payload(data.token);
  assert.equal(p.video.canPublish,true);assert.equal(p.video.roomAdmin,false);
  assert.equal(p.video.canPublishData,false);
});
test("host can moderate in grant but no roomCreate global",async()=>{
  const data=await (await call("host",CODES.HOST_JOIN_CODE)).json(),p=payload(data.token);
  assert.equal(p.video.canPublish,true);assert.equal(p.video.roomAdmin,true);
  assert.equal(p.video.roomCreate,undefined);
});
test("tokens unique and short-lived",async()=>{
  const a=payload((await (await call("viewer",CODES.VIEWER_JOIN_CODE)).json()).token);
  const b=payload((await (await call("viewer",CODES.VIEWER_JOIN_CODE)).json()).token);
  assert.notEqual(a.sub,b.sub);assert.ok(a.exp>a.iat);
});
test("rate-limit binding is mandatory and enforced",async()=>{
  const e=env();e.JOIN_LIMITER={limit:async()=>({success:false})};
  assert.equal((await call("viewer",CODES.VIEWER_JOIN_CODE,e)).status,429);
});
test("large body blocked and GET forbidden",async()=>{
  const huge=await worker.fetch(new Request("https://token.example.test/api/join",{
    method:"POST",headers:{Origin:ORIGIN,"Content-Type":"application/json"},
    body:JSON.stringify({role:"viewer",code:"x".repeat(1200)})
  }),env());
  assert.equal(huge.status,413);
  const get=await worker.fetch(new Request("https://token.example.test/api/join",{method:"GET",headers:{Origin:ORIGIN}}),env());
  assert.equal(get.status,405);
});
