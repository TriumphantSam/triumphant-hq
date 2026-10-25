import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { parse } from "dotenv";

const migrationEnv = fs.existsSync(".env.cloudflare")
  ? parse(fs.readFileSync(".env.cloudflare")) : {};
const productionConfig = fs.existsSync(".cloudflare-production-config.json")
  ? JSON.parse(fs.readFileSync(".cloudflare-production-config.json", "utf8")) : {};
for (const value of Object.values(productionConfig)) {
  if (typeof value !== "string" || value.includes("...[truncated]"))
    throw new Error("Production config contains an incomplete value");
}
const build = spawnSync(process.execPath, ["node_modules/@opennextjs/cloudflare/dist/cli/index.js", "build"], {
  stdio: "inherit", env: { ...process.env, ...productionConfig, ...migrationEnv },
});
if (build.status !== 0) process.exit(build.status ?? 1);
await import("./cloudflare-runtime-env.mjs");
