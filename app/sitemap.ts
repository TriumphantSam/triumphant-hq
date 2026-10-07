import { MetadataRoute } from "next";
import { getForgeProducts } from "@/lib/digital-forge";
import { caseStudies } from "@/lib/case-studies";
import { getBlogSitemapEntries } from "@/lib/blog";
import { locationPages, SITE_URL } from "@/lib/seo";

/**
 * Stable lastmod values. `new Date()` made every entry look freshly edited on each request.
 * Pages revised in the October 2026 SEO pass use that date. Untouched pages use the
 * 11 August 2026 entity revision recorded in public/llms-full.txt.
 */
const SEO_PASS = "2026-10-06";
const PRIOR_REVISION = "2026-08-11";

const revised = new Set([
  "/",
  "/services",
  "/services/seo",
  "/services/seo/ibadan",
  "/services/websites",
  "/about",
  "/work",
  "/contact",
  "/website-scorecard",
  "/automation-checklist",
  "/app-readiness",
  "/resources",
  "/ibadan-tech-agency",
  "/locations",
  "/locations/nigeria",
  "/locations/ibadan",
  "/locations/akobo",
  "/locations/bashorun",
  "/locations/bodija",
  "/locations/challenge",
  "/locations/ojoo",
  "/locations/oyo",
  "/locations/osogbo",
  "/locations/ife",
  "/blog",
  "/digital-forge",
  "/digital-forge/products",
  "/digital-forge/resources",
  "/digital-forge/training",
  "/digital-forge/system",
  "/digital-forge/course",
  "/digital-forge/course/access",
  "/digital-forge/course/waitlist",
  "/digital-forge/review",
  "/digital-product",
]);

function entry(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  lastModified?: string,
): MetadataRoute.Sitemap[number] {
  return {
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified: lastModified ?? (revised.has(path) ? SEO_PASS : PRIOR_REVISION),
    changeFrequency,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const forgeProducts = await getForgeProducts();
  const blogPosts = getBlogSitemapEntries();

  const staticRoutes: MetadataRoute.Sitemap = [
    entry("/", 1, "weekly"),
    entry("/services", 0.9, "monthly"),
    entry("/services/websites", 0.85, "monthly"),
    entry("/services/app-development", 0.85, "monthly"),
    entry("/services/seo", 0.95, "monthly"),
    entry("/services/automation", 0.85, "monthly"),
    entry("/about", 0.7, "yearly"),
    entry("/work", 0.85, "monthly"),
    entry("/portfolio", 0.85, "monthly", "2026-10-07"),
    ...caseStudies.map((study) =>
      entry(`/work/${study.slug}`, 0.8, "monthly", study.updated),
    ),
    entry("/contact", 0.8, "yearly"),
    entry("/ongoing-support", 0.75, "monthly"),
    entry("/website-scorecard", 0.7, "monthly"),
    entry("/automation-checklist", 0.7, "monthly"),
    entry("/app-readiness", 0.7, "monthly"),
    entry("/seo-snapshot", 0.8, "monthly"),
    entry("/resources", 0.6, "weekly"),
    entry("/local-support", 0.85, "monthly"),
    entry("/ibadan-tech-agency", 0.9, "weekly"),
    entry("/services/websites/ibadan", 0.88, "monthly"),
    entry("/services/seo/ibadan", 0.95, "monthly"),
    entry("/locations", 0.85, "monthly"),
    ...locationPages.map((location) =>
      entry(
        `/locations/${location.slug}`,
        location.slug === "ibadan" || location.slug === "nigeria" ? 0.88 : 0.8,
        "monthly",
      ),
    ),
    entry("/industries", 0.75, "monthly"),
    entry("/industries/professional-firms", 0.7, "monthly"),
    entry("/industries/saas", 0.7, "monthly"),
    entry("/industries/local-service-businesses", 0.7, "monthly"),
    entry("/compare", 0.7, "monthly"),
    entry("/compare/agency-vs-freelancer", 0.65, "monthly"),
    entry("/compare/in-house-vs-partner", 0.65, "monthly"),
    entry("/digital-forge", 0.45, "weekly"),
    entry("/digital-forge/products", 0.45, "weekly"),
    entry("/digital-forge/resources", 0.4, "weekly"),
    entry("/digital-forge/training", 0.4, "weekly"),
    entry("/digital-forge/system", 0.4, "weekly"),
    entry("/digital-forge/course", 0.4, "weekly"),
    entry("/digital-forge/course/access", 0.4, "weekly"),
    entry("/digital-forge/course/waitlist", 0.4, "weekly"),
    entry("/digital-product", 0.5, "weekly"),
    entry("/blog", 0.8, "weekly"),
    entry("/privacy-policy", 0.3, "yearly"),
    entry("/data-deletion", 0.3, "yearly"),
    entry("/terms", 0.3, "yearly"),
    entry("/refund-policy", 0.3, "yearly"),
  ];

  const productRoutes: MetadataRoute.Sitemap = forgeProducts.map((product) =>
    entry(`/digital-forge/products/${product.slug}`, 0.4, "weekly", PRIOR_REVISION),
  );

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) =>
    entry(`/blog/${post.slug}`, 0.72, "monthly", post.updated || post.date || PRIOR_REVISION),
  );

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
