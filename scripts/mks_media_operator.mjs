#!/usr/bin/env node
/* Review-only, operator-invoked tool. No secrets in GitHub or arguments.
 * Does nothing without explicit --confirm, endpoint and admin secret.
 */
import process from "node:process";
import readline from "node:readline/promises";
const [action,roleOrFlag,minutesOrFlag,confirmFlag]=process.argv.slice(2);
const allowed=["host","speaker","viewer"];
const conf=process.argv.includes("--confirm");
const urlString=process.env.MKS_MEDIA_API_URL||"";
const token=process.env.MKS_MEDIA_ADMIN_TOKEN||"";
let url;
try{
 url=new URL(urlString);
 if(url.protocol!=="https:"||url.username||url.password||url.search||url.hash)throw Error();
}catch{
 console.error("Set MKS_MEDIA_API_URL to an exact HTTPS Worker root URL.");
 process.exit(2);
}
if(!conf||token.length<32){
 console.error("Explicit --confirm and private MKS_MEDIA_ADMIN_TOKEN (32+ characters) required.");
 process.exit(2);
}
async function call(path,body){
 const destination=new URL(path,url);
 if(destination.origin!==url.origin)throw new Error("Endpoint origin mismatch");
 const res=await fetch(destination,{
  method:"POST",redirect:"error",headers:{
   "Content-Type":"application/json","Authorization":"Bearer "+token
  },body:JSON.stringify(body)
 });
 const answer=await res.json();
 if(!res.ok||answer.error)throw new Error("Service rejected request: "+String(answer.error||res.status));
 return answer;
}
if(action==="issue"){
 if(!allowed.includes(roleOrFlag)){
  console.error("Usage: node scripts/mks_media_operator.mjs issue viewer|speaker|host 30 --confirm");
  process.exit(2);
 }
 const minutes=Number(minutesOrFlag);
 if(!Number.isSafeInteger(minutes)||minutes<5||minutes>120){
  console.error("Lifetime must be between 5 and 120 minutes");
  process.exit(2);
 }
 const result=await call("/api/admin/invites",{role:roleOrFlag,minutes});
 console.log("ONE-TIME INVITATION, DISPLAYED ONCE — DO NOT PUBLISH:");
 console.log(JSON.stringify({role:result.role,expiresAt:result.expiresAt,code:result.code},null,2));
}else if(action==="revoke"){
 const rl=readline.createInterface({input:process.stdin,output:process.stdout});
 const code=(await rl.question("Invitation to revoke (not a login password): ")).trim();
 rl.close();
 if(!/^[A-Za-z0-9_-]{43}$/.test(code))throw new Error("Invalid code");
 const result=await call("/api/admin/revoke",{code});
 console.log(JSON.stringify(result,null,2));
 console.log("Revocation of an unconsumed invitation does NOT disconnect an active participant.");
}else{
 console.error("Usage: issue viewer|speaker|host MINUTES --confirm, or revoke --confirm");
 process.exit(2);
}
