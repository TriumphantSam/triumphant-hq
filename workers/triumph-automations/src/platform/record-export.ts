import type {Env} from '../types';
import {admit,PlatformError,requireWorkspace} from './core';

function date(value:unknown){
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))throw new PlatformError('Choose valid start and end dates.');
  const instant=Date.parse(value+'T00:00:00.000Z');
  if(!Number.isFinite(instant)||new Date(instant).toISOString().slice(0,10)!==value)throw new PlatformError('Choose valid start and end dates.');
  return instant;
}
export function csvCell(value:unknown){
  const text=String(value??'');
  // Quoting alone does not stop spreadsheet formula evaluation.
  const risky=/^[\s\u0000-\u001f]*[=+\-@]/u.test(text)||/^[\t\r\n]/.test(text);
  const clean=text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,' ');
  return '"'+(risky?"'":'')+clean.replace(/"/g,'""')+'"';
}
export async function exportRecords(env:Env,userId:string,input:Record<string,unknown>){
  const w=await requireWorkspace(env,userId,input.workspaceId,true);
  if(input.kind!=='enquiries'&&input.kind!=='bookings')throw new PlatformError('Choose enquiries or bookings.');
  const first=date(input.from),last=date(input.to);
  if(last<first||last-first>=31*86400000)throw new PlatformError('Choose a date range of no more than 31 days.');
  await admit(env,'record-export:'+w.id,10);
  // The inclusive date range refers to record creation in Lagos, for both kinds.
  const from=new Date(first-3600000).toISOString(),until=new Date(last+86400000-3600000).toISOString();
  const fields=input.kind==='enquiries'?['id','name','email','need','status','created_at','updated_at']:['id','name','email','start','end','state','created_at','updated_at'];
  const table=input.kind==='enquiries'?'platform_leads':'platform_bookings';
  const result=await env.DB.prepare(`SELECT ${fields.join(',')} FROM ${table} WHERE workspace_id=? AND created_at>=? AND created_at<? ORDER BY created_at,id LIMIT 501`).bind(w.id,from,until).all<Record<string,string>>();
  if(result.results.length>500)throw new PlatformError('More than 500 records match. Choose a shorter date range; no partial file was exported.',409);
  const headers=input.kind==='enquiries'?['Reference','Name','Email','Enquiry','Status','Created at (UTC)','Updated at (UTC)']:['Reference','Name','Email','Appointment start (UTC)','Appointment end (UTC)','State','Created at (UTC)','Updated at (UTC)'];
  const csv='\ufeff'+[headers.map(csvCell).join(','),...result.results.map(row=>fields.map(field=>csvCell(row[field])).join(','))].join('\r\n')+'\r\n';
  if(new TextEncoder().encode(csv).length>2000000)throw new PlatformError('This file is too large. Choose a shorter date range; no partial file was exported.',409);
  return {csv,filename:`triumphant-${input.kind}-${input.from}-to-${input.to}.csv`,count:result.results.length};
}
