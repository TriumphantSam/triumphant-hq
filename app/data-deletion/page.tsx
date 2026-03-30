'use client';

import Link from 'next/link';

export default function DataDeletionPage() {
    return (
        <div className="min-h-screen" style={{ paddingBottom: '6rem' }}>
            {/* ─── HERO ─── */}
            <section
                className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16 text-center"
                style={{ paddingTop: '5rem', paddingBottom: '3rem', position: 'relative' }}
            >
                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Badge */}
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.4rem 1.2rem',
                            border: '1px solid rgba(0,102,255,0.4)',
                            borderRadius: '2px',
                            background: 'rgba(0,102,255,0.06)',
                            marginBottom: '1.5rem',
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            color: 'var(--accent-color)',
                            fontWeight: 700,
                        }}
                    >
                        <span
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: 'var(--accent-color)',
                                display: 'inline-block',
                            }}
                        />
                        Meta / Facebook Compliance
                    </div>

                    <h1
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-5"
                        style={{ color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em' }}
                    >
                        Digital Forge / ForgeGrid Data Deletion Instructions
                    </h1>
                </div>
            </section>

            {/* ─── MAIN CONTENT ─── */}
            <div className="max-w-screen-md mx-auto px-6 sm:px-10" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                <div className="glass" style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)', borderRadius: '8px' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: 1.8 }}>
                        To delete your user data and activities associated with our Meta/Facebook application, please follow these steps:
                    </p>

                    <ol style={{ 
                        color: 'var(--text-secondary)', 
                        fontSize: '1.05rem', 
                        lineHeight: 1.8, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '1.2rem',
                        paddingLeft: '1.5rem',
                        marginBottom: '2rem'
                    }}>
                        <li>Go to your <strong>Facebook Account&apos;s Settings &amp; Privacy</strong>. Click <strong>Settings</strong>.</li>
                        <li>Look for <strong>Apps and Websites</strong> and you will see all of the apps you have linked.</li>
                        <li>Search and click <strong>Digital Forge</strong> or <strong>ForgeGrid</strong> in the search bar.</li>
                        <li>Scroll and click <strong>Remove</strong>.</li>
                    </ol>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8 }}>
                        If you wish to request a manual deletion of any specific data stored on our servers, please email us at <a href="mailto:admin@triumphantetech.com" style={{ color: 'var(--accent-color)', textDecoration: 'underline' }}>admin@triumphantetech.com</a> with your request.
                    </p>
                </div>

                {/* Related links */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: '1rem',
                    }}
                >
                    <Link
                        href="/privacy-policy"
                        className="glass glass-hover"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.6rem 1.25rem',
                            borderRadius: '4px',
                            color: 'var(--text-secondary)',
                            fontSize: '0.85rem',
                            textDecoration: 'none',
                        }}
                    >
                        🔒 Privacy Policy
                    </Link>
                    <Link
                        href="/contact"
                        className="glass glass-hover"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.6rem 1.25rem',
                            borderRadius: '4px',
                            color: 'var(--text-secondary)',
                            fontSize: '0.85rem',
                            textDecoration: 'none',
                        }}
                    >
                        📬 Contact Us
                    </Link>
                </div>
            </div>
        </div>
    );
}
