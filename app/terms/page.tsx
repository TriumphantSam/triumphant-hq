'use client';

import { useEffect, useRef, useState } from 'react';

const sections = [
    { id: 'overview',            label: 'Overview',               icon: '📄' },
    { id: 'products',            label: 'Products',               icon: '📦' },
    { id: 'license',             label: 'License',                icon: '🔑' },
    { id: 'delivery',            label: 'Delivery',               icon: '📬' },
    { id: 'results-disclaimer',  label: 'Results Disclaimer',     icon: '⚠️' },
    { id: 'intellectual-property', label: 'Intellectual Property', icon: '🏛️' },
    { id: 'acceptable-use',      label: 'Acceptable Use',         icon: '✅' },
    { id: 'liability',           label: 'Limitation of Liability', icon: '⚖️' },
    { id: 'contact',             label: 'Contact',                icon: '📧' },
];

export default function TermsPage() {
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
                        Terms of{' '}
                        <span style={{ color: 'var(--accent-color)' }}>Service</span>
                    </h1>

                    <p
                        className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        These terms govern your use of this website and the purchase of digital products from Triumphant Technological Services.
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
                                These Terms of Service govern your use of this website and the purchase of digital products offered by{' '}
                                <strong style={{ color: 'var(--accent-color)' }}>Triumphant Technological Services</strong>{' '}
                                (also trading as <strong>Triumphanttech</strong>), a digital products and technology services business based in Ibadan, Nigeria.
                            </p>
                            <p>
                                By purchasing or accessing our products, you agree to be bound by these terms. If you do not agree, please do not use our website or purchase our products.
                            </p>
                            <InfoBox>
                                For questions about these terms, contact us at{' '}
                                <a href="mailto:admin@triumphantech.com" style={{ color: 'var(--secondary-color)', textDecoration: 'none' }}>
                                    admin@triumphantech.com
                                </a>.
                            </InfoBox>
                        </PolicySection>

                        <PolicySection id="products" icon="📦" title="Products">
                            <p>
                                We sell digital products including but not limited to:
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                                {[
                                    { icon: '📘', title: 'Ebooks & Guides', desc: 'Practical written materials covering digital business, AI tools, and growth systems.' },
                                    { icon: '🗂️', title: 'Templates & Prompt Packs', desc: 'Ready-to-use document templates, workflow blueprints, and curated AI prompt libraries.' },
                                    { icon: '📊', title: 'Worksheets & Toolkits', desc: 'Structured worksheets, planning tools, and bundled resource kits.' },
                                    { icon: '🎓', title: 'Online Training & Courses', desc: 'Digital learning programs, video training, and step-by-step curriculum materials.' },
                                ].map((item) => (
                                    <DataCard key={item.title} icon={item.icon} title={item.title} desc={item.desc} />
                                ))}
                            </div>
                        </PolicySection>

                        <PolicySection id="license" icon="🔑" title="License">
                            <p>
                                Unless otherwise stated at the point of purchase, each product comes with a{' '}
                                <strong style={{ color: 'var(--secondary-color)' }}>non-exclusive, non-transferable license</strong>{' '}
                                for personal or internal business use only.
                            </p>
                            <InfoBox type="warning">
                                You may <strong>not</strong> resell, redistribute, sublicense, publicly share, or present our products as your own, in whole or in part. Products explicitly marked as &quot;commercial licence&quot; are exempt where stated.
                            </InfoBox>
                            <p style={{ marginTop: '1rem' }}>
                                This license is granted to the individual purchaser only and is not transferable to third parties.
                            </p>
                        </PolicySection>

                        <PolicySection id="delivery" icon="📬" title="Delivery">
                            <p>
                                All products are delivered digitally through one or more of the following methods:
                            </p>
                            <div
                                style={{
                                    marginTop: '1rem',
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                                    gap: '0.75rem',
                                }}
                            >
                                {[
                                    { icon: '⬇️', label: 'Direct Download' },
                                    { icon: '📧', label: 'Email Delivery' },
                                    { icon: '🔗', label: 'Access Page / Link' },
                                    { icon: '🖥️', label: 'Digital Platform Access' },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="glass"
                                        style={{
                                            padding: '0.85rem 1rem',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.6rem',
                                            fontSize: '0.82rem',
                                            color: 'var(--text-secondary)',
                                        }}
                                    >
                                        <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                            <p style={{ marginTop: '1rem' }}>
                                The specific delivery method will be described at the point of purchase. If you do not receive access within the expected timeframe, contact us immediately at{' '}
                                <a href="mailto:admin@triumphantech.com" style={{ color: 'var(--secondary-color)', textDecoration: 'none' }}>
                                    admin@triumphantech.com
                                </a>.
                            </p>
                        </PolicySection>

                        <PolicySection id="results-disclaimer" icon="⚠️" title="Results Disclaimer">
                            <p>
                                Our digital products are educational and practical in nature. We do not guarantee specific business, financial, or performance outcomes from using our products.
                            </p>
                            <p>
                                Results will vary based on your individual effort, execution, existing skills, market conditions, and other external factors entirely outside our control.
                            </p>
                            <InfoBox type="warning">
                                Any income figures, case studies, or success examples referenced in our marketing materials are illustrative and not guarantees of the results you will achieve.
                            </InfoBox>
                        </PolicySection>

                        <PolicySection id="intellectual-property" icon="🏛️" title="Intellectual Property">
                            <p>
                                All content, materials, branding, templates, documents, written materials, videos, graphics, and digital assets available through this website are the intellectual property of{' '}
                                <strong style={{ color: 'var(--accent-color)' }}>Triumphant Technological Services</strong>{' '}
                                unless explicitly stated otherwise.
                            </p>
                            <p>
                                Your purchase grants you a usage license as described above. It does not transfer ownership of the underlying intellectual property.
                            </p>
                        </PolicySection>

                        <PolicySection id="acceptable-use" icon="✅" title="Acceptable Use">
                            <p>By using this website and purchasing our products, you agree to:</p>
                            <ul style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {[
                                    'Use our products only for lawful personal or internal business purposes.',
                                    'Not reproduce, share, or distribute our products without explicit written permission.',
                                    'Not use our materials to create competing products without a valid commercial licence.',
                                    'Not engage in fraud, misrepresentation, or abuse of our refund or support processes.',
                                    'Respect applicable laws in your jurisdiction when using our products.',
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
                        </PolicySection>

                        <PolicySection id="liability" icon="⚖️" title="Limitation of Liability">
                            <p>
                                To the maximum extent permitted by applicable law, Triumphant Technological Services shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from:
                            </p>
                            <ul style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {[
                                    'Your use of or inability to use our products or website.',
                                    'Any errors, omissions, or inaccuracies in our products.',
                                    'Business decisions made based on information in our products.',
                                    'Unauthorised access to or alteration of your data.',
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
                                            background: 'rgba(0,102,255,0.5)',
                                            display: 'inline-block',
                                        }} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p style={{ marginTop: '1rem' }}>
                                Our total liability to you for any claim arising from these terms shall not exceed the amount you paid for the specific product giving rise to the claim.
                            </p>
                        </PolicySection>

                        <PolicySection id="contact" icon="📧" title="Contact" isLast>
                            <p className="mb-6">
                                For questions about these Terms of Service, or for support related to your purchase, contact us:
                            </p>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                                    gap: '1rem',
                                }}
                            >
                                {[
                                    {
                                        icon: '📧',
                                        label: 'Email',
                                        value: 'admin@triumphantech.com',
                                        href: 'mailto:admin@triumphantech.com',
                                    },
                                    {
                                        icon: '📍',
                                        label: 'Office',
                                        value: 'No 4, Kolawole Close, Ibadan, Nigeria',
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

function DataCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1rem 1.25rem',
                borderRadius: '4px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(0,102,255,0.03)',
                transition: 'border-color 0.25s ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,102,255,0.4)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)')}
        >
            <span style={{ fontSize: '1.4rem', flexShrink: 0, marginTop: '0.1rem' }}>{icon}</span>
            <div>
                <p style={{ color: 'var(--accent-color) !important', fontWeight: 700, fontSize: '0.9rem !important', marginBottom: '0.25rem !important' }}>
                    <span style={{ color: 'var(--accent-color)', fontWeight: 700, fontSize: '0.9rem' }}>{title}</span>
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
