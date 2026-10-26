// Next traces OpenTelemetry's CommonJS entry, while OpenNext's middleware
// bundler selects the ESM entry. Include that entry in the generated trace.
// This changes only generated build files, not either package's source.
import fs from "node:fs";
import path from "node:path";

const tracePath = ".next/server/middleware.js.nft.json";
const esmDirectory = "node_modules/@opentelemetry/api/build/esm";
if (fs.existsSync(tracePath) && fs.existsSync(esmDirectory)) {
  const trace = JSON.parse(fs.readFileSync(tracePath, "utf8"));
  const files = fs.readdirSync(esmDirectory, { recursive: true })
    .map(file => path.join(esmDirectory, file)).filter(file => fs.statSync(file).isFile());
  trace.files = [...new Set([...trace.files, ...files.map(file =>
    path.relative(path.dirname(tracePath), file).replaceAll("\\", "/"),
  )])];
  fs.writeFileSync(tracePath, JSON.stringify(trace));
  fs.cpSync(esmDirectory, path.join(".next/standalone", esmDirectory), { recursive: true });
  console.log("Included OpenTelemetry ESM middleware dependencies");
}
