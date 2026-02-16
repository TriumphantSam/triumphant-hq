'use client';

import { useState } from 'react';

/* ──────────────── DATA ──────────────── */

type ServiceCategory = 'local' | 'digital';

const categories: { key: ServiceCategory; label: string; description: string }[] = [
    { key: 'local', label: '🏪 Local & Essential', description: 'In-person support for everyday tech needs in Ibadan and beyond.' },
    { key: 'digital', label: '🚀 Digital & Professional', description: 'Advanced solutions to grow your online presence and leverage modern technology.' },
];

const services: Record<ServiceCategory, { icon: string; title: string; color: string; badge?: string; description: string; features: string[] }[]> = {
    local: [
        {
            icon: '🆔', title: 'NIMC Registration', color: '#0066FF',
            description: 'Fast and accurate National Identity Number (NIN) registration and enrollment services.',
            features: ['New NIN enrollment', 'NIN modification & updates', 'NIN slip printing', 'Expert guidance through the process'],
        },
        {
            icon: '🎓', title: 'School Registrations', color: '#00CCFF',
            description: 'Hassle-free registration for JAMB, WAEC, NECO, and other educational portals.',
            features: ['JAMB registration & profile creation', 'WAEC/NECO registration', 'Result checking & verification', 'Portal troubleshooting'],
        },
        {
            icon: '💻', title: 'Internet Services', color: '#3385FF',
            description: 'Document typing, printing, scanning, and general internet assistance.',
            features: ['Document typing & formatting', 'Printing & scanning', 'Email setup & support', 'Online form filling'],
        },
    ],
    digital: [
        {
            icon: '📈', title: 'SEO & Website Management', color: '#0066FF',
            badge: '40% Organic Traffic Increase',
            description: 'Proven strategies to increase your online visibility and drive organic growth.',
            features: ['Keyword research & optimization', 'On-page & technical SEO', 'Content strategy development', 'WordPress setup & maintenance', 'Performance monitoring & reporting'],
        },
        {
            icon: '🤖', title: 'AI Data Consulting', color: '#00CCFF',
            description: 'Human-in-the-Loop data services to ensure your AI models are accurate and reliable.',
            features: ['Data annotation & labeling', 'AI output evaluation & testing', 'Quality assurance for ML models', 'Prompt engineering & optimization', 'Training data accuracy consulting'],
        },
        {
            icon: '🔧', title: 'Technical Support', color: '#00A3CC',
            description: 'Expert troubleshooting and support for hardware, software, and system issues.',
            features: ['HP printer setup & troubleshooting', 'Microsoft 365 support', 'Hardware diagnostics & repair', 'Software installation & configuration', 'Remote & on-site support'],
        },
        {
            icon: '⚡', title: 'AI-Enhanced Productivity', color: '#3385FF',
            description: 'Leverage modern AI tools to streamline your business workflows and save time.',
            features: ['AI tool integration & training', 'Workflow automation consulting', 'Custom AI solution recommendations', 'Team training on AI productivity tools'],
        },
    ],
};

/* ──────────────── COMPONENT ──────────────── */

export default function ServicesPage() {
    const [activeCategory, setActiveCategory] = useState<ServiceCategory>('local');

    return (
        <div className="min-h-screen">
            {/* ===================== HERO ===================== */}
            <section
                className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16"
                style={{ paddingTop: '5rem', paddingBottom: '3rem', textAlign: 'center' }}
            >
                <p
                    className="uppercase tracking-widest text-sm font-semibold mb-4"
                    style={{ color: 'var(--accent-color)', letterSpacing: '0.25em' }}
                >
                    Our Services
                </p>
                <h1
                    className="gradient-text"
                    style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem' }}
                >
                    Comprehensive Tech Solutions
                </h1>
                <p
                    style={{ fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}
                >
                    From essential local tech support to advanced digital growth strategies, we provide end-to-end solutions for individuals and businesses.
                </p>
            </section>

            {/* ===================== CATEGORY TABS ===================== */}
            <section
                className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16"
                style={{ paddingBottom: '1rem' }}
            >
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                    {categories.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => setActiveCategory(cat.key)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '2px',
                                border: `1px solid ${activeCategory === cat.key ? 'var(--accent-color)' : 'var(--glass-border)'}`,
                                background: activeCategory === cat.key ? 'rgba(0, 102, 255, 0.15)' : 'var(--glass-bg)',
                                color: activeCategory === cat.key ? 'var(--accent-color)' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
                    {categories.find(c => c.key === activeCategory)?.description}
                </p>
            </section>

            {/* ===================== SERVICE CARDS ===================== */}
            <section
                className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16"
                style={{ paddingBottom: '5rem' }}
            >
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '1.5rem',
                    }}
                >
                    {services[activeCategory].map((service, i) => (
                        <div
                            key={`${activeCategory}-${i}`}
                            className="glass glass-hover rounded-sm"
                            style={{
                                padding: 'clamp(1.5rem, 3vw, 2rem)',
                                borderLeft: `4px solid ${service.color}`,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            }}
                        >
                            {/* Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ fontSize: '2rem' }}>{service.icon}</span>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: service.color }}>
                                    {service.title}
                                </h3>
                            </div>

                            {/* Badge */}
                            {service.badge && (
                                <div
                                    style={{
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: '2px',
                                        background: `${service.color}15`,
                                        border: `1px solid ${service.color}40`,
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        color: service.color,
                                    }}
                                >
                                    ✨ {service.badge}
                                </div>
                            )}

                            {/* Description */}
                            <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                {service.description}
                            </p>

                            {/* Features */}
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: 'auto' }}>
                                {service.features.map((f, j) => (
                                    <li
                                        key={j}
                                        style={{
                                            fontSize: '0.85rem',
                                            color: 'var(--text-secondary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                        }}
                                    >
                                        <span style={{ color: service.color, fontSize: '0.75rem' }}>✓</span> {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===================== CTA ===================== */}
            <section
                className="max-w-screen-lg mx-auto px-6 sm:px-10 lg:px-16"
                style={{ paddingBottom: '6rem', textAlign: 'center' }}
            >
                <div
                    className="glass rounded-lg border border-[#0066FF]/30"
                    style={{ padding: 'clamp(2rem, 5vw, 3.5rem)', position: 'relative', overflow: 'hidden' }}
                >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, var(--accent-color), var(--secondary-color))' }} />
                    <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, marginBottom: '0.75rem', color: '#fff' }}>
                        Ready to Get Started?
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto 2rem', lineHeight: 1.7 }}>
                        Whether you need local tech support or professional digital services, we are here to help you succeed.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a
                            href="/contact"
                            style={{
                                display: 'inline-block', padding: '0.9rem 2.5rem', fontSize: '0.9rem', fontWeight: 700,
                                textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '2px',
                                background: 'var(--accent-color)', color: '#fff', textDecoration: 'none',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                            onMouseEnter={(e) => { (e.target as HTMLElement).style.transform = 'translateY(-2px)'; (e.target as HTMLElement).style.boxShadow = '0 0 20px rgba(0, 102, 255, 0.4)'; }}
                            onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = 'translateY(0)'; (e.target as HTMLElement).style.boxShadow = 'none'; }}
                        >
                            Contact Us
                        </a>
                        <a
                            href="https://wa.me/2348107711190"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-block', padding: '0.9rem 2.5rem', fontSize: '0.9rem', fontWeight: 700,
                                textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '2px',
                                background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-primary)',
                                textDecoration: 'none', transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => { (e.target as HTMLElement).style.borderColor = 'var(--secondary-color)'; (e.target as HTMLElement).style.color = 'var(--secondary-color)'; }}
                            onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = 'var(--glass-border)'; (e.target as HTMLElement).style.color = 'var(--text-primary)'; }}
                        >
                            WhatsApp Us
                        </a>
                    </div>
                </div>

                {/* Location */}
                <p style={{ marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    📍 Visit us at: No 4, Kolawole Close, Ibadan, Nigeria
                </p>
            </section>
        </div>
    );
}
