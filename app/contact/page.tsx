'use client';

import { useState } from 'react';

const contactMethods = [
    { icon: '📧', title: 'Email', value: 'info@triumphanthq.com', href: 'mailto:info@triumphanthq.com', color: '#00ff88' },
    { icon: '📱', title: 'WhatsApp', value: '+234 800 000 0000', href: 'https://wa.me/2348000000000', color: '#00ccff' },
    { icon: '📍', title: 'Visit Us', value: 'No 4, Kolawole Close, Ibadan, Nigeria', href: '#', color: '#a855f7' },
];

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', service: '', message: '' });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        // Simulate sending — replace with real API (EmailJS, Formspree, etc.)
        await new Promise((r) => setTimeout(r, 1500));
        setSending(false);
        setSent(true);
        setFormData({ name: '', email: '', service: '', message: '' });
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '0.85rem 1rem',
        borderRadius: '0.75rem',
        border: '1px solid var(--glass-border)',
        background: 'var(--glass-bg)',
        color: 'var(--text-primary)',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'border-color 0.2s',
    };

    return (
        <div className="min-h-screen">
            {/* ===================== HERO ===================== */}
            <section
                className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16"
                style={{ paddingTop: '5rem', paddingBottom: '3rem', textAlign: 'center' }}
            >
                <p
                    className="uppercase tracking-widest text-sm font-semibold mb-4"
                    style={{ color: 'var(--accent-color)', letterSpacing: '0.25em' }}
                >
                    Get in Touch
                </p>
                <h1
                    className="gradient-text"
                    style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem' }}
                >
                    {"Let's Work Together"}
                </h1>
                <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', color: 'var(--text-secondary)', maxWidth: 550, margin: '0 auto', lineHeight: 1.7 }}>
                    Have a project in mind, need tech support, or want to explore how we can help? Reach out — we respond within 24 hours.
                </p>
            </section>

            {/* ===================== CONTACT METHODS ===================== */}
            <section
                className="max-w-screen-lg mx-auto px-6 sm:px-10 lg:px-16"
                style={{ paddingBottom: '3rem' }}
            >
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '1.25rem',
                    }}
                >
                    {contactMethods.map((m, i) => (
                        <a
                            key={i}
                            href={m.href}
                            target={m.href.startsWith('http') ? '_blank' : undefined}
                            rel={m.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="glass glass-hover rounded-2xl"
                            style={{
                                padding: '1.75rem',
                                textDecoration: 'none',
                                textAlign: 'center',
                                borderTop: `3px solid ${m.color}`,
                                transition: 'transform 0.3s, box-shadow 0.3s',
                            }}
                        >
                            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>{m.icon}</span>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: m.color, marginBottom: '0.35rem' }}>{m.title}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{m.value}</p>
                        </a>
                    ))}
                </div>
            </section>

            {/* ===================== FORM ===================== */}
            <section
                className="max-w-screen-md mx-auto px-6 sm:px-10 lg:px-16"
                style={{ paddingTop: '2rem', paddingBottom: '6rem' }}
            >
                <div
                    className="glass rounded-3xl"
                    style={{ padding: 'clamp(2rem, 5vw, 3rem)', position: 'relative', overflow: 'hidden' }}
                >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, var(--accent-color), var(--secondary-color))' }} />

                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-color)', marginBottom: '0.5rem' }}>
                        Send Us a Message
                    </h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Fill out the form and we will get back to you as soon as possible.
                    </p>

                    {sent ? (
                        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>✅</span>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-color)', marginBottom: '0.5rem' }}>
                                Message Sent!
                            </h3>
                            <p style={{ color: 'var(--text-secondary)' }}>{"We'll get back to you within 24 hours."}</p>
                            <button
                                onClick={() => setSent(false)}
                                style={{
                                    marginTop: '1.5rem', padding: '0.6rem 1.5rem', borderRadius: '0.75rem',
                                    border: '1px solid var(--glass-border)', background: 'transparent',
                                    color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem',
                                }}
                            >
                                Send Another Message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {/* Name & Email row */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="John Doe"
                                        style={inputStyle}
                                        onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="you@example.com"
                                        style={inputStyle}
                                        onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                                    />
                                </div>
                            </div>

                            {/* Service dropdown */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                                    Service Needed
                                </label>
                                <select
                                    value={formData.service}
                                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                    style={{ ...inputStyle, cursor: 'pointer', appearance: 'auto' }}
                                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                                >
                                    <option value="">Select a service...</option>
                                    <option value="nimc">NIMC Registration</option>
                                    <option value="school">School Registrations</option>
                                    <option value="internet">Internet Services</option>
                                    <option value="seo">SEO & Website Management</option>
                                    <option value="ai">AI Data Consulting</option>
                                    <option value="tech">Technical Support</option>
                                    <option value="productivity">AI-Enhanced Productivity</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Message */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                                    Your Message *
                                </label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Tell us about your project or how we can help..."
                                    style={{ ...inputStyle, resize: 'vertical' }}
                                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={sending}
                                style={{
                                    padding: '0.9rem 2.5rem',
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    borderRadius: '0.75rem',
                                    background: sending ? 'var(--glass-bg)' : 'var(--accent-color)',
                                    color: sending ? 'var(--text-secondary)' : '#000',
                                    border: 'none',
                                    cursor: sending ? 'wait' : 'pointer',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    alignSelf: 'flex-start',
                                }}
                            >
                                {sending ? 'Sending...' : 'Send Message →'}
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </div>
    );
}
