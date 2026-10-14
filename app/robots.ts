import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const allow = ["/", "/llms.txt", "/llms-full.txt"];
const disallow = [
  "/private/",
  "/cgi-bin/",
  "/contact/thank-you",
  "/seo-snapshot/thank-you",
  "/seo-snapshot/results",
  "/digital-forge/checkout",
  "/digital-forge/funnel/",
  "/digital-forge/builder",
  "/digital-forge/review",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow,
        disallow,
      },
      {
        userAgent: ["GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "Bingbot"],
        allow,
        disallow,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
