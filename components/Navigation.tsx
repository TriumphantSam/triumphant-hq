"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, MessageCircle, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { agencyServices, projectEnquiryUrl } from "@/lib/services";
import { whatsappLink } from "@/lib/contact";

const services = [
  ...agencyServices.map((service) => ({ href: `/services/${service.slug}`, label: service.shortTitle, description: service.promise })),
  { href: "/ongoing-support", label: "Ongoing Support", description: "Keep your website and systems improving." },
];
const more = [
  { href: "/nin-bvn-desk", label: "NIN/BVN desk", description: "Local identity support in Ibadan." },
  { href: "/shop", label: "Shop", description: "Practical digital products and tools." },
  { href: "/blog", label: "Insights", description: "Guides and ideas from our team." },
  { href: "/digital-forge", label: "Digital Forge", description: "Products, training and systems." },
  { href: "/seo-snapshot", label: "Free SEO Audit", description: "Find your visibility gaps." },
  { href: "/ibadan-tech-agency", label: "Ibadan", description: "Your local technology partner." },
  { href: "/locations", label: "Locations", description: "Where we work." },
];
const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/#how-we-work", label: "How we work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
const wa = whatsappLink("Hi Triumphant Tech, I saw your website and I'd like a website with WhatsApp automation for my business.");

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<"services" | "more" | null>(null);
  const [openDropdown, setOpenDropdown] = useState<"services" | "more" | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLDivElement>(null);
  const nav = useRef<HTMLElement>(null);
  const dropdownButtons = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeDrawer = useCallback((restoreFocus = false) => {
    setMobileOpen(false);
    setMobileGroup(null);
    if (restoreFocus) requestAnimationFrame(() => menuButton.current?.focus());
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { setMobileOpen(false); setOpenDropdown(null); }, 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = drawer.current?.querySelector<HTMLElement>("a, button");
    focusable?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); closeDrawer(true); return; }
      if (event.key !== "Tab" || !drawer.current) return;
      const items = [...drawer.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')];
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", onKey); };
  }, [mobileOpen, closeDrawer]);

  useEffect(() => {
    const onPointer = (event: PointerEvent) => { if (!nav.current?.contains(event.target as Node)) setOpenDropdown(null); };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && openDropdown) {
        const trigger = dropdownButtons.current[openDropdown];
        setOpenDropdown(null);
        trigger?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onPointer); document.removeEventListener("keydown", onKey); };
  }, [openDropdown]);

  if (["/digital-forge/funnel/", "/parent-home-routine", "/digital-product", "/invoices"].some((path) => pathname.startsWith(path))) return null;

  const active = (href: string) => href === "/" ? pathname === "/" : href.startsWith("/#") ? false : pathname === href || pathname.startsWith(`${href}/`);
  const linkClass = (href: string) => `relative inline-flex min-h-10 items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${active(href) ? "bg-white/10 text-white" : "text-white/80"}`;
  const cancelClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); };
  const scheduleClose = () => { cancelClose(); closeTimer.current = setTimeout(() => setOpenDropdown(null), 250); };

  const dropdown = (name: "services" | "more", label: string, items: typeof more) => (
    <div className="relative" onMouseEnter={() => { cancelClose(); setOpenDropdown(name); }} onMouseLeave={scheduleClose} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpenDropdown(null); }}>
      <button ref={(node) => { dropdownButtons.current[name] = node; }} type="button" aria-expanded={openDropdown === name} aria-controls={`${name}-dropdown`} onClick={() => setOpenDropdown(openDropdown === name ? null : name)} className={`${linkClass(name === "services" ? "/services" : "/nin-bvn-desk")} gap-1 focus-visible:outline-2 focus-visible:outline-white`}>
        {label}<ChevronDown size={14} className={`transition-transform ${openDropdown === name ? "rotate-180" : ""}`} />
      </button>
      {openDropdown === name && <div id={`${name}-dropdown`} className="absolute left-0 top-full z-[220] w-80 pt-3"><div className="max-h-[70vh] overflow-auto rounded-xl border border-white/10 bg-[var(--navy)]/95 p-2 shadow-xl backdrop-blur-md">{items.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpenDropdown(null)} className="block rounded-lg px-3 py-3 text-white transition hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-white"><span className="block text-sm font-semibold">{item.label}</span><span className="mt-1 block text-xs leading-5 text-white/65">{item.description}</span></Link>)}</div></div>}
    </div>
  );

  const navLink = (item: typeof mainLinks[number], compact = false) => (
    <Link key={item.href} href={item.href} aria-current={active(item.href) ? "page" : undefined} className={`${linkClass(item.href)} ${compact && ["/", "/about"].includes(item.href) ? "hidden xl:inline-flex" : ""}`}>
      {item.label}{active(item.href) && <span aria-hidden="true" className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[var(--wa)]" />}
    </Link>
  );

  return (
    <>
      <a href="#site-main-content" className="fixed left-4 top-2 z-[300] -translate-y-20 rounded-lg bg-white px-4 py-2 font-bold text-[var(--navy)] focus:translate-y-0">Skip to content</a>
      <nav ref={nav} aria-label="Main navigation" className="fixed inset-x-0 top-0 z-[200] px-3 pt-3 sm:px-4">
        <div className={`mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border px-4 text-white backdrop-blur-md transition-all duration-300 sm:px-6 ${scrolled ? "border-white/15 bg-[var(--navy)]/95 shadow-[0_10px_30px_rgba(0,0,0,0.35)]" : "border-white/10 bg-[var(--navy)]/85"}`}>
          <Link href="/" className="flex min-h-11 shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" aria-label="Triumphant HQ home"><span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--brand)] font-display text-lg font-bold">T</span><span className="font-display text-lg font-bold tracking-tight">Triumphant<span className="text-[#7eb0ff]">HQ</span></span></Link>
          <div className="hidden items-center gap-0.5 lg:flex">
            {navLink(mainLinks[0], true)}
            {dropdown("services", "Services", services)}
            {navLink(mainLinks[1])}
            {navLink(mainLinks[2])}
            {navLink(mainLinks[3], true)}
            {navLink(mainLinks[4])}
            {dropdown("more", "More", more)}
          </div>
          <div className="hidden items-center gap-2 xl:flex"><a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--wa)] px-4 text-xs font-bold text-white hover:bg-[#16a34a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><MessageCircle size={16} />Chat on WhatsApp</a><Link href={projectEnquiryUrl} className="inline-flex min-h-10 items-center rounded-full bg-[var(--brand)] px-4 text-xs font-bold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Start a project</Link></div>
          <div className="flex items-center gap-2 lg:hidden"><a href={wa} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="grid h-11 w-11 place-items-center rounded-full bg-[var(--wa)] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><MessageCircle size={19} /></a><button ref={menuButton} type="button" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => mobileOpen ? closeDrawer(true) : setMobileOpen(true)} className="grid h-11 w-11 place-items-center rounded-lg text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{mobileOpen ? <X size={25} /> : <Menu size={25} />}</button></div>
        </div>
      </nav>
      <div id="mobile-navigation" ref={drawer} aria-hidden={!mobileOpen} className={`fixed inset-x-0 bottom-0 top-[76px] z-[190] overflow-y-auto bg-[var(--navy)]/98 px-5 pb-8 pt-6 text-white backdrop-blur-xl transition-all duration-200 motion-reduce:transition-none lg:hidden ${mobileOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0"}`}>
        <div className="mx-auto max-w-xl"><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#7eb0ff]">Menu</p>
          <Link href="/" onClick={() => closeDrawer()} className="flex min-h-12 items-center justify-between border-b border-white/10 text-base" aria-current={active("/") ? "page" : undefined}>Home<ArrowRight size={17} /></Link>
          {(["services", "more"] as const).map((group) => group === "services" ? <div key={group}><button type="button" aria-expanded={mobileGroup === group} aria-controls={`${group}-mobile-items`} onClick={() => setMobileGroup(mobileGroup === group ? null : group)} className="flex min-h-12 w-full items-center justify-between border-b border-white/10 text-left text-base focus-visible:outline-2 focus-visible:outline-white">Services<ChevronDown size={18} className={mobileGroup === group ? "rotate-180" : ""} /></button>{mobileGroup === group && <div id={`${group}-mobile-items`} className="py-2">{services.map((item) => <Link key={item.href} href={item.href} onClick={() => closeDrawer()} className="block min-h-11 rounded-lg px-4 py-3 text-sm text-white/80 focus-visible:outline-2 focus-visible:outline-white">{item.label}</Link>)}</div>}</div> : null)}
          {[mainLinks[1], mainLinks[2], mainLinks[3], mainLinks[4]].map((item) => <Link key={item.href} href={item.href} onClick={() => closeDrawer()} className="flex min-h-12 items-center justify-between border-b border-white/10 text-base focus-visible:outline-2 focus-visible:outline-white" aria-current={active(item.href) ? "page" : undefined}>{item.label}<ArrowRight size={17} /></Link>)}
          <button type="button" aria-expanded={mobileGroup === "more"} aria-controls="more-mobile-items" onClick={() => setMobileGroup(mobileGroup === "more" ? null : "more")} className="flex min-h-12 w-full items-center justify-between border-b border-white/10 text-left text-base focus-visible:outline-2 focus-visible:outline-white">More<ChevronDown size={18} className={mobileGroup === "more" ? "rotate-180" : ""} /></button>
          {mobileGroup === "more" && <div id="more-mobile-items" className="py-2">{more.map((item) => <Link key={item.href} href={item.href} onClick={() => closeDrawer()} className="block min-h-11 rounded-lg px-4 py-3 text-sm text-white/80 focus-visible:outline-2 focus-visible:outline-white">{item.label}</Link>)}</div>}
          <div className="mt-7 grid gap-3"><a href={wa} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--wa)] px-5 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><MessageCircle size={18} />Chat on WhatsApp</a><Link href={projectEnquiryUrl} onClick={() => closeDrawer()} className="flex min-h-12 items-center justify-center rounded-full bg-[var(--brand)] px-5 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Start a project</Link></div>
        </div>
      </div>
    </>
  );
}
