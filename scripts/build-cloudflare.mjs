import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { parse } from "dotenv";

// CI receives public build settings only. Private runtime credentials remain
// on Cloudflare and must never be copied into generated deployment artifacts.
const publicBuildConfig = process.env.SITE_PUBLIC_CONFIG
  ? JSON.parse(process.env.SITE_PUBLIC_CONFIG) : {};
if (!publicBuildConfig || Array.isArray(publicBuildConfig) || typeof publicBuildConfig !== "object")
  throw new Error("Invalid public build configuration");
for (const [key, value] of Object.entries(publicBuildConfig))
  if (!/^NEXT_PUBLIC_[A-Z0-9_]+$/.test(key) || typeof value !== "string")
    throw new Error("Only public strings are allowed in build configuration");

const migrationEnv = fs.existsSync(".env.cloudflare")
  ? parse(fs.readFileSync(".env.cloudflare")) : {};
const productionConfig = fs.existsSync(".cloudflare-production-config.json")
  ? JSON.parse(fs.readFileSync(".cloudflare-production-config.json", "utf8")) : {};
for (const value of Object.values(productionConfig)) {
  if (typeof value !== "string" || value.includes("...[truncated]"))
    throw new Error("Production config contains an incomplete value");
}
const build = spawnSync(process.execPath, ["node_modules/@opennextjs/cloudflare/dist/cli/index.js", "build"], {
  stdio: "inherit", env: { ...process.env, ...publicBuildConfig, ...productionConfig, ...migrationEnv },
});
if (build.status !== 0) process.exit(build.status ?? 1);
await import("./cloudflare-runtime-env.mjs");
