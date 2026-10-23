import type {Env} from '../types';
import {PlatformError,requireWorkspace,validId} from './core';

export async function threadSignals(env:Env,workspaceId:string,userId:string,channel:'rehearsal'|'whatsapp') {
 const rehearsal=channel==='rehearsal',table=rehearsal?'platform_conversations':'platform_whatsapp_threads';
 const unread=rehearsal?"(SELECT count(*) FROM json_each(t.messages) j WHERE json_extract(j.value,'$.role')='customer' AND CAST(j.key AS INTEGER)>=coalesce(r.cursor,0))":"(SELECT count(*) FROM platform_whatsapp_events e WHERE e.workspace_id=t.workspace_id AND e.thread_id=t.id AND e.direction='in' AND e.rowid>coalesce(r.cursor,0))";
 const rows=await env.DB.prepare(`SELECT t.id,a.assignee_id AS assigneeId,coalesce(nullif(u.name,''),'Team member') AS assigneeName,${unread} AS unreadCount FROM ${table} t LEFT JOIN platform_thread_assignments a ON a.workspace_id=t.workspace_id AND a.channel=? AND a.thread_id=t.id LEFT JOIN platform_auth_user u ON u.id=a.assignee_id LEFT JOIN platform_thread_reads r ON r.workspace_id=t.workspace_id AND r.channel=? AND r.thread_id=t.id AND r.user_id=? WHERE t.workspace_id=? ORDER BY t.updated_at DESC,t.id LIMIT 100`).bind(channel,channel,userId,workspaceId).all<{id:string;assigneeId:string|null;assigneeName:string;unreadCount:number}>();
 return new Map(rows.results.map(r=>[r.id,{assigned:Boolean(r.assigneeId),isMine:r.assigneeId===userId,assigneeName:r.assigneeId?r.assigneeName:null,unreadCount:r.unreadCount}]));
}

export async function collaborationAction(env:Env,userId:string,action:string,input:Record<string,unknown>,now=Date.now()) {
 const w=await requireWorkspace(env,userId,input.workspaceId);
 const channel=input.channel,id=input.id;
 if(!['rehearsal','whatsapp'].includes(String(channel))||!validId(id))throw new PlatformError('Conversation not found.',404);
 const table=channel==='rehearsal'?'platform_conversations':'platform_whatsapp_threads';
 const thread=await env.DB.prepare(`SELECT id FROM ${table} WHERE workspace_id=? AND id=?`).bind(w.id,id).first();
 if(!thread)throw new PlatformError('Conversation not found.',404);
 if(action==='collaboration.seen') {
  if(!Number.isSafeInteger(input.cursor)||Number(input.cursor)<0)throw new PlatformError('Invalid read position.');
  const row=await env.DB.prepare(channel==='rehearsal'?'SELECT json_array_length(messages) AS maximum FROM platform_conversations WHERE workspace_id=? AND id=?':'SELECT coalesce(max(rowid),0) AS maximum FROM platform_whatsapp_events WHERE workspace_id=? AND thread_id=?').bind(w.id,id).first<{maximum:number}>();
  if(!row||Number(input.cursor)>row.maximum)throw new PlatformError('Refresh this conversation before marking it read.',409);
  await env.DB.prepare('INSERT INTO platform_thread_reads(workspace_id,channel,thread_id,user_id,cursor) VALUES(?,?,?,?,?) ON CONFLICT(workspace_id,channel,thread_id,user_id) DO UPDATE SET cursor=max(platform_thread_reads.cursor,excluded.cursor)').bind(w.id,channel,id,userId,input.cursor).run();
 }
 if(action==='collaboration.assign') {
  const assignee=input.assigneeId===null?null:input.assigneeId;
  if((assignee!==null&&typeof assignee!=='string')||!Number.isSafeInteger(input.version)||Number(input.version)<0)throw new PlatformError('Choose a team member and refresh the assignment.');
  await env.DB.prepare('INSERT INTO platform_thread_assignments(workspace_id,channel,thread_id) VALUES(?,?,?) ON CONFLICT DO NOTHING').bind(w.id,channel,id).run();
  const changed=await env.DB.prepare('UPDATE platform_thread_assignments SET assignee_id=?,version=version+1 WHERE workspace_id=? AND channel=? AND thread_id=? AND version=? AND (? IS NULL OR EXISTS(SELECT 1 FROM platform_memberships WHERE workspace_id=? AND user_id=?)) RETURNING version')
   .bind(assignee,w.id,channel,id,input.version,assignee,w.id,assignee).first();
  if(!changed)throw new PlatformError('Assignment changed or that person is no longer on this team. Refresh before continuing.',409);
 } else if(action==='collaboration.note') {
  if(!validId(input.requestId)||typeof input.text!=='string'||!input.text.trim()||input.text.trim().length>2000)throw new PlatformError('Enter a note between 1 and 2000 characters.');
  const body=input.text.trim();
  await env.DB.prepare('INSERT INTO platform_thread_notes(id,workspace_id,channel,thread_id,author_id,body,created_at) SELECT ?,?,?,?,?,?,? WHERE (SELECT count(*) FROM platform_thread_notes WHERE workspace_id=? AND channel=? AND thread_id=?)<200 ON CONFLICT DO NOTHING')
   .bind(input.requestId,w.id,channel,id,userId,body,new Date(now).toISOString(),w.id,channel,id).run();
  const saved=await env.DB.prepare('SELECT workspace_id,channel,thread_id,author_id,body FROM platform_thread_notes WHERE id=?').bind(input.requestId).first<{workspace_id:string;channel:string;thread_id:string;author_id:string;body:string}>();
  if(!saved||saved.workspace_id!==w.id||saved.channel!==channel||saved.thread_id!==id||saved.author_id!==userId||saved.body!==body)throw new PlatformError('This note could not be saved. Refresh and check the conversation limit or retry reference.',409);
 } else if(action!=='collaboration.read'&&action!=='collaboration.seen')throw new PlatformError('Unknown collaboration action.');
 const [assignment,members,notes]=await Promise.all([
  env.DB.prepare('SELECT assignee_id AS assigneeId,version FROM platform_thread_assignments WHERE workspace_id=? AND channel=? AND thread_id=?').bind(w.id,channel,id).first(),
  env.DB.prepare("SELECT m.user_id AS id,coalesce(nullif(u.name,''),'Team member') AS name,m.role FROM platform_memberships m JOIN platform_auth_user u ON u.id=m.user_id WHERE m.workspace_id=? ORDER BY name,m.user_id").bind(w.id).all(),
  env.DB.prepare("SELECT n.id,n.body,n.created_at AS at,coalesce(nullif(u.name,''),'Team member') AS author FROM platform_thread_notes n JOIN platform_auth_user u ON u.id=n.author_id WHERE n.workspace_id=? AND n.channel=? AND n.thread_id=? ORDER BY n.created_at,n.id LIMIT 200").bind(w.id,channel,id).all(),
 ]);
 return {assignment:assignment||{assigneeId:null,version:0},members:members.results,notes:notes.results};
}
