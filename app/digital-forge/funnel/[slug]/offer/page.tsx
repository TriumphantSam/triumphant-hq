import { notFound } from 'next/navigation';
import { getForgeFunnel } from '@/lib/digital-forge';

export default async function FunnelOfferPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const funnel = await getForgeFunnel(params.slug);

    if (!funnel) {
        notFound();
    }

    const { pages, offer, proof, promise } = funnel;
    
    // Strip the placeholder price text for display
    const displayPrice = offer.price === 'Review before publish' ? null : offer.price;

    return (
        <div className="min-h-screen bg-[#03040F] text-white overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

            {/* ══════════════════════════════════════════════════════════
                STICKY CTA BAR – Always-visible conversion
            ══════════════════════════════════════════════════════════ */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
                background: 'rgba(3,4,15,0.97)', backdropFilter: 'blur(16px)',
                borderTop: '1px solid rgba(245,158,11,0.2)',
                padding: '16px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px',
                flexWrap: 'wrap',
            }}>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: 0, fontWeight: 500 }}>
                    <span style={{ color: '#f59e0b', fontWeight: 800 }}>{offer.name}</span> — Get instant access
                </p>
                <a href="#offer-cta" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#fff', fontWeight: 800, fontSize: '14px',
                    padding: '12px 32px', borderRadius: '10px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 20px rgba(245,158,11,0.4)',
                    whiteSpace: 'nowrap',
                }}>
                    {offer.cta}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </a>
            </div>

            {/* ══════════════════════════════════════════════════════════
                HERO – Offer headline
            ══════════════════════════════════════════════════════════ */}
            <section style={{
                background: 'linear-gradient(180deg, #000d1f 0%, #000814 60%, #03040F 100%)',
                padding: '100px 24px 120px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Ambient glow */}
                <div style={{
                    position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)',
                    width: '800px', height: '400px',
                    background: 'radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
                        borderRadius: '100px', padding: '6px 20px', marginBottom: '32px',
                    }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px #f59e0b', display: 'inline-block' }} />
                        <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                            Special Offer
                        </span>
                    </div>
                    
                    <h1 style={{
                        fontSize: 'clamp(2.2rem, 5.5vw, 4rem)', fontWeight: 900,
                        lineHeight: 1.08, letterSpacing: '-0.03em', color: '#fff',
                        margin: '0 0 24px',
                    }}>
                        {pages.offerPage.headline}
                    </h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.55)', fontSize: '1.2rem',
                        lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 48px',
                    }}>
                        {pages.offerPage.summary}
                    </p>
                    
                    {/* Top CTA */}
                    <a href="#offer-cta" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '10px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: '#fff', fontWeight: 800, fontSize: '1.15rem',
                        padding: '20px 52px', borderRadius: '14px',
                        textDecoration: 'none',
                        boxShadow: '0 12px 40px rgba(245,158,11,0.4)',
                        letterSpacing: '0.02em',
                    }}>
                        {offer.cta}
                        {displayPrice && <span style={{ opacity: 0.9, fontSize: '0.9em' }}>— {displayPrice}</span>}
                    </a>
                    <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '16px' }}>
                        Instant access · Digital delivery
                    </p>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                EVERYTHING INCLUDED – Deliverables
            ══════════════════════════════════════════════════════════ */}
            <section style={{ padding: '100px 24px', maxWidth: '1040px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <p style={{ color: '#00CCFF', fontSize: '11px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>Complete System</p>
                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.02em', margin: 0 }}>
                        Everything You Get Inside
                    </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '60px' }}>
                    {offer.deliverables.map((item, i) => (
                        <div key={i} style={{
                            display: 'flex', gap: '16px', alignItems: 'center',
                            padding: '22px 24px',
                            background: 'rgba(0,204,255,0.04)',
                            border: '1px solid rgba(0,204,255,0.1)',
                            borderRadius: '12px',
                        }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
                                background: 'rgba(0,204,255,0.1)', border: '1px solid rgba(0,204,255,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00CCFF" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', fontWeight: 600 }}>
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Bonuses */}
                {offer.bonuses && offer.bonuses.length > 0 && (
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(245,158,11,0.02) 100%)',
                        border: '1px solid rgba(245,158,11,0.2)',
                        borderRadius: '20px', padding: '48px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                            <div style={{ width: 40, height: 40, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🎁</div>
                            <p style={{ color: '#f59e0b', fontSize: '13px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
                                Included Bonuses
                            </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {offer.bonuses.map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <span style={{ color: '#f59e0b', fontSize: '14px', fontWeight: 900 }}>+</span>
                                    </div>
                                    <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', fontWeight: 500 }}>
                                        {item.charAt(0).toUpperCase() + item.slice(1)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* ══════════════════════════════════════════════════════════
                AUTHORITY + FAQ – Trust building
            ══════════════════════════════════════════════════════════ */}
            <section style={{ padding: '0 24px 100px', maxWidth: '1040px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px', alignItems: 'start' }}>
                    
                    {/* Authority */}
                    <div style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '20px', padding: '40px',
                    }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '28px' }}>
                            <div style={{
                                width: 52, height: 52, background: 'linear-gradient(135deg, #0066FF, #00CCFF)',
                                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 900, fontSize: '22px', color: '#fff', flexShrink: 0,
                            }}>T</div>
                            <div>
                                <p style={{ color: '#fff', fontWeight: 800, fontSize: '15px', margin: '0 0 4px' }}>TriumphantHQ</p>
                                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', margin: 0 }}>Built from real systems, not theory</p>
                            </div>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, fontSize: '0.95rem', marginBottom: '24px' }}>
                            {proof.authorityBlock}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {proof.evidenceBullets.map((ev, i) => (
                                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>{ev}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ */}
                    <div>
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '28px' }}>
                            Common Questions
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                            {pages.offerPage.faq.map((faq, i) => (
                                <div key={i} style={{
                                    padding: '24px 0',
                                    borderBottom: i < pages.offerPage.faq.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                                }}>
                                    <p style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                        <span style={{ color: '#f59e0b', fontWeight: 900 }}>Q</span>
                                        {faq.question}
                                    </p>
                                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0, paddingLeft: '22px' }}>
                                        {faq.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                FINAL CTA – Anchor section with polished buybox
            ══════════════════════════════════════════════════════════ */}
            <section id="offer-cta" style={{
                background: 'linear-gradient(180deg, #000814 0%, #001a3d 50%, #000814 100%)',
                borderTop: '1px solid rgba(0,102,255,0.15)',
                padding: '120px 24px 200px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
                    width: '700px', height: '400px',
                    background: 'radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                <div style={{ maxWidth: '680px', margin: '0 auto', position: 'relative' }}>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '20px' }}>
                        Ready To Start?
                    </p>
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 900, color: '#fff', marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                        {offer.name}
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '48px', fontSize: '1.05rem', lineHeight: 1.7 }}>
                        {offer.summary}
                    </p>

                    {/* Buy box */}
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '20px', padding: '40px 48px',
                        boxShadow: '0 60px 100px rgba(0,0,0,0.8)',
                        marginBottom: '24px',
                    }}>
                        {displayPrice && (
                            <p style={{ fontSize: '3rem', fontWeight: 900, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                                {displayPrice}
                            </p>
                        )}
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', marginBottom: '32px' }}>
                            Instant access · All deliverables included
                        </p>
                        <a href="#" style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            color: '#fff', fontWeight: 800, fontSize: '1.1rem',
                            padding: '20px 40px', borderRadius: '12px',
                            textDecoration: 'none', width: '100%', boxSizing: 'border-box',
                            boxShadow: '0 12px 40px rgba(245,158,11,0.4)',
                            letterSpacing: '0.02em',
                        }}>
                            {offer.cta}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </a>

                        {/* Micro-trust signals */}
                        <div style={{
                            display: 'flex', justifyContent: 'center', gap: '24px',
                            marginTop: '24px', flexWrap: 'wrap',
                        }}>
                            {['Instant delivery', 'Secure checkout', 'Easy to follow'].map((t, i) => (
                                <span key={i} style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
