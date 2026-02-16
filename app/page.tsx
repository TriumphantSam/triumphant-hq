'use client';

import Hero from '@/components/Hero';

/* ──────────────── DATA ──────────────── */

const services = [
  {
    icon: '🏪',
    title: 'Local Services',
    color: '#0066FF',
    description: 'NIMC registration, school portals, document services and essential internet support for individuals and students.',
    link: '/services',
  },
  {
    icon: '📈',
    title: 'Digital Growth',
    color: '#00CCFF',
    description: 'SEO strategy, WordPress management and content optimization — with a 40% organic traffic growth track record.',
    link: '/services',
  },
  {
    icon: '🤖',
    title: 'AI Data & Training',
    color: '#3385FF',
    description: 'Human-in-the-Loop data annotation, prompt engineering and quality assurance for AI projects worldwide.',
    link: '/services',
  },
  {
    icon: '💻',
    title: 'Technical Support',
    color: '#00A3CC',
    description: 'HP printer setup, Microsoft 365 deployment, hardware diagnostics and repair from a trusted partner.',
    link: '/services',
  },
];

const stats = [
  { value: '7+', label: 'Years of Service' },
  { value: '40%', label: 'Avg. Traffic Growth' },
  { value: '500+', label: 'Clients Helped' },
  { value: '6', label: 'Service Areas' },
];

const reasons = [
  {
    icon: '🎯',
    title: 'Local Expertise, Global Standards',
    description: "We understand Nigeria's tech landscape while delivering solutions that meet international quality benchmarks.",
  },
  {
    icon: '⚡',
    title: 'Fast & Reliable',
    description: "Whether it's a NIN registration or a full SEO audit, we deliver on time with consistent quality.",
  },
  {
    icon: '🤝',
    title: 'Community First',
    description: 'Built on 7+ years of trust in Ibadan. Every client is a neighbour, every project is personal.',
  },
];

/* ──────────────── COMPONENT ──────────────── */

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <Hero />

      {/* ===================== STATS BAR ===================== */}
      <section
        className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16"
        style={{ paddingBottom: '4rem' }}
      >
        <div
          className="glass rounded-sm border border-[#0066FF]/30"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            textAlign: 'center',
          }}
        >
          {stats.map((s, i) => (
            <div key={i}>
              <div
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  fontWeight: 800,
                  color: 'var(--accent-color)',
                  lineHeight: 1.2,
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== SERVICES ===================== */}
      <section
        className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16"
        style={{ paddingTop: '2rem', paddingBottom: '5rem' }}
      >
        <p
          className="uppercase tracking-widest text-sm font-semibold mb-2 text-center"
          style={{ color: 'var(--secondary-color)', letterSpacing: '0.25em' }}
        >
          What We Do
        </p>
        <h2
          className="text-3xl sm:text-4xl font-bold mb-4 text-center gradient-text"
        >
          Our Services
        </h2>
        <p
          className="text-center mb-12"
          style={{ color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 3rem' }}
        >
          From essential community tech services to cutting-edge AI solutions — we cover every layer of the digital stack.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {services.map((service, i) => (
            <a
              key={i}
              href={service.link}
              className="glass glass-hover rounded-2xl"
              style={{
                padding: '2rem',
                textDecoration: 'none',
                borderTop: `3px solid ${service.color}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              <span style={{ fontSize: '2.5rem' }}>{service.icon}</span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: service.color }}>
                {service.title}
              </h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)', flex: 1 }}>
                {service.description}
              </p>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: service.color,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  marginTop: '0.5rem',
                }}
              >
                Learn more →
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ===================== WHY CHOOSE US ===================== */}
      <section
        className="max-w-screen-lg mx-auto px-6 sm:px-10 lg:px-16"
        style={{ paddingTop: '2rem', paddingBottom: '5rem' }}
      >
        <p
          className="uppercase tracking-widest text-sm font-semibold mb-2 text-center"
          style={{ color: 'var(--secondary-color)', letterSpacing: '0.25em' }}
        >
          Why Us
        </p>
        <h2
          className="text-3xl sm:text-4xl font-bold mb-12 text-center gradient-text"
        >
          Why Choose Triumphant&nbsp;HQ?
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {reasons.map((r, i) => (
            <div
              key={i}
              className="glass rounded-2xl"
              style={{ padding: '2rem', textAlign: 'center' }}
            >
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>{r.icon}</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-color)', marginBottom: '0.75rem' }}>
                {r.title}
              </h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                {r.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section
        className="max-w-screen-lg mx-auto px-6 sm:px-10 lg:px-16"
        style={{ paddingTop: '2rem', paddingBottom: '6rem', textAlign: 'center' }}
      >
        <div
          className="glass rounded-3xl"
          style={{
            padding: 'clamp(2.5rem, 5vw, 4rem)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Gradient accent line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, var(--accent-color), var(--secondary-color), #a855f7)' }} />

          <h2
            className="text-3xl sm:text-4xl font-bold mb-4 gradient-text"
          >
            Ready to Bridge the Gap?
          </h2>
          <p
            style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 2rem', lineHeight: 1.7 }}
          >
            Whether you need local tech support or global digital solutions, we're here to help you grow.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="/contact"
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
              Get in Touch
            </a>
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
                background: 'transparent',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.borderColor = 'var(--secondary-color)';
                (e.target as HTMLElement).style.color = 'var(--secondary-color)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.borderColor = 'var(--glass-border)';
                (e.target as HTMLElement).style.color = 'var(--text-primary)';
              }}
            >
              View Services →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
