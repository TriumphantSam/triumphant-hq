import type { Metadata } from "next";
import ServiceLanding from "@/components/marketing/ServiceLanding";
import { getAgencyService } from "@/lib/services";
import { buildPageMetadata } from "@/lib/seo";

const service = getAgencyService("automation")!;

export const metadata: Metadata = buildPageMetadata({
  title: "AI & Workflow Automation in Ibadan | Triumphant HQ",
  description:
    "Practical business automation, integrations and AI-assisted workflows from Triumphant HQ in Ibadan—for lean teams across Nigeria.",
  path: "/services/automation",
  keywords: [
    "business automation Ibadan",
    "AI automation Nigeria",
    "workflow automation Oyo State",
    "process automation Ibadan",
  ],
});

export default function AutomationPage() {
  return <ServiceLanding service={service} />;
}
