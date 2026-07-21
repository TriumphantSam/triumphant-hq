import type { BlogPost } from "@/lib/blog";

export type BlogCta = {
  eyebrow: string;
  title: string;
  description: string;
  primary: { href: string; label: string; external?: boolean };
  secondary: { href: string; label: string; external?: boolean };
};

const categoryServiceMap: Record<string, { href: string; label: string; title: string; description: string }> = {
  "AI & Automation": {
    href: "/services/automation",
    label: "Explore AI Automation",
    title: "Need this implemented for your business?",
    description:
      "If the ideas here matter operationally, we can map the workflow and build automation that your team can actually run.",
  },
  "Workflow Design": {
    href: "/services/automation",
    label: "Explore AI Automation",
    title: "Turn the blueprint into a working system.",
    description:
      "We help teams move from scattered tools to reliable workflows—with clear ownership and monitoring.",
  },
  "Digital Products": {
    href: "/services/websites",
    label: "Explore Website Design",
    title: "Building a product or offer that needs a sharper digital presence?",
    description:
      "When the product story must convert, we design and ship websites engineered for clarity and enquiries.",
  },
  "Sales & Funnels": {
    href: "/services/websites",
    label: "Explore Website Design",
    title: "Need a conversion path built professionally?",
    description:
      "We design and develop the pages and systems that turn attention into qualified conversations.",
  },
  "Market Intelligence": {
    href: "/services/seo",
    label: "Explore SEO Growth",
    title: "Want demand capture—not just insights?",
    description:
      "We turn market and search understanding into technical SEO, content structure and durable visibility.",
  },
  General: {
    href: "/services",
    label: "Explore agency services",
    title: "Prefer done-for-you execution?",
    description:
      "Triumphant HQ delivers websites, applications, SEO and automation as focused business engagements.",
  },
};

function inferServiceFromSlug(slug: string, title: string, excerpt: string) {
  const haystack = `${slug} ${title} ${excerpt}`.toLowerCase();
  if (haystack.includes("seo") || haystack.includes("search") || haystack.includes("answer engine") || haystack.includes("citation")) {
    return categoryServiceMap["Market Intelligence"];
  }
  if (haystack.includes("automat") || haystack.includes("workflow") || haystack.includes("agent") || haystack.includes("prompt")) {
    return categoryServiceMap["AI & Automation"];
  }
  if (haystack.includes("app") || haystack.includes("software") || haystack.includes("portal")) {
    return {
      href: "/services/app-development",
      label: "Explore Custom Applications",
      title: "Need custom software around this workflow?",
      description:
        "When spreadsheets and tools stop scaling, we design and build applications around your real operations.",
    };
  }
  return null;
}

export function resolveBlogCta(post: BlogPost): BlogCta {
  const inferred =
    (post.serviceHref
      ? {
          href: post.serviceHref,
          label: post.serviceCtaLabel || "Explore this service",
          title: post.serviceCtaTitle || "Need this done for your business?",
          description:
            post.serviceCtaDescription ||
            "If this article describes a live business problem, our agency can help you diagnose and deliver the next step.",
        }
      : null) ||
    inferServiceFromSlug(post.slug, post.title, post.excerpt) ||
    categoryServiceMap[post.category] ||
    categoryServiceMap.General;

  const hasProduct = Boolean(post.productHref);

  return {
    eyebrow: "Next step",
    title: inferred.title,
    description: inferred.description,
    primary: {
      href: inferred.href,
      label: inferred.label,
    },
    secondary: hasProduct
      ? {
          href: post.productHref as string,
          label: post.ctaLabel || "View the related product",
        }
      : {
          href: "/contact",
          label: "Send a project brief",
        },
  };
}
