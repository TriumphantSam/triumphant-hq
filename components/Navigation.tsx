"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { agencyServices, discoveryCallUrl } from "@/lib/services";

const resources = [
  { href: "/digital-forge", label: "Digital Forge", description: "Our practical product-building lab" },
  { href: "/digital-forge/products", label: "Products", description: "Playbooks, systems and templates" },
  { href: "/digital-forge/training", label: "Free Training", description: "Learn before you invest" },
  { href: "/blog", label: "Insights", description: "Practical guides from our team" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/digital-forge/funnel/") || pathname.startsWith("/parent-home-routine")) {
    return null;
  }

  const overHero = isHome && !scrolled && !mobileOpen;

  return (
    <nav
      className={`${
        isHome ? "fixed" : "sticky"
      } top-0 left-0 right-0 z-[200] transition-all duration-300 ${
        overHero
          ? "border-b border-white/10 bg-gradient-to-b from-black/45 to-transparent"
          : "border-b border-slate-200/70 bg-white/90 backdrop-blur-2xl"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--accent-color)] transition-colors group-hover:bg-[var(--accent-hover)]">
            <span className="font-display text-base font-bold text-white">T</span>
          </div>
          <span
            className={`font-display text-[1.05rem] font-bold tracking-[-0.03em] transition-colors ${
              overHero ? "text-white" : "text-[var(--text-primary)]"
            }`}
          >
            Triumphant<span className={overHero ? "text-[#8bb6ff]" : "text-[var(--accent-color)]"}>HQ</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <Link
            href="/"
            className={`nav-link ${overHero ? "!text-white/75 hover:!text-white" : ""} ${pathname === "/" ? (overHero ? "!text-white" : "nav-link-active") : ""}`}
          >
            Home
          </Link>
          <div className="group relative">
            <Link
              href="/services"
              className={`nav-link inline-flex items-center gap-1.5 ${overHero ? "!text-white/75 hover:!text-white" : ""} ${pathname.startsWith("/services") || pathname.startsWith("/local-support") || pathname.startsWith("/ongoing-support") ? (overHero ? "!text-white" : "nav-link-active") : ""}`}
            >
              Services
              <svg className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <div className="pointer-events-none absolute left-1/2 top-full z-[250] w-[380px] -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
                <Link
                  href="/local-support"
                  className="group/item flex gap-3.5 border-b border-slate-100 bg-blue-50/50 px-4 py-3.5 transition-colors hover:bg-blue-50"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-600 font-mono text-[10px] font-bold text-white">
                    01
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-slate-950 group-hover/item:text-blue-600">
                      Local Support
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                      NIN, BVN, school portals and document help
                    </span>
                  </span>
                </Link>
                {agencyServices.map((service, i) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="group/item flex gap-3.5 border-b border-slate-100 px-4 py-3.5 transition-colors hover:bg-slate-50"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 font-mono text-[10px] font-bold text-blue-700">
                      {String(i + 2).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-slate-950 group-hover/item:text-blue-600">
                        {service.shortTitle}
                      </span>
                      <span className="mt-0.5 block text-xs leading-5 text-slate-500">{service.promise}</span>
                    </span>
                  </Link>
                ))}
                <Link
                  href="/ongoing-support"
                  className="group/item flex gap-3.5 px-4 py-3.5 transition-colors hover:bg-slate-50"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 font-mono text-[10px] font-bold text-blue-700">
                    06
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-slate-950 group-hover/item:text-blue-600">
                      Ongoing Support
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                      Monthly website care, SEO and automation retainers
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <Link
            href="/about"
            className={`nav-link ${overHero ? "!text-white/75 hover:!text-white" : ""} ${pathname === "/about" ? (overHero ? "!text-white" : "nav-link-active") : ""}`}
          >
            About
          </Link>
          <Link
            href="/locations"
            className={`nav-link ${overHero ? "!text-white/75 hover:!text-white" : ""} ${pathname.startsWith("/locations") ? (overHero ? "!text-white" : "nav-link-active") : ""}`}
          >
            Locations
          </Link>
          <Link
            href="/work"
            className={`nav-link ${overHero ? "!text-white/75 hover:!text-white" : ""} ${pathname.startsWith("/work") ? (overHero ? "!text-white" : "nav-link-active") : ""}`}
          >
            Work
          </Link>
          <Link
            href="/contact"
            className={`nav-link ${overHero ? "!text-white/75 hover:!text-white" : ""} ${pathname === "/contact" ? (overHero ? "!text-white" : "nav-link-active") : ""}`}
          >
            Work With Us
          </Link>
          <div className="group relative">
            <Link
              href="/resources"
              className={`nav-link inline-flex items-center gap-1.5 ${overHero ? "!text-white/75 hover:!text-white" : ""} ${pathname.startsWith("/resources") || pathname.startsWith("/digital-forge") || pathname.startsWith("/blog") ? (overHero ? "!text-white" : "nav-link-active") : ""}`}
            >
              Resources
              <svg className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <div className="pointer-events-none absolute right-0 top-full z-[250] w-[340px] translate-y-1 pt-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
                {resources.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group/item flex gap-3.5 px-4 py-3.5 transition-colors hover:bg-slate-50 ${index < resources.length - 1 ? "border-b border-slate-100" : ""}`}
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 font-mono text-[10px] font-bold text-blue-700 transition-colors group-hover/item:bg-blue-600 group-hover/item:text-white">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-slate-950 group-hover/item:text-blue-600">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-5 text-slate-500">{item.description}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link
            href="/seo-snapshot"
            className={`nav-link ${overHero ? "!text-[#9ec2ff] hover:!text-white" : "text-[var(--accent-color)]"}`}
          >
            Free SEO Audit
          </Link>
          <Link
            href={discoveryCallUrl}
            target="_blank"
            className="button button-primary !min-h-10 !px-4 !py-2 !text-[0.7rem]"
          >
            Book a call
          </Link>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          className={`transition-colors lg:hidden ${overHero ? "text-white hover:text-white/80" : "text-[var(--text-primary)] hover:text-[var(--accent-color)]"}`}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-slate-200 bg-white px-5 py-6 lg:hidden">
          <div className="flex flex-col gap-1">
            <Link href="/" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            <p className="mobile-nav-label">Services</p>
            <Link href="/local-support" className="mobile-nav-sublink font-semibold text-blue-700" onClick={() => setMobileOpen(false)}>
              01 · Local Support
            </Link>
            {agencyServices.map((service, index) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="mobile-nav-sublink"
                onClick={() => setMobileOpen(false)}
              >
                {String(index + 2).padStart(2, "0")} · {service.shortTitle}
              </Link>
            ))}
            <Link href="/ongoing-support" className="mobile-nav-sublink" onClick={() => setMobileOpen(false)}>
              06 · Ongoing Support
            </Link>
            <Link href="/about" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
              About
            </Link>
            <Link href="/locations" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
              Locations
            </Link>
            <Link href="/work" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
              Work
            </Link>
            <Link href="/contact" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
              Work With Us
            </Link>
            <p className="mobile-nav-label">Resources</p>
            {resources.map((item) => (
              <Link key={item.href} href={item.href} className="mobile-nav-sublink" onClick={() => setMobileOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link
              href="/seo-snapshot"
              className="mobile-nav-link text-[var(--accent-color)]"
              onClick={() => setMobileOpen(false)}
            >
              Free SEO Audit
            </Link>
            <a
              href={discoveryCallUrl}
              target="_blank"
              rel="noreferrer"
              className="button button-primary mt-4"
              onClick={() => setMobileOpen(false)}
            >
              Book a discovery call
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
