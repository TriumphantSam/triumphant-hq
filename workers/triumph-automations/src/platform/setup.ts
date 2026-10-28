import type {Env} from '../types';
import type {Workspace} from './core';
import type {SetupChoices,SetupStep,WorkspaceSetup} from '../../../../lib/platform-setup';
import {subscriptionAccess} from './subscription-access';

export function setupInput(input:Record<string,unknown>):SetupChoices|null {
 if(typeof input.businessType!=='string'||!['services','appointments','shop'].includes(input.businessType)||typeof input.channel!=='string'||!['whatsapp','website','both'].includes(input.channel)||typeof input.appointments!=='boolean'||typeof input.team!=='boolean'||!Number.isSafeInteger(input.version)||Number(input.version)<0)return null;
 return {businessType:input.businessType as SetupChoices['businessType'],appointments:input.appointments,team:input.team,channel:input.channel as SetupChoices['channel'],version:Number(input.version)};
}
export async function saveSetup(env:Env,workspaceId:string,choices:SetupChoices){
 await env.DB.prepare('INSERT INTO platform_setup_preferences(workspace_id,updated_at) VALUES(?,?) ON CONFLICT DO NOTHING').bind(workspaceId,new Date().toISOString()).run();
 return env.DB.prepare('UPDATE platform_setup_preferences SET business_type=?,appointments=?,team=?,channel=?,version=version+1,updated_at=? WHERE workspace_id=? AND version=? RETURNING workspace_id')
  .bind(choices.businessType,Number(choices.appointments),Number(choices.team),choices.channel,new Date().toISOString(),workspaceId,choices.version).first();
}
export async function workspaceSetup(env:Env,w:Workspace):Promise<WorkspaceSetup>{
 const [preferences,answers,booking,responder,rehearsal,staff,widget,whatsapp,subscription]=await Promise.all([
  env.DB.prepare('SELECT business_type,appointments,team,channel,version FROM platform_setup_preferences WHERE workspace_id=?').bind(w.id).first<{business_type:SetupChoices['businessType'];appointments:number;team:number;channel:SetupChoices['channel'];version:number}>(),
  env.DB.prepare('SELECT count(*) n FROM platform_faqs WHERE workspace_id=?').bind(w.id).first<{n:number}>(),
  env.DB.prepare('SELECT reviewed_at FROM platform_booking_policy WHERE workspace_id=?').bind(w.id).first<{reviewed_at:string|null}>(),
  env.DB.prepare('SELECT version,enabled FROM platform_responder_settings WHERE workspace_id=?').bind(w.id).first<{version:number;enabled:number}>(),
  env.DB.prepare("SELECT 1 AS ok FROM platform_conversations c WHERE c.workspace_id=? AND EXISTS(SELECT 1 FROM json_each(c.messages) WHERE json_extract(value,'$.role')='customer') AND EXISTS(SELECT 1 FROM json_each(c.messages) WHERE json_extract(value,'$.role')='automation') AND EXISTS(SELECT 1 FROM json_each(c.messages) WHERE json_extract(value,'$.role')='team') LIMIT 1").bind(w.id).first(),
  env.DB.prepare("SELECT count(*) n FROM platform_memberships WHERE workspace_id=? AND role='staff'").bind(w.id).first<{n:number}>(),
  env.DB.prepare('SELECT enabled,origin FROM platform_widget_settings WHERE workspace_id=?').bind(w.id).first<{enabled:number;origin:string}>(),
  env.DB.prepare("SELECT 1 AS ok FROM platform_whatsapp_connections WHERE workspace_id=? AND state='connected'").bind(w.id).first(),
  subscriptionAccess(env,w.id),
 ]);
 const choices:SetupChoices={businessType:preferences?.business_type||'services',appointments:preferences?Boolean(preferences.appointments):true,team:Boolean(preferences?.team),channel:preferences?.channel||'both',version:preferences?.version||0};
 const steps:SetupStep[]=[
  {id:'choices',tab:'Setup',title:'Choose your setup path',detail:'Save the business type, optional preparation steps and channels you want to prepare.',done:choices.version>0,required:true},
  {id:'profile',tab:'Business',title:'Introduce your business',detail:'Save your business description and an HTTPS customer contact link. Open the link yourself to check it works.',done:Boolean(w.description&&w.contact_url),required:true},
  {id:'answers',tab:'Answers',title:'Save your approved answers',detail:'Add accurate answers about your services, prices and common customer questions.',done:Number(answers?.n)>0,required:true},
  {id:'appointments',tab:'Appointments',title:'Review your appointment rules',detail:'Save the working days, Lagos hours, duration, buffer and minimum notice you actually offer.',done:Boolean(booking?.reviewed_at),required:choices.appointments},
  {id:'responders',tab:'Autoresponders',title:'Save and enable your responders',detail:'Review your welcome, away and handover messages, then save with automation enabled.',done:Boolean(responder&&responder.version>0&&responder.enabled),required:true},
  {id:'rehearsal',tab:'Conversations',title:'Practise a conversation and team handover',detail:'In one rehearsal, ask a customer question, check the automated reply and send a team reply. Use invented details.',done:Boolean(rehearsal),required:true},
  {id:'team',tab:'Team',title:'Bring a colleague into the workspace',detail:'An invitation alone is not enough: a colleague must accept and appear as staff.',done:Number(staff?.n)>0,required:choices.team},
 ];
 const completed=steps.filter(step=>step.required&&step.done).length,required=steps.filter(step=>step.required).length,preparationComplete=completed===required;
 const websiteRequired=choices.channel!=='whatsapp',whatsappRequired=choices.channel!=='website';
 return {choices,steps,completed,required,preparationComplete,launchChecks:[
  {id:'preparation',label:'Business preparation',state:preparationComplete?'ready':'pending',detail:preparationComplete?'All required preparation steps have saved evidence.':'Complete the required setup steps first.',tab:'Setup'},
  {id:'billing',label:'Subscription access',state:env.ENVIRONMENT==='production'&&subscription.active?'ready':subscription.active?'configured':'pending',detail:subscription.active?(env.ENVIRONMENT==='production'?'A verified live payment covers the current period.':'A verified test payment is active. It does not activate live billing.'):'No active verified subscription period.',tab:'Plans'},
  {id:'website',label:'Customer website',state:!websiteRequired?'not-required':w.state==='published'&&widget?.enabled?'configured':'pending',detail:!websiteRequired?'Website installation is not part of your selected setup path.':w.state==='published'&&widget?.enabled?'Widget settings are saved. Installation on the customer website still needs an end-to-end test.':'Publish the test page and configure the website installation. This does not prove customer-site delivery.',tab:'Website'},
  {id:'whatsapp',label:'WhatsApp channel',state:!whatsappRequired?'not-required':whatsapp?'configured':'blocked',detail:!whatsappRequired?'WhatsApp is not part of your selected setup path.':whatsapp?'A connection is recorded. Real inbound and outbound delivery must still be tested.':'Connection, required Meta access and delivery verification are separate launch requirements.',tab:'Launch'},
  {id:'release',label:'Customer release',state:env.ENVIRONMENT==='production'&&env.PLATFORM_CUSTOMER_RELEASE_ENABLED==='true'?'configured':'blocked',detail:'Preparation does not open the production platform. Release approval and the selected channels’ delivery checks remain separate.',tab:'Launch'},
 ]};
}
