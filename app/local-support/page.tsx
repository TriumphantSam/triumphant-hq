import type { Metadata } from "next";
import LocalSupportExperience from "@/components/marketing/LocalSupportExperience";
import FaqSection from "@/components/marketing/FaqSection";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { localSupportFaqs } from "@/lib/faqs";
import { buildPageMetadata, serviceJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "NIN Enrolment, Verification & Recovery in Ibadan | BVN Support · Triumphant HQ",
  description:
    "NIN enrolment, verification, lost NIN recovery, IPE clearance, validation, suspended NIN fix, and BVN cards/retrieval in Ibadan at Triumphant HQ on Basorun Rd.",
  path: "/local-support",
  keywords: [
    "NIN enrolment Ibadan",
    "NIN verification",
    "recover lost NIN",
    "BVN verification and card",
    "IPE clearance NIMC",
    "NIN record not found fix",
    "NIN validation",
    "suspended NIN resolution",
    "BVN retrieval Ibadan",
    "BVN support Ibadan",
    "NIN Akobo",
    "NIN Bashorun",
    "NIMC support Oyo State",
  ],
});

export default function LocalSupportPage() {
  return (
    <div>
      <JsonLd
        data={serviceJsonLd({
          name: "Local NIN and BVN Support Desk",
          description:
            "Certified NIN enrolment, verification, lost NIN recovery, IPE clearance, validation, suspended NIN fix, and BVN card/retrieval support in Ibadan, Oyo State, plus school portal and document assistance.",
          path: "/local-support",
          serviceType: "Local digital identity support",
        })}
      />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Local Support", path: "/local-support" },
        ]}
      />
      <LocalSupportExperience />
      <div className="section-muted">
        <FaqSection
          title="Local support across Ibadan, Oyo and beyond."
          description="Where we are based, which neighbourhoods we serve and how WhatsApp-first support works."
          items={localSupportFaqs}
        />
      </div>
    </div>
  );
}
