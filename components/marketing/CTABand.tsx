import Link from "next/link";
import { discoveryCallUrl } from "@/lib/services";

export default function CTABand({
  eyebrow = "Start a conversation",
  title = "Ready to turn the next business challenge into a working system?",
  description = "Tell us what is slowing growth, delivery or visibility. We will help you identify the clearest next move.",
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  return (
    <section className="section-shell">
      <div className="cta-band">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="button-row">
          <a className="button button-primary" href={discoveryCallUrl} target="_blank" rel="noreferrer">
            Book a discovery call
          </a>
          <Link className="button button-secondary" href="/contact">
            Send a project brief
          </Link>
        </div>
      </div>
    </section>
  );
}
