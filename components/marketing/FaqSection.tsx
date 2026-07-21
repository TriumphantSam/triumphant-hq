import type { FaqItem } from "@/lib/faqs";
import FaqAccordion from "./FaqAccordion";

export default function FaqSection({
  eyebrow = "FAQ",
  title = "Clear answers before you commit.",
  description,
  items,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: FaqItem[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="section-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="font-display mt-5 text-[clamp(1.85rem,3.2vw,2.6rem)] font-bold tracking-[-0.04em] text-slate-950">
            {title}
          </h2>
          {description ? <p className="mt-4 max-w-md text-[1.02rem] leading-8 text-slate-600">{description}</p> : null}
        </div>
        <FaqAccordion items={items} />
      </div>
    </section>
  );
}
