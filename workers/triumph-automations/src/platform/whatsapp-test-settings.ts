import type {Env} from '../types';
import {PlatformError,requireWorkspace} from './core';

type Row={enabled:number;recipients:string;version:number};
export function normaliseTestRecipients(input:unknown):string[]|null {
 if(!Array.isArray(input)||input.length>5)return null;
 const numbers:string[]=[];
 for(const value of input){
  if(typeof value!=='string'||value.length>40||!/^[+\d ()-]+$/.test(value))return null;
  const number=value.replace(/[+ ()-]/g,'');
  if(!/^[1-9]\d{6,14}$/.test(number)||value.trim().slice(1).includes('+'))return null;
  if(!numbers.includes(number))numbers.push(number);
 }
 return numbers;
}
async function read(env:Env,workspaceId:string):Promise<Row>{
 return await env.DB.prepare('SELECT enabled,recipients,version FROM platform_whatsapp_test_settings WHERE workspace_id=?').bind(workspaceId).first<Row>()||{enabled:0,recipients:'[]',version:0};
}
function recipients(row:Row):string[]{
 try{return normaliseTestRecipients(JSON.parse(row.recipients))||[];}catch{return [];}
}
export async function testContactPermission(env:Env,workspaceId:string,number:string){
 const row=await read(env,workspaceId);
 return {allowed:row.enabled===1&&recipients(row).includes(number),version:row.version};
}
export async function whatsappTestSummary(env:Env,workspaceId:string){
 const row=await read(env,workspaceId);return {enabled:row.enabled===1,count:recipients(row).length};
}
export async function whatsappTestSettings(env:Env,userId:string,action:string,input:Record<string,unknown>){
 const w=await requireWorkspace(env,userId,input.workspaceId,true);
 if(action==='whatsapp.testing.save'){
  const numbers=normaliseTestRecipients(input.recipients);
  if(typeof input.enabled!=='boolean'||!Number.isSafeInteger(input.version)||Number(input.version)<0||!numbers||input.enabled&&(!numbers.length||input.testConsent!==true))
   throw new PlatformError('Choose up to five international test numbers and confirm permission before enabling testing.');
  const connection=await env.DB.prepare("SELECT display_phone FROM platform_whatsapp_connections WHERE workspace_id=? AND state='connected'").bind(w.id).first<{display_phone:string|null}>();
  if(input.enabled&&!connection)throw new PlatformError('Connect your company WhatsApp number before enabling selected-contact testing.');
  if(connection?.display_phone&&numbers.includes(connection.display_phone.replace(/\D/g,'')))throw new PlatformError('Use a different WhatsApp account for the test, not this connected business number.');
  const changed=await env.DB.prepare("INSERT INTO platform_whatsapp_test_settings(workspace_id,enabled,recipients,version,updated_at) SELECT ?,?,?,1,? WHERE ?=0 OR EXISTS(SELECT 1 FROM platform_whatsapp_test_settings WHERE workspace_id=? AND version=?) ON CONFLICT(workspace_id) DO UPDATE SET enabled=excluded.enabled,recipients=excluded.recipients,version=platform_whatsapp_test_settings.version+1,updated_at=excluded.updated_at WHERE platform_whatsapp_test_settings.version=? RETURNING version")
   .bind(w.id,Number(input.enabled),JSON.stringify(numbers),new Date().toISOString(),input.version,w.id,input.version,input.version).first();
  if(!changed)throw new PlatformError('Test contact settings changed. Reload before saving.',409);
 }else if(action!=='whatsapp.testing.read')throw new PlatformError('Unknown test contact action.');
 const row=await read(env,w.id);return {enabled:row.enabled===1,recipients:recipients(row),version:row.version,maxRecipients:5};
}

export async function resetWhatsAppTesting(env:Env,workspaceId:string){
 await env.DB.prepare("INSERT INTO platform_whatsapp_test_settings(workspace_id,enabled,recipients,version,updated_at) VALUES(?,0,'[]',1,?) ON CONFLICT(workspace_id) DO UPDATE SET enabled=0,recipients='[]',version=platform_whatsapp_test_settings.version+1,updated_at=excluded.updated_at")
  .bind(workspaceId,new Date().toISOString()).run();
}
