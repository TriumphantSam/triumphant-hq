import type { Metadata } from "next";
import ServiceLanding from "@/components/marketing/ServiceLanding";
import { getAgencyService } from "@/lib/services";
import { buildPageMetadata } from "@/lib/seo";

const service = getAgencyService("websites")!;

export const metadata: Metadata = buildPageMetadata({
  title: "Website Design in Ibadan | Web Design Company · Triumphant HQ",
  description:
    "Website design in Ibadan from Triumphant HQ—conversion-focused sites for Oyo State businesses. Next.js builds, clear structure, and a partner based on Basorun Rd.",
  path: "/services/websites",
  keywords: [
    "website design Ibadan",
    "web design company Ibadan",
    "website design company Oyo",
    "business website Ibadan",
  ],
});

export default function WebsitesPage() {
  return (
    <ServiceLanding
      service={service}
      h1="Website design in Ibadan for businesses that need to look as serious as their work"
      intro="Triumphant HQ designs and builds fast, conversion-focused websites for Ibadan and Oyo State organisations—professional firms, clinics, schools, SaaS teams and local operators who are done with templates that do not convert."
      localLinks={[
        { href: "/services/websites/ibadan", label: "Ibadan website design" },
        { href: "/locations/ibadan", label: "Ibadan service area" },
        { href: "/ibadan-tech-agency", label: "Technology agency in Ibadan" },
        { href: "/work", label: "Selected work" },
      ]}
    />
  );
}
