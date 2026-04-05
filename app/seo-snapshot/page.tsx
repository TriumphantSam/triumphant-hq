'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SeoSnapshotPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({ websiteUrl: '', name: '', email: '', businessType: '' });

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.websiteUrl || !form.name || !form.email.includes('@')) {
      setErrorMsg('Please fill in all required fields correctly.');
      return;
    }
    setStep('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/seo/quick-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data: Record<string, unknown> = await res.json();
      if (!res.ok) {
        setStep('error');
        setErrorMsg((data.error as string) || 'Something went wrong. Please try again.');
        return;
      }
      if (data.ok) {
        sessionStorage.setItem('trium_seo_result', JSON.stringify(data));
        router.push('/seo-snapshot/results');
      } else {
        setStep('error');
        setErrorMsg((data.error as string) || 'Something went wrong. Please try again.');
      }
    } catch {
      setStep('idle');
      setErrorMsg('Network error — please check your connection and try again.');
    }
  };

  const STATS = [
    { value: '68%', label: 'of businesses are invisible to AI search engines right now' },
    { value: '3×', label: 'more traffic from sites that pass AI citation checks' },
    { value: '90s', label: 'is all it takes to get your full visibility snapshot' },
  ];

  const WHAT_YOU_GET = [
    'Your current SEO Visibility Score out of 100',
    'The exact blockers stopping Google and AI tools from ranking you',
    'Quick-win fixes you can implement this week — free',
    'A clear next step with no pressure or obligation',
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-dark)' }}>

      {/* ── BACKGROUND GLOW ── */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          background:
            'radial-gradient(circle at 20% 20%, rgba(0,102,255,0.18), transparent 40%), radial-gradient(circle at 80% 80%, rgba(0,204,255,0.1), transparent 38%), linear-gradient(180deg, rgba(5,5,16,0.98), rgba(2,2,5,1))',
        }}
      />

      <div className="relative" style={{ zIndex: 10 }}>

        {/* ── HERO ── */}
        <section style={{ paddingTop: '10rem', paddingBottom: '5rem' }}>
          <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">

            {/* Badge */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  background: 'rgba(0,102,255,0.1)',
                  border: '1px solid rgba(0,102,255,0.35)',
                  borderRadius: '999px',
                  padding: '0.45rem 1.1rem',
                }}
              >
                <span style={{ position: 'relative', display: 'inline-flex' }}>
                  <span style={{
                    position: 'absolute', inset: 0, borderRadius: '50%', background: '#00CCFF', opacity: 0.75,
                    animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
                  }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00CCFF', display: 'inline-block', position: 'relative' }} />
                </span>
                <span style={{ color: '#00CCFF', fontSize: '0.73rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  100% Free — No Credit Card Needed
                </span>
              </div>
            </div>

            {/* Headline */}
            <div style={{ textAlign: 'center', maxWidth: 900, margin: '0 auto', marginBottom: '2.5rem' }}>
              <h1
                style={{
                  fontSize: 'clamp(3rem, 7vw, 5.8rem)',
                  fontWeight: 900,
                  lineHeight: 1.02,
                  color: '#fff',
                  letterSpacing: '-0.03em',
                  marginBottom: '1.5rem',
                }}
              >
                Why is Google
                <br />
                <span
                  style={{
                    background: 'linear-gradient(90deg, #0066FF, #00CCFF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  ignoring your website?
                </span>
              </h1>
              <p
                style={{
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                  color: 'rgba(255,255,255,0.65)',
                  lineHeight: 1.85,
                  maxWidth: 780,
                  margin: '0 auto 0.9rem',
                }}
              >
                AI-powered search has changed everything. Millions of businesses are invisible to ChatGPT, Google&apos;s AI Overviews, and Perplexity — not because their product is bad, but because their site fails simple technical checks.
              </p>
              <p
                style={{
                  fontSize: '1rem',
                  color: 'rgba(255,255,255,0.42)',
                  lineHeight: 1.8,
                }}
              >
                Your free SEO Snapshot shows you exactly where you stand — and what to fix first.
              </p>
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
              <button
                id="seo-snapshot-run-cta"
                onClick={() => setIsModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.7rem',
                  padding: '1.1rem 2.5rem',
                  background: 'linear-gradient(135deg, #0066FF, #0044CC)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 0 40px rgba(0,102,255,0.42)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 60px rgba(0,102,255,0.55)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(0,102,255,0.42)'; }}
              >
                Run My Free Snapshot
                <span style={{ fontSize: '1.2rem', transition: 'transform 0.2s', display: 'inline-block' }}>→</span>
              </button>
            </div>

            {/* Trust tags */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
              {['No sign-up required', 'Results in 90 seconds', 'Zero obligations', 'Built by real SEO operators'].map(tag => (
                <span
                  key={tag}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.45rem 0.9rem',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '999px',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '0.82rem',
                  }}
                >
                  <span style={{ color: '#00CCFF', fontWeight: 900 }}>✓</span> {tag}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                maxWidth: 860,
                margin: '0 auto',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {STATS.map(s => (
                <div
                  key={s.value}
                  style={{
                    background: 'rgba(0,102,255,0.05)',
                    border: '1px solid rgba(0,102,255,0.16)',
                    borderRadius: 20,
                    padding: '1.5rem',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ color: '#fff', fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900, lineHeight: 1, marginBottom: '0.5rem' }}>{s.value}</p>
                  <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: '0.88rem', lineHeight: 1.65 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT YOU GET ── */}
        <section style={{ paddingBottom: '5rem' }}>
          <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div
                style={{
                  background: 'linear-gradient(180deg, rgba(7,13,34,0.95), rgba(5,8,20,0.92))',
                  border: '1px solid rgba(0,102,255,0.2)',
                  borderRadius: 24,
                  padding: '2rem',
                }}
              >
                <p style={{ color: '#00CCFF', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.9rem' }}>
                  Your Free Report Includes
                </p>
                <h2 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 900, lineHeight: 1.12, marginBottom: '1.4rem' }}>
                  A complete visibility scan — delivered in 90 seconds
                </h2>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {WHAT_YOU_GET.map(item => (
                    <div key={item} style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                      <span
                        style={{
                          width: 24, height: 24, borderRadius: '50%',
                          background: 'rgba(0,204,255,0.15)',
                          border: '1px solid rgba(0,204,255,0.3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, marginTop: 2,
                        }}
                      >
                        <span style={{ color: '#00CCFF', fontSize: '0.72rem', fontWeight: 900 }}>✓</span>
                      </span>
                      <p style={{ color: 'rgba(255,255,255,0.78)', lineHeight: 1.75 }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gap: '1rem' }}>
                <div
                  style={{
                    background: 'rgba(0,204,255,0.05)',
                    border: '1px solid rgba(0,204,255,0.18)',
                    borderRadius: 20,
                    padding: '1.5rem',
                  }}
                >
                  <p style={{ color: '#00CCFF', fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.7rem' }}>
                    Who This Is For
                  </p>
                  <div style={{ display: 'grid', gap: '0.7rem' }}>
                    {[
                      'Business owners who suspect their website is not working hard enough',
                      'Marketing teams frustrated by flat or falling organic traffic',
                      'Founders who want to rank before competitors in AI-powered search',
                      'Anyone who has never done a real technical SEO check',
                    ].map(item => (
                      <p key={item} style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: '0.92rem' }}>
                        → {item}
                      </p>
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 20,
                    padding: '1.5rem',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.84rem', lineHeight: 1.7, marginBottom: '1.2rem' }}>
                    Powered by real SEO operators who have worked on hundreds of African and international business websites.
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                      padding: '0.85rem 1.6rem',
                      background: 'linear-gradient(135deg, #0066FF, #0044CC)',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      borderRadius: 10,
                      border: 'none',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    Get My Free Snapshot →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ paddingBottom: '6rem' }}>
          <div className="max-w-screen-xl px-6 sm:px-10 lg:px-16">
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(0,66,204,0.2), rgba(0,204,255,0.1))',
                border: '1px solid rgba(0,102,255,0.24)',
                borderRadius: 28,
                padding: 'clamp(2rem, 5vw, 4rem)',
                textAlign: 'center',
              }}
            >
              <p style={{ color: '#00CCFF', fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.9rem' }}>
                How It Works
              </p>
              <h2 style={{ color: '#fff', fontSize: 'clamp(1.9rem, 4vw, 3rem)', fontWeight: 900, lineHeight: 1.08, marginBottom: '2.5rem' }}>
                Your snapshot in 3 steps.
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                  marginBottom: '2.5rem',
                }}
              >
                {[
                  { num: '01', title: 'Enter Your Website URL', desc: 'No technical knowledge needed. Just paste your domain and fill in your name and email.' },
                  { num: '02', title: 'We Scan Your Site', desc: 'Our system runs a deep technical visibility check in about 90 seconds — no installs, no plugins.' },
                  { num: '03', title: 'Get Your Snapshot', desc: 'See your score, your blockers, your quick wins, and a clear next step you can act on immediately.' },
                ].map(item => (
                  <div
                    key={item.num}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 20,
                      padding: '1.5rem',
                      textAlign: 'left',
                    }}
                  >
                    <p style={{ color: '#00CCFF', fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>{item.num}</p>
                    <h3 style={{ color: '#fff', fontWeight: 800, marginBottom: '0.5rem' }}>{item.title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, fontSize: '0.92rem' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
              <button
                id="seo-snapshot-bottom-cta"
                onClick={() => setIsModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '1rem 2.2rem',
                  background: 'linear-gradient(135deg, #0066FF, #0044CC)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 0 32px rgba(0,102,255,0.4)',
                }}
              >
                Run My Free Snapshot Now →
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ── MODAL ── */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
            background: 'rgba(2,2,5,0.92)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 600,
              background: 'rgba(5,5,16,0.98)',
              border: '1px solid rgba(0,102,255,0.25)',
              borderRadius: 24,
              boxShadow: '0 30px 100px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '92vh',
              overflow: 'hidden',
            }}
          >
            {/* Modal header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                padding: '1.8rem 2rem 1.2rem',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                flexShrink: 0,
              }}
            >
              <div>
                <p style={{ color: '#00CCFF', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Free SEO Snapshot
                </p>
                <h2 style={{ color: '#fff', fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 900, letterSpacing: '-0.02em' }}>
                  Reveal your website&apos;s visibility score
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.3rem', fontSize: '0.92rem' }}>
                  Results in 90 seconds. Zero obligations.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
                style={{
                  width: 40, height: 40, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  marginTop: '0.2rem',
                }}
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <div style={{ padding: '1.8rem 2rem', overflowY: 'auto' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ color: '#00CCFF', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                    Website URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.websiteUrl}
                    onChange={e => setForm(f => ({ ...f, websiteUrl: e.target.value.replace(/^https?:\/\//, '') }))}
                    placeholder="yourdomain.com"
                    style={{
                      width: '100%', minHeight: 52,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 12, padding: '0 1rem',
                      color: '#fff', fontSize: '1rem', outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: '#00CCFF', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                      Your Name *
                    </label>
                    <input
                      type="text" required value={form.name} onChange={set('name')} placeholder="John Doe"
                      style={{
                        width: '100%', minHeight: 52,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 12, padding: '0 1rem',
                        color: '#fff', fontSize: '1rem', outline: 'none',
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: '#00CCFF', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                      Email Address *
                    </label>
                    <input
                      type="email" required value={form.email} onChange={set('email')} placeholder="you@company.com"
                      style={{
                        width: '100%', minHeight: 52,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 12, padding: '0 1rem',
                        color: '#fff', fontSize: '1rem', outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ color: '#00CCFF', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                    Business Type (optional)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={form.businessType} onChange={set('businessType')}
                      style={{
                        width: '100%', minHeight: 52,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 12, padding: '0 1rem',
                        color: form.businessType ? '#fff' : 'rgba(255,255,255,0.35)',
                        fontSize: '1rem', outline: 'none', appearance: 'none', cursor: 'pointer',
                      }}
                    >
                      <option value="" style={{ background: '#050510', color: '#888' }}>Select your business type…</option>
                      <option value="ecommerce" style={{ background: '#050510' }}>E-commerce</option>
                      <option value="local" style={{ background: '#050510' }}>Local Business</option>
                      <option value="saas" style={{ background: '#050510' }}>SaaS / B2B</option>
                      <option value="agency" style={{ background: '#050510' }}>Agency</option>
                      <option value="other" style={{ background: '#050510' }}>Other</option>
                    </select>
                    <div style={{ position: 'absolute', insetY: 0, right: '1rem', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                      <svg width="16" height="16" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <div style={{ padding: '0.9rem 1rem', borderRadius: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '0.9rem', display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
                    <span style={{ flexShrink: 0 }}>⚠</span>
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  id="seo-snapshot-submit"
                  disabled={step === 'loading'}
                  style={{
                    width: '100%', minHeight: 56,
                    background: step === 'loading' ? 'rgba(0,102,255,0.5)' : 'linear-gradient(135deg, #0066FF, #0044CC)',
                    color: '#fff', fontWeight: 800, fontSize: '0.88rem',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    borderRadius: 12, border: 'none',
                    cursor: step === 'loading' ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                    boxShadow: '0 0 28px rgba(0,102,255,0.35)',
                    marginTop: '0.4rem',
                  }}
                >
                  {step === 'loading' ? (
                    <>
                      <svg style={{ animation: 'spin 1s linear infinite', width: 20, height: 20 }} fill="none" viewBox="0 0 24 24">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Scanning your site…
                    </>
                  ) : (
                    <>Reveal My Snapshot →</>
                  )}
                </button>

                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Your data is safe. We never share or sell it.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
