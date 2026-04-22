'use client';

import Hero from '@/components/Hero';

/* ──────────────── DATA ──────────────── */

const services = [
  {
    icon: '⚡',
    title: 'Funnel Engineering',
    color: '#0066FF',
    description: 'High-converting flagship funnels, optimized checkout systems, and the underlying Digital Forge offering ecosystem.',
    link: '/services',
  },
  {
    icon: '📈',
    title: 'Search & Generative Visibility',
    color: '#00CCFF',
    description: 'Advanced semantic SEO, AI-citations optimization (SGE), and performance marketing architecture.',
    link: '/seo-snapshot',
  },
  {
    icon: '🛍️',
    title: 'Digital Products Store',
    color: '#f59e0b',
    description: 'Ready-to-use AI playbooks, prompt packs, workflow systems, and creator toolkits. Buy and implement from day one.',
    link: '/digital-forge/products',
  },
  {
    icon: '🤖',
    title: 'Autonomous AI Pipelines',
    color: '#3385FF',
    description: 'Custom implementation of AgentPrinter and other orchestrated workflows to scale your digital product generation unconditionally.',
    link: '/services',
  },
  {
    icon: '🏗️',
    title: 'Technical Infrastructure',
    color: '#00A3CC',
    description: 'Complete stack setups including Next.js web apps, automation webhooks, and private API worker integrations.',
    link: '/services',
  },
];

const reasons = [
  {
    icon: '⚙️',
    title: 'Autonomous Systems First',
    description: "We don't just build websites; we build scalable digital architectures powered by AI and hands-free automation.",
  },
  {
    icon: '🎯',
    title: 'Scalable Product Ecosystems',
    description: "We help you transition from selling time to scaling digital assets through calculated funnel engineering.",
  },
  {
    icon: '🌍',
    title: 'Local Roots, Global Output',
    description: 'Backed by 7+ years of technical experience, our infrastructure delivers elite results capable of competing on the global stage.',
  },
];

/* ──────────────── COMPONENT ──────────────── */

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <Hero />

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
          We engineer automated digital product ecosystems, high-conversion funnels, and generative-readiness for search.
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
          Why Triumphant&nbsp;HQ is the Premier Tech & SEO Company
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
            Ready to Dominate Search & AI?
          </h2>
          <p
            style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 2rem', lineHeight: 1.7 }}
          >
            Get a free visibility snapshot to see what is blocking your rankings, AI citations, and conversions right now.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="/seo-snapshot"
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
              Get Free SEO Snapshot
            </a>
            <a
              href="/digital-forge/products"
              style={{
                display: 'inline-block',
                padding: '0.9rem 2.5rem',
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                borderRadius: '0.75rem',
                background: 'rgba(245,158,11,0.15)',
                border: '1px solid rgba(245,158,11,0.4)',
                color: '#f59e0b',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              Browse Products →
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
              View Full Architecture →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
