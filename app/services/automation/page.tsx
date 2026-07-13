import type { Metadata } from "next";
import ServiceLanding from "@/components/marketing/ServiceLanding";
import { getAgencyService } from "@/lib/services";

export const metadata: Metadata = {
  title: "AI and Workflow Automation Services | Triumphant HQ",
  description: "Practical business automation, software integrations and AI-assisted workflows for lean teams.",
};

export default function AutomationPage() {
  return <ServiceLanding service={getAgencyService("automation")!} />;
}
