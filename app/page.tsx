'use client';

import Hero from '@/components/Hero';

/* ──────────────── DATA ──────────────── */

const services = [
  {
    icon: '💻',
    title: 'Website Design & UI/UX',
    color: '#0066FF',
    description: 'Modern, highly responsive designs, custom landing pages, and interactive interfaces engineered to scale conversions.',
    link: '/services',
  },
  {
    icon: '📱',
    title: 'Custom App Development',
    color: '#3385FF',
    description: 'Tailored mobile apps (iOS/Android), custom web apps, APIs, and complex software systems built using Next.js/React.',
    link: '/services',
  },
  {
    icon: '📈',
    title: 'Elite SEO Services',
    color: '#00CCFF',
    description: 'Advanced semantic SEO, search rankings strategy, SGE/AI citation readiness, and visibility growth structures.',
    link: '/services',
  },
  {
    icon: '🤖',
    title: 'Autonomous AI & Workflows',
    color: '#a855f7',
    description: 'Custom workflow automation, AI system integrations, automated data pipelines, and API integrations.',
    link: '/services',
  },
  {
    icon: '🛠️',
    title: 'Digital Forge Showcase',
    color: '#f59e0b',
    description: 'Our proprietary lab containing pre-built digital products, workflow systems, prompt packs, and video training resources.',
    link: '/digital-forge',
  },
];

const reasons = [
  {
    icon: '🚀',
    title: 'Engineered for Real Growth',
    description: "We build systems with conversion optimization at the forefront, turning visitors into active customers.",
  },
  {
    icon: '⚡',
    title: 'Bleeding-Edge Development',
    description: "Leveraging React, Next.js, Tailwind, and node/python backend systems for fast, secure, and modern applications.",
  },
  {
    icon: '🌍',
    title: '7+ Years of Elite Experience',
    description: 'Backed by extensive industry experience, our tech and SEO agency designs solutions that compete on the global stage.',
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
          Our Tech Services
        </h2>
        <p
          className="text-center mb-12"
          style={{ color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 3rem' }}
        >
          We build responsive websites, develop custom software applications, and implement elite search engine marketing.
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
          Why Triumphant&nbsp;HQ is the Premier Tech & SEO Agency
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

      {/* ===================== DIGITAL FORGE LAB SHOWCASE ===================== */}
      <section
        className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16"
        style={{ paddingTop: '2rem', paddingBottom: '5rem' }}
      >
        <div
          className="glass rounded-3xl"
          style={{
            padding: 'clamp(2rem, 5vw, 3.5rem)',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(0, 204, 255, 0.2)',
            background: 'radial-gradient(circle at top right, rgba(0, 204, 255, 0.08), transparent 40%), var(--glass-bg)',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, width: 4, bottom: 0, background: 'linear-gradient(180deg, var(--secondary-color), var(--accent-color))' }} />
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p
                className="uppercase tracking-widest text-xs font-semibold mb-2"
                style={{ color: 'var(--secondary-color)', letterSpacing: '0.25em' }}
              >
                Our Technical Lab
              </p>
              <h2 className="text-3xl font-bold mb-4 gradient-text">
                The Digital Forge
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                We don't just build software for clients — we package our expertise into production-ready blueprints, custom workflow automations, training courses, and starter templates.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                Explore the Digital Forge to watch our free educational training or purchase assets to accelerate your own engineering pipelines.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                  href="/digital-forge"
                  className="px-6 py-2.5 bg-[#00CCFF]/10 border border-[#00CCFF]/35 text-[#00CCFF] hover:bg-[#00CCFF] hover:text-black font-bold text-xs uppercase tracking-wider transition-all"
                  style={{ borderRadius: '2px', textDecoration: 'none' }}
                >
                  Enter the Forge
                </a>
                <a
                  href="/digital-forge/products"
                  className="px-6 py-2.5 bg-transparent border border-white/10 text-white hover:border-white font-bold text-xs uppercase tracking-wider transition-all"
                  style={{ borderRadius: '2px', textDecoration: 'none' }}
                >
                  Browse Store
                </a>
              </div>
            </div>
            
            <div className="hidden md:flex flex-col gap-4">
              <div className="glass p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                <span className="text-sm font-bold text-white block mb-1">🛠️ Starter Product Blueprints</span>
                <span className="text-xs text-gray-400">Step-by-step guides and template packages to build digital assets fast.</span>
              </div>
              <div className="glass p-4 rounded-xl border border-[#0066FF]/20 bg-[#0066FF]/5">
                <span className="text-sm font-bold text-[#0066FF] block mb-1">🎓 High-Impact Video Training</span>
                <span className="text-xs text-gray-400">Free conceptual deep-dives showing you how we automate revenue channels.</span>
              </div>
              <div className="glass p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                <span className="text-sm font-bold text-white block mb-1">⚡ Core System Automations</span>
                <span className="text-xs text-gray-400">Fully developed automation codeblocks and custom webhook blueprints.</span>
              </div>
            </div>
          </div>
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
            Ready to Dominate Search & Development?
          </h2>
          <p
            style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 2rem', lineHeight: 1.7 }}
          >
            Get a free visibility snapshot or contact us directly to discuss website design, app development, and technical workflows.
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
              Get Free SEO Audit
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
                background: 'rgba(245,158,11,0.15)',
                border: '1px solid rgba(245,158,11,0.4)',
                color: '#f59e0b',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              View All Services →
            </a>
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
              Contact Us →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
