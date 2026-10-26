// Prepare ignored runtime files without printing credential values. Local
// Exported production config and local private overrides are ignored by Git.
import fs from "node:fs";
import path from "node:path";
import { parse } from "dotenv";

const variables = {};
for (const file of [".env", ".env.local", ".env.production.local"]) {
  if (fs.existsSync(file)) Object.assign(variables, parse(fs.readFileSync(file)));
}
if (fs.existsSync(".cloudflare-production-config.json")) {
  const config = JSON.parse(fs.readFileSync(".cloudflare-production-config.json", "utf8"));
  for (const value of Object.values(config)) {
    if (typeof value !== "string" || value.includes("...[truncated]"))
      throw new Error("Production config contains an incomplete value");
  }
  Object.assign(variables, config);
}
if (fs.existsSync(".env.cloudflare")) Object.assign(variables, parse(fs.readFileSync(".env.cloudflare")));
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
const publicConfig = Object.fromEntries(Object.entries(runtime).filter(([key]) => key.startsWith("NEXT_PUBLIC_")));
const bindings = Object.fromEntries(Object.entries(runtime).filter(([key]) => !key.startsWith("NEXT_PUBLIC_")));
bindings.SITE_PUBLIC_CONFIG = JSON.stringify(publicConfig);
fs.writeFileSync("tmp/cloudflare-secrets.json", JSON.stringify(bindings));
fs.writeFileSync("tmp/cloudflare-public-config.json", JSON.stringify({ SITE_PUBLIC_CONFIG: bindings.SITE_PUBLIC_CONFIG }));
// dotenv does not unescape embedded JSON quotes in double-quoted values.
const quote = value => {
  for (const mark of ["'", "`"])
    if (!value.includes(mark)) return mark + value + mark;
  throw new Error("An environment value needs manual dotenv quoting");
};
fs.writeFileSync(".dev.vars", Object.entries(bindings).map(([key,value]) => `${key}=${quote(value)}`).join("\n") + "\n");
console.log(`Prepared ${Object.keys(runtime).length} runtime settings in ${Object.keys(bindings).length} secret bindings. No credential values printed.`);
console.log("Production-only settings must be compared with Vercel before domain cutover.");
