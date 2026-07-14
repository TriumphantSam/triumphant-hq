'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { agencyServices, discoveryCallUrl } from '@/lib/services';
import ServiceIcon from '@/components/marketing/ServiceIcon';

const resources = [
    { href: '/digital-forge', label: 'Digital Forge', description: 'Our practical product-building lab' },
    { href: '/digital-forge/products', label: 'Products', description: 'Playbooks, systems and templates' },
    { href: '/digital-forge/training', label: 'Free Training', description: 'Learn before you invest' },
    { href: '/blog', label: 'Insights', description: 'Practical guides from our team' },
];

export default function Navigation() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    if (pathname.startsWith('/digital-forge/funnel/') || pathname.startsWith('/parent-home-routine')) {
        return null; // Isolate funnel engine pages
    }

    return (
        <nav className="sticky top-0 left-0 right-0 z-[200] bg-white/90 backdrop-blur-xl border-b border-slate-200/80">
            <div className="max-w-[1240px] mx-auto px-5 lg:px-8 h-[76px] flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-[var(--accent-color)] flex items-center justify-center rounded-xl group-hover:bg-[var(--accent-hover)] transition-colors shadow-[0_8px_20px_rgba(7,94,229,0.2)]">
                        <span className="text-white font-black text-lg">T</span>
                    </div>
                    <span className="text-[var(--text-primary)] font-black text-lg tracking-[0.08em] uppercase">
                        TRIUMPHANT<span className="text-[var(--accent-color)]">HQ</span>
                    </span>
                </Link>

                <div className="hidden lg:flex items-center gap-7">
                    <Link href="/" className={`nav-link ${pathname === '/' ? 'nav-link-active' : ''}`}>Home</Link>
                    <div className="relative group">
                        <Link href="/services" className={`nav-link inline-flex items-center gap-1 ${pathname.startsWith('/services') ? 'nav-link-active' : ''}`}>
                            Services
                            <svg className="h-3 w-3 transition-transform group-hover:rotate-180" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                <path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                        <div className="absolute left-1/2 top-full w-[700px] -translate-x-1/2 translate-y-2 pt-5 opacity-0 pointer-events-none transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto z-[250]">
                            <div className="grid grid-cols-2 gap-3.5 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_30px_90px_rgba(15,23,42,0.22)] ring-1 ring-slate-100">
                                {agencyServices.map((service) => (
                                    <Link key={service.slug} href={`/services/${service.slug}`} className="group/item flex gap-3.5 rounded-2xl border border-transparent p-4 transition-all hover:border-blue-100 hover:bg-blue-50">
                                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-blue-100 bg-white text-blue-600 shadow-sm">
                                            <ServiceIcon name={service.icon} className="h-5 w-5" />
                                        </span>
                                        <span>
                                            <span className="flex items-center gap-2 text-sm font-extrabold text-slate-950">
                                                {service.shortTitle}
                                                <span className="text-blue-600 opacity-0 transition-all group-hover/item:translate-x-1 group-hover/item:opacity-100">→</span>
                                            </span>
                                            <span className="mt-1 block text-xs leading-5 text-slate-500">{service.promise}</span>
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Link href="/about" className={`nav-link ${pathname === '/about' ? 'nav-link-active' : ''}`}>About</Link>
                    <Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'nav-link-active' : ''}`}>Work With Us</Link>
                    <div className="relative group">
                        <Link href="/resources" className={`nav-link inline-flex items-center gap-1 ${pathname.startsWith('/resources') || pathname.startsWith('/digital-forge') || pathname.startsWith('/blog') ? 'nav-link-active' : ''}`}>
                            Resources
                            <svg className="h-3 w-3 transition-transform group-hover:rotate-180" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                <path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                        <div className="absolute right-0 top-full w-[370px] translate-y-2 pt-5 opacity-0 pointer-events-none transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto z-[250]">
                            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_30px_90px_rgba(15,23,42,0.22)] ring-1 ring-slate-100">
                                {resources.map((item, index) => (
                                    <Link key={item.href} href={item.href} className="group/item flex gap-3 rounded-2xl border border-transparent p-3.5 transition-all hover:border-blue-100 hover:bg-blue-50">
                                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-xs font-black text-blue-700 transition-colors group-hover/item:bg-blue-600 group-hover/item:text-white">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span>
                                            <span className="block text-sm font-extrabold text-slate-950">{item.label}</span>
                                            <span className="mt-0.5 block text-xs leading-5 text-slate-500">{item.description}</span>
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Link href="/seo-snapshot" className="nav-link text-[var(--accent-color)]">Free SEO Audit</Link>
                    <Link
                        href={discoveryCallUrl}
                        target="_blank"
                        className="button button-primary !min-h-10 !px-4 !py-2 !text-[0.72rem]"
                    >
                        Book a call
                    </Link>
                </div>

                <button
                    type="button"
                    aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    aria-expanded={mobileOpen}
                    className="lg:hidden text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors"
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
                <div className="lg:hidden bg-white border-t border-slate-200 px-5 py-6 max-h-[calc(100vh-76px)] overflow-y-auto">
                    <div className="flex flex-col gap-2">
                        <Link href="/" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Home</Link>
                        <p className="mobile-nav-label">Services</p>
                        {agencyServices.map((service) => (
                            <Link key={service.slug} href={`/services/${service.slug}`} className="mobile-nav-sublink" onClick={() => setMobileOpen(false)}>
                                {service.shortTitle}
                            </Link>
                        ))}
                        <Link href="/about" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>About</Link>
                        <Link href="/contact" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Work With Us</Link>
                        <p className="mobile-nav-label">Resources</p>
                        {resources.map((item) => (
                            <Link key={item.href} href={item.href} className="mobile-nav-sublink" onClick={() => setMobileOpen(false)}>
                                {item.label}
                            </Link>
                        ))}
                        <Link href="/seo-snapshot" className="mobile-nav-link text-[var(--accent-color)]" onClick={() => setMobileOpen(false)}>Free SEO Audit</Link>
                        <a href={discoveryCallUrl} target="_blank" rel="noreferrer" className="button button-primary mt-3" onClick={() => setMobileOpen(false)}>
                            Book a discovery call
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}

