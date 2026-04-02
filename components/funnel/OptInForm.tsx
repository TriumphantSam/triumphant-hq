'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OptInForm({ slug, ctaText }: { slug: string; ctaText: string }) {
    const router = useRouter();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;

        if (!name || !email) {
            setStatus('error');
            setErrorMsg('Please enter both your name and email.');
            return;
        }

        setStatus('loading');
        try {
            const res = await fetch('/api/digital-forge/funnel-optin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug, name, email })
            });

            if (!res.ok) throw new Error('Failed to reserve spot');

            setStatus('success');
            router.push(`/digital-forge/funnel/${slug}/thank-you`);
        } catch (err) {
            setStatus('error');
            setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            {status === 'error' && (
                <div style={{
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                    borderRadius: '10px', padding: '12px 16px',
                    color: '#f87171', fontSize: '13px', fontWeight: 600, textAlign: 'center',
                    marginBottom: '16px',
                }}>
                    {errorMsg}
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                <input
                    type="text"
                    name="name"
                    placeholder="Your First Name"
                    required
                    style={{
                        width: '100%', boxSizing: 'border-box',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '10px', padding: '16px 20px',
                        color: '#fff', fontSize: '15px', fontWeight: 500,
                        outline: 'none',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = 'rgba(0,204,255,0.5)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Your Best Email Address"
                    required
                    style={{
                        width: '100%', boxSizing: 'border-box',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '10px', padding: '16px 20px',
                        color: '#fff', fontSize: '15px', fontWeight: 500,
                        outline: 'none',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = 'rgba(0,204,255,0.5)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                />
            </div>

            <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                    width: '100%',
                    background: status === 'loading'
                        ? 'rgba(245,158,11,0.5)'
                        : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#fff', fontWeight: 800, fontSize: '1rem',
                    padding: '18px 32px', borderRadius: '10px', border: 'none',
                    cursor: status === 'loading' ? 'wait' : 'pointer',
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                    boxShadow: status === 'loading' ? 'none' : '0 8px 24px rgba(245,158,11,0.3)',
                    transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
            >
                {status === 'loading' ? (
                    <>
                        <svg style={{ animation: 'spin 1s linear infinite' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 12a9 9 0 11-6.219-8.56" />
                        </svg>
                        Securing Your Spot…
                    </>
                ) : (
                    <>
                        {ctaText || 'Reserve My Spot'}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </>
                )}
            </button>

            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '12px', marginTop: '16px', lineHeight: 1.5 }}>
                🔒 100% free · No spam, ever · Unsubscribe any time
            </p>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                input::placeholder { color: rgba(255,255,255,0.3); }
            `}</style>
        </form>
    );
}
