import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Service | Triumphant HQ",
  description:
    "Terms of Service for triumphantech.com and digital products from Triumphant HQ (Triumphant Technological Services).",
  path: "/terms",
});

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
