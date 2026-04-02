import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getForgeFunnel } from '@/lib/digital-forge';

export default async function FunnelTrainingPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const funnel = await getForgeFunnel(params.slug);

    if (!funnel) {
        notFound();
    }

    const { pages, training, offer } = funnel;

    return (
        <div className="min-h-screen bg-[#03040F] text-white overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

            {/* Sticky progress bar */}
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                background: 'rgba(3,4,15,0.95)', backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                padding: '12px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00CCFF', boxShadow: '0 0 8px #00CCFF' }} />
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Training Room
                    </span>
                </div>
                <Link href={`/digital-forge/funnel/${funnel.slug}/offer`} style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: '#fff', fontSize: '12px', fontWeight: 800,
                    padding: '8px 18px', borderRadius: '8px', textDecoration: 'none',
                    letterSpacing: '0.05em',
                }}>
                    See The Full System →
                </Link>
            </div>

            {/* ══════════════════════════════════════════════════════════
                HERO – Session intro
            ══════════════════════════════════════════════════════════ */}
            <section style={{ paddingTop: '96px', paddingBottom: '0', textAlign: 'center', padding: '120px 24px 80px' }}>
                <div style={{ maxWidth: '860px', margin: '0 auto' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '16px',
                        background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                        borderRadius: '100px', padding: '8px 20px', marginBottom: '32px',
                        flexWrap: 'wrap', justifyContent: 'center',
                    }}>
                        <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                            {training.title}
                        </span>
                        <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)', display: 'inline-block' }} />
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 700 }}>
                            {training.duration}
                        </span>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, lineHeight: 1.1,
                        letterSpacing: '-0.025em', color: '#fff', marginBottom: '20px',
                    }}>
                        {pages.trainingPage.headline}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto' }}>
                        {pages.trainingPage.supportingLine}
                    </p>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                VIDEO PLAYER – Premium media slot
            ══════════════════════════════════════════════════════════ */}
            <section style={{ padding: '40px 24px 80px', maxWidth: '960px', margin: '0 auto' }}>
                <div style={{
                    position: 'relative',
                    paddingBottom: '56.25%',
                    background: '#000',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 60px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)',
                }}>
                    {/* Grid overlay */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: 'linear-gradient(rgba(0,102,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,0.04) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }} />
                    
                    {/* Glow center */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'radial-gradient(ellipse at 50% 60%, rgba(0,102,255,0.08) 0%, transparent 70%)',
                    }} />
                    
                    {/* Play button */}
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            width: 88, height: 88, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #0066FF 0%, #00CCFF 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px',
                            boxShadow: '0 0 60px rgba(0,102,255,0.5), 0 0 0 20px rgba(0,102,255,0.08)',
                            cursor: 'pointer',
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="white" style={{ marginLeft: '4px' }}>
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                            Click to Play
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', marginTop: '4px' }}>
                            {training.duration} · On Demand
                        </p>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                WHAT YOU'LL LEARN – Content outline
            ══════════════════════════════════════════════════════════ */}
            <section style={{ padding: '80px 24px', maxWidth: '960px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '48px' }}>
                    
                    {/* Core Method */}
                    <div>
                        <p style={{ color: '#00CCFF', fontSize: '11px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '24px' }}>
                            The 3-Part Framework
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {training.coreMethod.map((method, i) => (
                                <div key={i} style={{
                                    display: 'flex', gap: '20px', alignItems: 'flex-start',
                                    padding: '24px',
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '12px',
                                }}>
                                    <span style={{
                                        fontSize: '2rem', fontWeight: 900, lineHeight: 1,
                                        color: 'rgba(0,204,255,0.25)', fontVariantNumeric: 'tabular-nums',
                                        minWidth: '48px',
                                    }}>
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>{method}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Learning Objectives */}
                    <div>
                        <p style={{ color: '#00CCFF', fontSize: '11px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '24px' }}>
                            What You&apos;ll Walk Away With
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {training.whatYouWillLearn.map((pt, i) => (
                                <div key={i} style={{
                                    display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '20px 0',
                                    borderBottom: i < training.whatYouWillLearn.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                                }}>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: '50%',
                                        background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{pt}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                OFFER BRIDGE – Transition to next step
            ══════════════════════════════════════════════════════════ */}
            <section style={{
                background: 'linear-gradient(135deg, #000814 0%, #001a3a 50%, #000814 100%)',
                border: '1px solid rgba(0,102,255,0.15)',
                margin: '0 24px 80px',
                borderRadius: '24px',
                padding: '80px 40px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)',
                    width: '500px', height: '300px',
                    background: 'radial-gradient(ellipse, rgba(0,102,255,0.12) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <div style={{ position: 'relative' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                        borderRadius: '100px', padding: '6px 18px', marginBottom: '24px',
                    }}>
                        <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Up Next</span>
                    </div>
                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#fff', marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                        Ready to Implement Everything You Just Learned?
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 40px' }}>
                        We&apos;ve packaged the entire system — the tools, templates, and step-by-step workflow — so you can get it done without building everything from scratch.
                    </p>
                    <Link href={`/digital-forge/funnel/${funnel.slug}/offer`} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '10px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: '#fff', fontWeight: 800, fontSize: '1rem',
                        padding: '18px 48px', borderRadius: '12px',
                        textDecoration: 'none',
                        boxShadow: '0 8px 32px rgba(245,158,11,0.35)',
                        letterSpacing: '0.02em',
                    }}>
                        {pages.trainingPage.cta}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </div>
            </section>
        </div>
    );
}
