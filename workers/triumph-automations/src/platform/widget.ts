import type {Env} from "../types";
import {PlatformError,requireWorkspace} from "./core";
export async function widgetAction(env:Env,userId:string,action:string,input:Record<string,unknown>){
  const w=await requireWorkspace(env,userId,input.workspaceId,action==="widget.save");
  const read=async()=>await env.DB.prepare("SELECT origin,enabled,version FROM platform_widget_settings WHERE workspace_id=?").bind(w.id).first()||{origin:"",enabled:0,version:0};
  if(action==="widget.read")return read();
  if(action!=="widget.save"||typeof input.origin!=="string"||typeof input.enabled!=="boolean"||!Number.isSafeInteger(input.version))throw new PlatformError("Check website settings.");
  let url:URL;try{url=new URL(input.origin);}catch{throw new PlatformError("Enter your website origin, such as https://example.com.");}
  if(url.protocol!=="https:"||!/^[a-z0-9.-]+$/i.test(url.hostname)||url.username||url.password||url.pathname!=="/"||url.search||url.hash||input.origin.length>250)throw new PlatformError("Use an HTTPS website origin without a path or credentials.");
  if(input.enabled && w.state!=="published")throw new PlatformError("Publish the sandbox business page before enabling its widget.",409);
  await env.DB.prepare("INSERT INTO platform_widget_settings(workspace_id,origin,enabled) VALUES (?, ?,0) ON CONFLICT DO NOTHING").bind(w.id,url.origin).run();
  const updated=await env.DB.prepare("UPDATE platform_widget_settings SET origin=?,enabled=?,version=version+1 WHERE workspace_id=? AND version=? RETURNING version").bind(url.origin,Number(input.enabled),w.id,input.version).first();
  if(!updated)throw new PlatformError("Website settings changed. Reload before saving.",409);
  return read();
}
