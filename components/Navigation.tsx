'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/tech-diary', label: 'Tech Diary' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

export default function Navigation() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                background: 'rgba(10, 10, 20, 0.75)',
                borderBottom: '1px solid var(--glass-border)',
            }}
        >
            <div
                style={{
                    maxWidth: 1200,
                    margin: '0 auto',
                    padding: '0 clamp(1rem, 3vw, 2rem)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: 64,
                }}
            >
                {/* Logo */}
                <Link
                    href="/"
                    style={{
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                >
                    <span
                        style={{
                            fontSize: '1.35rem',
                            fontWeight: 800,
                            letterSpacing: '0.15em',
                            color: 'var(--accent-color)',
                        }}
                    >
                        TRIUMPHANT
                    </span>
                    <span
                        style={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            padding: '0.15rem 0.5rem',
                            borderRadius: '0.25rem',
                            border: '1px solid var(--accent-color)',
                            color: 'var(--accent-color)',
                            letterSpacing: '0.1em',
                        }}
                    >
                        HQ
                    </span>
                </Link>

                {/* Desktop links */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                    }}
                    className="desktop-nav"
                >
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    textDecoration: 'none',
                                    padding: '0.45rem 1rem',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.9rem',
                                    fontWeight: isActive ? 600 : 400,
                                    color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)',
                                    background: isActive ? 'rgba(0, 255, 136, 0.08)' : 'transparent',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Mobile hamburger */}
                <button
                    className="mobile-nav-btn"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                    style={{
                        display: 'none', /* shown via CSS media query */
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        color: 'var(--text-primary)',
                    }}
                >
                    {mobileOpen ? (
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div
                    className="mobile-nav-menu"
                    style={{
                        padding: '0.5rem clamp(1rem, 3vw, 2rem) 1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
                        borderTop: '1px solid var(--glass-border)',
                        background: 'rgba(10, 10, 20, 0.95)',
                    }}
                >
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                style={{
                                    textDecoration: 'none',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0.5rem',
                                    fontSize: '1rem',
                                    fontWeight: isActive ? 600 : 400,
                                    color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)',
                                    background: isActive ? 'rgba(0, 255, 136, 0.08)' : 'transparent',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Responsive CSS */}
            <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-nav-menu { display: none !important; }
        }
      `}</style>
        </nav>
    );
}
