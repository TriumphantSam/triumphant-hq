import test from "node:test";
import assert from "node:assert/strict";
import {NextRequest} from "next/server";
import {proxy} from "../proxy";
test("widget framing is origin-scoped, handles encoded paths and fails closed",async()=>{
 const saved={base:process.env.AUTOMATION_API_BASE,key:process.env.AUTOMATION_HMAC_SECRET,fetch:globalThis.fetch};
 process.env.AUTOMATION_API_BASE="https://backend.example";process.env.AUTOMATION_HMAC_SECRET="widget-test-secret";
 try{
  globalThis.fetch=async()=>Response.json({data:{origin:"https://customer.example"}});
  for(const id of ["d0e0f0a0-2026-4020-8020-202610200001","%640e0f0a0-2026-4020-8020-202610200001"]){
   const response=await proxy(new NextRequest(`https://triumphantech.com/business/${id}/widget`));
   assert.equal(response.headers.get("content-security-policy"),"frame-ancestors https://customer.example");
   assert.equal(response.headers.get("cache-control"),"no-store, private");
  }
  globalThis.fetch=async()=>Response.json({error:"paused"},{status:404});
  assert.equal((await proxy(new NextRequest("https://triumphantech.com/business/d0e0f0a0-2026-4020-8020-202610200001/widget"))).headers.get("content-security-policy"),"frame-ancestors 'none'");
  assert.equal((await proxy(new NextRequest("https://triumphantech.com/platform"))).headers.get("content-security-policy"),"frame-ancestors 'none'");
  globalThis.fetch=async()=>Response.json({data:{origin:"https://customer.test;unsafe"}});
  assert.equal((await proxy(new NextRequest("https://triumphantech.com/business/d0e0f0a0-2026-4020-8020-202610200001/widget"))).headers.get("content-security-policy"),"frame-ancestors 'none'");
 }finally{
  globalThis.fetch=saved.fetch;
  if(saved.base===undefined)delete process.env.AUTOMATION_API_BASE;else process.env.AUTOMATION_API_BASE=saved.base;
  if(saved.key===undefined)delete process.env.AUTOMATION_HMAC_SECRET;else process.env.AUTOMATION_HMAC_SECRET=saved.key;
 }
});
