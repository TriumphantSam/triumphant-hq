import type { Metadata } from "next";
import LocalSupportExperience from "@/components/marketing/LocalSupportExperience";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "NIN & BVN Help Desk in Ibadan | Verification, IPE & Recovery · Triumphant HQ",
  description:
    "Get NIN enrolment, verification, lost NIN recovery, IPE clearance, validation, suspended NIN fix, and BVN card/retrieval support from Triumphant HQ's local desk in Ibadan. Contact us on WhatsApp.",
  path: "/nin-bvn-desk",
  keywords: [
    "NIN verification Ibadan",
    "recover lost NIN",
    "BVN verification and card",
    "NIMC IPE clearance",
    "NIN record not found",
    "NIN validation",
    "suspended NIN fix",
    "BVN retrieval",
    "NIN enrolment Ibadan",
    "BVN desk Ibadan",
  ],
});

export default function NinBvnDeskPage() {
  return <LocalSupportExperience />;
}
