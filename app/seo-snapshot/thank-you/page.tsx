'use client';

import Link from 'next/link';

const BOOKING_URL = process.env.NEXT_PUBLIC_SEO_BOOKING_URL || 'https://cal.com/adeyemi-olayemi-vqvyj4/30-min-seo-strategy-call';

export default function SeoSnapshotThankYouPage() {
  const NEXT_STEPS = [
    {
      num: '01',
      title: 'Check your inbox',
      desc: 'Your snapshot summary and a brief analysis of your site are on their way to your email — usually within a few minutes.',
    },
    {
      num: '02',
      title: 'We review your domain in detail',
      desc: 'Our SEO team goes deeper into your specific issues, builds a custom implementation plan, and prepares a prioritized roadmap for your site.',
    },
    {
      num: '03',
      title: 'You get a personal follow-up',
      desc: 'Within 24 hours, we will reach out to walk you through the roadmap, answer your questions, and give you a clear path forward.',
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-dark)' }}>

      {/* ── BACKGROUND ── */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at 25% 25%, rgba(0,102,255,0.16), transparent 38%), radial-gradient(circle at 78% 72%, rgba(0,204,255,0.08), transparent 34%), linear-gradient(180deg, rgba(5,5,16,0.98), rgba(2,2,5,1))',
        }}
      />

      <div className="relative" style={{ zIndex: 10, paddingBottom: '5rem' }}>

        {/* ── HERO ── */}
        <section style={{ paddingTop: '8rem', paddingBottom: '4rem', textAlign: 'center' }}>
          <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">

            {/* Icon */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 24,
                  background: 'linear-gradient(135deg, #0066FF, #00CCFF)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 60px rgba(0,102,255,0.4)',
                }}
              >
                <svg width="44" height="44" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                background: 'rgba(0,102,255,0.1)',
                border: '1px solid rgba(0,102,255,0.3)',
                borderRadius: '999px',
                padding: '0.4rem 1.1rem',
                marginBottom: '1.5rem',
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00CCFF', display: 'inline-block' }} />
              <span style={{ color: '#00CCFF', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                Request Received
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.8rem, 6vw, 5rem)',
                fontWeight: 900,
                lineHeight: 1.04,
                color: '#fff',
                letterSpacing: '-0.03em',
                marginBottom: '1.2rem',
              }}
            >
              Your snapshot is
              <br />
              <span
                style={{
                  background: 'linear-gradient(90deg, #0066FF, #00CCFF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                on its way.
              </span>
            </h1>
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: 'rgba(255,255,255,0.65)',
                lineHeight: 1.85,
                maxWidth: 680,
                margin: '0 auto',
              }}
            >
              We have logged your request and your scan is complete. A summary of your visibility score, your priority blockers, and your quick wins is heading to your email right now.
            </p>
          </div>
        </section>

        {/* ── NEXT STEPS ── */}
        <section style={{ paddingBottom: '4rem' }}>
          <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
            <div
              style={{
                background: 'linear-gradient(180deg, rgba(7,13,34,0.95), rgba(5,8,20,0.92))',
                border: '1px solid rgba(0,102,255,0.2)',
                borderRadius: 24,
                padding: 'clamp(1.5rem, 4vw, 3rem)',
              }}
            >
              <p
                style={{
                  color: '#00CCFF',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  marginBottom: '0.9rem',
                  textAlign: 'center',
                }}
              >
                What Happens Next
              </p>
              <h2
                style={{
                  color: '#fff',
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  marginBottom: '2rem',
                  textAlign: 'center',
                }}
              >
                Here is your next 24 hours
              </h2>
              <div style={{ display: 'grid', gap: '1.2rem' }}>
                {NEXT_STEPS.map(item => (
                  <div
                    key={item.num}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '64px minmax(0,1fr)',
                      gap: '1.2rem',
                      alignItems: 'flex-start',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 18,
                      padding: '1.2rem',
                    }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        background: 'rgba(0,102,255,0.14)',
                        border: '1px solid rgba(0,102,255,0.28)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ color: '#60A5FA', fontWeight: 900, fontSize: '1rem' }}>{item.num}</span>
                    </div>
                    <div>
                      <h3 style={{ color: '#fff', fontWeight: 800, marginBottom: '0.35rem', fontSize: '1.05rem' }}>{item.title}</h3>
                      <p style={{ color: 'rgba(255,255,255,0.62)', lineHeight: 1.75, fontSize: '0.93rem' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SKIP THE WAIT CTA ── */}
        <section style={{ paddingBottom: '4rem' }}>
          <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(0,66,204,0.26), rgba(0,204,255,0.1))',
                border: '1px solid rgba(0,102,255,0.28)',
                borderRadius: 28,
                padding: 'clamp(2rem, 5vw, 4rem)',
                textAlign: 'center',
              }}
            >
              <p style={{ color: '#00CCFF', fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.9rem' }}>
                Want Faster Results?
              </p>
              <h2 style={{ color: '#fff', fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 900, lineHeight: 1.08, marginBottom: '1rem' }}>
                Skip the wait.
                <br />
                Book a live strategy call.
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', maxWidth: 680, margin: '0 auto 2rem', lineHeight: 1.85, fontSize: '1rem' }}>
                In 30 minutes, we will walk through your results together, explain exactly what is stopping your rankings, and give you a prioritized plan you can act on immediately. No sales pitch — just clear, useful SEO direction.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link
                  href={BOOKING_URL}
                  id="thankyou-book-call-cta"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '1rem 2rem',
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #0066FF, #0044CC)',
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontSize: '0.86rem',
                    boxShadow: '0 0 32px rgba(0,102,255,0.4)',
                  }}
                >
                  Book My Free Strategy Call →
                </Link>
                <Link
                  href="/seo-snapshot"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '1rem 2rem',
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.14)',
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontSize: '0.86rem',
                  }}
                >
                  Run Another Snapshot
                </Link>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', marginTop: '1.4rem' }}>
                30-minute call · Free · No obligation · Real action from day one
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
