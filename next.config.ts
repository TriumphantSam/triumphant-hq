import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Host canonicalization (www + leftover triumphanthq.com → apex) lives in
  // vercel.json and proxy.ts so we can emit HTTP 301. Next.js `redirects()`
  // only offers 307/308 for host rules.
  //
  // The sitemap route re-executes on Vercel because it fetches Digital Forge
  // products. Node file tracing does not follow process.cwd() + "content/blog",
  // so the markdown directory can be missing at runtime and getAllPosts()
  // returns []. Including the files here is a backstop; the sitemap also
  // imports content/blog-index.json, which is bundled with the function.
  outputFileTracingIncludes: {
    "/sitemap.xml": ["./content/blog/**/*.md", "./content/blog-index.json", "./content/digital-forge/**/*.json"],
  },
  async redirects() {
    return [
      { source: "/seo-ibadan", destination: "/services/seo/ibadan", permanent: true },
      { source: "/seo-nigeria", destination: "/services/seo", permanent: true },
    ];
  },
};

export default nextConfig;
