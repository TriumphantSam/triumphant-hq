import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";
import "./spacing.css";

export const metadata: Metadata = {
  title: "Digital Product Seller Launch Bundle",
  description:
    "Launch, follow up, and deliver your digital product with copy-paste WhatsApp scripts, TikTok-to-WhatsApp messages, price objection replies, and daily sales posts. ₦3,000 today. Returns to ₦10,000 after this window.",
  alternates: { canonical: `${SITE_URL}/digital-product` },
  openGraph: {
    title: "Digital Product Seller Launch Bundle — ₦3,000 today",
    description:
      "4 packs. Copy-paste scripts. Instant download. Launch price ₦3,000 before it returns to ₦10,000.",
    url: `${SITE_URL}/digital-product`,
    type: "website",
    images: [
      {
        url: "/images/digital-product/bundle-hero.png",
        width: 1200,
        height: 1200,
        alt: "Digital Product Seller Launch Bundle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Product Seller Launch Bundle — ₦3,000 today",
    description: "WhatsApp launch scripts, objection replies, TikTok-to-WhatsApp, and daily sales posts.",
    images: ["/images/digital-product/bundle-hero.png"],
  },
};

export default function DigitalProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
