import type {Env} from './types';
import type {OperationsHealth} from '../../../lib/operations-health';
export async function operationsHealth(env:Env,now=Date.now()):Promise<OperationsHealth>{
 const cutoff=new Date(now-15*60000).toISOString(),leaseCutoff=new Date(now-5*60000).toISOString();
 const tables=[['Enquiry delivery','outbox'],['Appointment email','booking_outbox'],['Appointment SMS / WhatsApp','booking_messages'],['Test payment email','lab_payment_jobs'],['Feedback alerts','review_jobs'],['Review invitations','review_invite_jobs'],['Owner reports','owner_report_jobs']];
 const queues=await Promise.all(tables.map(async([name,table])=>{
  const counts=await env.DB.prepare(`SELECT coalesce(sum(state='failed'),0) AS failed,coalesce(sum(state='unknown'),0) AS unknown,coalesce(sum(state='pending' AND next_attempt_at<?),0) AS overdue,coalesce(sum(state='sending' AND lease_until<?),0) AS expiredLeases FROM ${table}`).bind(cutoff,leaseCutoff).first<{failed:number;unknown:number;overdue:number;expiredLeases:number}>();
  return {name,...counts!};
 }));
 const heartbeat=await env.DB.prepare("SELECT last_started AS lastStarted,last_finished AS lastFinished,last_success AS lastSuccess,last_outcome AS lastOutcome FROM automation_heartbeat WHERE id='minute-cron'").first<NonNullable<OperationsHealth['heartbeat']>>();
 const invitation=await env.DB.prepare("SELECT count(*) AS n FROM platform_team_invites WHERE state='pending' AND expires_at>? AND (email_state='unconfirmed' OR (email_state='sending' AND email_attempted_at<?))").bind(new Date(now).toISOString(),cutoff).first<{n:number}>();
 const heartbeatAttention=!heartbeat||!heartbeat.lastSuccess||Date.parse(heartbeat.lastSuccess)<now-5*60000||heartbeat.lastOutcome==='failed';
 return {environment:env.ENVIRONMENT,generatedAt:new Date(now).toISOString(),heartbeat,heartbeatAttention,queues,invitationAttention:invitation?.n||0,attention:heartbeatAttention||queues.some(q=>q.failed+q.unknown+q.overdue+q.expiredLeases>0)||Boolean(invitation?.n)};
}
export async function heartbeatStart(env:Env){
 try{await env.DB.prepare("INSERT INTO automation_heartbeat(id,last_started,last_outcome) VALUES('minute-cron',?,'running') ON CONFLICT(id) DO UPDATE SET last_started=excluded.last_started,last_outcome='running'").bind(new Date().toISOString()).run();}catch{console.warn('heartbeat_write_unavailable');}
}
export async function heartbeatFinish(env:Env,ok:boolean){
 try{const stamp=new Date().toISOString();await env.DB.prepare("UPDATE automation_heartbeat SET last_finished=?,last_success=CASE WHEN ?=1 THEN ? ELSE last_success END,last_outcome=? WHERE id='minute-cron'").bind(stamp,ok?1:0,stamp,ok?'ok':'failed').run();}catch{console.warn('heartbeat_write_unavailable');}
}
