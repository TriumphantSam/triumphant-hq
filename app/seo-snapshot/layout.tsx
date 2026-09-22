import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Free SEO Snapshot | Why Google may be ignoring your site",
  description:
    "Get a free SEO visibility snapshot from Triumphant HQ in Ibadan—technical blockers, crawl issues and a clear next step. No retainer required.",
  path: "/seo-snapshot",
  keywords: ["SEO snapshot Ibadan", "free SEO audit Nigeria", "website visibility check"],
});

export default function SeoSnapshotLayout({ children }: { children: React.ReactNode }) {
  return children;
}
