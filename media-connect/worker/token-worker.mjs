/**
 * MEDIA CONNECT v0.2 - PRIVATE PILOT token issuer.
 * Not deployed; no recording, bulk messaging or public guest registration.
 *
 * Mandatory, secret configuration:
 *   LIVEKIT_API_KEY, LIVEKIT_API_SECRET
 *   HOST_JOIN_CODE, SPEAKER_JOIN_CODE, VIEWER_JOIN_CODE
 * Mandatory bindings/vars:
 *   JOIN_LIMITER (Cloudflare ratelimit)
 *   ALLOWED_ORIGIN (exact HTTPS origin)
 *   LIVEKIT_URL (wss://...), ROOM_NAME (opaque slug)
 *   ENABLED=true, HUMAN_GATE_APPROVED=true
 *
 * Shared invite codes are a pilot-only design. Production requires
 * identity-backed, revocable per-user invites, session limits and audit.
 */
const te = new TextEncoder();
const NO_CACHE = { "Cache-Control": "no-store, max-age=0", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer" };

function response(data, status, origin) {
  const headers = { ...NO_CACHE, "Content-Type": "application/json; charset=utf-8", "Vary": "Origin" };
  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
    headers["Access-Control-Max-Age"] = "600";
  }
  return new Response(JSON.stringify(data), { status, headers });
}

function base64url(bytes) {
  let str = "";
  for (const byte of bytes) str += String.fromCharCode(byte);
  return btoa(str).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function secureEquals(provided, stored) {
  // Fixed-length digests + no early difference exit. The pilot codes should
  // each have high entropy, not human-readable 4- or 6-digit PINs.
  if (typeof provided !== "string" || typeof stored !== "string" ||
      stored.length < 24 || provided.length > 512) return false;
  const [a,b] = await Promise.all([
    crypto.subtle.digest("SHA-256", te.encode(provided)),
    crypto.subtle.digest("SHA-256", te.encode(stored))
  ]);
  const x=new Uint8Array(a), y=new Uint8Array(b);
  let result=0;
  for(let i=0;i<x.length;i++) result |= x[i]^y[i];
  return result===0;
}

async function makeToken(env, role) {
  const now=Math.floor(Date.now()/1000);
  const room=env.ROOM_NAME;
  const grant={
    room, roomJoin:true, canSubscribe:true,
    canPublish:role!=="viewer",
    canPublishData:false,
    roomAdmin:role==="host",
    canUpdateOwnMetadata:false
  };
  const identity="mc_"+crypto.randomUUID().replace(/-/g,"");
  const head=base64url(te.encode(JSON.stringify({alg:"HS256",typ:"JWT"})));
  const payload=base64url(te.encode(JSON.stringify({
    iss:env.LIVEKIT_API_KEY, sub:identity, iat:now, nbf:now-5, exp:now+300,
    video:grant, name:role+"-"+identity.slice(-6)
  })));
  const input=head+"."+payload;
  const key=await crypto.subtle.importKey(
    "raw",te.encode(env.LIVEKIT_API_SECRET),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const sig=await crypto.subtle.sign("HMAC",key,te.encode(input));
  return input+"."+base64url(new Uint8Array(sig));
}

function validEnvironment(env) {
  if(!env || env.ENABLED!=="true" || env.HUMAN_GATE_APPROVED!=="true") return false;
  if(!env.JOIN_LIMITER || typeof env.JOIN_LIMITER.limit!=="function") return false;
  if(typeof env.ALLOWED_ORIGIN!=="string" || !/^https:\/\/[^\s/?#]+$/.test(env.ALLOWED_ORIGIN)) return false;
  if(typeof env.LIVEKIT_URL!=="string" || !/^wss:\/\/[^\s/?#]+(?:\/[^\s?#]*)?$/.test(env.LIVEKIT_URL)) return false;
  if(typeof env.ROOM_NAME!=="string" || !/^[a-z0-9_-]{3,64}$/.test(env.ROOM_NAME)) return false;
  if(typeof env.LIVEKIT_API_KEY!=="string" || env.LIVEKIT_API_KEY.length<5) return false;
  if(typeof env.LIVEKIT_API_SECRET!=="string" || env.LIVEKIT_API_SECRET.length<24) return false;
  return true;
}

export default {
  async fetch(request, env) {
    const url=new URL(request.url);
    if(url.pathname==="/health" && request.method==="GET") {
      return response({service:"media-connect",status:"pilot-only",enabled:false},200);
    }
    if(url.pathname!=="/api/join") return response({error:"not_found"},404);
    if(!validEnvironment(env)) return response({error:"pilot_disabled"},503);
    const origin=request.headers.get("Origin");
    // CORS restrictions are not authentication; invite codes and rate limits
    // still apply, including for non-browser clients.
    if(origin!==env.ALLOWED_ORIGIN) return response({error:"origin_denied"},403);
    if(request.method==="OPTIONS") return new Response(null,{status:204,headers:{
      ...NO_CACHE,"Access-Control-Allow-Origin":origin,"Access-Control-Allow-Methods":"POST, OPTIONS",
      "Access-Control-Allow-Headers":"Content-Type","Access-Control-Max-Age":"600","Vary":"Origin"
    }});
    if(request.method!=="POST") return response({error:"method_not_allowed"},405,origin);
    if(!String(request.headers.get("Content-Type")||"").toLowerCase().startsWith("application/json")) {
      return response({error:"json_required"},415,origin);
    }
    const size=Number(request.headers.get("Content-Length")||"0");
    if(size>1024) return response({error:"payload_too_large"},413,origin);
    const bodyText=await request.text();
    if(bodyText.length>1024) return response({error:"payload_too_large"},413,origin);
    let body;
    try{body=JSON.parse(bodyText);}catch{return response({error:"invalid_json"},400,origin);}
    if(!body || !["host","speaker","viewer"].includes(body.role) ||
       typeof body.code!=="string" || body.code.length>512) {
       return response({error:"invalid_request"},400,origin);
    }
    // Bound per-IP checks mitigate guessing but are approximate and NOT
    // a substitute for identity-backed single-use invitations.
    const ip=request.headers.get("CF-Connecting-IP")||"unidentified";
    const {success}=await env.JOIN_LIMITER.limit({key:"media-connect:"+ip});
    if(!success) return response({error:"rate_limited"},429,origin);
    const name={host:"HOST_JOIN_CODE",speaker:"SPEAKER_JOIN_CODE",viewer:"VIEWER_JOIN_CODE"}[body.role];
    if(!await secureEquals(body.code,env[name])) {
      return response({error:"invalid_invitation"},403,origin);
    }
    const token=await makeToken(env,body.role);
    return response({serverUrl:env.LIVEKIT_URL,token,role:body.role,expiresIn:300},200,origin);
  }
};
