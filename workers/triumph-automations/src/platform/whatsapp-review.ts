import type {Env} from "../types";
import {hmac} from "../security";
import {PlatformError,requireWorkspace,validId} from "./core";
import {graphVersion,PROTECTED_PHONE_NUMBER_IDS} from "./whatsapp";

type Actor={id:string;email:string};
type State="ready"|"reserved"|"accepted"|"unconfirmed";
/** App-owned Meta test sender only. Does not connect a customer or change webhooks. */
export async function whatsappReview(env:Env,user:Actor,action:string,input:Record<string,unknown>,now=Date.now()) {
  const expires=Date.parse(env.PLATFORM_WA_REVIEW_EXPIRES_AT||"");
  if(env.ENVIRONMENT!=="staging"||env.PLATFORM_WA_REVIEW_ENABLED!=="true"||!Number.isFinite(expires)||expires<=now||expires>now+86400000) {
    if(action==="whatsapp.review.read")return {available:false};
    throw new PlatformError("The review sender is disabled.",403);
  }
  if(user.email.toLowerCase()!==env.PLATFORM_WA_REVIEW_OWNER_EMAIL?.toLowerCase()||input.workspaceId!==env.PLATFORM_WA_REVIEW_WORKSPACE_ID)throw new PlatformError("The review sender is unavailable for this account.",403);
  const w=await requireWorkspace(env,user.id,input.workspaceId,true);
  const phone=env.PLATFORM_WA_REVIEW_PHONE_ID||"",to=env.PLATFORM_WA_REVIEW_RECIPIENT||"",token=env.PLATFORM_WA_REVIEW_TOKEN||"",run=env.PLATFORM_WA_REVIEW_RUN_ID;
  if(!/^\d{5,32}$/.test(phone)||PROTECTED_PHONE_NUMBER_IDS.has(phone)||!/^\d{8,15}$/.test(to)||!token||token.length>10000||/[\r\n]/.test(token)||!validId(run))throw new PlatformError("The private test-sender settings are incomplete.",503);
  const endpoint=`https://graph.facebook.com/${graphVersion(env)}/${phone}`;
  const requestId="wa-review:"+run;
  const digest=await hmac(env.AUTOMATION_HMAC_SECRET,JSON.stringify([phone,to,run,"hello_world"]));
  const saved=await env.DB.prepare("SELECT payload_digest,response FROM platform_requests WHERE workspace_id=? AND request_id=?").bind(w.id,requestId).first<{payload_digest:string;response:string|null}>();
  if(saved&&saved.payload_digest!==digest)throw new PlatformError("This recording run has changed. Operator review is required.",409);
  if(!["whatsapp.review.read","whatsapp.review.send"].includes(action))throw new PlatformError("Unknown review action.");
  let state:State=saved?(saved.response==="accepted"?"accepted":saved.response==="unconfirmed"?"unconfirmed":"reserved"):"ready";
  if(action==="whatsapp.review.send"&&saved) return {available:true,state,recipientLastFour:to.slice(-4)};
  let profile:Record<string,unknown>;
  try {
    const r=await fetch(endpoint+"?fields=id,display_phone_number,verified_name",{headers:{Authorization:"Bearer "+token},signal:AbortSignal.timeout(8000),redirect:"manual"});
    if(!r.ok){
      const failure=await r.json().catch(()=>null) as {error?:{code?:number;error_subcode?:number}}|null;
      console.warn("whatsapp_review_profile_failed",{status:r.status,code:failure?.error?.code,subcode:failure?.error?.error_subcode});
      throw new Error();
    }profile=await r.json() as Record<string,unknown>;
  }catch(error){console.warn("whatsapp_review_profile_unavailable",{kind:error instanceof Error?error.name:"unknown"});throw new PlatformError("The test sender could not be verified. The temporary token may have expired.",503);}
  const display=String(profile.display_phone_number||"").replace(/\D/g,"");
  if(profile.id!==phone||!/^1555\d{7}$/.test(display)||String(profile.verified_name||"").toLowerCase()!=="test number")throw new PlatformError("Only Meta's isolated Test Number can be used in this review panel.",403);
  if(action==="whatsapp.review.read")return {available:true,state,sender:display,recipientLastFour:to.slice(-4),template:"hello_world"};
  const claimed=await env.DB.prepare("INSERT INTO platform_requests(workspace_id,request_id,payload_digest,response,created_at) VALUES(?,?,?,NULL,?) ON CONFLICT DO NOTHING RETURNING request_id").bind(w.id,requestId,digest,new Date().toISOString()).first();
  if(!claimed)return {available:true,state:"reserved",recipientLastFour:to.slice(-4)};
  try {
    const r=await fetch(endpoint+"/messages",{method:"POST",headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},body:JSON.stringify({messaging_product:"whatsapp",to,type:"template",template:{name:"hello_world",language:{code:"en_US"}}}),signal:AbortSignal.timeout(8000),redirect:"manual"});
    const result=await r.json() as {messages?:Array<{id?:string}>};
    if(!r.ok||!result.messages?.[0]?.id)throw new Error();
    state="accepted";
  }catch {state="unconfirmed";}
  // A timeout or failed write never frees the reservation for another send.
  await env.DB.prepare("UPDATE platform_requests SET response=? WHERE workspace_id=? AND request_id=?").bind(state,w.id,requestId).run();
  return {available:true,state,recipientLastFour:to.slice(-4)};
}
