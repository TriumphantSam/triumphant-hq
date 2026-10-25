// Prepare ignored runtime files without printing credential values. Local
// settings are only a migration preview baseline; compare Vercel before cutover.
import fs from "node:fs";
import path from "node:path";
import { parse } from "dotenv";

const variables = {};
for (const file of [".env", ".env.local", ".env.production.local"]) {
  if (fs.existsSync(file)) Object.assign(variables, parse(fs.readFileSync(file)));
}
const used = new Set();
for (const directory of ["app", "lib", "components"]) {
  for (const file of fs.readdirSync(directory, { recursive: true })) {
    if (!/\.(?:ts|tsx)$/.test(file) || /\.test\./.test(file)) continue;
    const text = fs.readFileSync(path.join(directory, file), "utf8");
    for (const match of text.matchAll(/process\.env\.([A-Z][A-Z0-9_]*)/g)) used.add(match[1]);
  }
}
for (const match of fs.readFileSync("proxy.ts", "utf8").matchAll(/process\.env\.([A-Z][A-Z0-9_]*)/g)) used.add(match[1]);
const excluded = new Set(["VERCEL", "VERCEL_OIDC_TOKEN", "NODE_ENV", "HOSTING_PLATFORM"]);
const runtime = Object.fromEntries(Object.entries(variables).filter(([key, value]) => used.has(key) && value && !excluded.has(key)));
runtime.NEXT_PUBLIC_SITE_URL = "https://triumphantech.com";
runtime.SITE_URL = "https://triumphantech.com";
fs.mkdirSync("tmp", { recursive: true });
fs.writeFileSync("tmp/cloudflare-secrets.json", JSON.stringify(runtime));
fs.writeFileSync(".dev.vars", Object.entries(runtime).map(([key,value]) => `${key}=${JSON.stringify(value)}`).join("\n") + "\n");
console.log(`Prepared ${Object.keys(runtime).length} runtime settings in ignored local files. No credential values printed.`);
console.log("Production-only settings must be compared with Vercel before domain cutover.");
