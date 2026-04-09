'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const footerLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Free SEO Audit', href: '/seo-snapshot' },
    { label: 'Digital Forge', href: '/digital-forge' },
    { label: 'Products', href: '/digital-forge/products' },
    { label: 'Free Training', href: '/digital-forge/training' },
    { label: 'Starter System', href: '/digital-forge/system' },
    { label: 'Course', href: '/digital-forge/course' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Refund Policy', href: '/refund-policy' },
];

const services = [
    { label: 'Funnel Engineering', href: '/services' },
    { label: 'SEO Implementation', href: '/seo-implementation' },
    { label: 'AI Data Pipelines', href: '/services' },
    { label: 'Local Tech Support', href: '/services' },
];

export default function Footer() {
    const pathname = usePathname();
    
    if (pathname.startsWith('/digital-forge/funnel/')) {
        return null; // Isolate funnel engine pages
    }

    return (
        <footer className="bg-[#020205] border-t border-white/5 relative overflow-hidden z-20">
            {/* Ambient Deep Background Glow */}
            <div className="absolute left-1/2 -bottom-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-r from-[#3b82f6]/10 to-[#06b6d4]/10 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20 lg:py-28 relative z-10 flex flex-col gap-20">
                
                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8">
                    
                    {/* Brand Column */}
                    <div className="lg:col-span-5 flex flex-col gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#3b82f6] to-[#06b6d4] flex items-center justify-center rounded-[1rem] shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                <span className="text-white font-black text-2xl">T</span>
                            </div>
                            <span className="text-2xl font-black tracking-[0.15em] text-white uppercase">
                                TRIUMPHANT<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] to-[#06b6d4]">HQ</span>
                            </span>
                        </div>
                        <p className="text-gray-400 text-lg font-light leading-relaxed max-w-sm">
                            Building autonomous digital product pipelines and advanced AI architectures since 2017.
                        </p>
                        <div className="flex items-start gap-4 mt-2 group/pin w-fit">
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover/pin:border-[#3b82f6]/50 transition-colors">
                                <svg className="w-4 h-4 text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            </div>
                            <span className="text-sm text-gray-500 font-medium tracking-wide group-hover/pin:text-white transition-colors pt-2">No 4, Kolawole Close, Ibadan</span>
                        </div>
                    </div>

                    {/* Navigation Column */}
                    <div className="lg:col-span-2 lg:col-start-7">
                        <h4 className="text-xs font-black uppercase tracking-[0.15em] text-[#60a5fa] mb-8">
                            Quick Links
                        </h4>
                        <div className="flex flex-col gap-5">
                            {footerLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="group/link text-gray-500 hover:text-white transition-colors flex items-center gap-3 text-sm font-medium"
                                >
                                    <svg className="w-3 h-3 text-white/20 group-hover/link:text-[#3b82f6] transition-all group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Services Column */}
                    <div className="lg:col-span-2">
                        <h4 className="text-xs font-black uppercase tracking-[0.15em] text-[#60a5fa] mb-8">
                            Services
                        </h4>
                        <div className="flex flex-col gap-5">
                            {services.map((s, i) => (
                                <Link
                                    key={i}
                                    href={s.href}
                                    className="group/link text-gray-500 hover:text-white transition-colors flex items-center gap-3 text-sm font-medium"
                                >
                                    <svg className="w-3 h-3 text-white/20 group-hover/link:text-[#3b82f6] transition-all group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                                    {s.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact Column */}
                    <div className="lg:col-span-2">
                        <h4 className="text-xs font-black uppercase tracking-[0.15em] text-[#60a5fa] mb-8">
                            Get in Touch
                        </h4>
                        <div className="flex flex-col gap-4">
                            <a
                                href="mailto:admin@triumphantech.com"
                                className="group flex items-center gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-[#3b82f6]/30 transition-all"
                            >
                                <div className="w-10 h-10 rounded-full bg-black/50 border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#3b82f6]/10 transition-colors">
                                    <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                </div>
                                <span className="text-xs text-gray-400 font-medium group-hover:text-white transition-colors">admin@triumphantech.com</span>
                            </a>
                            <a
                                href="https://wa.me/2348107711190"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-[#3b82f6]/30 transition-all"
                            >
                                <div className="w-10 h-10 rounded-full bg-black/50 border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#3b82f6]/10 transition-colors">
                                    <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                                </div>
                                <span className="text-xs text-gray-400 font-medium group-hover:text-white transition-colors truncate">+234 810 771 1190</span>
                            </a>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
                    <p className="text-sm tracking-wide text-gray-600 font-medium">
                        © {new Date().getFullYear()} Triumphant Technological Services. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-6">
                        <Link href="/privacy-policy" className="text-sm font-medium text-gray-500 hover:text-[#60a5fa] transition-colors">
                            Privacy Policy
                        </Link>
                        <span className="w-1 h-1 rounded-full bg-gray-800"></span>
                        <Link href="/terms" className="text-sm font-medium text-gray-500 hover:text-[#60a5fa] transition-colors">
                            Terms of Service
                        </Link>
                        <span className="w-1 h-1 rounded-full bg-gray-800"></span>
                        <Link href="/refund-policy" className="text-sm font-medium text-gray-500 hover:text-[#60a5fa] transition-colors">
                            Refund Policy
                        </Link>
                        <span className="w-1 h-1 rounded-full bg-gray-800"></span>
                        <Link href="/data-deletion" className="text-sm font-medium text-gray-500 hover:text-[#60a5fa] transition-colors">
                            Data Deletion
                        </Link>
                        <span className="w-1 h-1 rounded-full bg-gray-800 hidden sm:inline-block"></span>
                        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5 w-full sm:w-auto justify-center">
                            <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse"></span>
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Built in Ibadan</span>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
}

