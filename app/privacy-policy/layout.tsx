import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy | Triumphant HQ",
  description:
    "Privacy Policy for Triumphant HQ (Triumphant Technological Services)—how we collect, use and protect information on triumphantech.com.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
