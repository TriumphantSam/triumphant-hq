import { build } from "esbuild";
import { fileURLToPath } from "node:url";
const here = fileURLToPath(new URL(".", import.meta.url));
await build({
  entryPoints: [here + "main.ts"], outfile: here + "dist/server.mjs",
  platform: "node", target: "node22", format: "esm", bundle: true,
  sourcemap: false, minify: false,
});
console.log("Built isolated Node scanner; no environment files are bundled.");
