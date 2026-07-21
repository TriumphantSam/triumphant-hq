import type { Metadata } from "next";
import ServiceLanding from "@/components/marketing/ServiceLanding";
import { getAgencyService } from "@/lib/services";
import { buildPageMetadata } from "@/lib/seo";

const service = getAgencyService("seo")!;

export const metadata: Metadata = buildPageMetadata({
  title: "SEO Agency in Ibadan & Nigeria | Triumphant HQ",
  description:
    "Technical SEO, content optimisation and AI-search readiness from an Ibadan-based growth partner serving Oyo State and Nigeria.",
  path: "/services/seo",
  keywords: [
    "SEO agency Ibadan",
    "SEO company Oyo State",
    "SEO Nigeria",
    "search visibility Ibadan",
  ],
});

export default function SeoServicePage() {
  return <ServiceLanding service={service} />;
}
