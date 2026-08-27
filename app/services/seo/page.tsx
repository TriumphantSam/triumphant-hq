import type { Metadata } from "next";
import ServiceLanding from "@/components/marketing/ServiceLanding";
import { getAgencyService } from "@/lib/services";
import { buildPageMetadata } from "@/lib/seo";

const service = getAgencyService("seo")!;

export const metadata: Metadata = buildPageMetadata({
  title: "SEO Agency in Ibadan | Search Visibility · Triumphant HQ",
  description:
    "SEO agency in Ibadan for technical health, local pages and content that match how Oyo State customers search. Start with a free snapshot—no ranking guarantees.",
  path: "/services/seo",
  keywords: [
    "SEO agency Ibadan",
    "SEO company Oyo State",
    "local SEO Ibadan",
    "search visibility Ibadan",
  ],
});

export default function SeoServicePage() {
  return (
    <ServiceLanding
      service={service}
      h1="SEO agency in Ibadan for businesses that need to be found"
      intro="Triumphant HQ is an SEO agency based in Ibadan. We fix crawl and technical blockers, structure service and location pages for how people actually search, and build content that can earn visibility on Google—without fake ranking promises."
      localLinks={[
        { href: "/services/seo/ibadan", label: "SEO in Ibadan" },
        { href: "/seo-snapshot", label: "Free SEO snapshot" },
        { href: "/locations/ibadan", label: "Ibadan service area" },
        { href: "/ibadan-tech-agency", label: "Tech company in Ibadan" },
      ]}
    />
  );
}
