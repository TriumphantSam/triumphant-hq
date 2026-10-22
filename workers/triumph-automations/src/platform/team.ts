import type {Env} from "../types";
import {admit,PlatformError,requireWorkspace,validId} from "./core";
type Actor={id:string;email:string};
export async function teamAction(env:Env,user:Actor,action:string,input:Record<string,unknown>,now=Date.now()) {
  const email=user.email.trim().toLowerCase(),stamp=new Date(now).toISOString();
  if(action==="team.invitations") {
    const result=await env.DB.prepare("SELECT i.id,w.name AS businessName,i.expires_at AS expiresAt FROM platform_team_invites i JOIN platform_workspaces w ON w.id=i.workspace_id WHERE i.email=? AND i.state='pending' AND i.expires_at>? ORDER BY i.created_at DESC LIMIT 50").bind(email,stamp).all();
    return {invitations:result.results};
  }
  if(action==="team.accept") {
    if(!validId(input.inviteId))throw new PlatformError("This invitation is unavailable.",404);
    const invite=await env.DB.prepare("SELECT workspace_id,state,expires_at FROM platform_team_invites WHERE id=? AND email=?").bind(input.inviteId,email).first<{workspace_id:string;state:string;expires_at:string}>();
    if(!invite || invite.expires_at<=stamp || !["pending","accepted"].includes(invite.state))throw new PlatformError("This invitation expired or was withdrawn.",409);
    if(invite.state==="accepted") {
      await requireWorkspace(env,user.id,invite.workspace_id);
      return {ok:true,workspaceId:invite.workspace_id};
    }
    await env.DB.batch([
      env.DB.prepare("INSERT INTO platform_memberships(workspace_id,user_id,role) SELECT workspace_id,?,'staff' FROM platform_team_invites WHERE id=? AND email=? AND state='pending' AND expires_at>? AND (SELECT count(*) FROM platform_memberships WHERE workspace_id=platform_team_invites.workspace_id)<10 ON CONFLICT DO NOTHING").bind(user.id,input.inviteId,email,stamp),
      env.DB.prepare("UPDATE platform_team_invites SET state='accepted' WHERE id=? AND email=? AND state='pending' AND expires_at>? AND EXISTS(SELECT 1 FROM platform_memberships WHERE workspace_id=platform_team_invites.workspace_id AND user_id=?)").bind(input.inviteId,email,stamp,user.id),
    ]);
    const accepted=await env.DB.prepare("SELECT state FROM platform_team_invites WHERE id=?").bind(input.inviteId).first<{state:string}>();
    if(accepted?.state!=="accepted")throw new PlatformError("This team is full or the invitation changed. Ask the owner to review it.",409);
    return {ok:true,workspaceId:invite.workspace_id};
  }
  const w=await requireWorkspace(env,user.id,input.workspaceId,true);
  if(action==="team.read") {
    const [members,invites]=await Promise.all([
      env.DB.prepare("SELECT m.user_id AS userId,m.role,u.name,u.email FROM platform_memberships m JOIN platform_auth_user u ON u.id=m.user_id WHERE m.workspace_id=? ORDER BY m.role,u.email").bind(w.id).all(),
      env.DB.prepare("SELECT id,email,expires_at AS expiresAt FROM platform_team_invites WHERE workspace_id=? AND state='pending' AND expires_at>? ORDER BY created_at DESC").bind(w.id,stamp).all(),
    ]);
    return {members:members.results,invitations:invites.results,limit:10};
  }
  if(action==="team.invite") {
    const recipient=typeof input.email==="string"?input.email.trim().toLowerCase():"";
    if(recipient.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)||recipient===email)throw new PlatformError("Enter your colleague's email address.");
    await admit(env,"team-invite:"+w.id,20);
    const member=await env.DB.prepare("SELECT m.user_id FROM platform_memberships m JOIN platform_auth_user u ON u.id=m.user_id WHERE m.workspace_id=? AND lower(u.email)=?").bind(w.id,recipient).first();
    if(member)throw new PlatformError("This person already belongs to your team.",409);
    const id=crypto.randomUUID(),expires=new Date(now+7*86400000).toISOString();
    await env.DB.batch([
      env.DB.prepare("UPDATE platform_team_invites SET state='expired' WHERE workspace_id=? AND state='pending' AND expires_at<=?").bind(w.id,stamp),
      env.DB.prepare("INSERT INTO platform_team_invites(id,workspace_id,email,created_by,created_at,expires_at) SELECT ?,?,?,?,?,? WHERE ((SELECT count(*) FROM platform_memberships WHERE workspace_id=?)+(SELECT count(*) FROM platform_team_invites WHERE workspace_id=? AND state='pending' AND expires_at>?))<10 ON CONFLICT DO NOTHING").bind(id,w.id,recipient,user.id,stamp,expires,w.id,w.id,stamp),
    ]);
    const invite=await env.DB.prepare("SELECT id,email,expires_at AS expiresAt FROM platform_team_invites WHERE workspace_id=? AND email=? AND state='pending' AND expires_at>?").bind(w.id,recipient,stamp).first();
    if(!invite)throw new PlatformError("Your team is full. Remove a pending invitation or staff member first.",409);
    return {invitation:invite,emailSent:false};
  }
  if(action==="team.revoke") {
    if(!validId(input.inviteId))throw new PlatformError("Invitation not found.",404);
    await env.DB.prepare("UPDATE platform_team_invites SET state='revoked' WHERE id=? AND workspace_id=? AND state='pending'").bind(input.inviteId,w.id).run();
    return {ok:true};
  }
  if(action==="team.remove") {
    if(typeof input.userId!=="string"||input.userId.length>128||input.userId===w.owner_user_id)throw new PlatformError("The business owner cannot be removed.",409);
    await env.DB.batch([
      env.DB.prepare("UPDATE platform_team_invites SET state='revoked' WHERE workspace_id=? AND email=(SELECT lower(email) FROM platform_auth_user WHERE id=?)").bind(w.id,input.userId),
      env.DB.prepare("DELETE FROM platform_memberships WHERE workspace_id=? AND user_id=? AND role='staff'").bind(w.id,input.userId),
    ]);
    return {ok:true};
  }
  throw new PlatformError("Unknown team action.");
}
