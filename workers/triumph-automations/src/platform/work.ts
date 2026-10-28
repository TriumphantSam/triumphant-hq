import type {Env} from '../types';
import {PlatformError,requireWorkspace,validId} from './core';
import type {WorkTarget,WorkSource,FollowUp,FollowUpView,WorkOverview} from '../../../../lib/platform-work';

function target(input:Record<string,unknown>):WorkTarget{
 if(typeof input.kind!=='string'||!['enquiry','booking','rehearsal','whatsapp'].includes(input.kind)||!validId(input.id))throw new PlatformError('Work record not found.',404);
 return {kind:input.kind as WorkTarget['kind'],id:input.id};
}
async function source(env:Env,workspaceId:string,item:WorkTarget):Promise<WorkSource>{
 const queries={
  enquiry:'SELECT name AS label,need AS detail,status AS state,version FROM platform_leads WHERE workspace_id=? AND id=?',
  booking:'SELECT name AS label,start||\' to \'||end AS detail,state,version,start,end FROM platform_bookings WHERE workspace_id=? AND id=?',
  rehearsal:"SELECT label,'Private conversation rehearsal' AS detail,CASE WHEN paused=1 THEN 'with-team' ELSE 'automation-available' END AS state,version FROM platform_conversations WHERE workspace_id=? AND id=?",
  whatsapp:"SELECT label,'WhatsApp conversation' AS detail,CASE WHEN paused=1 THEN 'with-team' ELSE 'automation-available' END AS state,version FROM platform_whatsapp_threads WHERE workspace_id=? AND id=?",
 };
 const row=await env.DB.prepare(queries[item.kind]).bind(workspaceId,item.id).first<WorkSource>();
 if(!row)throw new PlatformError('Work record not found.',404);return row;
}
async function task(env:Env,workspaceId:string,item:WorkTarget){return env.DB.prepare('SELECT due_at AS dueAt,note,assignee_id AS assigneeId,done,version FROM platform_followups WHERE workspace_id=? AND kind=? AND record_id=?').bind(workspaceId,item.kind,item.id).first<FollowUp>();}
export async function followUpAction(env:Env,userId:string,action:string,input:Record<string,unknown>,now=Date.now()):Promise<FollowUpView>{
 const w=await requireWorkspace(env,userId,input.workspaceId),item=target(input),record=await source(env,w.id,item),stamp=new Date(now).toISOString();
 if(action==='followup.save'){
  const due=typeof input.dueAt==='string'?Date.parse(input.dueAt):NaN;
  if(!Number.isFinite(due)||new Date(due).toISOString()!==input.dueAt||Math.abs(due-now)>365*86400000||typeof input.note!=='string'||input.note.trim().length>1000||!Number.isSafeInteger(input.version)||Number(input.version)<0||(input.assigneeId!==null&&typeof input.assigneeId!=='string'))throw new PlatformError('Check the Lagos follow-up date, note and team member.');
  const assignee=input.assigneeId as string|null;
  // The membership check is inside the write, not only a preceding lookup.
  let changed;
  if(input.version===0)changed=await env.DB.prepare('INSERT INTO platform_followups(workspace_id,kind,record_id,due_at,note,assignee_id,updated_at) SELECT ?,?,?,?,?,?,? WHERE (? IS NULL OR EXISTS(SELECT 1 FROM platform_memberships WHERE workspace_id=? AND user_id=?)) ON CONFLICT DO NOTHING RETURNING version').bind(w.id,item.kind,item.id,input.dueAt,input.note.trim(),assignee,stamp,assignee,w.id,assignee).first();
  else changed=await env.DB.prepare('UPDATE platform_followups SET due_at=?,note=?,assignee_id=?,done=0,version=version+1,updated_at=? WHERE workspace_id=? AND kind=? AND record_id=? AND version=? AND (? IS NULL OR EXISTS(SELECT 1 FROM platform_memberships WHERE workspace_id=? AND user_id=?)) RETURNING version').bind(input.dueAt,input.note.trim(),assignee,stamp,w.id,item.kind,item.id,input.version,assignee,w.id,assignee).first();
  if(!changed)throw new PlatformError('Follow-up changed or the assignee is no longer a member. Reload before saving.',409);
 } else if(action==='followup.complete'){
  if(!Number.isSafeInteger(input.version))throw new PlatformError('Reload the follow-up before completing it.');
  const changed=await env.DB.prepare('UPDATE platform_followups SET done=1,version=version+1,updated_at=? WHERE workspace_id=? AND kind=? AND record_id=? AND version=? AND done=0 RETURNING version').bind(stamp,w.id,item.kind,item.id,input.version).first();
  if(!changed)throw new PlatformError('Follow-up changed. Reload before completing it.',409);
 } else if(action!=='followup.read')throw new PlatformError('Unknown follow-up action.');
 const [saved,members]=await Promise.all([task(env,w.id,item),env.DB.prepare("SELECT m.user_id AS id,coalesce(nullif(u.name,''),'Team member') AS name FROM platform_memberships m JOIN platform_auth_user u ON u.id=m.user_id WHERE m.workspace_id=? ORDER BY name,m.user_id").bind(w.id).all<{id:string;name:string}>()]);
 return {source:record,task:saved?{...saved,done:Boolean(saved.done)}:null,members:members.results};
}
export async function workOverview(env:Env,userId:string,input:Record<string,unknown>,now=Date.now()):Promise<WorkOverview>{
 const w=await requireWorkspace(env,userId,input.workspaceId);
 if(input.filter!==undefined&&(typeof input.filter!=='string'||!['mine','all'].includes(input.filter)))throw new PlatformError('Choose a valid work filter.');
 const stamp=new Date(now).toISOString(),end=new Date(now+86400000).toISOString();
 const [counts,rows]=await Promise.all([
  env.DB.prepare("SELECT (SELECT count(*) FROM platform_leads WHERE workspace_id=? AND status='new') AS newEnquiries,(SELECT count(*) FROM platform_bookings WHERE workspace_id=? AND state='confirmed' AND start>=? AND start<?) AS appointmentsNextDay,(SELECT count(*) FROM platform_conversations WHERE workspace_id=? AND paused=1) AS pausedRehearsals,(SELECT count(*) FROM platform_whatsapp_threads WHERE workspace_id=? AND paused=1) AS pausedWhatsApp,(SELECT version FROM platform_responder_settings WHERE workspace_id=?) AS responderVersion,(SELECT enabled FROM platform_responder_settings WHERE workspace_id=?) AS responderEnabled").bind(w.id,w.id,stamp,end,w.id,w.id,w.id,w.id).first<{newEnquiries:number;appointmentsNextDay:number;pausedRehearsals:number;pausedWhatsApp:number;responderVersion:number|null;responderEnabled:number|null}>(),
  env.DB.prepare(`SELECT f.kind,f.record_id AS id,f.due_at AS dueAt,f.note,f.assignee_id AS assigneeId,f.done,f.version,
   coalesce(l.name,b.name,c.label,t.label,'Stored record') AS label,
   CASE WHEN m.user_id IS NULL THEN NULL ELSE coalesce(nullif(u.name,''),'Team member') END AS assigneeName
   FROM platform_followups f
   LEFT JOIN platform_leads l ON f.kind='enquiry' AND l.workspace_id=f.workspace_id AND l.id=f.record_id
   LEFT JOIN platform_bookings b ON f.kind='booking' AND b.workspace_id=f.workspace_id AND b.id=f.record_id
   LEFT JOIN platform_conversations c ON f.kind='rehearsal' AND c.workspace_id=f.workspace_id AND c.id=f.record_id
   LEFT JOIN platform_whatsapp_threads t ON f.kind='whatsapp' AND t.workspace_id=f.workspace_id AND t.id=f.record_id
   LEFT JOIN platform_memberships m ON m.workspace_id=f.workspace_id AND m.user_id=f.assignee_id
   LEFT JOIN platform_auth_user u ON u.id=m.user_id
   WHERE f.workspace_id=? AND f.done=0 AND (l.id IS NOT NULL OR b.id IS NOT NULL OR c.id IS NOT NULL OR t.id IS NOT NULL)
   AND (?='all' OR f.assignee_id=? OR m.user_id IS NULL)
   ORDER BY f.due_at,f.kind,f.record_id LIMIT 51`).bind(w.id,input.filter||'mine',userId).all<WorkOverview['tasks'][number]>(),
 ]);
 return {asOf:stamp,sandbox:env.ENVIRONMENT!=='production',newEnquiries:counts!.newEnquiries,appointmentsNextDay:counts!.appointmentsNextDay,pausedRehearsals:counts!.pausedRehearsals,pausedWhatsApp:counts!.pausedWhatsApp,responders:{configured:Number(counts!.responderVersion)>0,enabled:Boolean(counts!.responderEnabled)},tasks:rows.results.slice(0,50).map(row=>({...row,done:Boolean(row.done),overdue:row.dueAt<stamp})),truncated:rows.results.length>50};
}
