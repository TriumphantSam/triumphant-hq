import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import ClientLogos from "@/components/marketing/ClientLogos";
import ProcessSteps from "@/components/marketing/ProcessSteps";
import ServiceCard from "@/components/marketing/ServiceCard";
import Testimonials from "@/components/Testimonials";
import { whatsappLink } from "@/lib/contact";
import { agencyServices } from "@/lib/services";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Technology Agency in Ibadan | Tech Company · Triumphant HQ",
  description: "Triumphant HQ builds websites, custom apps, SEO and AI automation for Nigerian businesses. Based in Ibadan and delivering practical digital systems since 2017.",
  path: "/",
  keywords: ["Triumphant HQ Ibadan", "Triumphant Technological Services", "technology agency Ibadan", "website design Ibadan"],
});

const projects = [
  { name: "Metropolitan Family Hospital", sector: "Healthcare", slug: "metropolitan-family-hospital" },
  { name: "IAPrecision", sector: "Agricultural technology", slug: "iaprecision" },
  { name: "Echitech", sector: "Engineering and safety", slug: "echitech" },
  { name: "Precision Field Academy", sector: "Agricultural education", slug: "precision-field-academy" },
  { name: "Eternal Life Global Community Church", sector: "Faith and community", slug: "elgcc" },
];
const wa = whatsappLink("Hi Triumphant Tech, I saw your website and I'd like a website with WhatsApp automation for my business.");

export default function Home() {
  return (
    <div className="home-page min-h-screen">
      <Hero />

      <section className="bg-white py-16 sm:py-20" aria-labelledby="portfolio-preview-title">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="eyebrow">Selected work</p><h2 id="portfolio-preview-title" className="font-display mt-4 max-w-2xl text-[clamp(2rem,4vw,3.2rem)] font-bold leading-tight tracking-[-0.045em] text-slate-950">Real websites. Real businesses. Live today.</h2><p className="mt-4 max-w-2xl leading-7 text-slate-600">Explore websites built for care, agriculture, training and community.</p></div>
            <Link href="/portfolio" className="inline-flex min-h-11 shrink-0 items-center font-bold text-blue-700 underline decoration-blue-300 underline-offset-4 focus-visible:outline-2 focus-visible:outline-blue-700">View full portfolio →</Link>
          </div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((project, index) => <Link key={project.slug} href="/portfolio#projects" className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-blue-700 ${index === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""}`}>
              <div className={`relative overflow-hidden bg-slate-100 ${index === 0 ? "aspect-[1.45] lg:aspect-auto lg:h-[385px]" : "aspect-[1.5]"}`}><Image src={`/portfolio/${project.slug}-desktop.webp`} alt={`Homepage of ${project.name} website built by Triumphant Tech`} fill sizes={index === 0 ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 100vw, 25vw"} className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]" priority={index === 0} /></div>
              <div className="p-4 sm:p-5"><p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">{project.sector}</p><h3 className="mt-2 text-lg font-bold text-slate-950">{project.name}</h3></div>
            </Link>)}
          </div>
        </div>
      </section>

      <section className="bg-[var(--tint)] px-5 py-16 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-[1240px]"><p className="eyebrow">Built for growth</p><h2 className="font-display mt-4 max-w-4xl text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight tracking-[-0.045em] text-slate-950">Websites + WhatsApp AI that books customers for Nigerian clinics, solar installers and service businesses.</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">We connect a credible online presence with faster responses, easier booking and practical follow-up.</p><a href={wa} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-12 items-center rounded-xl bg-[var(--wa)] px-6 font-bold text-white hover:bg-[#16a34a] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--brand)]">Chat on WhatsApp ↗</a></div>
      </section>

      <section className="bg-white py-16 sm:py-20"><div className="mx-auto max-w-[1240px] px-5 lg:px-8"><p className="eyebrow">What we do</p><h2 className="font-display mt-4 max-w-2xl text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-[-0.045em] text-slate-950">One partner across the systems that power modern growth.</h2><p className="mt-4 max-w-2xl leading-7 text-slate-600">Strategy only matters when customers can feel it and teams can run it. We connect design, engineering, visibility and automation into focused delivery.</p><div className="agency-grid mt-9">{agencyServices.map((service) => <ServiceCard key={service.slug} service={service} />)}</div></div></section>

      <div className="bg-[var(--tint)]"><ClientLogos /></div>

      <section id="how-we-work" className="scroll-mt-24 bg-white py-16 sm:py-20"><div className="mx-auto max-w-[1240px] px-5 lg:px-8"><p className="eyebrow">How we work</p><h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-[-0.045em] text-slate-950">A clear path from challenge to working solution.</h2><p className="mt-4 max-w-2xl leading-7 text-slate-600">You stay close to the decisions that matter, without managing every technical detail.</p><div className="mt-9"><ProcessSteps /></div></div></section>

      <section className="bg-[var(--brand)] px-5 py-14 text-white sm:py-16 lg:px-8"><div className="mx-auto flex max-w-[1240px] flex-col gap-6 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-white/80">Start a conversation</p><h2 className="font-display mt-3 max-w-2xl text-[clamp(2rem,4vw,3rem)] font-bold leading-tight">Ready to turn the next challenge into a working system?</h2></div><Link href="/contact" className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-white px-6 font-bold text-[var(--brand)] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white">Send a project brief →</Link></div></section>

      <div className="bg-[var(--navy-2)] text-white">{/* TODO: add more real client testimonials after verification. */}<Testimonials /></div>

      <section className="bg-[var(--navy)] px-5 py-16 text-white sm:py-20 lg:px-8"><div className="mx-auto flex max-w-[1240px] flex-col gap-7 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9ec2ff]">Let&apos;s build</p><h2 className="font-display mt-4 max-w-2xl text-[clamp(2.2rem,4vw,3.4rem)] font-bold leading-tight tracking-[-0.045em]">Your next customer should find a business ready to respond.</h2><p className="mt-4 max-w-xl leading-7 text-slate-200">Tell us what you do. We’ll help you find the right website and automation starting point.</p></div><a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-[var(--wa)] px-6 font-bold text-white hover:bg-[#16a34a] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white">Chat on WhatsApp ↗</a></div></section>
    </div>
  );
}
