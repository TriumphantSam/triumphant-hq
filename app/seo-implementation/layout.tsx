import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "SEO snapshot results | Triumphant HQ",
  description: "Private SEO snapshot results for a site just checked. This page is not part of the public index.",
  path: "/seo-implementation",
  noIndex: true,
});

export default function SeoImplementationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
