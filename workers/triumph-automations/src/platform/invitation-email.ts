import type {Env} from '../types';
import {admit,PlatformError} from './core';
export function invitationEmailAvailable(env:Env){
 if(env.PLATFORM_TEAM_EMAIL_ENABLED!=='true'||!env.RESEND_API_KEY||!env.EMAIL_FROM)return false;
 try{const url=new URL(env.PLATFORM_WORKSPACE_URL||'');return url.protocol==='https:'&&!url.username&&!url.password&&!url.port&&url.pathname==='/platform'&&!url.search&&!url.hash;}catch{return false;}
}
export function checkInvitationEmail(env:Env,email:string){
 if(!invitationEmailAvailable(env))throw new PlatformError('Email invitations are not enabled. Share the sign-in instructions manually.',503);
 if(env.ENVIRONMENT!=='production'&&email!==env.PLATFORM_TEAM_EMAIL_TEST_EMAIL?.toLowerCase())throw new PlatformError('Staging email is restricted to the configured test recipient.',403);
}
type Invite={id:string;email:string;email_state:string;expires_at:string};
export async function emailInvitation(env:Env,workspaceId:string,businessName:string,inviteId:string,now=Date.now()){
 const invite=await env.DB.prepare("SELECT id,email,email_state,expires_at FROM platform_team_invites WHERE id=? AND workspace_id=? AND state='pending' AND expires_at>?").bind(inviteId,workspaceId,new Date(now).toISOString()).first<Invite>();
 if(!invite)throw new PlatformError('This invitation expired or was withdrawn.',409);
 checkInvitationEmail(env,invite.email);
 if(invite.email_state!=='not-sent')return {emailState:invite.email_state,emailSent:invite.email_state==='accepted'};
 await admit(env,'team-email:'+workspaceId,5);
 const claimed=await env.DB.prepare("UPDATE platform_team_invites SET email_state='sending',email_attempted_at=? WHERE id=? AND workspace_id=? AND state='pending' AND expires_at>? AND email_state='not-sent' RETURNING id").bind(new Date(now).toISOString(),inviteId,workspaceId,new Date(now).toISOString()).first();
 if(!claimed)return {emailState:'sending',emailSent:false};
 let state='unconfirmed';
 try{
  const response=await fetch('https://api.resend.com/emails',{method:'POST',redirect:'manual',signal:AbortSignal.timeout(8000),headers:{Authorization:'Bearer '+env.RESEND_API_KEY,'Content-Type':'application/json','Idempotency-Key':'platform-team-invite-'+invite.id},body:JSON.stringify({from:env.EMAIL_FROM,to:[invite.email],subject:'Your business workspace staff invitation',text:`You have been invited to join ${businessName} as staff on TriumphantTech.\n\nOpen ${env.PLATFORM_WORKSPACE_URL}\nSign in with ${invite.email}, then accept the invitation for this business. Do not forward sign-in codes.\n\nStaff can access this business's inbox and conversations. Owners control settings, billing and team membership. This email alone does not grant access.\n\nThe invitation expires ${new Intl.DateTimeFormat('en-NG',{timeZone:'Africa/Lagos',dateStyle:'medium',timeStyle:'short'}).format(new Date(invite.expires_at))} WAT. If you do not recognise this business, ignore the invitation.`})});
  const result=await response.json() as {id?:string};if(response.ok&&typeof result.id==='string'&&result.id)state='accepted';
 }catch{/* Never resend an ambiguous provider outcome automatically. */}
 await env.DB.prepare("UPDATE platform_team_invites SET email_state=? WHERE id=? AND workspace_id=? AND email_state='sending'").bind(state,inviteId,workspaceId).run();
 return {emailState:state,emailSent:state==='accepted'};
}
