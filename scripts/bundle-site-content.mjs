// Workers cannot read the repository filesystem. Bundle source content at build
// time; keep this server-only snapshot out of public/ and refresh every build.
import fs from "node:fs";
import path from "node:path";

const readDirectory = (directory, extension, parse) => Object.fromEntries(
  fs.readdirSync(directory).filter(name => name.endsWith(extension)).sort().map(name => [
    name.slice(0, -extension.length), parse(fs.readFileSync(path.join(directory, name), "utf8")),
  ]),
);
const snapshot = {
  blog: readDirectory("content/blog", ".md", raw => raw),
  products: readDirectory("content/digital-forge/generated", ".json", JSON.parse),
  funnels: readDirectory("content/digital-forge/funnels", ".json", JSON.parse),
};
fs.writeFileSync("content/site-content.generated.json", JSON.stringify(snapshot) + "\n");
console.log(`Bundled ${Object.keys(snapshot.blog).length} posts, ${Object.keys(snapshot.products).length} products and ${Object.keys(snapshot.funnels).length} funnels`);
