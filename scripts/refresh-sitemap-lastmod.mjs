/**
 * Writes lib/sitemap-lastmod.json from git commit dates of each page's content file.
 * A missing git history leaves the existing JSON in place so the build can continue.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outFile = path.join(root, "lib", "sitemap-lastmod.json");

function gitDate(file) {
  if (!file || !fs.existsSync(path.join(root, file))) return null;
  try {
    const out = execSync(`git log -1 --format=%cs -- ${JSON.stringify(file)}`, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null;
  } catch {
    return null;
  }
}

function maxDate(values) {
  const days = values.filter((value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value));
  days.sort();
  return days.at(-1) ?? null;
}

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function slugsIn(file, exportName) {
  const source = read(file);
  const start = source.indexOf(`export const ${exportName}`);
  if (start < 0) return [];
  const slice = source.slice(start);
  const nextExport = slice.indexOf("\nexport ", 10);
  const block = nextExport > 0 ? slice.slice(0, nextExport) : slice;
  return [...block.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
}

const staticRoutes = {
  "/": ["app/page.tsx"],
  "/services": ["app/services/page.tsx"],
  "/services/websites": ["app/services/websites/page.tsx"],
  "/services/app-development": ["app/services/app-development/page.tsx"],
  "/services/seo": ["app/services/seo/page.tsx"],
  "/services/automation": ["app/services/automation/page.tsx"],
  "/about": ["app/about/page.tsx"],
  "/work": ["app/work/page.tsx"],
  "/portfolio": ["app/portfolio/page.tsx"],
  "/nin-bvn-desk": ["app/nin-bvn-desk/page.tsx"],
  "/shop": ["app/shop/page.tsx"],
  "/contact": ["app/contact/page.tsx"],
  "/ongoing-support": ["app/ongoing-support/page.tsx"],
  "/website-scorecard": ["app/website-scorecard/page.tsx"],
  "/automation-checklist": ["app/automation-checklist/page.tsx"],
  "/app-readiness": ["app/app-readiness/page.tsx"],
  "/seo-snapshot": ["app/seo-snapshot/page.tsx"],
  "/resources": ["app/resources/page.tsx"],
  "/local-support": ["app/local-support/page.tsx", "components/marketing/LocalSupportExperience.tsx"],
  "/ibadan-tech-agency": ["app/ibadan-tech-agency/page.tsx"],
  "/services/websites/ibadan": ["app/services/[service]/[location]/page.tsx", "lib/seo.ts"],
  "/services/seo/ibadan": ["app/services/seo/ibadan/page.tsx"],
  "/locations": ["app/locations/page.tsx", "lib/seo.ts"],
  "/industries": ["app/industries/page.tsx", "lib/compare-industries.ts"],
  "/compare": ["app/compare/page.tsx", "lib/compare-industries.ts"],
  "/digital-forge": ["app/digital-forge/page.tsx"],
  "/digital-forge/products": ["app/digital-forge/products/page.tsx"],
  "/digital-forge/resources": ["app/digital-forge/resources/page.tsx"],
  "/digital-forge/training": ["app/digital-forge/training/page.tsx"],
  "/digital-forge/system": ["app/digital-forge/system/page.tsx"],
  "/digital-forge/course": ["app/digital-forge/course/page.tsx"],
  "/digital-forge/course/access": ["app/digital-forge/course/access/page.tsx"],
  "/digital-forge/course/waitlist": ["app/digital-forge/course/waitlist/page.tsx"],
  "/digital-forge/review": ["app/digital-forge/review/page.tsx"],
  "/digital-product": ["app/digital-product/page.tsx"],
  "/blog": ["app/blog/page.tsx"],
  "/privacy-policy": ["app/privacy-policy/page.tsx"],
  "/data-deletion": ["app/data-deletion/page.tsx"],
  "/terms": ["app/terms/page.tsx"],
  "/refund-policy": ["app/refund-policy/page.tsx"],
};

const dates = {};

for (const [route, files] of Object.entries(staticRoutes)) {
  const day = maxDate(files.map(gitDate));
  if (day) dates[route] = day;
}

for (const slug of slugsIn("lib/seo.ts", "locationPages")) {
  const day = maxDate([gitDate("app/locations/[slug]/page.tsx"), gitDate("lib/seo.ts")]);
  if (day) dates[`/locations/${slug}`] = day;
}

for (const slug of slugsIn("lib/compare-industries.ts", "industries")) {
  const day = maxDate([gitDate("app/industries/[slug]/page.tsx"), gitDate("lib/compare-industries.ts")]);
  if (day) dates[`/industries/${slug}`] = day;
}

for (const slug of slugsIn("lib/compare-industries.ts", "comparisons")) {
  const day = maxDate([gitDate("app/compare/[slug]/page.tsx"), gitDate("lib/compare-industries.ts")]);
  if (day) dates[`/compare/${slug}`] = day;
}

const caseStudySource = read("lib/case-studies.ts");
for (const match of caseStudySource.matchAll(/slug:\s*"([^"]+)"[\s\S]*?updated:\s*"(\d{4}-\d{2}-\d{2})"/g)) {
  dates[`/work/${match[1]}`] = match[2];
}

const blogDir = path.join(root, "content", "blog");
if (fs.existsSync(blogDir)) {
  for (const file of fs.readdirSync(blogDir).filter((name) => name.endsWith(".md"))) {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(blogDir, file), "utf8").slice(0, 1200);
    const updated = raw.match(/^updated:\s*"?(\d{4}-\d{2}-\d{2})/m)?.[1] ?? null;
    const day = maxDate([gitDate(`content/blog/${file}`), updated]);
    if (day) dates[`/blog/${slug}`] = day;
  }
}

const productDir = path.join(root, "content", "digital-forge", "generated");
if (fs.existsSync(productDir)) {
  for (const file of fs.readdirSync(productDir).filter((name) => name.endsWith(".json"))) {
    try {
      const product = JSON.parse(fs.readFileSync(path.join(productDir, file), "utf8"));
      if (!product?.slug) continue;
      const day = gitDate(`content/digital-forge/generated/${file}`);
      if (day) dates[`/digital-forge/products/${product.slug}`] = day;
    } catch {
      continue;
    }
  }
}

if (Object.keys(dates).length === 0) {
  console.warn("sitemap lastmod: no git dates found; leaving existing JSON");
  process.exit(0);
}

const ordered = Object.fromEntries(Object.entries(dates).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(outFile, `${JSON.stringify(ordered, null, 2)}\n`);
console.log(`sitemap lastmod: wrote ${Object.keys(ordered).length} paths`);
