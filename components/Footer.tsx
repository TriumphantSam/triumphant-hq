import Link from 'next/link';

const footerLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Tech Diary', href: '/tech-diary' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
];

const services = [
    { label: 'NIMC Registration', href: '/services' },
    { label: 'SEO & Web', href: '/services' },
    { label: 'AI Data Consulting', href: '/services' },
    { label: 'Technical Support', href: '/services' },
];

export default function Footer() {
    return (
        <footer
            style={{
                borderTop: '1px solid var(--glass-border)',
                background: 'rgba(10, 10, 20, 0.6)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
            }}
        >
            <div
                style={{
                    maxWidth: 1200,
                    margin: '0 auto',
                    padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 3vw, 2rem) 2rem',
                }}
            >
                {/* Main grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '2.5rem',
                        marginBottom: '2.5rem',
                    }}
                >
                    {/* Brand column */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '0.15em', color: 'var(--accent-color)' }}>
                                TRIUMPHANT
                            </span>
                            <span
                                style={{
                                    fontSize: '0.6rem', fontWeight: 600, padding: '0.1rem 0.4rem',
                                    borderRadius: '0.2rem', border: '1px solid var(--accent-color)',
                                    color: 'var(--accent-color)', letterSpacing: '0.1em',
                                }}
                            >
                                HQ
                            </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1rem', maxWidth: 280 }}>
                            Bridging essential local tech services with cutting-edge digital solutions since 2017.
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            📍 No 4, Kolawole Close, Ibadan
                        </p>
                    </div>

                    {/* Navigation column */}
                    <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                            Quick Links
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {footerLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Services column */}
                    <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                            Services
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {services.map((s, i) => (
                                <Link
                                    key={i}
                                    href={s.href}
                                    style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                                >
                                    {s.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact column */}
                    <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                            Get in Touch
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                            <a
                                href="mailto:admin@triumphantech.com"
                                style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                                📧 admin@triumphantech.com
                            </a>
                            <a
                                href="https://wa.me/2348107711190"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                                📱 +234 810 771 1190
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div
                    style={{
                        borderTop: '1px solid var(--glass-border)',
                        paddingTop: '1.5rem',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.75rem',
                    }}
                >
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        © {new Date().getFullYear()} Triumphant Technological Services. All rights reserved.
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.6 }}>
                        Built with ⚡ in Ibadan, Nigeria
                    </p>
                </div>
            </div>
        </footer>
    );
}
