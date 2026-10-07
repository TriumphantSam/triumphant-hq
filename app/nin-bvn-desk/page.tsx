import type { Metadata } from "next";
import LocalSupportExperience from "@/components/marketing/LocalSupportExperience";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "NIN & BVN Help Desk in Ibadan | Triumphant HQ",
  description: "Get NIN enrolment and BVN support from Triumphant HQ's local desk in Ibadan. See the services, requirements and how to contact the team on WhatsApp.",
  path: "/nin-bvn-desk",
});

export default function NinBvnDeskPage() {
  return <LocalSupportExperience />;
}
