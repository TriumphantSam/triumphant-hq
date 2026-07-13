import type { Metadata } from "next";
import ServiceLanding from "@/components/marketing/ServiceLanding";
import { getAgencyService } from "@/lib/services";

export const metadata: Metadata = {
  title: "Professional Website Design and Development | Triumphant HQ",
  description: "Custom, fast and conversion-focused business websites designed and developed by Triumphant HQ.",
};

export default function WebsitesPage() {
  return <ServiceLanding service={getAgencyService("websites")!} />;
}
