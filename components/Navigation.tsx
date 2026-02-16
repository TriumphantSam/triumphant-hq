'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/tech-diary', label: 'Tech Diary' },
    { href: '/about', label: 'About' },
];

export default function Navigation() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${mobileOpen ? 'bg-[#050510]' : 'bg-[#050510]/80 backdrop-blur-md border-b border-[#0066FF]/20'
                }`}
        >
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo - Industrial/Tech */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-[#0066FF] flex items-center justify-center rounded-sm group-hover:bg-[#00CCFF] transition-colors shadow-[0_0_15px_rgba(0,102,255,0.3)]">
                        <span className="text-white font-bold text-xl">T</span>
                    </div>
                    <span
                        className="text-white font-bold text-xl tracking-wider uppercase"
                    >
                        TRIUMPHANT<span className="text-[#0066FF]">HQ</span>
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-semibold tracking-widest uppercase transition-colors hover:text-[#00CCFF] ${pathname === link.href ? 'text-[#0066FF]' : 'text-gray-400'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/contact"
                        className="px-6 py-2 border border-[#0066FF] text-[#0066FF] text-sm font-bold tracking-wider uppercase hover:bg-[#0066FF] hover:text-white transition-all shadow-[0_0_10px_rgba(0,102,255,0.15)] hover:shadow-[0_0_20px_rgba(0,102,255,0.4)]"
                        style={{ borderRadius: '2px' }}
                    >
                        Contact
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white hover:text-[#0066FF] transition-colors"
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

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden bg-[#050510] border-t border-[#0066FF]/20 px-6 py-8 h-screen">
                    <div className="flex flex-col gap-6">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-lg font-semibold tracking-wide uppercase ${pathname === link.href ? 'text-[#0066FF]' : 'text-gray-400'
                                    }`}
                                onClick={() => setMobileOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/contact"
                            className="inline-block text-center px-6 py-3 border border-[#0066FF] text-[#0066FF] font-bold tracking-wider uppercase hover:bg-[#0066FF] hover:text-white transition-all"
                            onClick={() => setMobileOpen(false)}
                            style={{ borderRadius: '2px' }}
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
