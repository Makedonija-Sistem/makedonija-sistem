/**
 * MEDIA CONNECT secure invitation pilot v0.3.
 * REVIEW ONLY. Deployment requires Human Gate, provider secrets and
 * external legal/security approval. No bulk outreach or political profiling.
 *
 * One-time invitations use one SQLite-backed Durable Object per room.
 * Issue quotas bound UNIQUE INVITES, not concurrent SFU participants.
 * JWT is valid for 120s; consuming an invite does not revoke a minted JWT.
 */
const enc=new TextEncoder();
const CACHE={"Cache-Control":"no-store, max-age=0","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer"};
const ROLES=["host","speaker","viewer"];
const ERROR_CODES={
  not_found:404,method_not_allowed:405,pilot_disabled:503,origin_denied:403,
  invalid_admin:403,json_required:415,payload_too_large:413,
  invalid_request:400,invalid_invitation:403,quota_exhausted:409,
  rate_limited:429,registry_unavailable:503
};
function send(data,status=200,origin=null){
  const headers={...CACHE,"Content-Type":"application/json; charset=utf-8","Vary":"Origin"};
  if(origin){headers["Access-Control-Allow-Origin"]=origin;headers["Access-Control-Allow-Methods"]="POST, OPTIONS";headers["Access-Control-Allow-Headers"]="Content-Type";headers["Access-Control-Max-Age"]="300";}
  return new Response(JSON.stringify(data),{status,headers});
}
const fail=(code,origin=null)=>send({error:code},ERROR_CODES[code]||400,origin);
function b64u(bytes){
 let s="";for(const b of bytes)s+=String.fromCharCode(b);
 return btoa(s).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_");
}
async function digest(code){
 const bytes=await crypto.subtle.digest("SHA-256",enc.encode(code));
 return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,"0")).join("");
}
async function sameSecret(given,expected){
 if(typeof given!=="string"||typeof expected!=="string"||
    expected.length<32||given.length>512)return false;
 const [a,b]=await Promise.all([digest(given),digest(expected)]);
 let mismatch=0;for(let i=0;i<a.length;i++)mismatch|=a.charCodeAt(i)^b.charCodeAt(i);
 return mismatch===0;
}
async function jwt(env,role){
 const now=Math.floor(Date.now()/1000);
 const identity="mc_"+crypto.randomUUID().replace(/-/g,"");
 const header=b64u(enc.encode(JSON.stringify({alg:"HS256",typ:"JWT"})));
 const payload=b64u(enc.encode(JSON.stringify({
  iss:env.LIVEKIT_API_KEY,sub:identity,iat:now,nbf:now-5,exp:now+120,
  name:role+"-"+identity.slice(-6),
  video:{room:env.ROOM_NAME,roomJoin:true,canSubscribe:true,
   canPublish:role!=="viewer",canPublishData:false,roomAdmin:role==="host",
   canUpdateOwnMetadata:false}
 })));
 const input=header+"."+payload;
 const key=await crypto.subtle.importKey("raw",enc.encode(env.LIVEKIT_API_SECRET),
  {name:"HMAC",hash:"SHA-256"},false,["sign"]);
 const sig=await crypto.subtle.sign("HMAC",key,enc.encode(input));
 return input+"."+b64u(new Uint8Array(sig));
}
function validEnv(env){
 return !!env&&env.ENABLED==="true"&&env.HUMAN_GATE_APPROVED==="true"&&
  typeof env.ALLOWED_ORIGIN==="string"&&/^https:\/\/[a-z0-9.-]+(?::[0-9]{2,5})?$/i.test(env.ALLOWED_ORIGIN)&&
  typeof env.LIVEKIT_URL==="string"&&/^wss:\/\/[a-z0-9.-]+(?::[0-9]{2,5})?$/i.test(env.LIVEKIT_URL)&&
  typeof env.ROOM_NAME==="string"&&/^[a-z0-9_-]{3,64}$/.test(env.ROOM_NAME)&&
  typeof env.LIVEKIT_API_KEY==="string"&&env.LIVEKIT_API_KEY.length>=5&&
  typeof env.LIVEKIT_API_SECRET==="string"&&env.LIVEKIT_API_SECRET.length>=24&&
  typeof env.ADMIN_INVITE_TOKEN==="string"&&env.ADMIN_INVITE_TOKEN.length>=32&&
  env.INVITES&&typeof env.INVITES.idFromName==="function"&&typeof env.INVITES.get==="function"&&
  env.JOIN_LIMITER&&typeof env.JOIN_LIMITER.limit==="function";
}
async function bodyJson(request,limit=1024){
 if(!String(request.headers.get("Content-Type")||"").toLowerCase().startsWith("application/json"))return {error:"json_required"};
 if(Number(request.headers.get("Content-Length")||"0")>limit)return {error:"payload_too_large"};
 const text=await request.text();
 if(enc.encode(text).byteLength>limit)return {error:"payload_too_large"};
 try{return {value:JSON.parse(text)};}catch{return {error:"invalid_request"};}
}
function registry(env){
 return env.INVITES.get(env.INVITES.idFromName("media:"+env.ROOM_NAME));
}
async function registryAction(env,action,body){
 const res=await registry(env).fetch(new Request("https://registry.internal/"+action,{
  method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)
 }));
 if(res.status>=500)throw new Error("Registry unavailable");
 const answer=await res.json();
 if(!answer || typeof answer.ok!=="boolean")throw new Error("Invalid registry response");
 return answer;
}
function issueCaps(env){
 const defaults={host:1,speaker:10,viewer:25};
 const upper={host:2,speaker:500,viewer:500};
 const result={};
 for(const role of ROLES){
  const raw=env["ISSUE_CAP_"+role.toUpperCase()];
  const n=raw==null?defaults[role]:Number(raw);
  result[role]=Number.isSafeInteger(n)&&n>=1&&n<=upper[role]?n:defaults[role];
 }
 return result;
}
export class InviteRegistry {
 constructor(ctx,env){this.ctx=ctx;this.env=env;}
 async fetch(request){
  if(request.method!=="POST")return send({ok:false},405);
  let data;try{data=await request.json();}catch{return send({ok:false},400);}
  if(!data||typeof data.hash!=="string"||!/^[0-9a-f]{64}$/.test(data.hash))return send({ok:false},400);
  const key="invite:"+data.hash;
  const result=await this.ctx.storage.transaction(async txn=>{
   const now=Date.now();
   if(data.action==="issue"){
    if(!ROLES.includes(data.role)||!Number.isSafeInteger(data.expiresAt)||
       data.expiresAt<=now||data.expiresAt>now+2*60*60*1000)return {ok:false,error:"invalid_request"};
    const caps=data.caps||{},limit=caps[data.role];
    if(!Number.isSafeInteger(limit)||limit<1||limit>500)return {ok:false,error:"invalid_request"};
    const totals=await txn.get("totals")||{host:0,speaker:0,viewer:0};
    if(totals[data.role]>=limit)return {ok:false,error:"quota_exhausted"};
    if(await txn.get(key))return {ok:false,error:"invalid_request"};
    totals[data.role]+=1;
    await txn.put(key,{role:data.role,expiresAt:data.expiresAt,used:false});
    await txn.put("totals",totals);
    return {ok:true,role:data.role,expiresAt:data.expiresAt};
   }
   if(data.action==="consume"){
    const item=await txn.get(key);
    if(!item||item.used||item.revoked||item.expiresAt<=now)return {ok:false,error:"invalid_invitation"};
    await txn.put(key,{...item,used:true,usedAt:now});
    return {ok:true,role:item.role};
   }
   if(data.action==="revoke"){
    const item=await txn.get(key);
    if(!item||item.used)return {ok:false,error:"invalid_invitation"};
    await txn.put(key,{...item,revoked:true});
    return {ok:true,revoked:true};
   }
   return {ok:false,error:"invalid_request"};
  });
  return send(result,result.ok?200:(ERROR_CODES[result.error]||400));
 }
}
export default {
 async fetch(request,env){
  const pathname=new URL(request.url).pathname;
  if(pathname==="/health"&&request.method==="GET")
   return send({service:"media-connect",status:"pilot-only",enabled:false},200);
  const admin=pathname==="/api/admin/invites"||pathname==="/api/admin/revoke";
  if(!admin&&pathname!=="/api/join")return fail("not_found");
  if(!validEnv(env))return fail("pilot_disabled");
  if(request.method!=="POST"&&request.method!=="OPTIONS")return fail("method_not_allowed");
  const origin=request.headers.get("Origin");
  if(admin){
   // Admin runs from a private operator CLI only, never browser/client JS.
   if(origin!==null)return fail("origin_denied");
   if(request.method!=="POST")return fail("method_not_allowed");
   const auth=request.headers.get("Authorization")||"";
   if(!await sameSecret(auth.startsWith("Bearer ")?auth.slice(7):"",env.ADMIN_INVITE_TOKEN))
    return fail("invalid_admin");
   const parsed=await bodyJson(request);
   if(parsed.error)return fail(parsed.error);
   const data=parsed.value;
   if(pathname==="/api/admin/invites"){
    if(!data||!ROLES.includes(data.role))return fail("invalid_request");
    const minutes=data.minutes===undefined?30:Number(data.minutes);
    if(!Number.isSafeInteger(minutes)||minutes<5||minutes>120)return fail("invalid_request");
    const code=b64u(crypto.getRandomValues(new Uint8Array(32)));
    const expiresAt=Date.now()+minutes*60000;
    const result=await registryAction(env,"issue",{
     action:"issue",hash:await digest(code),role:data.role,expiresAt,caps:issueCaps(env)
    });
    if(!result.ok)return fail(result.error||"registry_unavailable");
    return send({code,role:data.role,expiresAt},201);
   }
   if(!data||typeof data.code!=="string"||data.code.length<32||data.code.length>128)
    return fail("invalid_request");
   const result=await registryAction(env,"revoke",{action:"revoke",hash:await digest(data.code)});
   if(!result.ok)return fail(result.error||"invalid_invitation");
   // Does NOT disconnect an already joined participant.
   return send({revoked:true,activeParticipantRevoked:false},200);
  }
  if(origin!==env.ALLOWED_ORIGIN)return fail("origin_denied");
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers:{
   ...CACHE,"Access-Control-Allow-Origin":origin,"Access-Control-Allow-Methods":"POST, OPTIONS",
   "Access-Control-Allow-Headers":"Content-Type","Access-Control-Max-Age":"300","Vary":"Origin"
  }});
  const parsed=await bodyJson(request);
  if(parsed.error)return fail(parsed.error,origin);
  const data=parsed.value;
  if(!data||typeof data.code!=="string"||!/^[A-Za-z0-9_-]{43}$/.test(data.code))
   return fail("invalid_request",origin);
  // Rate-limiter is per Cloudflare location, not a global access cap.
  const ip=request.headers.get("CF-Connecting-IP")||"unidentified";
  let allowed;
  try{({success:allowed}=await env.JOIN_LIMITER.limit({key:"mks-media-join:"+ip}));}
  catch{return fail("registry_unavailable",origin);}
  if(!allowed)return fail("rate_limited",origin);
  const result=await registryAction(env,"consume",{action:"consume",hash:await digest(data.code)});
  if(!result.ok)return fail(result.error||"invalid_invitation",origin);
  return send({serverUrl:env.LIVEKIT_URL,token:await jwt(env,result.role),
   role:result.role,expiresIn:120},200,origin);
 }
};
