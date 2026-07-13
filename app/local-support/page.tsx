import type { Metadata } from "next";
import SectionHeader from "@/components/marketing/SectionHeader";
import { whatsappNumber } from "@/lib/services";

export const metadata: Metadata = {
  title: "Local Technology Support | Triumphant HQ",
  description: "Reliable local support for NIN services, school registrations, documents and online applications.",
};

const localServices = [
  {
    title: "NIN and NIMC Support",
    description: "Guidance for enrolment, modifications, slip printing and resolving common registration issues.",
    items: ["New enrolment guidance", "Record modification support", "Slip printing", "Portal troubleshooting"],
  },
  {
    title: "School and Examination Portals",
    description: "Careful assistance with JAMB, WAEC, NECO and other education-related online services.",
    items: ["Profile and portal setup", "Registration support", "Result checking", "Application troubleshooting"],
  },
  {
    title: "Documents and Online Applications",
    description: "Practical support for everyday digital tasks when accuracy and speed matter.",
    items: ["Typing and formatting", "Printing and scanning", "Online forms", "Email and account assistance"],
  },
];

export default function LocalSupportPage() {
  return (
    <div>
      <header className="page-hero">
        <p className="eyebrow">Local support</p>
        <h1>Reliable help with essential digital services.</h1>
        <p>
          Triumphant HQ began by helping people navigate everyday technology. That local commitment continues through a
          dedicated support service, separate from our global agency work.
        </p>
      </header>

      <section className="section-muted">
        <div className="section-shell">
          <SectionHeader
            eyebrow="Available support"
            title="Clear guidance, careful execution"
            description="Contact us before visiting so we can confirm requirements, availability and any documents you should bring."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {localServices.map((service) => (
              <article className="agency-card" key={service.title}>
                <h2 className="text-xl font-bold text-slate-950">{service.title}</h2>
                <p className="card-copy">{service.description}</p>
                <ul className="check-list">
                  {service.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="cta-band">
          <div>
            <p className="eyebrow">Check availability</p>
            <h2>Tell us the service you need.</h2>
            <p>Send a short WhatsApp message and our team will explain the next step.</p>
          </div>
          <a className="button button-primary" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
            Message on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
