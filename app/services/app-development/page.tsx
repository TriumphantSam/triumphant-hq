import type { Metadata } from "next";
import ServiceLanding from "@/components/marketing/ServiceLanding";
import { getAgencyService } from "@/lib/services";
import { buildPageMetadata } from "@/lib/seo";

const service = getAgencyService("app-development")!;

export const metadata: Metadata = buildPageMetadata({
  title: "Custom App Development in Ibadan | Triumphant HQ",
  description:
    "Custom web applications, portals and operational software designed in Ibadan for teams across Oyo State, Osun and Nigeria.",
  path: "/services/app-development",
  keywords: [
    "app development Ibadan",
    "custom software Oyo State",
    "web application Nigeria",
    "business software Ibadan",
  ],
});

export default function AppDevelopmentPage() {
  return <ServiceLanding service={service} />;
}
