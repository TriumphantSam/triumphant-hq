import {
  createHmac,
  createHash,
  timingSafeEqual,
  randomUUID,
} from "node:crypto";
export const ADMIN_COOKIE = "thq_lab_admin";
export function adminConfigured() {
  return (
    /^[a-f0-9]{64}$/.test(process.env.ADMIN_LAB_PASSWORD_HASH || "") &&
    Boolean(process.env.AUTOMATION_HMAC_SECRET)
  );
}
export function validAdminPassword(password: string) {
  if (!adminConfigured() || password.length > 200) return false;
  const actual = createHash("sha256").update(password).digest();
  return timingSafeEqual(
    actual,
    Buffer.from(process.env.ADMIN_LAB_PASSWORD_HASH!, "hex"),
  );
}
export function adminSession() {
  const body = String(Date.now() + 8 * 3600000) + "." + randomUUID();
  return (
    body +
    "." +
    createHmac("sha256", process.env.AUTOMATION_HMAC_SECRET!)
      .update("admin-lab:" + body)
      .digest("hex")
  );
}
export function validAdminSession(token?: string) {
  if (!adminConfigured() || !token) return false;
  const parts = token.split(".");
  if (
    parts.length !== 3 ||
    !/^\d{13}$/.test(parts[0]) ||
    Number(parts[0]) < Date.now() ||
    Number(parts[0]) > Date.now() + 8 * 3600000 ||
    !/^[a-f0-9-]{36}$/.test(parts[1]) ||
    !/^[a-f0-9]{64}$/.test(parts[2])
  )
    return false;
  const expected = createHmac("sha256", process.env.AUTOMATION_HMAC_SECRET!)
    .update("admin-lab:" + parts[0] + "." + parts[1])
    .digest();
  return timingSafeEqual(expected, Buffer.from(parts[2], "hex"));
}
