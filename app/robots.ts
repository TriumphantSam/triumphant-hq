import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/private/",
        "/cgi-bin/",
        "/contact/thank-you",
        "/seo-snapshot/thank-you",
        "/seo-snapshot/results",
        "/digital-forge/checkout",
        "/digital-forge/funnel/",
        "/digital-forge/builder",
        "/digital-forge/review",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
