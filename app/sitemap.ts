import { MetadataRoute } from "next";
import { getForgeProducts } from "@/lib/digital-forge";
import { caseStudies } from "@/lib/case-studies";
import { getBlogSitemapEntries } from "@/lib/blog";
import { contentLastModified } from "@/lib/content-lastmod";
import { locationPages, SITE_URL } from "@/lib/seo";

/**
 * lastmod comes from lib/sitemap-lastmod.json (git date of the content file,
 * or the case study `updated` field when several studies share one file).
 * It is not the build time. Paths with no recorded edit omit lastmod.
 */
function entry(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  lastModified?: string,
): MetadataRoute.Sitemap[number] {
  const day = lastModified || contentLastModified(path);
  return {
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    ...(day ? { lastModified: day } : {}),
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
    entry('/automation-lab', 0.8, 'monthly', '2026-10-13'),
    entry('/automation-lab/lead-capture', 0.7, 'monthly', '2026-10-13'),
    entry("/about", 0.7, "yearly"),
    entry("/founder", 0.7, "yearly"),
    entry("/work", 0.85, "monthly"),
    entry("/portfolio", 0.85, "monthly"),
    entry("/nin-bvn-desk", 0.8, "monthly"),
    entry("/shop", 0.8, "monthly"),
    ...caseStudies.map((study) =>
      entry(`/work/${study.slug}`, 0.8, "monthly", contentLastModified(`/work/${study.slug}`) || study.updated),
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
    entry(
      `/digital-forge/products/${product.slug}`,
      0.4,
      "weekly",
      contentLastModified(`/digital-forge/products/${product.slug}`),
    ),
  );

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) =>
    entry(
      `/blog/${post.slug}`,
      0.72,
      "monthly",
      contentLastModified(`/blog/${post.slug}`) || post.updated || post.date,
    ),
  );

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
