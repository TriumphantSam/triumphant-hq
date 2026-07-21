import type { Metadata } from "next";
import ServiceLanding from "@/components/marketing/ServiceLanding";
import { getAgencyService } from "@/lib/services";
import { buildPageMetadata } from "@/lib/seo";

const service = getAgencyService("websites")!;

export const metadata: Metadata = buildPageMetadata({
  title: "Website Design & Development in Ibadan | Triumphant HQ",
  description:
    "Custom, fast and conversion-focused business websites from Triumphant HQ in Ibadan—serving Oyo State, Osun and organisations across Nigeria.",
  path: "/services/websites",
  keywords: [
    "website design Ibadan",
    "web development Oyo State",
    "Next.js website Nigeria",
    "business website Ibadan",
  ],
});

export default function WebsitesPage() {
  return <ServiceLanding service={service} />;
}
