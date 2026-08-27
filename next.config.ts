import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Host canonicalization (www + leftover triumphanthq.com → apex) lives in
  // vercel.json and proxy.ts so we can emit HTTP 301. Next.js `redirects()`
  // only offers 307/308 for host rules.
};

export default nextConfig;
