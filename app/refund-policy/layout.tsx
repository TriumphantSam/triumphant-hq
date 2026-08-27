import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Refund Policy | Triumphant HQ",
  description:
    "Refund Policy for digital products sold by Triumphant HQ (Triumphant Technological Services).",
  path: "/refund-policy",
});

export default function RefundPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
