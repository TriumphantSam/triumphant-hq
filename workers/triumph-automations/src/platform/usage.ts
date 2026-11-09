import type {Env} from '../types';
import {requireWorkspace} from './core';
import {subscriptionAccess} from './subscription-access';
export async function workspaceUsage(env:Env,userId:string,workspaceId:unknown,now=Date.now()){
 const w=await requireWorkspace(env,userId,workspaceId,true),local=new Date(now+3600000),period=local.toISOString().slice(0,7);
 const reset=new Date(Date.UTC(local.getUTCFullYear(),local.getUTCMonth()+1,1)-3600000).toISOString();
 const access=await subscriptionAccess(env,w.id,now);
 const [replies,leads,bookings]=await Promise.all([
  env.DB.prepare("SELECT count AS used FROM platform_usage WHERE workspace_id=? AND period=? AND kind='assistant_replies'").bind(w.id,access.period).first<{used:number}>(),
  env.DB.prepare('SELECT count(*) AS used FROM platform_leads WHERE workspace_id=? AND created_at>=?').bind(w.id,access.windowStart).first<{used:number}>(),
  env.DB.prepare('SELECT count(*) AS used FROM platform_bookings WHERE workspace_id=? AND created_at>=?').bind(w.id,access.windowStart).first<{used:number}>(),
 ]);
 const ended=Boolean(access.trialEndsAt&&!access.active&&!access.trial);
 const metric=(id:string,label:string,used:number,limit=100)=>{
  if(access.period==='trial')limit=id==='answers'?50:10;
  return {id,label,used,limit,remaining:ended?0:Math.max(0,limit-used),percent:limit?Math.min(100,Math.round(used/limit*100)):100,state:ended||used>=limit?'reached':used>=limit*0.8?'near':'available'};
 };
 const sandbox=env.ENVIRONMENT!=='production';

 return {period:access.trialEndsAt&&!access.active?'Trial (lifetime)':period,timezone:'Africa/Lagos',resetsAt:access.trialEndsAt&&!access.active?access.trialEndsAt:reset,asOf:new Date(now).toISOString(),sandbox,subscription:access,metrics:[metric('answers',access.active?(sandbox?'Test plan answers':'Plan answers'):(sandbox?'Sandbox answers':'Plan answers'),replies?.used||0,access.replies),metric('enquiries',sandbox?'Sandbox enquiries':'Enquiries',leads?.used||0,access.enquiries),metric('bookings',sandbox?'Sandbox booking records':'Booking records',bookings?.used||0,access.bookings)]};
}
