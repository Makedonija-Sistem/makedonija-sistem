import test from "node:test";
import assert from "node:assert/strict";
import {webcrypto} from "node:crypto";
import app,{InviteRegistry} from "../worker/invite-worker.mjs";
if(!globalThis.crypto)globalThis.crypto=webcrypto;
const ORIGIN="https://preview.example.test",ADMIN="ADMIN_TOKEN_STRONG_MKS_TEST_ABCDEFGHIJKLMNOPQRSTUVWXYZ";
class MemoryStorage {
 constructor(){this.rows=new Map();this.queue=Promise.resolve();}
 async transaction(fn){
  let done;const next=new Promise(resolve=>{done=resolve;});
  const before=this.queue;this.queue=next;await before;
  try{return await fn({
   get:async key=>this.rows.get(key),
   put:async(key,value)=>{this.rows.set(key,structuredClone(value));}
  });}finally{done();}
 }
}
function setup(overrides={}){
 const storage=new MemoryStorage(),obj=new InviteRegistry({storage},{});
 const env={
  ENABLED:"true",HUMAN_GATE_APPROVED:"true",
  ALLOWED_ORIGIN:ORIGIN,LIVEKIT_URL:"wss://livekit.pilot.test",
  ROOM_NAME:"pilot_test",LIVEKIT_API_KEY:"API_KEY_TEST_AAA",
  LIVEKIT_API_SECRET:"TEST_LIVEKIT_SECRET_abcdefghijklmnopqrstuvwxyz_1234",
  ADMIN_INVITE_TOKEN:ADMIN,
  INVITES:{idFromName:n=>n,get:()=>({fetch:req=>obj.fetch(req)})},
  JOIN_LIMITER:{limit:async()=>({success:true})},
  ...overrides
 };
 return {env,storage};
}
const req=(url,data,headers={})=>new Request("https://private.test"+url,{
 method:"POST",headers:{"Content-Type":"application/json",...headers},body:JSON.stringify(data)
});
async function issue(env,role="viewer",minutes=30,token=ADMIN){
 const r=await app.fetch(req("/api/admin/invites",{role,minutes},{
  Authorization:"Bearer "+token
 }),env);
 return {r,data:await r.json()};
}
async function join(env,code,origin=ORIGIN){
 const r=await app.fetch(req("/api/join",{code},{Origin:origin}),env);
 return {r,data:await r.json()};
}
function parseJwt(jwt){
 const parts=jwt.split(".");
 assert.equal(parts.length,3);
 return JSON.parse(Buffer.from(parts[1],"base64url").toString("utf8"));
}
async function verify(jwt,secret){
 const [a,b,c]=jwt.split(".");
 const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),
  {name:"HMAC",hash:"SHA-256"},false,["verify"]);
 return crypto.subtle.verify("HMAC",key,Buffer.from(c,"base64url"),new TextEncoder().encode(a+"."+b));
}
test("fail-closed without explicit operator approval",async()=>{
 const {env}=setup({ENABLED:"false"});
 const r=await issue(env);assert.equal(r.r.status,503);
 const health=await app.fetch(new Request("https://private.test/health"),env);
 assert.equal((await health.json()).enabled,false);
 const {env:e}=setup({HUMAN_GATE_APPROVED:"false"});
 assert.equal((await issue(e)).r.status,503);
});
test("missing Durable Object, rate limiter and secrets fail closed",async()=>{
 for(const override of [{INVITES:null},{JOIN_LIMITER:null},{LIVEKIT_API_SECRET:""},{ADMIN_INVITE_TOKEN:"weak"}]){
  const {env}=setup(override);assert.equal((await issue(env)).r.status,503);
 }
});
test("admin requires exact bearer secret and NO browser origin",async()=>{
 const {env}=setup();
 assert.equal((await issue(env,"host",30,"invalid")).r.status,403);
 const r=await app.fetch(req("/api/admin/invites",{role:"host"},{Origin:ORIGIN,Authorization:"Bearer "+ADMIN}),env);
 assert.equal(r.status,403);
 assert.equal(r.headers.get("Access-Control-Allow-Origin"),null);
});
test("valid one-time invite, immutable role from server, signed viewer JWT",async()=>{
 const {env}=setup();
 const issued=await issue(env,"viewer");
 assert.equal(issued.r.status,201);
 assert.match(issued.data.code,/^[A-Za-z0-9_-]{43}$/);
 assert.equal(issued.data.role,"viewer");
 assert.ok(issued.data.expiresAt>Date.now());
 assert.match(issued.r.headers.get("Cache-Control"),/no-store/);
 const used=await join(env,issued.data.code);
 assert.equal(used.r.status,200);
 assert.equal(used.data.role,"viewer");
 const p=parseJwt(used.data.token);
 assert.equal(p.video.room,"pilot_test");
 assert.equal(p.video.roomJoin,true);
 assert.equal(p.video.canPublish,false);
 assert.equal(p.video.roomAdmin,false);
 assert.equal(p.video.canPublishData,false);
 assert.equal(p.exp-p.iat,120);
 assert.equal(await verify(used.data.token,env.LIVEKIT_API_SECRET),true);
 const twice=await join(env,issued.data.code);
 assert.equal(twice.r.status,403);
 assert.deepEqual(twice.data,{error:"invalid_invitation"});
});
test("speaker and host grants; only admin chooses them",async()=>{
 const {env}=setup();
 for(const role of ["speaker","host"]){
  const issued=await issue(env,role);
  assert.equal(issued.r.status,201);
  const used=await join(env,issued.data.code);
  const p=parseJwt(used.data.token);
  assert.equal(used.data.role,role);
  assert.equal(p.video.canPublish,true);
  assert.equal(p.video.roomAdmin,role==="host");
  assert.equal(p.video.roomCreate,undefined);
  assert.equal(p.video.canPublishData,false);
 }
});
test("atomic single-use consume: parallel replay succeeds once",async()=>{
 const {env}=setup(),inv=(await issue(env,"viewer")).data;
 const results=await Promise.all(Array.from({length:10},()=>join(env,inv.code)));
 assert.equal(results.filter(x=>x.r.status===200).length,1);
 assert.equal(results.filter(x=>x.r.status===403).length,9);
});
test("host invitation count is limited in registry",async()=>{
 const {env}=setup();
 assert.equal((await issue(env,"host")).r.status,201);
 const second=await issue(env,"host");
 assert.equal(second.r.status,409);
 assert.equal(second.data.error,"quota_exhausted");
});
test("invitation can be revoked before use, not after JWT issuance",async()=>{
 const {env}=setup(),one=(await issue(env,"viewer")).data;
 const revoke=await app.fetch(req("/api/admin/revoke",{code:one.code},{
  Authorization:"Bearer "+ADMIN
 }),env);
 assert.equal(revoke.status,200);
 assert.deepEqual(await revoke.json(),{revoked:true,activeParticipantRevoked:false});
 assert.equal((await join(env,one.code)).r.status,403);
 const two=(await issue(env,"viewer")).data;
 assert.equal((await join(env,two.code)).r.status,200);
 const late=await app.fetch(req("/api/admin/revoke",{code:two.code},{
  Authorization:"Bearer "+ADMIN
 }),env);
 assert.equal(late.status,403);
});
test("invalid and expired invitations are rejected",async()=>{
 const {env,storage}=setup();
 assert.equal((await join(env,"bad")).r.status,400);
 assert.equal((await join(env,"A".repeat(43))).r.status,403);
 const invited=(await issue(env,"viewer")).data;
 for(const [key,value] of storage.rows.entries()){
  if(key.startsWith("invite:"))storage.rows.set(key,{...value,expiresAt:Date.now()-100});
 }
 assert.equal((await join(env,invited.code)).r.status,403);
});
test("strict origin CORS, quota, request type, limiter and method",async()=>{
 const {env}=setup();
 const created=(await issue(env,"viewer")).data;
 assert.equal((await join(env,created.code,"https://evil.test")).r.status,403);
 const pre=await app.fetch(new Request("https://private.test/api/join",{
  method:"OPTIONS",headers:{Origin:ORIGIN}
 }),env);
 assert.equal(pre.status,204);
 assert.equal(pre.headers.get("Access-Control-Allow-Origin"),ORIGIN);
 const wrong=await app.fetch(new Request("https://private.test/api/join",{
  method:"GET",headers:{Origin:ORIGIN}
 }),env);
 assert.equal(wrong.status,405);
 env.JOIN_LIMITER={limit:async()=>({success:false})};
 assert.equal((await join(env,created.code)).r.status,429);
});
test("invitation cannot be created with invalid role or lifetime",async()=>{
 const {env}=setup();
 for(const invalid of [{role:"admin"},{role:"viewer",minutes:500},{role:"viewer",minutes:-1}]){
  const res=await app.fetch(req("/api/admin/invites",invalid,{Authorization:"Bearer "+ADMIN}),env);
  assert.equal(res.status,400);
 }
});
