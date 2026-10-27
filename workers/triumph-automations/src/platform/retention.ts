import type {Env} from '../types';
import {PlatformError,requireWorkspace} from './core';
export async function retentionAction(env:Env,userId:string,action:string,input:Record<string,unknown>,now=Date.now()){
 const w=await requireWorkspace(env,userId,input.workspaceId,true),stamp=new Date(now).toISOString();
 if(action==='retention.save'){
  if(![0,90,180,365].includes(Number(input.days))||typeof input.days!=='number'||!Number.isSafeInteger(input.version)||Number(input.version)<0)throw new PlatformError('Choose a valid preview window.');
  const saved=await env.DB.prepare("INSERT INTO platform_retention_preview(workspace_id,days,version,updated_at) SELECT ?,?,1,? WHERE ?=0 ON CONFLICT(workspace_id) DO UPDATE SET days=excluded.days,version=platform_retention_preview.version+1,updated_at=excluded.updated_at WHERE platform_retention_preview.version=? RETURNING version").bind(w.id,input.days,stamp,input.version,input.version).first();
  // Existing rows with versions above zero need a regular guarded update.
  if(!saved){
   const updated=await env.DB.prepare('UPDATE platform_retention_preview SET days=?,version=version+1,updated_at=? WHERE workspace_id=? AND version=? RETURNING version').bind(input.days,stamp,w.id,input.version).first();
   if(!updated)throw new PlatformError('The preview changed. Reload before saving.',409);
  }
 }else if(action!=='retention.read')throw new PlatformError('Unknown retention action.');
 const policy=await env.DB.prepare('SELECT days,version FROM platform_retention_preview WHERE workspace_id=?').bind(w.id).first<{days:number;version:number}>()||{days:0,version:0};
 if(!policy.days)return {...policy,deletionEnabled:false,cutoff:null,enquiries:0,appointments:0};
 const cutoff=new Date(now-policy.days*86400000).toISOString();
 const counts=await env.DB.prepare("SELECT (SELECT count(*) FROM platform_leads WHERE workspace_id=? AND status IN ('won','lost') AND created_at<? AND updated_at<?) AS enquiries,(SELECT count(*) FROM platform_bookings WHERE workspace_id=? AND end<? AND updated_at<?) AS appointments").bind(w.id,cutoff,cutoff,w.id,cutoff,cutoff).first<{enquiries:number;appointments:number}>();
 return {...policy,...counts,deletionEnabled:false,cutoff};
}
