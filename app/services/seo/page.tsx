import type { Metadata } from "next";
import ServiceLanding from "@/components/marketing/ServiceLanding";
import { getAgencyService } from "@/lib/services";

export const metadata: Metadata = {
  title: "SEO Growth and AI Search Visibility | Triumphant HQ",
  description: "Technical SEO, content optimization and AI-search readiness implemented by an experienced growth partner.",
};

export default function SeoServicePage() {
  return <ServiceLanding service={getAgencyService("seo")!} />;
}
