'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SeoResult {
  domain: string;
  quickScore: number;
  statusLabel: string;
  summary: string;
  visibleIssues: string[];
  opportunities: string[];
  leadId: string;
  rootUrl?: string;
  cta?: { headline: string; description: string; primaryLabel: string; primaryUrl?: string; secondaryLabel: string; secondaryUrl?: string };
  bookingLinks?: { triage?: string; strategy?: string; implementation?: string };
}

const DEFAULT_BOOKING_URL = process.env.NEXT_PUBLIC_SEO_BOOKING_URL || 'https://cal.com/adeyemi-olayemi-vqvyj4/30-min-seo-strategy-call';

export default function SeoResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<SeoResult | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('trium_seo_result');
    if (!raw) { router.push('/seo-snapshot'); return; }
    setResult(JSON.parse(raw) as SeoResult);
  }, [router]);

  const handleRequestAudit = async () => {
    if (!result?.leadId) return;
    setRequesting(true);
    try {
      await fetch('/api/seo/request-full-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: result.leadId, websiteUrl: result.rootUrl || result.domain }),
      });
    } finally {
      router.push('/seo-snapshot/thank-you');
    }
  };

  const handleBookCall = async () => {
    const bookingUrl = result?.cta?.primaryUrl || result?.bookingLinks?.strategy || DEFAULT_BOOKING_URL;
    if (!result?.leadId) { window.location.href = bookingUrl; return; }
    setBooking(true);
    try {
      await fetch('/api/seo/book-call-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: result.leadId }),
      });
    } finally {
      window.location.href = bookingUrl;
    }
  };

  if (!result) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
          <svg style={{ animation: 'spin 1s linear infinite', width: 22, height: 22 }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading your results…
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const score = result.quickScore;
  const scoreColor = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';
  const scoreBg = score >= 70 ? 'rgba(34,197,94,0.1)' : score >= 40 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';
  const scoreBorder = score >= 70 ? 'rgba(34,197,94,0.3)' : score >= 40 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)';
  const scoreLabel = score >= 70 ? 'Good' : score >= 40 ? 'Needs Work' : 'Critical';
  const scoreRingClass = score >= 70 ? 'stroke-green-500' : score >= 40 ? 'stroke-amber-400' : 'stroke-red-500';
  const scoreMessage = score >= 70
    ? 'Your site has a solid foundation. A few targeted fixes will push you into the top tier for AI-powered search.'
    : score >= 40
      ? 'Your site is performing below its potential. Several key issues are costing you visibility every day.'
      : 'Your site has critical blockers that are significantly limiting your visibility in both Google and AI search.';

  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = circ - (circ * score) / 100;

  const cta = result.cta || {
    headline: 'Ready to fix this and start winning?',
    description: 'Turn these insights into real results. Book a free 30-minute strategy call and we will walk through exactly what to fix and in what order — no jargon, no sales pressure.',
    primaryLabel: 'Book Free Strategy Call',
    secondaryLabel: 'Request Full Audit Report',
  };

  return (
    <div style={{ background: 'var(--bg-dark)', minHeight: '100vh', paddingBottom: '6rem' }}>

      {/* ── BACKGROUND ── */}
      <div
        aria-hidden
        style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden',
          background: 'radial-gradient(circle at 18% 20%, rgba(0,102,255,0.14), transparent 36%), radial-gradient(circle at 82% 78%, rgba(0,204,255,0.08), transparent 32%), linear-gradient(180deg, rgba(5,5,16,0.98), rgba(2,2,5,1))',
        }}
      />

      <div className="relative" style={{ zIndex: 10 }}>

        {/* ── HEADER ── */}
        <section style={{ paddingTop: '7rem', paddingBottom: '3rem', textAlign: 'center' }}>
          <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                background: 'rgba(0,102,255,0.1)',
                border: '1px solid rgba(0,102,255,0.3)',
                borderRadius: '999px',
                padding: '0.42rem 1.1rem',
                marginBottom: '1.4rem',
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              <span style={{ color: '#00CCFF', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                Analysis Complete
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                fontWeight: 900,
                color: '#fff',
                letterSpacing: '-0.03em',
                lineHeight: 1.08,
                marginBottom: '1rem',
              }}
            >
              SEO Snapshot —{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #0066FF, #00CCFF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {result.domain}
              </span>
            </h1>
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: 'rgba(255,255,255,0.62)',
                lineHeight: 1.85,
                maxWidth: 780,
                margin: '0 auto',
              }}
            >
              {result.summary}
            </p>
          </div>
        </section>

        {/* ── MAIN RESULTS GRID ── */}
        <section style={{ paddingBottom: '3rem' }}>
          <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr)',
                gap: '1.2rem',
              }}
              className="lg:grid-cols-[320px_minmax(0,1fr)]"
            >

              {/* SCORE CARD */}
              <div
                style={{
                  background: 'linear-gradient(180deg, rgba(7,13,34,0.95), rgba(5,8,20,0.92))',
                  border: '1px solid rgba(0,102,255,0.2)',
                  borderRadius: 24,
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '1rem',
                }}
              >
                <p style={{ color: '#00CCFF', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  Your Visibility Score
                </p>

                {/* Ring chart */}
                <div style={{ position: 'relative', width: 180, height: 180 }}>
                  <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                    <circle
                      cx="60" cy="60" r={r} fill="none"
                      className={scoreRingClass}
                      strokeWidth="10" strokeLinecap="round"
                      strokeDasharray={circ} strokeDashoffset={dash}
                      style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '3.2rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{score}</span>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 4 }}>/ 100</span>
                  </div>
                </div>

                <span
                  style={{
                    padding: '0.45rem 1.2rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.18em',
                    color: scoreColor,
                    background: scoreBg,
                    border: `1px solid ${scoreBorder}`,
                  }}
                >
                  {scoreLabel}
                </span>

                <p style={{ color: 'rgba(255,255,255,0.58)', lineHeight: 1.75, fontSize: '0.9rem', maxWidth: 240 }}>
                  {scoreMessage}
                </p>

                <div style={{ width: '100%', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {[
                      { label: 'Issues Found', value: result.visibleIssues.length },
                      { label: 'Quick Wins', value: result.opportunities.length },
                    ].map(item => (
                      <div
                        key={item.label}
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: 14,
                          padding: '0.9rem',
                          textAlign: 'center',
                        }}
                      >
                        <p style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 900, lineHeight: 1 }}>{item.value}</p>
                        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 4 }}>{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN — ISSUES + OPPORTUNITIES */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                {/* Priority Blockers */}
                <div
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderTop: '3px solid #ef4444',
                    borderRadius: 24,
                    padding: '1.8rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.4rem' }}>
                    <div
                      style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'rgba(239,68,68,0.12)',
                        border: '1px solid rgba(239,68,68,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}
                    >
                      <svg width="18" height="18" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '1.2rem' }}>Priority Blockers</h2>
                      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.84rem' }}>These are costing you rankings right now</p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {result.visibleIssues.map((issue, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '40px minmax(0,1fr)',
                          gap: '0.9rem',
                          alignItems: 'flex-start',
                          padding: '1rem',
                          background: 'rgba(239,68,68,0.05)',
                          border: '1px solid rgba(239,68,68,0.12)',
                          borderRadius: 16,
                        }}
                      >
                        <div
                          style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: 'rgba(239,68,68,0.14)',
                            border: '1px solid rgba(239,68,68,0.24)',
                            color: '#f87171', fontWeight: 900,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.88rem',
                          }}
                        >
                          {i + 1}
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.75, fontSize: '0.95rem', paddingTop: 2 }}>{issue}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Wins */}
                <div
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(0,204,255,0.2)',
                    borderTop: '3px solid #00CCFF',
                    borderRadius: 24,
                    padding: '1.8rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.4rem' }}>
                    <div
                      style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'rgba(0,204,255,0.12)',
                        border: '1px solid rgba(0,204,255,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}
                    >
                      <svg width="18" height="18" fill="none" stroke="#00CCFF" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '1.2rem' }}>Quick Wins Available</h2>
                      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.84rem' }}>These can improve your rankings this week</p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {result.opportunities.map((opp, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '40px minmax(0,1fr)',
                          gap: '0.9rem',
                          alignItems: 'flex-start',
                          padding: '1rem',
                          background: 'rgba(0,204,255,0.04)',
                          border: '1px solid rgba(0,204,255,0.12)',
                          borderRadius: 16,
                        }}
                      >
                        <div
                          style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: 'rgba(0,204,255,0.14)',
                            border: '1px solid rgba(0,204,255,0.24)',
                            color: '#00CCFF', fontWeight: 900,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.88rem',
                          }}
                        >
                          {i + 1}
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.75, fontSize: '0.95rem', paddingTop: 2 }}>{opp}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ── CONTEXT STRIP ── */}
        <section style={{ paddingBottom: '3rem' }}>
          <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
            <div
              style={{
                background: 'rgba(0,102,255,0.05)',
                border: '1px solid rgba(0,102,255,0.16)',
                borderRadius: 20,
                padding: '1.5rem 2rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#00CCFF', fontWeight: 900, fontSize: '1.5rem', lineHeight: 1 }}>{score}/100</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginTop: 4 }}>Visibility Score</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#fff', fontWeight: 900, fontSize: '1.5rem', lineHeight: 1 }}>{result.visibleIssues.length}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginTop: 4 }}>Issues blocking your rankings</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#fff', fontWeight: 900, fontSize: '1.5rem', lineHeight: 1 }}>{result.opportunities.length}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginTop: 4 }}>Quick wins to implement now</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: scoreColor, fontWeight: 900, fontSize: '1.5rem', lineHeight: 1 }}>{scoreLabel}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginTop: 4 }}>Current SEO health rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ paddingBottom: '3rem' }}>
          <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(0,66,204,0.26), rgba(0,204,255,0.1))',
                border: '1px solid rgba(0,102,255,0.3)',
                borderRadius: 28,
                padding: 'clamp(2rem, 5vw, 4rem)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  background: 'linear-gradient(90deg, transparent, rgba(0,102,255,0.6), transparent)',
                }}
              />

              <p style={{ color: '#00CCFF', fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Roadmap &amp; Fix
              </p>
              <h2 style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 900, lineHeight: 1.08, marginBottom: '1.1rem' }}>
                {cta.headline}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', maxWidth: 720, margin: '0 auto 2.2rem', lineHeight: 1.9, fontSize: '1.01rem' }}>
                {cta.description}
              </p>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.4rem' }}>
                <button
                  id="results-book-call-cta"
                  onClick={handleBookCall}
                  disabled={booking}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '1rem 2rem',
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #0066FF, #0044CC)',
                    color: '#fff',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontSize: '0.86rem',
                    border: 'none',
                    cursor: booking ? 'not-allowed' : 'pointer',
                    opacity: booking ? 0.6 : 1,
                    boxShadow: '0 0 36px rgba(0,102,255,0.45)',
                  }}
                >
                  {booking ? 'Opening calendar…' : `${cta.primaryLabel} →`}
                </button>
                <button
                  id="results-full-audit-cta"
                  onClick={handleRequestAudit}
                  disabled={requesting}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '1rem 2rem',
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.16)',
                    color: 'rgba(255,255,255,0.82)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontSize: '0.86rem',
                    background: 'transparent',
                    cursor: requesting ? 'not-allowed' : 'pointer',
                    opacity: requesting ? 0.6 : 1,
                  }}
                >
                  {requesting ? 'Sending…' : cta.secondaryLabel}
                </button>
              </div>

              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>
                Free 30-minute call · Real implementation advice · No hard sell
              </p>
            </div>
          </div>
        </section>

        {/* ── WHAT COMES NEXT ── */}
        <section style={{ paddingBottom: '4rem' }}>
          <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
            <div style={{ marginBottom: '1.6rem', textAlign: 'center' }}>
              <h2 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '0.7rem' }}>
                Beyond the snapshot — what a full SEO fix looks like
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 680, margin: '0 auto', lineHeight: 1.85 }}>
                The snapshot surfaces the issues. The real work is fixing them systematically. Here is what Triumphant HQ clients typically experience when they go beyond the free report.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {[
                { title: 'Technical SEO Foundation', desc: 'Schema markup, crawlability, Core Web Vitals, and all the technical signals Google and AI tools use to evaluate your site.', accent: '#0066FF' },
                { title: 'AI Search Optimisation', desc: 'Structured content formats, E-E-A-T signals, and the specific attributes that determine whether your site gets cited in AI Overviews and Perplexity.', accent: '#00CCFF' },
                { title: 'Content and Authority Building', desc: 'Strategic content that earns clicks, builds topical authority, and positions your business as the expert answer in your niche.', accent: '#8B5CF6' },
                { title: 'Ongoing Monitoring', desc: 'Regular health checks, rank tracking, and implementation support so your improvements stick and compound over time.', accent: '#22c55e' },
              ].map(item => (
                <div
                  key={item.title}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${item.accent}22`,
                    borderTop: `3px solid ${item.accent}`,
                    borderRadius: 20,
                    padding: '1.4rem',
                  }}
                >
                  <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', marginBottom: '0.6rem' }}>{item.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, fontSize: '0.9rem' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
