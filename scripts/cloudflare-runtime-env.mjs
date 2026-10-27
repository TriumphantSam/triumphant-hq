// OpenNext copies all local env files into this server module by default.
// Runtime credentials belong in Wrangler secrets, never the deployment bundle.
import fs from "node:fs";
const target = ".open-next/cloudflare/next-env.mjs";
if (!fs.existsSync(target)) throw new Error("Build OpenNext before preparing runtime environment");
fs.writeFileSync(target, "export const production = {};\nexport const development = {};\nexport const test = {};\n");
console.log("Cloudflare bundle uses runtime secrets; local env-file fallback removed.");
