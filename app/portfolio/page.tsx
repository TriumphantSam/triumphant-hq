import type { Metadata } from "next";
import Image from "next/image";
import JsonLd from "@/components/seo/JsonLd";
import TrackedLink from "@/components/portfolio/TrackedLink";
import { whatsappNumber } from "@/lib/services";
import { buildPageMetadata, SITE_URL, siteIdentity } from "@/lib/seo";

const title = "Portfolio | Triumphant Tech, Website & AI Automation Agency in Ibadan";
const description = "Explore five live websites by Triumphant Tech in Ibadan. See our work for healthcare, agriculture, education and communities, then chat about your project.";
const ogImage = `${SITE_URL}/og/portfolio.png`;

export const metadata: Metadata = {
  ...buildPageMetadata({ title, description, path: "/portfolio", ogImage }),
  openGraph: {
    title, description, url: `${SITE_URL}/portfolio`, siteName: siteIdentity.brandName,
    locale: "en_NG", type: "website",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Triumphant Tech portfolio featuring five live websites" }],
  },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

const projects = [
  {
    name: "Metropolitan Family Hospital", slug: "metropolitan-family-hospital", industry: "Healthcare · Akobo, Ibadan",
    url: "https://www.metropolitanfamilyhospital.com/",
    summary: "A hospital website that presents departments, care information and ways to request an appointment. Visitors can also explore the Black MD resource hub.",
    features: ["Medical departments", "Appointment request", "Black MD articles", "Contact information"],
  },
  {
    name: "IAPrecision", slug: "iaprecision", industry: "Agricultural technology",
    url: "https://iaprecision.com",
    summary: "An agricultural technology website presenting drone services and products. It gives prospective customers a clear path to explore use cases and request a demo.",
    features: ["Drone service pages", "Products", "Case studies", "Demo enquiry"],
  },
  {
    name: "Echitech", slug: "echitech", industry: "Engineering · safety · environment",
    url: "https://echitech.com",
    summary: "A services website for engineering, QHSSE and environmental work. Training listings and registration help visitors find the right programme.",
    features: ["Service hub", "Training calendar", "Registration", "News and projects"],
  },
  {
    name: "Precision Field Academy", slug: "precision-field-academy", industry: "Agricultural education",
    url: "https://precisionfieldacademy.com/",
    summary: "A learning platform for practical agricultural technology. Visitors can browse programmes and resources, while learners have a dedicated portal.",
    features: ["Programme pages", "Flagship cohort", "Self-paced learning", "Student portal"],
  },
  {
    name: "Eternal Life Global Community Church", slug: "elgcc", industry: "Faith · community",
    url: "https://eternallifegcc.com/",
    summary: "A community website connecting visitors to live meetings, teachings, programmes and locations, with clear ways to get in touch.",
    features: ["Live meetings", "Teachings", "Programmes", "Locations"],
  },
] as const;

const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi Triumphant Tech, I saw your portfolio and I'd like a website for my business.")}`;

const automation = [
  { icon: "↗", title: "Missed-call follow-up", copy: "Send a timely WhatsApp reply when a potential customer calls and cannot reach you." },
  { icon: "✦", title: "AI chat and booking", copy: "Answer common questions and help visitors book an appointment or site survey, day or night." },
  { icon: "★", title: "Google review requests", copy: "Invite customers to leave a review after a completed job." },
  { icon: "◎", title: "Quote follow-up and CRM", copy: "Track enquiries and follow up when a quote has gone quiet." },
];

export default function PortfolioPage() {
  const structuredData = [
    {
      "@context": "https://schema.org", "@type": "ItemList", "@id": `${SITE_URL}/portfolio#projects`,
      name: "Triumphant Tech portfolio", numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem", position: index + 1,
        item: { "@type": "WebSite", name: project.name, url: project.url, description: project.summary },
      })),
    },
  ];

  return (
    <main className="bg-[#fafbfd]">
      <JsonLd data={structuredData} />
      <section className="relative overflow-hidden bg-[#0a1730] text-white">
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="mx-auto max-w-[1240px] px-5 pb-18 pt-24 sm:pb-24 sm:pt-32 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Triumphant Tech · Our portfolio</p>
          <h1 className="font-display mt-6 max-w-4xl text-[clamp(2.7rem,6vw,5.4rem)] font-bold leading-[1.04] tracking-[-0.055em]">Websites built to win trust and bring in enquiries.</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">See live work across Nigerian healthcare, agriculture, education and community organisations. We also build WhatsApp and AI automation that helps you respond and follow up.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <TrackedLink href={whatsappUrl} event="portfolio_whatsapp_click" className="inline-flex min-h-13 items-center justify-center rounded-xl bg-[#2ed174] px-6 py-3 font-bold text-[#062315] transition hover:bg-[#58e58f] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white">Chat with us on WhatsApp <span aria-hidden="true" className="ml-2">↗</span></TrackedLink>
            <a href="#projects" className="inline-flex min-h-13 items-center justify-center rounded-xl border border-white/35 px-6 py-3 font-bold text-white transition hover:bg-white/10 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white">See our work ↓</a>
          </div>
        </div>
      </section>

      <section aria-label="About Triumphant Tech" className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1240px] flex-wrap gap-x-8 gap-y-3 px-5 py-5 text-sm font-semibold text-slate-700 lg:px-8">
          <span>Based in Ibadan</span><span>Since 2017</span><span>Websites · apps · SEO · AI automation</span><span>5 live projects below</span>
        </div>
      </section>

      <section id="projects" className="mx-auto max-w-[1240px] scroll-mt-20 px-5 py-18 sm:py-24 lg:px-8">
        <p className="eyebrow">Selected projects</p>
        <h2 className="font-display mt-4 max-w-2xl text-[clamp(2rem,4vw,3.3rem)] font-bold leading-tight tracking-[-0.045em] text-slate-950">See the work. Visit the real sites.</h2>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">Every project below is live. Explore the screenshots, then open the site to see it for yourself.</p>
        <div className="mt-10 grid gap-7 lg:grid-cols-2">
          {projects.map((project, index) => (
            <article key={project.slug} className="flex flex-col overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_15px_45px_rgba(15,23,42,0.05)]">
              <div className="relative overflow-hidden bg-[#e8eef6] px-5 pb-8 pt-7 sm:px-8 sm:pt-9">
                <div className="relative aspect-[1.6] w-[88%] overflow-hidden rounded-xl border border-slate-300 bg-white shadow-xl">
                  <Image src={`/portfolio/${project.slug}-desktop.webp`} alt={`Desktop homepage of ${project.name} website built by Triumphant Tech`} fill sizes="(max-width: 1023px) 82vw, 43vw" className="object-cover object-top" priority={index === 0} />
                </div>
                <div className="absolute bottom-3 right-4 w-[24%] overflow-hidden rounded-[1rem] border-[3px] border-slate-900 bg-white shadow-2xl sm:bottom-4 sm:right-8">
                  <div className="mx-auto my-1 h-1 w-5 rounded-full bg-slate-900" />
                  <div className="relative aspect-[390/844] w-full overflow-hidden rounded-b-xl">
                    <Image src={`/portfolio/${project.slug}-mobile.webp`} alt={`Mobile homepage of ${project.name} website built by Triumphant Tech`} fill sizes="(max-width: 1023px) 23vw, 12vw" className="object-cover object-top" />
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-700">{project.industry}</p>
                <h3 className="font-display mt-3 text-2xl font-bold tracking-[-0.035em] text-slate-950">{project.name}</h3>
                <p className="mt-4 leading-7 text-slate-600">{project.summary}</p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${project.name} features`}>
                  {project.features.map((feature) => <li key={feature} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">{feature}</li>)}
                </ul>
                <TrackedLink href={project.url} event="portfolio_visit_site" projectName={project.name} className="mt-7 inline-flex min-h-11 items-center self-start font-bold text-blue-700 underline decoration-blue-300 underline-offset-4 transition hover:text-blue-900 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-blue-700">Visit live site <span aria-hidden="true" className="ml-2">↗</span></TrackedLink>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-18 sm:py-24">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
          <p className="eyebrow">More than a website</p>
          <h2 className="font-display mt-4 max-w-2xl text-[clamp(2rem,4vw,3.3rem)] font-bold leading-tight tracking-[-0.045em] text-slate-950">A better way to respond, book and follow up.</h2>
          <p className="mt-4 max-w-2xl leading-7 text-slate-600">Add practical automation to the website we build for your business.</p>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {automation.map((item) => <div key={item.title} className="rounded-2xl border border-slate-200 bg-[#f7f9fc] p-6"><span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-xl bg-blue-100 text-xl font-bold text-blue-700">{item.icon}</span><h3 className="mt-5 text-lg font-bold text-slate-950">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</p></div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-18 sm:py-24 lg:px-8">
        <p className="eyebrow">Who we help</p>
        <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.3rem)] font-bold tracking-[-0.045em] text-slate-950">Built around your business.</h2>
        <div className="mt-7 flex flex-wrap gap-3">
          {["Solar installers", "Clinics and hospitals", "Med spas and salons", "Cleaning and fumigation", "Schools and academies", "Churches", "Restaurants"].map((industry) => <span key={industry} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">{industry}</span>)}
        </div>
        <div className="mt-16 border-t border-slate-200 pt-14">
          <p className="eyebrow">How it works</p>
          <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.3rem)] font-bold tracking-[-0.045em] text-slate-950">From idea to launch.</h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {[["01", "Tell us about your project", "Message us on WhatsApp and share what your business needs."], ["02", "We design and build", "We plan the pages, experience and tools around your goals."], ["03", "Launch and improve", "We launch your site and can connect the automation your team needs."]].map(([number, heading, copy]) => <li key={number} className="rounded-2xl border border-slate-200 bg-white p-6"><span className="text-sm font-bold text-blue-700">{number}</span><h3 className="mt-4 text-lg font-bold text-slate-950">{heading}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="bg-[#0a1730] px-5 py-18 text-white sm:py-22 lg:px-8">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Let&apos;s talk</p><h2 className="font-display mt-4 max-w-2xl text-[clamp(2.2rem,4vw,3.7rem)] font-bold leading-tight tracking-[-0.045em]">Ready to get more enquiries from your website?</h2><p className="mt-4 max-w-xl leading-7 text-slate-200">Tell us what you sell and where you want to grow. We’ll help you find the right starting point.</p></div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col lg:flex-row"><TrackedLink href={whatsappUrl} event="portfolio_whatsapp_click" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#2ed174] px-6 py-3 font-bold text-[#062315] transition hover:bg-[#58e58f] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white">Chat on WhatsApp ↗</TrackedLink><a href={`mailto:${siteIdentity.email}?subject=${encodeURIComponent("Website project enquiry")}`} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/40 px-6 py-3 font-bold text-white transition hover:bg-white/10 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white">Send an email</a></div>
        </div>
      </section>
    </main>
  );
}
