import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getForgeFunnel } from '@/lib/digital-forge';

export default async function FunnelThankYouPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const funnel = await getForgeFunnel(params.slug);

    if (!funnel) {
        notFound();
    }

    const { pages, training, promise } = funnel;

    return (
        <div className="min-h-screen bg-[#03040F] text-white overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            
            {/* ══════════════════════════════════════════════════════════
                HERO – Confirmation energy
            ══════════════════════════════════════════════════════════ */}
            <section style={{
                background: 'linear-gradient(180deg, #000814 0%, #001233 60%, #03040F 100%)',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '80px 24px',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'center',
            }}>
                {/* Glow orb */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -60%)',
                    width: '600px', height: '400px',
                    background: 'radial-gradient(ellipse, rgba(16,185,129,0.12) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                {/* Check icon */}
                <div style={{
                    width: 96, height: 96,
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 100%)',
                    border: '2px solid rgba(16,185,129,0.4)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '40px',
                    boxShadow: '0 0 60px rgba(16,185,129,0.2)',
                    position: 'relative',
                }}>
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                    </svg>
                </div>

                {/* Headline */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)',
                    borderRadius: '100px', padding: '6px 18px', marginBottom: '28px',
                }}>
                    <span style={{ color: '#10b981', fontSize: '11px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                        You&apos;re In
                    </span>
                </div>
                <h1 style={{
                    fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 900,
                    lineHeight: 1.1, letterSpacing: '-0.02em', color: '#fff',
                    margin: '0 0 20px', maxWidth: '640px',
                }}>
                    {pages.thankYou.headline}
                </h1>
                <p style={{
                    color: 'rgba(255,255,255,0.45)', fontSize: '1.1rem',
                    lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 64px',
                }}>
                    You&apos;re moments away from learning exactly how to build and sell your first AI-powered digital product.
                </p>

                {/* Session card */}
                <div style={{
                    width: '100%', maxWidth: '520px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px', padding: '32px 40px',
                    marginBottom: '40px',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
                    textAlign: 'left',
                }}>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '20px' }}>Your Session</p>
                    
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '16px',
                        paddingBottom: '20px', marginBottom: '20px',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}>
                        <div style={{
                            width: 52, height: 52, borderRadius: '12px',
                            background: 'linear-gradient(135deg, #0066FF, #00CCFF)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <div>
                            <p style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', marginBottom: '4px' }}>{training.title}</p>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>{training.timeLabel} · {training.duration}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {pages.thankYou.instructions.map((inst, i) => (
                            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: 24, height: 24, borderRadius: '50%',
                                    background: 'rgba(0,204,255,0.1)', border: '1px solid rgba(0,204,255,0.2)',
                                    color: '#00CCFF', fontSize: '11px', fontWeight: 900,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    {i + 1}
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{inst}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Primary CTA */}
                <Link
                    href={`/digital-forge/funnel/${funnel.slug}/training`}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '10px',
                        background: 'linear-gradient(135deg, #0066FF 0%, #0052cc 100%)',
                        color: '#fff', fontWeight: 800, fontSize: '1rem',
                        padding: '18px 48px', borderRadius: '12px',
                        textDecoration: 'none', marginBottom: '16px',
                        boxShadow: '0 8px 32px rgba(0,102,255,0.4), 0 0 0 1px rgba(0,204,255,0.2)',
                        letterSpacing: '0.02em',
                    }}
                >
                    Enter the Training Room
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </Link>
                <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '8px' }}>Click above to watch the free masterclass</p>
            </section>
        </div>
    );
}
