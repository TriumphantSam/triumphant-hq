'use client';

export default function Hero() {
    return (
        <section
            style={{
                minHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '2rem 1.5rem',
                position: 'relative',
            }}
        >
            {/* Decorative badge */}
            <div
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '9999px',
                    border: '1px solid var(--glass-border)',
                    background: 'var(--glass-bg)',
                    marginBottom: '2rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                }}
            >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-color)', display: 'inline-block' }} />
                Bridging Technology &amp; Community Since 2017
            </div>

            {/* Main heading */}
            <h1
                className="gradient-text"
                style={{
                    fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                    fontWeight: 800,
                    lineHeight: 1.1,
                    marginBottom: '1.5rem',
                    maxWidth: 800,
                }}
            >
                Essential Tech.
                <br />
                <span style={{ color: 'var(--accent-color)', WebkitTextFillColor: 'var(--accent-color)' }}>
                    Digital Growth.
                </span>
            </h1>

            {/* Subtitle */}
            <p
                style={{
                    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                    color: 'var(--text-secondary)',
                    maxWidth: 600,
                    lineHeight: 1.7,
                    marginBottom: '2.5rem',
                }}
            >
                From local NIMC registrations to global AI data strategies. We bridge the gap between today's needs and tomorrow's technology.
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <a
                    href="/services"
                    style={{
                        display: 'inline-block',
                        padding: '0.9rem 2.5rem',
                        fontSize: '1rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        borderRadius: '0.75rem',
                        background: 'var(--accent-color)',
                        color: '#000',
                        textDecoration: 'none',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                        (e.target as HTMLElement).style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.transform = 'translateY(0)';
                        (e.target as HTMLElement).style.boxShadow = 'none';
                    }}
                >
                    Explore Solutions
                </a>
                <a
                    href="/about"
                    style={{
                        display: 'inline-block',
                        padding: '0.9rem 2.5rem',
                        fontSize: '1rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        borderRadius: '0.75rem',
                        background: 'transparent',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.borderColor = 'var(--accent-color)';
                        (e.target as HTMLElement).style.color = 'var(--accent-color)';
                    }}
                    onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.borderColor = 'var(--glass-border)';
                        (e.target as HTMLElement).style.color = 'var(--text-primary)';
                    }}
                >
                    Our Story →
                </a>
            </div>

            {/* Scroll indicator */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    opacity: 0.6,
                    animation: 'float-slow 3s ease-in-out infinite',
                }}
            >
                <span>Scroll</span>
                <span style={{ fontSize: '1.25rem' }}>↓</span>
            </div>
        </section>
    );
}
