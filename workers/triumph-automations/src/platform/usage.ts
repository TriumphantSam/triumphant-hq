import type {Env} from '../types';
import {requireWorkspace} from './core';
export async function workspaceUsage(env:Env,userId:string,workspaceId:unknown,now=Date.now()){
 const w=await requireWorkspace(env,userId,workspaceId,true),local=new Date(now+3600000),period=local.toISOString().slice(0,7);
 const start=new Date(period+'-01T00:00:00+01:00').toISOString(),reset=new Date(Date.UTC(local.getUTCFullYear(),local.getUTCMonth()+1,1)-3600000).toISOString();
 const [replies,leads,bookings]=await Promise.all([
  env.DB.prepare("SELECT count AS used FROM platform_usage WHERE workspace_id=? AND period=? AND kind='assistant_replies'").bind(w.id,period).first<{used:number}>(),
  env.DB.prepare('SELECT count(*) AS used FROM platform_leads WHERE workspace_id=? AND created_at>=?').bind(w.id,start).first<{used:number}>(),
  env.DB.prepare('SELECT count(*) AS used FROM platform_bookings WHERE workspace_id=? AND created_at>=?').bind(w.id,start).first<{used:number}>(),
 ]);
 const metric=(id:string,label:string,used:number)=>({id,label,used,limit:100,remaining:Math.max(0,100-used),percent:Math.min(100,Math.round(used)),state:used>=100?'reached':used>=80?'near':'available'});
 return {period,timezone:'Africa/Lagos',resetsAt:reset,asOf:new Date(now).toISOString(),sandbox:true,metrics:[metric('answers','Sandbox answers',replies?.used||0),metric('enquiries','Sandbox enquiries',leads?.used||0),metric('bookings','Sandbox booking records',bookings?.used||0)]};
}
