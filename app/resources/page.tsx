import type { Metadata } from "next";
import Link from "next/link";
import CTABand from "@/components/marketing/CTABand";
import SectionHeader from "@/components/marketing/SectionHeader";

export const metadata: Metadata = {
  title: "Resources | Digital Forge, Training and Insights",
  description: "Explore Triumphant HQ guides, training, digital products and practical systems for building with technology and AI.",
};

const resources = [
  {
    eyebrow: "Practical lab",
    title: "Digital Forge",
    description: "A structured path for turning useful knowledge and AI-assisted workflows into focused digital products.",
    href: "/digital-forge",
    cta: "Enter Digital Forge",
  },
  {
    eyebrow: "Ready-to-use systems",
    title: "Product Library",
    description: "Implementation guides, prompt packs, templates and operating systems designed to help you execute faster.",
    href: "/digital-forge/products",
    cta: "Browse products",
  },
  {
    eyebrow: "Learn at your pace",
    title: "Free Training",
    description: "Start with focused lessons that explain the opportunity, the process and the mistakes worth avoiding.",
    href: "/digital-forge/training",
    cta: "Watch training",
  },
  {
    eyebrow: "Agency insights",
    title: "Guides and Articles",
    description: "Practical thinking on websites, SEO, automation, AI products and the systems behind sustainable digital growth.",
    href: "/blog",
    cta: "Read insights",
  },
];

export default function ResourcesPage() {
  return (
    <div>
      <header className="page-hero">
        <p className="eyebrow">Resources by Triumphant HQ</p>
        <h1>Practical knowledge and systems for people ready to build.</h1>
        <p>
          Our client services solve complex business challenges. These resources give founders, creators and operators a
          practical place to learn, test ideas and move independently.
        </p>
      </header>

      <section className="section-muted">
        <div className="section-shell">
          <SectionHeader
            eyebrow="Explore the library"
            title="Choose the resource that matches your next move"
            description="Digital Forge remains a focused learning and product ecosystem, intentionally separate from our done-for-you agency services."
          />
          <div className="agency-grid">
            {resources.map((resource) => (
              <article className="agency-card" key={resource.title}>
                <p className="card-eyebrow">{resource.eyebrow}</p>
                <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-slate-950">{resource.title}</h2>
                <p className="card-copy">{resource.description}</p>
                <Link className="text-link" href={resource.href}>
                  {resource.cta} <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        eyebrow="Need it done for you?"
        title="Move from learning to a professionally delivered solution."
        description="If the challenge is business-critical, our agency can design, build and implement the system with you."
      />
    </div>
  );
}
