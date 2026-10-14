import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { whatsappNumber, projectEnquiryUrl } from "@/lib/services";
import { buildPageMetadata, founderPersonJsonLd, siteIdentity } from "@/lib/seo";

const title = "Adeyemi Olayemi, Founder of TriumphantTech | Ibadan";
const description =
  "Adeyemi Olayemi founded Triumphant Technological Services in Ibadan in 2017. He builds websites, custom apps, SEO and AI automation for Nigerian businesses.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/founder",
  keywords: ["Adeyemi Olayemi", "TriumphantTech", "Triumphant Technological Services"],
});

const PORTRAIT_SRC = "/images/founder/adeyemi-olayemi.jpg";
const PORTRAIT_ALT =
  "Adeyemi Olayemi, founder of TriumphantTech, smiling outdoors in a royal-blue double-breasted suit, white shirt and striped tie, with green trees behind him.";

const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello Triumphant HQ — I have a project enquiry.")}`;

const disciplines = [
  {
    title: "Website design",
    copy: "fast, credible, conversion-focused sites, including moves from legacy cPanel hosting to modern edge-hosted frameworks.",
  },
  {
    title: "Custom applications",
    copy: "portals and internal tools that replace scattered spreadsheets and manual steps.",
  },
  {
    title: "SEO growth",
    copy: "technical SEO, content and local visibility, now including visibility in AI search tools such as ChatGPT, Gemini and Copilot.",
  },
  {
    title: "AI and WhatsApp automation",
    copy: "missed-call follow-up, AI chat and booking, review requests and quote follow-up.",
  },
];

const expertise = [
  "Technical SEO audits, keyword research, on-page optimisation and link building",
  "Paid ads across Meta, Google, Bing and LinkedIn, including Click-to-WhatsApp campaigns",
  "Web development with Next.js, Tailwind CSS, Supabase, Vercel, Sanity CMS and Cloudflare",
  "Domain, DNS and hosting administration",
  "Lead funnels and automation (Zoho Forms with pre-filled links, email notifications, WhatsApp flows)",
  "AI model evaluation: checking AI outputs for errors, logic gaps and guideline compliance (RLHF, search-intent evaluation)",
  "Advanced IT support: hardware and firmware diagnostics, system recovery, cloud subscription troubleshooting",
];

const timeline = [
  ["2013–2016", "Community Manager (Moderator), Nairaland Forum"],
  ["2017–present", "Founder, Triumphant Technological Services (TriumphantTech), Ibadan"],
  ["2019–2024", "Microsoft Answers Community Expert & Expert Advisor (contract), Limitless Technology (UK)"],
  ["2022–2024", "Remote SEO Specialist, Chicago SEO Company (Chicago, US)"],
  ["2023–present", "AI evaluation for Mercor, Appen, TELUS International, OpenTrain AI and Mindrift, 2023–present"],
  ["2024–present", "SEO & Website Manager (contract), Integrated Aerial Precision, Lagos"],
  ["2024–present", "Website & Social Media Manager (contract), Echitech Engineering Services"],
  ["2024–2026", "Digital Marketing Manager & Ads Specialist, Dr Seyi Absolute Wellness Ltd, Lagos"],
  ["2025–present", "Technical Support & HP Instant Ink Specialist (contract), Limitless (HP Support)"],
];

const education = [
  "Postgraduate Diploma in Information Technology, 2024–present",
  "B.Sc. Agricultural Economics, Federal University of Agriculture, Abeokuta (FUNAAB), 2012–2016, CGPA 4.14/5.00",
  "Software engineering coursework in C, Python and shell, ALX, 2022",
];

const selectedWork = [
  {
    name: "Tradepatnas Nigeria Limited",
    copy: "integrated agribusiness site with a produce-booking portal and operations hub.",
    href: "https://tradepatnas.com",
    linkLabel: "Visit tradepatnas.com",
    image: "/portfolio/tradepatnas-desktop.webp",
    imageAlt: "Desktop homepage of Tradepatnas website built by Triumphant Tech",
  },
  {
    name: "Integrated Aerial Precision",
    copy: "agricultural drone services and products. Adeyemi has also managed its SEO and website since 2024.",
    href: "https://iaprecision.com",
    linkLabel: "Visit iaprecision.com",
    image: "/portfolio/iaprecision-desktop.webp",
    imageAlt: "Desktop homepage of IAPrecision website built by Triumphant Tech",
  },
  {
    name: "Precision Field Academy",
    copy: "learning platform for practical agricultural technology, with a student portal.",
    href: "https://precisionfieldacademy.com/",
    linkLabel: "Visit live site",
    image: "/portfolio/precision-field-academy-desktop.webp",
    imageAlt: "Desktop homepage of Precision Field Academy website built by Triumphant Tech",
  },
  {
    name: "Echitech Engineering Services",
    copy: "engineering and QHSSE services site with training calendar and registration. He also runs its Meta and LinkedIn lead campaigns.",
    href: "https://echitech.com",
    linkLabel: "Visit echitech.com",
    image: "/portfolio/echitech-desktop.webp",
    imageAlt: "Desktop homepage of Echitech website built by Triumphant Tech",
  },
  {
    name: "Metropolitan Family Hospital, Akobo, Ibadan",
    copy: "hospital site with departments, appointment requests and the Black MD resource hub.",
    href: "https://www.metropolitanfamilyhospital.com/",
    linkLabel: "Visit live site",
    image: "/portfolio/metropolitan-family-hospital-desktop.webp",
    imageAlt: "Desktop homepage of Metropolitan Family Hospital website built by Triumphant Tech",
  },
  {
    name: "Eternal Life Global Community Church",
    copy: "community site for live meetings, teachings and locations.",
    href: "https://eternallifegcc.com/",
    linkLabel: "Visit live site",
    image: "/portfolio/elgcc-desktop.webp",
    imageAlt: "Desktop homepage of Eternal Life Global Community Church website built by Triumphant Tech",
  },
  {
    name: "Dr Seyi Absolute Wellness",
    copy: "digital marketing, ads and search visibility (2024–2026).",
    href: "/work/dr-seyi-absolute-wellness",
    linkLabel: "Read the case study",
    image: null,
    imageAlt: null,
  },
];

const githubHighlights = [
  {
    name: "triumphant-hq (TypeScript)",
    note: "the codebase behind triumphantech.com.",
    href: "https://github.com/TriumphantSam/triumphant-hq",
  },
  {
    name: "alx-low_level_programming, printf, simple_shell, alx-higher_level_programming, alx-system_engineering-devops",
    note: "ALX coursework in C, Python and shell (2022).",
    href: "https://github.com/TriumphantSam",
  },
  {
    name: "MatchGame, PickRandomCards, PickACardUI, Unity lab",
    note: "C# and Unity learning projects (2020–2021).",
    href: "https://github.com/TriumphantSam",
  },
  {
    name: "khariskleen",
    note: "website for a cleaning company.",
    href: "https://github.com/TriumphantSam/khariskleen",
  },
];

const howHeWorks = [
  ["Clarity before complexity", "Define the real business problem before choosing tools."],
  ["Execution over theatre", "Judge work by what launches and keeps working after handover."],
  ["Close collaboration", "Clear decisions, visible progress, direct communication."],
  ["Durable foundations", "Maintainable, fast and easy to hand over."],
  ["Honest numbers", "Report real data, not invented results."],
];

const whyWorkWithHim = [
  "He has done both sides: years of front-line technical support and years of SEO and ads work for international agencies.",
  "He knows Nigerian business, from Ibadan clinics to Lagos agritech, and how customers here actually reach out: WhatsApp first.",
  "He tests AI systems for a living, so he knows where AI helps and where it fails, and builds automation with that in mind.",
  "One accountable person from brief to launch.",
];

const connectLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/adeyemi-olayemi-73a7b1158/" },
  { label: "GitHub", href: "https://github.com/TriumphantSam" },
  ...siteIdentity.profiles,
];

function portraitExists() {
  return fs.existsSync(path.join(process.cwd(), "public", PORTRAIT_SRC));
}

function FounderPortrait() {
  if (!portraitExists()) {
    return (
      <div
        className="grid aspect-[4/5] place-items-center bg-[var(--navy)] text-white sm:max-w-md lg:max-w-none"
        role="img"
        aria-label={PORTRAIT_ALT}
      >
        <span className="font-display text-7xl font-bold tracking-[-0.04em]" aria-hidden="true">
          AO
        </span>
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 sm:max-w-md lg:max-w-none">
      <Image
        src={PORTRAIT_SRC}
        alt={PORTRAIT_ALT}
        fill
        className="object-cover object-top"
        sizes="(max-width: 1024px) 100vw, 40vw"
        priority
      />
    </div>
  );
}

export default function FounderPage() {
  return (
    <div>
      <JsonLd data={founderPersonJsonLd()} />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Founder", path: "/founder" },
        ]}
      />

      <header className="section-shell !pt-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <p className="eyebrow">Founder</p>
            <h1 className="font-display mt-4 max-w-3xl text-[clamp(2.7rem,6vw,5.1rem)] font-extrabold leading-[0.98] tracking-[-0.055em] text-slate-950">
              Adeyemi Olayemi
            </h1>
            <p className="mt-5 max-w-xl text-[1.05rem] font-semibold leading-7 text-slate-950">
              Founder, Triumphant Technological Services (TriumphantTech) · Ibadan, Nigeria
            </p>
            <p className="mt-6 max-w-xl text-[clamp(1.05rem,2vw,1.2rem)] leading-8 text-slate-600">
              He builds the websites, search visibility and automation that make Nigerian businesses easier to find,
              easier to trust and easier to buy from.
            </p>
            <div className="button-row mt-10">
              <Link className="button button-primary" href={projectEnquiryUrl}>
                Start a project
                <span className="button-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
              <a className="button button-secondary" href={whatsappHref} target="_blank" rel="noreferrer">
                Chat on WhatsApp
              </a>
            </div>
          </div>
          <FounderPortrait />
        </div>
      </header>

      <section className="section-muted">
        <div className="section-shell">
          <h2 className="font-display max-w-3xl text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.05em] text-slate-950">
            His story
          </h2>
          <div className="mt-8 max-w-3xl space-y-5 text-[1.05rem] leading-8 text-slate-600">
            <p>
              Adeyemi Olayemi&apos;s work in technology started with people, not code. From 2013 to 2016 he was a
              community manager (moderator) at Nairaland, Africa&apos;s largest online forum, helping moderate a community
              of millions of members. In the same years he earned a B.Sc. in Agricultural Economics at the Federal
              University of Agriculture, Abeokuta (FUNAAB), graduating with a CGPA of 4.14 out of 5.00.
            </p>
            <p>
              In 2017 he started Triumphant Technological Services with one plain rule: make technology useful,
              understandable and dependable for the person relying on it. The business began with essential digital
              support, including help with NIN and BVN services, and grew with what clients needed next. Support led to
              websites. Websites led to search growth. Repetitive manual work led to custom software and automation.
            </p>
            <p>
              Alongside the agency, he spent years doing remote technical work for international teams. From 2019 to
              2024 he was a Microsoft Answers Community Expert and Expert Advisor through Limitless Technology,
              supporting Microsoft 365, Windows and Xbox users. From 2022 to 2024 he was a remote SEO specialist for
              Chicago SEO Company, working across a portfolio of more than 30 client accounts. That mix of hands-on
              support and growth marketing shapes how he works today: fix the foundations first, then make the business
              visible.
            </p>
            <p>
              He kept learning in public too. His GitHub shows his early C# and Unity exercises from 2020–2021, and his
              ALX software engineering coursework in C, Python and shell in 2022. He is now studying for a Postgraduate
              Diploma in Information Technology.
            </p>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <h2 className="font-display max-w-3xl text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.05em] text-slate-950">
          What he does at TriumphantTech
        </h2>
        <p className="mt-6 max-w-3xl text-[1.05rem] leading-8 text-slate-600">
          Adeyemi leads strategy and delivery across the studio&apos;s four disciplines:
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {disciplines.map((item) => (
            <article className="agency-card" key={item.title}>
              <h3 className="text-xl font-bold text-slate-950">{item.title}</h3>
              <p className="card-copy">{item.copy}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-[1.05rem] leading-8 text-slate-600">
          He works directly with each client, so the person who plans the work is the person who answers for it.
        </p>
      </section>

      <section className="section-muted">
        <div className="section-shell">
          <h2 className="font-display max-w-3xl text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.05em] text-slate-950">
            Areas of expertise
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {expertise.map((item) => (
              <li className="agency-card text-[0.98rem] leading-7 text-slate-700" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-shell">
        <h2 className="font-display max-w-3xl text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.05em] text-slate-950">
          Career
        </h2>
        <ol className="relative mt-10 max-w-3xl border-l border-slate-200">
          {timeline.map(([years, role]) => (
            <li className="relative pb-8 pl-8 last:pb-0" key={`${years}-${role}`}>
              <span
                className="absolute top-1.5 -left-[5px] h-2.5 w-2.5 rounded-full bg-[var(--accent-color)] ring-4 ring-white"
                aria-hidden="true"
              />
              <p className="text-sm font-extrabold text-blue-600">{years}</p>
              <p className="mt-2 text-[1.02rem] leading-7 text-slate-950">{role}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section-muted">
        <div className="section-shell">
          <h2 className="font-display max-w-3xl text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.05em] text-slate-950">
            Education
          </h2>
          <ul className="mt-8 max-w-3xl space-y-4">
            {education.map((item) => (
              <li className="border-l-2 border-[var(--accent-color)] pl-5 text-[1.02rem] leading-7 text-slate-700" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-shell">
        <h2 className="font-display max-w-3xl text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.05em] text-slate-950">
          Selected work
        </h2>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {selectedWork.map((project) => (
            <article
              className="flex flex-col overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_15px_45px_rgba(15,23,42,0.05)]"
              key={project.name}
            >
              {project.image ? (
                <div className="relative aspect-[1.6] bg-[#e8eef6]">
                  <Image
                    src={project.image}
                    alt={project.imageAlt ?? ""}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <h3 className="font-display text-2xl font-bold tracking-[-0.035em] text-slate-950">{project.name}</h3>
                <p className="card-copy">{project.copy}</p>
                <Link
                  href={project.href}
                  className="mt-6 inline-flex min-h-11 items-center self-start font-bold text-blue-700 underline decoration-blue-300 underline-offset-4 transition hover:text-blue-900"
                  {...(project.href.startsWith("http")
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                >
                  {project.linkLabel}
                  <span aria-hidden="true" className="ml-2">
                    {project.href.startsWith("http") ? "↗" : "→"}
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-muted">
        <div className="section-shell">
          <h2 className="font-display max-w-3xl text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.05em] text-slate-950">
            Open source and GitHub
          </h2>
          <p className="mt-6 max-w-3xl text-[1.05rem] leading-8 text-slate-600">
            Adeyemi&apos;s GitHub (
            <a
              href="https://github.com/TriumphantSam"
              className="font-semibold text-[var(--accent-color)] transition hover:text-[var(--accent-hover)]"
              target="_blank"
              rel="noreferrer"
            >
              @TriumphantSam
            </a>
            ,{" "}
            <a
              href="https://github.com/TriumphantSam"
              className="font-semibold text-[var(--accent-color)] transition hover:text-[var(--accent-hover)]"
              target="_blank"
              rel="noreferrer"
            >
              https://github.com/TriumphantSam
            </a>
            ) has 27 public repositories, with client work kept private. Public highlights:
          </p>
          <ul className="mt-8 max-w-3xl space-y-4">
            {githubHighlights.map((item) => (
              <li className="text-[1.02rem] leading-7 text-slate-700" key={item.name}>
                <a
                  href={item.href}
                  className="font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 transition hover:text-[var(--accent-color)]"
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.name}
                </a>
                {": "}
                {item.note}
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-3xl text-[1.05rem] leading-8 text-slate-600">
            His GitHub bio sums it up: &quot;I love building things.&quot;
          </p>
        </div>
      </section>

      <section className="section-shell">
        <h2 className="font-display max-w-3xl text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.05em] text-slate-950">
          How he works
        </h2>
        <div className="agency-grid mt-10">
          {howHeWorks.map(([heading, copy], index) => (
            <article className="agency-card" key={heading}>
              <span className="font-mono text-xs font-bold text-blue-600">0{index + 1}</span>
              <h3 className="mt-5 text-xl font-bold text-slate-950">{heading}</h3>
              <p className="card-copy">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-muted">
        <div className="section-shell">
          <h2 className="font-display max-w-3xl text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.05em] text-slate-950">
            Why work with him
          </h2>
          <ul className="mt-8 grid gap-4 lg:grid-cols-2">
            {whyWorkWithHim.map((item) => (
              <li className="agency-card text-[1.02rem] leading-7 text-slate-700" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-shell">
        <div className="cta-band">
          <div>
            <p className="eyebrow">Work with Adeyemi</p>
            <h2>Have a project in mind?</h2>
            <p>Tell Adeyemi what your business needs. He replies personally.</p>
          </div>
          <div className="button-row lg:justify-end">
            <Link className="button button-primary" href={projectEnquiryUrl}>
              Start a project
              <span className="button-arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <a className="button button-secondary" href={whatsappHref} target="_blank" rel="noreferrer">
              Chat on WhatsApp
            </a>
            <Link className="button button-ghost" href="/portfolio">
              See the portfolio
            </Link>
          </div>
        </div>
      </section>

      <section className="section-muted">
        <div className="section-shell">
          <h2 className="font-display text-[clamp(2rem,4vw,3.1rem)] font-extrabold leading-[1.05] tracking-[-0.05em] text-slate-950">
            Connect
          </h2>
          <p className="mt-6 text-[1.02rem] leading-8">
            {connectLinks.map((link, index) => (
              <span key={link.href}>
                {index > 0 ? <span className="text-slate-400"> · </span> : null}
                <a
                  href={link.href}
                  className="font-semibold text-[var(--accent-color)] transition hover:text-[var(--accent-hover)]"
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              </span>
            ))}
          </p>
        </div>
      </section>
    </div>
  );
}
