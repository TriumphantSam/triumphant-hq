import { notFound } from 'next/navigation';
import { getForgeFunnel } from '@/lib/digital-forge';
import OptInForm from '@/components/funnel/OptInForm';

export default async function FunnelOptInPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const funnel = await getForgeFunnel(params.slug);

    if (!funnel) {
        notFound();
    }

    const { promise, training, pages, proof } = funnel;

    return (
        <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            
            {/* ══════════════════════════════════════════════════════════
                HERO – Full-bleed gradient section
            ══════════════════════════════════════════════════════════ */}
            <section style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 60%, #ffffff 100%)',
                paddingTop: '80px',
                paddingBottom: '120px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Glow orb */}
                <div style={{
                    position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
                    width: '700px', height: '400px', borderRadius: '50%',
                    background: 'radial-gradient(ellipse, rgba(0,102,255,0.18) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative' }}>
                    
                    {/* Eyebrow pill */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(0,204,255,0.08)', border: '1px solid rgba(0,204,255,0.25)',
                        borderRadius: '100px', padding: '6px 18px', marginBottom: '32px',
                    }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00CCFF', boxShadow: '0 0 8px #00CCFF', display: 'inline-block' }} />
                        <span style={{ color: '#0077b8', fontSize: '11px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                            {pages.optIn.heroEyebrow}
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 style={{
                        fontSize: 'clamp(2.4rem, 6vw, 4rem)', fontWeight: 900, lineHeight: 1.08,
                        letterSpacing: '-0.03em', color: 'var(--text-primary)', margin: '0 0 24px',
                    }}>
                        {promise.headline}
                    </h1>

                    {/* Subheadline */}
                    <p style={{
                        fontSize: '1.2rem', color: '#64748b', lineHeight: 1.7,
                        maxWidth: '540px', margin: '0 auto 16px', fontWeight: 400,
                    }}>
                        {promise.subheadline}
                    </p>

                    {/* Session details strip */}
                    <div style={{
                        display: 'inline-flex', gap: '24px', alignItems: 'center',
                        background: '#ffffff', border: '1px solid #ffffff',
                        borderRadius: '10px', padding: '12px 24px', margin: '0 0 52px',
                        fontSize: '13px', color: '#64748b', fontWeight: 600,
                        flexWrap: 'wrap', justifyContent: 'center',
                    }}>
                        <span>🎯 {training.mode === 'on_demand' ? 'On-Demand' : 'Live'} Masterclass</span>
                        <span style={{ opacity: 0.3 }}>•</span>
                        <span>⏱ {training.duration}</span>
                        <span style={{ opacity: 0.3 }}>•</span>
                        <span>✅ 100% Free</span>
                    </div>

                    {/* Form card */}
                    <div style={{
                        background: '#ffffff',
                        border: '1px solid rgba(15,23,42,0.11)',
                        borderRadius: '20px',
                        padding: '40px 48px',
                        boxShadow: '0 40px 80px rgba(15,23,42,0.12), 0 0 0 1px rgba(255,255,255,0.04)',
                    }}>
                        <p style={{ color: '#334155', fontSize: '14px', fontWeight: 600, marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Enter your details to watch instantly
                        </p>
                        <OptInForm slug={funnel.slug} ctaText={promise.cta} />
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                SOCIAL PROOF – Quick credentials bar
            ══════════════════════════════════════════════════════════ */}
            <section style={{ borderTop: '1px solid rgba(15,23,42,0.11)', borderBottom: '1px solid rgba(15,23,42,0.11)', padding: '24px 0' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
                    {proof.evidenceBullets.map((b, i) => (
                        <span key={i} style={{ color: '#64748b', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#0077b8' }}>✓</span> {b}
                        </span>
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                WHAT YOU'LL LEARN – Feature grid
            ══════════════════════════════════════════════════════════ */}
            <section style={{ padding: '120px 24px', maxWidth: '960px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '72px' }}>
                    <p style={{ color: '#0077b8', fontSize: '11px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>
                        Inside This Free Masterclass
                    </p>
                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.15, letterSpacing: '-0.02em', margin: 0 }}>
                        Here&apos;s Exactly What You&apos;ll Walk Away With
                    </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    {training.whatYouWillLearn.map((pt, i) => (
                        <div key={i} style={{
                            background: 'linear-gradient(135deg, #ffffff 0%, #f5f8ff 100%)',
                            border: '1px solid rgba(0,102,255,0.15)',
                            borderRadius: '16px', padding: '32px',
                            transition: 'border-color 0.2s',
                        }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: '10px',
                                background: 'rgba(0,204,255,0.1)', border: '1px solid rgba(0,204,255,0.2)',
                                color: '#0077b8', fontWeight: 900, fontSize: '16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '20px',
                            }}>
                                {String(i + 1).padStart(2, '0')}
                            </div>
                            <p style={{ color: '#334155', fontSize: '1.05rem', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>{pt}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                WHO IT'S FOR – Audience section
            ══════════════════════════════════════════════════════════ */}
            <section style={{ background: '#ffffff', borderTop: '1px solid #ffffff', borderBottom: '1px solid #ffffff', padding: '100px 24px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>
                        This Is Built For
                    </p>
                    <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '48px', lineHeight: 1.2 }}>
                        A Practical System for Builders Who Want Results
                    </h2>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '64px' }}>
                        {pages.optIn.whoItsFor.map((item, i) => (
                            <span key={i} style={{
                                padding: '12px 24px',
                                background: 'rgba(0,102,255,0.08)', border: '1px solid rgba(0,102,255,0.2)',
                                borderRadius: '100px', color: '#334155',
                                fontSize: '14px', fontWeight: 600,
                            }}>
                                {item}
                            </span>
                        ))}
                    </div>

                    {/* Why now */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(0,204,255,0.06) 0%, rgba(0,102,255,0.04) 100%)',
                        border: '1px solid rgba(0,204,255,0.15)', borderRadius: '16px', padding: '36px',
                        borderLeft: '4px solid #00CCFF',
                        textAlign: 'left',
                    }}>
                        <p style={{ color: '#0077b8', fontSize: '11px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>Why Right Now</p>
                        <p style={{ color: '#334155', fontSize: '1.1rem', lineHeight: 1.7, margin: 0 }}>{pages.optIn.whyNow}</p>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                AUTHORITY – Trainer credibility
            ══════════════════════════════════════════════════════════ */}
            <section style={{ padding: '100px 24px' }}>
                <div style={{ maxWidth: '720px', margin: '0 auto' }}>
                    <div style={{
                        display: 'flex', gap: '32px', alignItems: 'flex-start',
                        background: '#ffffff', border: '1px solid #ffffff',
                        borderRadius: '20px', padding: '48px',
                    }}>
                        <div style={{
                            width: 64, height: 64, background: 'linear-gradient(135deg, #ffffff 0%, #f5f8ff 100%)',
                            borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 900, fontSize: '28px', color: 'var(--text-primary)', flexShrink: 0,
                            boxShadow: '0 0 30px rgba(0,102,255,0.4)',
                        }}>T</div>
                        <div>
                            <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>About the trainer</p>
                            <p style={{ color: 'var(--text-primary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '20px', fontWeight: 500 }}>{proof.authorityBlock}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {proof.evidenceBullets.map((ev, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <span style={{ color: '#0077b8', fontWeight: 900, fontSize: '14px' }}>→</span>
                                        <span style={{ color: '#334155', fontSize: '14px' }}>{ev}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                FINAL CTA – Bottom form repeat
            ══════════════════════════════════════════════════════════ */}
            <section style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 100%)',
                padding: '100px 24px 160px',
                textAlign: 'center',
                borderTop: '1px solid rgba(15,23,42,0.11)',
            }}>
                <p style={{ color: '#64748b', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px' }}>Seats are limited</p>
                <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                    Ready to Start?
                </h2>
                <p style={{ color: '#64748b', marginBottom: '48px', fontSize: '1rem' }}>Join the free masterclass and get your first AI product launched.</p>
                <div style={{ maxWidth: '480px', margin: '0 auto' }}>
                    <OptInForm slug={funnel.slug} ctaText={promise.cta} />
                </div>
            </section>
        </div>
    );
}
