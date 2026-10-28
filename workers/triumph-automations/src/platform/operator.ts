import type {Env} from "../types";
import type {PlatformOverview} from "../../../../lib/platform-operator";
import {PlatformError,validId,type Workspace} from "./core";
import type {PlatformSupport} from '../../../../lib/platform-operator';
import {workspaceSetup} from './setup';
import {subscriptionAccess} from './subscription-access';

/** Metadata only: no contacts, conversations, tokens or provider calls. */
export async function platformSupport(env:Env,input:Record<string,unknown>,now=Date.now()):Promise<PlatformSupport>{
 if(env.PLATFORM_ENABLED!=='true')throw new PlatformError('The customer platform is not open yet.',503);
 if(!validId(input.workspaceId))throw new PlatformError('Enter a valid business ID.');
 const w=await env.DB.prepare('SELECT * FROM platform_workspaces WHERE id=?').bind(input.workspaceId).first<Workspace>();
 if(!w)throw new PlatformError('Business not found.',404);
 const period=new Date(now+3600000).toISOString().slice(0,7),stamp=new Date(now).toISOString();
 const [setup,access,usage,members,invites]=await Promise.all([
  workspaceSetup(env,w),subscriptionAccess(env,w.id,now),
  env.DB.prepare("SELECT count FROM platform_usage WHERE workspace_id=? AND period=? AND kind='assistant_replies'").bind(w.id,period).first<{count:number}>(),
  env.DB.prepare('SELECT count(*) n FROM platform_memberships WHERE workspace_id=?').bind(w.id).first<{n:number}>(),
  env.DB.prepare("SELECT count(*) n FROM platform_team_invites WHERE workspace_id=? AND state='pending' AND expires_at>?").bind(w.id,stamp).first<{n:number}>(),
 ]);
 return {environment:env.ENVIRONMENT,generatedAt:stamp,period,business:{id:w.id,name:w.name,state:w.state,configuredPlan:w.plan_id,version:w.version},setup,access,repliesUsed:usage?.count||0,members:members?.n||0,pendingInvites:invites?.n||0};
}

/** Internal signed admin route only. Never expose through the customer RPC. */
export async function platformOverview(env:Env,input:Record<string,unknown>,now=Date.now()):Promise<PlatformOverview> {
  if(env.PLATFORM_ENABLED!=="true")throw new PlatformError("The customer platform is not open yet.",503);
  const cursor=input.cursor??"",state=input.state??"all";
  if(typeof cursor!=="string"||(cursor!==""&&!validId(cursor))||typeof state!=="string"||!["all","draft","testing","published","suspended"].includes(state))throw new PlatformError("Choose a valid business filter.");
  const period=new Date(now+3600000).toISOString().slice(0,7),stamp=new Date(now).toISOString();
  const [totals,rows]=await Promise.all([
    env.DB.prepare(`SELECT count(*) AS businesses,COALESCE(sum(state='published'),0) AS published,COALESCE(sum(state='suspended'),0) AS suspended,(SELECT count(*) FROM platform_memberships WHERE role='staff') AS staff FROM platform_workspaces`).first<PlatformOverview["totals"]>(),
    env.DB.prepare(`SELECT w.id,w.name,w.state,w.plan_id AS plan,w.created_at AS createdAt,
      (SELECT count(*) FROM platform_memberships m WHERE m.workspace_id=w.id) AS members,
      (SELECT count(*) FROM platform_team_invites i WHERE i.workspace_id=w.id AND i.state='pending' AND i.expires_at>?) AS pendingInvites,
      COALESCE((SELECT count FROM platform_usage u WHERE u.workspace_id=w.id AND u.period=? AND u.kind='assistant_replies'),0) AS replies,
      (SELECT count(*) FROM platform_leads l WHERE l.workspace_id=w.id) AS enquiries,
      (SELECT count(*) FROM platform_bookings b WHERE b.workspace_id=w.id AND b.state='confirmed') AS appointments,
      (SELECT count(*) FROM platform_conversations c WHERE c.workspace_id=w.id) AS conversations,
      COALESCE((SELECT enabled FROM platform_widget_settings s WHERE s.workspace_id=w.id),0) AS widgetEnabled,
      COALESCE((SELECT ai_enabled FROM platform_responder_settings r WHERE r.workspace_id=w.id),0) AS aiEnabled,
      (SELECT state FROM platform_billing b WHERE b.workspace_id=w.id) AS billingState,
      (SELECT paid_through FROM platform_billing b WHERE b.workspace_id=w.id) AS paidThrough
      FROM platform_workspaces w WHERE w.id>? AND (?='all' OR w.state=?) ORDER BY w.id LIMIT 21`).bind(stamp,period,cursor,state,state).all<PlatformOverview["businesses"][number]>(),
  ]);
  const businesses=rows.results.slice(0,20);
  return {environment:env.ENVIRONMENT,generatedAt:stamp,period,totals:totals!,gates:{platform:env.PLATFORM_ENABLED==="true",ai:env.PLATFORM_AI_ENABLED==="true",testBilling:env.ENVIRONMENT==="staging"&&env.PLATFORM_BILLING_TEST_ENABLED==="true"},businesses,nextCursor:rows.results.length>20?businesses.at(-1)!.id:null};
}
