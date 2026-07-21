import type { Metadata } from "next";
import LocalSupportExperience from "@/components/marketing/LocalSupportExperience";
import FaqSection from "@/components/marketing/FaqSection";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { localSupportFaqs } from "@/lib/faqs";
import { buildPageMetadata, serviceJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "NIN & BVN Support in Ibadan | Local Digital Desk",
  description:
    "Certified NIN enrolment and BVN support in Ibadan—serving Akobo, Bashorun, Bodija and Oyo State. WhatsApp-first local digital help from Triumphant HQ.",
  path: "/local-support",
  keywords: [
    "NIN enrolment Ibadan",
    "BVN support Ibadan",
    "NIN Akobo",
    "NIN Bashorun",
    "NIMC support Oyo State",
    "local digital services Ibadan",
  ],
});

export default function LocalSupportPage() {
  return (
    <div>
      <JsonLd
        data={serviceJsonLd({
          name: "Local NIN and BVN Support",
          description:
            "Certified NIN enrolment, modifications and BVN support in Ibadan, Oyo State, plus school portal and document assistance.",
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
