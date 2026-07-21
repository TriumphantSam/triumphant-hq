import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "SEO Snapshot received | Triumphant HQ",
  description: "Your SEO snapshot request was received. Check your inbox for the summary.",
  path: "/seo-snapshot/thank-you",
  noIndex: true,
});

export default function SeoSnapshotThankYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
