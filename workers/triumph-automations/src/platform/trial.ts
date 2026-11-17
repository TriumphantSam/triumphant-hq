import type {Env} from '../types';
import {requireWorkspace,PlatformError} from './core';
import {subscriptionAccess} from './subscription-access';
export async function startTrial(env:Env,userId:string,workspaceId:unknown,now=Date.now()){
 const w=await requireWorkspace(env,userId,workspaceId,true);
 if(w.state==='suspended')throw new PlatformError('This business is suspended. Contact support.',409);
 if(env.PLATFORM_TRIAL_ENABLED!=='true'||(env.ENVIRONMENT==='production'&&env.PLATFORM_CUSTOMER_RELEASE_ENABLED!=='true'))throw new PlatformError('Trials are not open in this environment.',503);
 // One lifetime trial per verified owner and workspace. Repeated requests never
 // reset dates. Existing agreements are preserved, including stopped renewals.
 const stamp=new Date(now).toISOString(),end=new Date(now+14*86400000).toISOString();
 const result=await env.DB.prepare("INSERT INTO platform_trials(workspace_id,user_id,started_at,expires_at) SELECT ?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM platform_billing WHERE workspace_id=?) AND (SELECT count(*) FROM platform_faqs WHERE workspace_id=?)<=20 ON CONFLICT DO NOTHING RETURNING workspace_id").bind(w.id,userId,stamp,end,w.id,w.id).first();
 const existing=await env.DB.prepare('SELECT user_id FROM platform_trials WHERE workspace_id=?').bind(w.id).first<{user_id:string}>();
 if(!result&&existing?.user_id!==userId)throw new PlatformError('A trial cannot be started. Check existing agreements, prior trial use and the 20-FAQ trial limit.',409);
 return subscriptionAccess(env,w.id,now);
}
