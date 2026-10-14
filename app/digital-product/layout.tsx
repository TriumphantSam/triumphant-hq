import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import "./spacing.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Digital Product Launch Bundle | Triumphant HQ",
  description:
    "WhatsApp scripts, follow-up messages, objection replies and daily sales posts for launching a digital product.",
  path: "/digital-product",
  ogImage: "/images/digital-product/bundle-hero.png",
  ogImageWidth: 682,
  ogImageHeight: 1024,
});

export default function DigitalProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
