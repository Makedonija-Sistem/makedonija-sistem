/* Local Cloudflare Worker runtime smoke (workerd + SQLite Durable Object).
 * NO external API calls, no real LiveKit credentials or SFU connections.
 */
"use strict";
const assert=require("node:assert/strict");
const {webcrypto}=require("node:crypto");
const crypto=globalThis.crypto||webcrypto;
const base=process.env.MKS_LOCAL_WORKER_URL||"http://127.0.0.1:8791";
const admin=process.env.MKS_FAKE_ADMIN_TOKEN||"TEST_ADMIN_TOKEN_FOR_LOCAL_QA_ABCDEFGHIJKLMNOPQRSTUVWXYZ_1234";
if(!/^http:\/\/127\.0\.0\.1:[0-9]+$/.test(base))throw new Error("Worker runtime test accepts loopback only");
const origin="https://preview.example.test";
let passed=0;
async function check(label,fn){
 await fn();passed++;console.log("PASS "+label);
}
async function call(path,body,headers={}){
 const res=await fetch(base+path,{method:"POST",headers:{
  "Content-Type":"application/json",...headers
 },body:JSON.stringify(body)});
 return {res,data:await res.json()};
}
const adminHeaders={Authorization:"Bearer "+admin};
async function issue(role){
 return call("/api/admin/invites",{role,minutes:30},adminHeaders);
}
async function join(code){
 return call("/api/join",{code},{Origin:origin});
}
const payload=jwt=>JSON.parse(Buffer.from(jwt.split(".")[1],"base64url").toString("utf8"));
async function verify(jwt){
 const parts=jwt.split(".");
 const key=await crypto.subtle.importKey("raw",
  new TextEncoder().encode("TEST_LIVEKIT_SECRET_LOCAL_ONLY_ABCDEFGHIJKLMNOPQRSTUVWXYZ_1234"),
  {name:"HMAC",hash:"SHA-256"},false,["verify"]);
 return crypto.subtle.verify("HMAC",key,
  Buffer.from(parts[2],"base64url"),new TextEncoder().encode(parts[0]+"."+parts[1]));
}
(async()=>{
 const health=await fetch(base+"/health");assert.equal(health.status,200);
 await check("private runtime ready; health never claims public live service",async()=>{
  const d=await health.json();assert.equal(d.enabled,false);
 });
 await check("admin request requires correct token",async()=>{
  const invalid=await call("/api/admin/invites",{role:"host"},{Authorization:"Bearer INVALID"});
  assert.equal(invalid.res.status,403);
 });
 await check("SQLite Durable Object creates valid single-use viewer invite",async()=>{
  const issued=await issue("viewer");assert.equal(issued.res.status,201);
  assert.match(issued.data.code,/^[A-Za-z0-9_-]{43}$/);
  const joined=await join(issued.data.code);assert.equal(joined.res.status,200);
  const p=payload(joined.data.token);
  assert.equal(p.video.canPublish,false);
  assert.equal(p.video.roomJoin,true);
  assert.equal(p.exp-p.iat,120);
  assert.equal(await verify(joined.data.token),true);
  const reused=await join(issued.data.code);assert.equal(reused.res.status,403);
 });
 await check("host quota is enforced by persistent Durable Object",async()=>{
  const first=await issue("host");assert.equal(first.res.status,201);
  const second=await issue("host");assert.equal(second.res.status,409);
  assert.equal(second.data.error,"quota_exhausted");
 });
 await check("unused speaker invite revoked before use",async()=>{
  const issued=await issue("speaker");assert.equal(issued.res.status,201);
  const revoked=await call("/api/admin/revoke",{code:issued.data.code},adminHeaders);
  assert.equal(revoked.res.status,200);
  assert.equal((await join(issued.data.code)).res.status,403);
 });
 await check("wrong CORS origin denied; role not client-chosen",async()=>{
  const invite=await issue("speaker");
  const r=await call("/api/join",{code:invite.data.code,role:"host"},{Origin:"https://evil.test"});
  assert.equal(r.res.status,403);
  const valid=await join(invite.data.code);
  assert.equal(valid.res.status,200);
  assert.equal(valid.data.role,"speaker");
  assert.equal(payload(valid.data.token).video.roomAdmin,false);
 });
 console.log(JSON.stringify({status:"PASS",passed,failed:0,mode:"LOCAL_WORKER_ONLY_NO_DEPLOY"},null,2));
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
