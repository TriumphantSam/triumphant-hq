import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { parse } from "dotenv";

const migrationEnv = fs.existsSync(".env.cloudflare")
  ? parse(fs.readFileSync(".env.cloudflare")) : {};
const build = spawnSync(process.execPath, ["node_modules/@opennextjs/cloudflare/dist/cli/index.js", "build"], {
  stdio: "inherit", env: { ...process.env, ...migrationEnv },
});
if (build.status !== 0) process.exit(build.status ?? 1);
await import("./cloudflare-runtime-env.mjs");
