'use client';

import { useEffect, useRef, useState } from 'react';

const sections = [
    { id: 'who-we-are', label: 'Who We Are', icon: '🏢' },
    { id: 'consent', label: 'Consent', icon: '✅' },
    { id: 'information-we-collect', label: 'Information We Collect', icon: '📋' },
    { id: 'how-we-use', label: 'How We Use Your Information', icon: '⚙️' },
    { id: 'log-files', label: 'Log Files', icon: '📁' },
    { id: 'cookies', label: 'Cookies & Tracking', icon: '🍪' },
    { id: 'data-sharing', label: 'Data Sharing', icon: '🔗' },
    { id: 'data-retention', label: 'Data Retention & Security', icon: '🔒' },
    { id: 'your-rights', label: 'Your Data Rights', icon: '⚖️' },
    { id: 'childrens-privacy', label: "Children's Privacy", icon: '👶' },
    { id: 'policy-changes', label: 'Policy Changes', icon: '📝' },
    { id: 'contact-us', label: 'Contact Us', icon: '📬' },
];

export default function PrivacyPolicyPage() {
    const [activeSection, setActiveSection] = useState('who-we-are');
    const [tocOpen, setTocOpen] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
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
                {/* Decorative glow blob */}
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
                        Privacy{' '}
                        <span style={{ color: 'var(--accent-color)' }}>Policy</span>
                    </h1>

                    <p
                        className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        How Triumphant Technological Services collects, uses, and protects your personal information.
                    </p>

                    {/* Meta tags */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            gap: '0.75rem',
                        }}
                    >
                        {[
                            { label: 'Effective Date', value: '2019' },
                            { label: 'Jurisdiction', value: 'Global Standards (incl. GDPR)' },
                            { label: 'Last Updated', value: 'March 2026' },
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
                        style={{
                            position: 'sticky',
                            top: '6rem',
                        }}
                    >
                        <div
                            className="glass"
                            style={{
                                borderRadius: '4px',
                                padding: '1.25rem 0.75rem',
                            }}
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
                        <PolicySection id="who-we-are" icon="🏢" title="Who We Are">
                            <p>
                                At <strong style={{ color: 'var(--accent-color)' }}>Triumphant Technological Services</strong> (also trading as <strong>Triumphanttech</strong>), the privacy of our visitors and clients is a top priority. This Privacy Policy outlines the types of personal information we collect and how we use, store, and protect that information.
                            </p>
                            <p>
                                If you have questions about this policy or need further information, contact us at{' '}
                                <a href="mailto:admin@triumphantech.com" style={{ color: 'var(--secondary-color)', textDecoration: 'none' }}>
                                    admin@triumphantech.com
                                </a>.
                            </p>
                            <InfoBox>
                                This Policy applies exclusively to information collected through our website and digital platforms. It does not apply to data collected offline or through third-party channels.
                            </InfoBox>
                        </PolicySection>

                        <PolicySection id="consent" icon="✅" title="Consent">
                            <p>
                                By using our website or engaging the services of Triumphant Technological Services, you consent to this Privacy Policy and agree to its terms.
                            </p>
                        </PolicySection>

                        <PolicySection id="information-we-collect" icon="📋" title="Information We Collect">
                            <p>
                                Triumphanttech may collect and process the following types of information:
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                                {[
                                    {
                                        icon: '👤',
                                        title: 'Personal Identification Information',
                                        desc: 'Name, email address, phone number, company name, and address.',
                                    },
                                    {
                                        icon: '💻',
                                        title: 'Technical Information',
                                        desc: 'IP address, browser type, operating system, device ID, and site usage data.',
                                    },
                                    {
                                        icon: '📊',
                                        title: 'Business Information',
                                        desc: 'Service request data, project details, and other information relevant to our tech services.',
                                    },
                                    {
                                        icon: '💬',
                                        title: 'Communication Data',
                                        desc: 'Feedback, inquiries, and correspondence you send to us.',
                                    },
                                ].map((item) => (
                                    <DataCard key={item.title} icon={item.icon} title={item.title} desc={item.desc} />
                                ))}
                            </div>
                            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                All information requested will be specified at the point of collection.
                            </p>
                        </PolicySection>

                        <PolicySection id="how-we-use" icon="⚙️" title="How We Use Your Information">
                            <p>Triumphant Technological Services uses collected data to:</p>
                            <ul style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {[
                                    'Provide, maintain, and improve our services and digital platform.',
                                    'Personalize your online experience.',
                                    'Communicate updates, project status, and promotional offers.',
                                    'Develop and enhance our tech consulting and digital growth solutions.',
                                    'Comply with regulatory and legal obligations.',
                                    'Detect, prevent, and mitigate fraudulent or unauthorized activities.',
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

                        <PolicySection id="log-files" icon="📁" title="Log Files">
                            <p>
                                Triumphant Technological Services follows standard web log procedures. Log file data may include IP addresses, browser details, timestamps, and referring pages. These are not linked to personally identifiable information and are used for analytics and service optimization.
                            </p>
                        </PolicySection>

                        <PolicySection id="cookies" icon="🍪" title="Cookies and Tracking Technologies">
                            <p>
                                We use cookies to improve website functionality and enhance user experience. Cookies are small data files stored on your device when you visit our platform.
                            </p>
                            <InfoBox type="warning">
                                You may refuse cookies through your browser settings, but some parts of the Triumphanttech website may not function properly as a result.
                            </InfoBox>
                        </PolicySection>

                        <PolicySection id="data-sharing" icon="🔗" title="Data Sharing and Third Parties">
                            <p>
                                Triumphant Technological Services does not sell or trade users' personal information. However, we may share limited data with trusted partners who assist in operating our services — such as payment processors, analytics providers, or regulatory bodies — under strict confidentiality agreements.
                            </p>
                        </PolicySection>

                        <PolicySection id="data-retention" icon="🔒" title="Data Retention and Security">
                            <p>
                                We retain personal data only as long as necessary to fulfill business or legal obligations. All data is securely stored using encryption and access control measures to prevent unauthorized access, alteration, or disclosure.
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
                                    { icon: '🔐', label: 'Encryption at Rest' },
                                    { icon: '🛡️', label: 'Access Controls' },
                                    { icon: '🗑️', label: 'Timely Deletion' },
                                    { icon: '📡', label: 'Secure Transmission' },
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
                        </PolicySection>

                        <PolicySection id="your-rights" icon="⚖️" title="Your Data Protection Rights">
                            <p>
                                Consistent with global best practices and <strong style={{ color: 'var(--secondary-color)' }}>International Data Protection Regulations</strong>, you reserve the right to:
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
                                    { right: 'Access', desc: 'Request access to your stored personal data.' },
                                    { right: 'Correct / Delete', desc: 'Request correction or deletion of your personal information.' },
                                    { right: 'Withdraw Consent', desc: 'Withdraw consent to data processing at any time.' },
                                    { right: 'Data Portability', desc: 'Request data portability where technically applicable.' },
                                ].map((item) => (
                                    <div
                                        key={item.right}
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
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {item.right}
                                        </span>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                            {item.desc}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <p style={{ marginTop: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                To exercise these rights, contact us at{' '}
                                <a href="mailto:admin@triumphantech.com" style={{ color: 'var(--secondary-color)', textDecoration: 'none' }}>
                                    admin@triumphantech.com
                                </a>.
                            </p>
                        </PolicySection>

                        <PolicySection id="childrens-privacy" icon="👶" title="Children's Privacy">
                            <p>
                                The services of Triumphant Technological Services are not directed toward children under 13. We do not knowingly collect information from minors. Upon notice of such collection, we promptly remove the data from our systems.
                            </p>
                        </PolicySection>

                        <PolicySection id="policy-changes" icon="📝" title="Changes to This Policy">
                            <p>
                                Triumphanttech may update this Privacy Policy to reflect operational, legal, or regulatory changes. Updates will be posted on this page with the latest revision date indicated. Continued use of our services after updates constitutes your acceptance of the revised policy.
                            </p>
                        </PolicySection>

                        <PolicySection id="contact-us" icon="📬" title="Contact Us" isLast>
                            <p className="mb-6">
                                For inquiries, concerns, or requests related to this Privacy Policy, please reach out to Triumphant Technological Services:
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

            {/* Mobile-only: render content without TOC grid */}
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
