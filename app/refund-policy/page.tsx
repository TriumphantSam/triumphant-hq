'use client';

import { useEffect, useRef, useState } from 'react';

const sections = [
    { id: 'overview',          label: 'Overview',           icon: '📄' },
    { id: 'digital-nature',    label: 'Digital Nature',     icon: '💾' },
    { id: 'eligible-issues',   label: 'Eligible Issues',    icon: '✅' },
    { id: 'how-refunds-work',  label: 'How Refunds Work',  icon: '🔄' },
    { id: 'timeframe',         label: 'Timeframe',          icon: '🕐' },
    { id: 'contact',           label: 'Contact & Support',  icon: '📧' },
];

export default function RefundPolicyPage() {
    const [activeSection, setActiveSection] = useState('overview');
    const [tocOpen, setTocOpen] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { rootMargin: '-20% 0px -70% 0px' }
        );
        sections.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observerRef.current?.observe(el);
        });
        return () => observerRef.current?.disconnect();
    }, []);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTocOpen(false);
    };

    return (
        <div className="min-h-screen" style={{ paddingBottom: '6rem' }}>

            {/* ─── HERO ─── */}
            <section
                className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16 text-center"
                style={{ paddingTop: '8rem', paddingBottom: '3rem', position: 'relative' }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 600,
                        height: 300,
                        background: 'radial-gradient(ellipse, rgba(0,102,255,0.12) 0%, transparent 70%)',
                        pointerEvents: 'none',
                        zIndex: 0,
                    }}
                />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Badge */}
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.4rem 1.2rem',
                            border: '1px solid rgba(0,102,255,0.4)',
                            borderRadius: '2px',
                            background: 'rgba(0,102,255,0.06)',
                            marginBottom: '1.5rem',
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            color: 'var(--accent-color)',
                            fontWeight: 700,
                        }}
                    >
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-color)', display: 'inline-block' }} />
                        Legal Document
                    </div>

                    <h1
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6"
                        style={{ color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em' }}
                    >
                        Refund{' '}
                        <span style={{ color: 'var(--accent-color)' }}>Policy</span>
                    </h1>

                    <p
                        className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        We want every buyer to receive exactly what they paid for. Here is how we handle refunds, replacements, and support for our digital products.
                    </p>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            gap: '0.75rem',
                        }}
                    >
                        {[
                            { label: 'Business', value: 'Triumphant Technological Services' },
                            { label: 'Contact', value: 'admin@triumphantech.com' },
                            { label: 'Last Updated', value: 'April 2026' },
                        ].map((tag) => (
                            <div
                                key={tag.label}
                                className="glass"
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '2px',
                                    fontSize: '0.8rem',
                                    color: 'var(--text-secondary)',
                                }}
                            >
                                <span style={{ color: 'var(--accent-color)', fontWeight: 700 }}>{tag.label}:</span>{' '}
                                {tag.value}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── LAYOUT: TOC + CONTENT ─── */}
            <div
                className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0,1fr)',
                    gap: '2rem',
                    alignItems: 'start',
                }}
            >
                {/* Mobile TOC Toggle */}
                <div className="lg:hidden" style={{ marginBottom: '0.5rem' }}>
                    <button
                        id="toc-toggle"
                        onClick={() => setTocOpen(!tocOpen)}
                        style={{
                            width: '100%',
                            padding: '0.85rem 1.25rem',
                            border: '1px solid var(--glass-border)',
                            background: 'var(--glass-bg)',
                            color: 'var(--text-primary)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                        }}
                    >
                        <span>📑 Table of Contents</span>
                        <span style={{ transition: 'transform 0.3s', transform: tocOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
                    </button>

                    {tocOpen && (
                        <div
                            className="glass"
                            style={{
                                marginTop: '0.5rem',
                                borderRadius: '4px',
                                padding: '0.75rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.25rem',
                            }}
                        >
                            {sections.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => scrollTo(s.id)}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '0.6rem 0.75rem',
                                        borderRadius: '2px',
                                        border: 'none',
                                        background: activeSection === s.id ? 'rgba(0,102,255,0.12)' : 'transparent',
                                        color: activeSection === s.id ? 'var(--accent-color)' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.6rem',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <span>{s.icon}</span> {s.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Desktop two-column layout */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '220px 1fr',
                        gap: '3rem',
                        alignItems: 'start',
                    }}
                    className="hidden-mobile"
                >
                    {/* Sticky TOC — Desktop */}
                    <aside
                        className="hidden lg:block"
                        style={{ position: 'sticky', top: '6rem' }}
                    >
                        <div
                            className="glass"
                            style={{ borderRadius: '4px', padding: '1.25rem 0.75rem' }}
                        >
                            <p
                                style={{
                                    fontSize: '0.65rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.2em',
                                    color: 'var(--text-secondary)',
                                    marginBottom: '0.75rem',
                                    paddingLeft: '0.75rem',
                                }}
                            >
                                Contents
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                {sections.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => scrollTo(s.id)}
                                        style={{
                                            width: '100%',
                                            textAlign: 'left',
                                            padding: '0.55rem 0.75rem',
                                            borderRadius: '2px',
                                            border: 'none',
                                            borderLeft: activeSection === s.id ? '2px solid var(--accent-color)' : '2px solid transparent',
                                            background: activeSection === s.id ? 'rgba(0,102,255,0.1)' : 'transparent',
                                            color: activeSection === s.id ? 'var(--accent-color)' : 'var(--text-secondary)',
                                            cursor: 'pointer',
                                            fontSize: '0.78rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.2s ease',
                                            fontWeight: activeSection === s.id ? 600 : 400,
                                        }}
                                    >
                                        <span style={{ opacity: 0.7 }}>{s.icon}</span>
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* ─── MAIN CONTENT ─── */}
                    <main>
                        <PolicySection id="overview" icon="📄" title="Overview">
                            <p>
                                Due to the digital nature of our products, <strong style={{ color: '#fff' }}>all sales are generally final</strong> once access or download has been delivered. This is consistent with standard practice for digital goods.
                            </p>
                            <p>
                                However, we stand behind our products. If you experience a genuine issue with your purchase — such as failed delivery, broken files, or a technical problem that prevents you from accessing what you paid for — we will take action to make it right.
                            </p>
                            <InfoBox>
                                Our goal is simple: you should receive exactly what was described at the point of purchase. If that does not happen, contact us and we will resolve it.
                            </InfoBox>
                        </PolicySection>

                        <PolicySection id="digital-nature" icon="💾" title="Digital Products Are Non-Refundable Once Delivered">
                            <p>
                                Once a digital product has been delivered — whether through direct download, an email link, an access page, or any other electronic method — the transaction is considered complete.
                            </p>
                            <p>
                                We are unable to accept refund requests based on:
                            </p>
                            <ul style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {[
                                    'A change of mind after delivery.',
                                    'Not having reviewed the product description thoroughly before purchase.',
                                    'Dissatisfaction with results, as outcomes depend on your own effort and execution.',
                                    'Finding a similar product at a lower price elsewhere.',
                                    'Not having the technical skills expected to use the product.',
                                ].map((item, i) => (
                                    <li
                                        key={i}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '0.75rem',
                                            fontSize: '0.95rem',
                                            color: 'var(--text-secondary)',
                                            lineHeight: 1.65,
                                        }}
                                    >
                                        <span style={{
                                            marginTop: '0.3rem',
                                            flexShrink: 0,
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            background: 'rgba(245,158,11,0.6)',
                                            display: 'inline-block',
                                        }} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </PolicySection>

                        <PolicySection id="eligible-issues" icon="✅" title="What We Will Always Resolve">
                            <p>
                                If you experience any of the following, contact us immediately and we will investigate and resolve it promptly:
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                                {[
                                    {
                                        icon: '🗂️',
                                        title: 'Broken or Corrupted Files',
                                        desc: 'The product file you received is unreadable, incomplete, or damaged in a way that prevents normal use.',
                                    },
                                    {
                                        icon: '📬',
                                        title: 'Failed Delivery',
                                        desc: 'You completed payment but never received access, a download link, or the product via email.',
                                    },
                                    {
                                        icon: '💳',
                                        title: 'Duplicate Charge',
                                        desc: 'You were charged more than once for the same product due to a technical payment error.',
                                    },
                                    {
                                        icon: '🔒',
                                        title: 'Access Denied After Payment',
                                        desc: 'You paid successfully but are blocked from accessing the product page, platform, or download — despite having valid purchase confirmation.',
                                    },
                                ].map((item) => (
                                    <EligibleCard key={item.title} icon={item.icon} title={item.title} desc={item.desc} />
                                ))}
                            </div>
                        </PolicySection>

                        <PolicySection id="how-refunds-work" icon="🔄" title="How We Handle Eligible Issues">
                            <p>
                                When you contact us with a verifiable issue, here is what happens:
                            </p>
                            <div
                                style={{
                                    marginTop: '1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.6rem',
                                }}
                            >
                                {[
                                    { step: '01', label: 'We investigate', detail: 'We review your purchase details and confirm the reported issue.' },
                                    { step: '02', label: 'We attempt to resolve', detail: 'We will first try to fix the issue — replacing broken files, resending access, or correcting the delivery.' },
                                    { step: '03', label: 'If unresolvable', detail: 'If the issue cannot be corrected within a reasonable time, we will offer a replacement product or a refund at our discretion.' },
                                    { step: '04', label: 'Refund processing', detail: 'Approved refunds are processed back to your original payment method through Lemon Squeezy, our payment processor.' },
                                ].map((item) => (
                                    <div
                                        key={item.step}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '1rem',
                                            padding: '0.85rem 1rem',
                                            borderRadius: '4px',
                                            border: '1px solid var(--glass-border)',
                                            background: 'rgba(0,102,255,0.03)',
                                        }}
                                    >
                                        <span
                                            style={{
                                                flexShrink: 0,
                                                padding: '0.2rem 0.6rem',
                                                background: 'rgba(0,102,255,0.15)',
                                                border: '1px solid rgba(0,102,255,0.3)',
                                                borderRadius: '2px',
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                color: 'var(--accent-color)',
                                                letterSpacing: '0.05em',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {item.step}
                                        </span>
                                        <div>
                                            <p style={{ color: '#fff !important', fontWeight: 700, fontSize: '0.9rem !important', marginBottom: '0.2rem !important' }}>
                                                <span style={{ color: '#fff', fontWeight: 700 }}>{item.label}</span>
                                            </p>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '0 !important' }}>
                                                {item.detail}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <InfoBox type="warning">
                                Refunds are granted at our discretion, on a case-by-case basis. We reserve the right to decline requests that do not meet the eligibility criteria above or where abuse of our policy is suspected.
                            </InfoBox>
                        </PolicySection>

                        <PolicySection id="timeframe" icon="🕐" title="Response Timeframe">
                            <p>
                                We aim to respond to all support and refund-related inquiries within <strong style={{ color: '#fff' }}>2–5 business days</strong>.
                            </p>
                            <p>
                                Complex cases may take slightly longer, but we will acknowledge your request within 24–48 hours and keep you updated throughout the process.
                            </p>
                            <div
                                style={{
                                    marginTop: '1.25rem',
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                                    gap: '0.75rem',
                                }}
                            >
                                {[
                                    { icon: '📨', label: 'Acknowledgement', value: 'Within 24–48 hrs' },
                                    { icon: '🔍', label: 'Investigation', value: 'Up to 3 business days' },
                                    { icon: '✅', label: 'Resolution', value: 'Within 2–5 business days' },
                                    { icon: '💸', label: 'Refund Processing', value: 'Via Lemon Squeezy (varies by bank)' },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="glass"
                                        style={{
                                            padding: '1rem',
                                            borderRadius: '4px',
                                            fontSize: '0.82rem',
                                        }}
                                    >
                                        <span style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.4rem' }}>{item.icon}</span>
                                        <p style={{ color: 'var(--accent-color) !important', fontWeight: 700, fontSize: '0.75rem !important', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem !important' }}>
                                            <span style={{ color: 'var(--accent-color)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</span>
                                        </p>
                                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0 !important' }}>
                                            {item.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </PolicySection>

                        <PolicySection id="contact" icon="📧" title="Contact & Support" isLast>
                            <p>
                                To request support or submit a refund request, email us with the following information:
                            </p>
                            <ul style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {[
                                    'Your full name and email address used at purchase.',
                                    'Your order or transaction ID (from your confirmation email).',
                                    'A clear description of the issue you experienced.',
                                    'Any screenshots or error messages that help explain the problem.',
                                ].map((item, i) => (
                                    <li
                                        key={i}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '0.75rem',
                                            fontSize: '0.95rem',
                                            color: 'var(--text-secondary)',
                                            lineHeight: 1.65,
                                        }}
                                    >
                                        <span
                                            style={{
                                                marginTop: '0.25rem',
                                                flexShrink: 0,
                                                width: 20,
                                                height: 20,
                                                borderRadius: '50%',
                                                background: 'rgba(0,102,255,0.15)',
                                                border: '1px solid rgba(0,102,255,0.4)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.65rem',
                                                color: 'var(--accent-color)',
                                                fontWeight: 700,
                                            }}
                                        >
                                            {i + 1}
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                                    gap: '1rem',
                                    marginTop: '1.5rem',
                                }}
                            >
                                {[
                                    {
                                        icon: '📧',
                                        label: 'Refund & Support Email',
                                        value: 'admin@triumphantech.com',
                                        href: 'mailto:admin@triumphantech.com',
                                    },
                                    {
                                        icon: '📍',
                                        label: 'Office',
                                        value: 'Global Operations',
                                        href: undefined,
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="glass glass-hover"
                                        style={{
                                            padding: '1.5rem',
                                            borderRadius: '4px',
                                            borderTop: '3px solid var(--accent-color)',
                                        }}
                                    >
                                        <div style={{ fontSize: '1.75rem', marginBottom: '0.6rem' }}>{item.icon}</div>
                                        <p
                                            style={{
                                                fontSize: '0.65rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.15em',
                                                color: 'var(--accent-color)',
                                                fontWeight: 700,
                                                marginBottom: '0.4rem',
                                            }}
                                        >
                                            {item.label}
                                        </p>
                                        {item.href ? (
                                            <a
                                                href={item.href}
                                                style={{
                                                    color: 'var(--text-secondary)',
                                                    textDecoration: 'none',
                                                    fontSize: '0.9rem',
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                {item.value}
                                            </a>
                                        ) : (
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                                {item.value}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </PolicySection>
                    </main>
                </div>
            </div>

            <style>{`
                @media (min-width: 1024px) {
                    .hidden-mobile { display: grid !important; }
                }
                @media (max-width: 1023px) {
                    .hidden-mobile > aside { display: none !important; }
                    .hidden-mobile { display: block !important; }
                }
                .policy-section {
                    scroll-margin-top: 6rem;
                    padding-bottom: 2.5rem;
                    margin-bottom: 2.5rem;
                    border-bottom: 1px solid rgba(0,102,255,0.1);
                    animation: fadeInUp 0.5s ease both;
                }
                .policy-section:last-child {
                    border-bottom: none;
                    margin-bottom: 0;
                    padding-bottom: 0;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .policy-section p {
                    color: var(--text-secondary);
                    line-height: 1.8;
                    font-size: 0.96rem;
                    margin-bottom: 0.75rem;
                }
                .policy-section p:last-child { margin-bottom: 0; }
            `}</style>
        </div>
    );
}

/* ─── Sub-components ─── */

function PolicySection({
    id,
    icon,
    title,
    children,
    isLast = false,
}: {
    id: string;
    icon: string;
    title: string;
    children: React.ReactNode;
    isLast?: boolean;
}) {
    return (
        <section id={id} className="policy-section" style={isLast ? { borderBottom: 'none' } : {}}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
                <div
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: '4px',
                        background: 'rgba(0,102,255,0.1)',
                        border: '1px solid rgba(0,102,255,0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                        flexShrink: 0,
                    }}
                >
                    {icon}
                </div>
                <h2
                    style={{
                        fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                        fontWeight: 700,
                        color: '#fff',
                        letterSpacing: '-0.01em',
                    }}
                >
                    {title}
                </h2>
            </div>
            <div style={{ paddingLeft: '0.25rem' }}>{children}</div>
        </section>
    );
}

function EligibleCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1rem 1.25rem',
                borderRadius: '4px',
                border: '1px solid rgba(0,204,102,0.2)',
                background: 'rgba(0,204,102,0.03)',
                transition: 'border-color 0.25s ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,204,102,0.4)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,204,102,0.2)')}
        >
            <span style={{ fontSize: '1.4rem', flexShrink: 0, marginTop: '0.1rem' }}>{icon}</span>
            <div>
                <p style={{ color: 'var(--accent-color) !important', fontWeight: 700, fontSize: '0.9rem !important', marginBottom: '0.25rem !important' }}>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{title}</span>
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '0 !important' }}>
                    {desc}
                </p>
            </div>
        </div>
    );
}

function InfoBox({ children, type = 'info' }: { children: React.ReactNode; type?: 'info' | 'warning' }) {
    const color = type === 'warning' ? '#F59E0B' : 'var(--secondary-color)';
    return (
        <div
            style={{
                marginTop: '1rem',
                padding: '1rem 1.25rem',
                borderRadius: '4px',
                borderLeft: `3px solid ${color}`,
                background: type === 'warning' ? 'rgba(245,158,11,0.06)' : 'rgba(0,204,255,0.06)',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.75,
            }}
        >
            {children}
        </div>
    );
}
