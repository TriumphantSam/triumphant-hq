import test from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {adminConfigured,validAdminPassword,adminSession,validAdminSession} from "./admin-lab-auth";
test("owner access fails closed and cookies are scoped, expiring and tamper resistant",()=>{
  const originalHash=process.env.ADMIN_LAB_PASSWORD_HASH,originalSecret=process.env.AUTOMATION_HMAC_SECRET;
  try{
    delete process.env.ADMIN_LAB_PASSWORD_HASH;
    assert.equal(adminConfigured(),false);assert.equal(validAdminPassword("admin"),false);assert.equal(validAdminSession("anything"),false);
    process.env.ADMIN_LAB_PASSWORD_HASH=createHash("sha256").update("unit-test-owner").digest("hex");
    process.env.AUTOMATION_HMAC_SECRET="local-unit-test-only";
    assert.equal(validAdminPassword("unit-test-owner"),true);assert.equal(validAdminPassword("wrong"),false);
    const session=adminSession();assert.equal(validAdminSession(session),true);
    const [expires,nonce,signature]=session.split(".");
    assert.equal(validAdminSession("0."+nonce+"."+signature),false);
    assert.equal(validAdminSession(expires+"."+nonce+"."+"0".repeat(64)),false);
    process.env.AUTOMATION_HMAC_SECRET="another-unit-test-secret";
    assert.equal(validAdminSession(session),false);
  }finally{
    if(originalHash===undefined)delete process.env.ADMIN_LAB_PASSWORD_HASH;else process.env.ADMIN_LAB_PASSWORD_HASH=originalHash;
    if(originalSecret===undefined)delete process.env.AUTOMATION_HMAC_SECRET;else process.env.AUTOMATION_HMAC_SECRET=originalSecret;
  }
});
