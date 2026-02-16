'use client';

import { useState } from 'react';

const timelineData = [
    {
        year: '2017–2019',
        title: 'Foundation Years',
        icon: '🏁',
        color: '#0066FF',
        description: 'Started in a local internet café serving the biggest Forum in Africa and providing essential services to the community.',
        highlights: ['Nairaland Moderator', 'Document typing & printing', 'Email & internet support', 'School portal registrations', 'Building community trust'],
    },
    {
        year: '2019–Present',
        title: 'Technical Expertise',
        icon: '🔧',
        color: '#00CCFF',
        description: 'Expanded into technical support and hardware services, becoming a trusted HP and Microsoft partner.',
        highlights: ['HP printer setup & troubleshooting', 'Microsoft 365 support', 'Hardware diagnostics & repair', 'NIMC registration services'],
    },
    {
        year: '2021–Present',
        title: 'Digital Growth',
        icon: '📈',
        color: '#3385FF',
        description: 'Pivoted into SEO and digital marketing, helping businesses grow their online presence.',
        highlights: ['SEO strategy & implementation', 'WordPress website management', 'Content optimization', '40% organic traffic growth for clients'],
    },
    {
        year: '2023–Present',
        title: 'AI & Innovation',
        icon: '🤖',
        color: '#00A3CC',
        description: 'Embracing the AI revolution with data consulting and productivity solutions.',
        highlights: ['AI data annotation & QA', 'Human-in-the-Loop services', 'AI-enhanced productivity consulting', 'Continuous learning & adaptation'],
    },
];

const skills = [
    { icon: '🏪', title: 'Local Services', color: '#0066FF', items: ['NIMC Registration', 'JAMB/WAEC/NECO', 'Document Services', 'Internet Support'] },
    { icon: '💻', title: 'Technical Support', color: '#00CCFF', items: ['HP Printer Support', 'Microsoft 365', 'Hardware Repair', 'Software Installation'] },
    { icon: '🌐', title: 'SEO & Web', color: '#3385FF', items: ['Search Optimization', 'WordPress Management', 'Online Ads', 'Analytics & Reporting'] },
    { icon: '🧠', title: 'AI & Data', color: '#00A3CC', items: ['Data Annotation', 'Quality Assurance', 'Prompt Engineering', 'Model Evaluation'] },
    { icon: '⚡', title: 'Productivity', color: '#0066FF', items: ['AI Tool Integration', 'Workflow Automation', 'Team Training', 'Process Optimization'] },
    { icon: '👨‍💻', title: 'Development', color: '#00CCFF', items: ['Next.js / React', 'JavaScript / TypeScript', 'Modern Web Design', '"Vibe Coding"'] },
];

export default function AboutPage() {
    const [activeTimeline, setActiveTimeline] = useState(0);

    return (
        <div className="min-h-screen">
            {/* ===================== HERO SECTION ===================== */}
            <section
                className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16"
                style={{ paddingTop: '5rem', paddingBottom: '4rem', textAlign: 'center' }}
            >
                <p
                    className="uppercase tracking-widest text-sm font-semibold mb-4"
                    style={{ color: 'var(--accent-color)', letterSpacing: '0.25em' }}
                >
                    Who We Are
                </p>
                <h1
                    className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 gradient-text"
                    style={{ lineHeight: 1.15 }}
                >
                    About Triumphant&nbsp;HQ
                </h1>
                <p
                    className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    Bridging the gap between essential local tech services and cutting-edge digital solutions  <strong style={{ color: 'var(--secondary-color)' }}></strong>.
                </p>
            </section>

            {/* ===================== OUR STORY ===================== */}
            <section className="max-w-screen-lg mx-auto px-6 sm:px-10 lg:px-16" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
                <div
                    className="glass rounded-3xl overflow-hidden"
                    style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0 }}
                >
                    {/* Accent bar */}
                    <div style={{ height: 4, background: 'linear-gradient(90deg, var(--accent-color), var(--secondary-color))' }} />

                    <div style={{ padding: 'clamp(2rem, 5vw, 3.5rem)' }}>
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6" style={{ color: 'var(--accent-color)' }}>
                            Our Story
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: 'var(--text-secondary)', fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', lineHeight: 1.8 }}>
                            <p>
                                What started as a personal passion for providing essential services has evolved into a comprehensive tech solutions provider. We understand the unique challenges of operating in Nigeria's tech landscape.
                            </p>
                            <p>
                                From helping citizens register their NIN and providing student registration solutions to optimizing websites for global search engines, we've seen it all — and we've mastered the art of delivering reliable solutions in both worlds.
                            </p>
                            <p>
                                Today, Triumphant Tech Services stands as a testament to adaptability and growth. We're not just keeping pace with technology — we're helping our clients leverage it, whether they need local solutions or professional services.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================== TIMELINE ===================== */}
            <section className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
                <p
                    className="uppercase tracking-widest text-sm font-semibold mb-2 text-center"
                    style={{ color: 'var(--secondary-color)', letterSpacing: '0.25em' }}
                >
                    Our Journey
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center gradient-text">
                    7+ Years of Growth
                </h2>

                {/* Timeline navigation tabs */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        marginBottom: '2.5rem',
                        flexWrap: 'wrap',
                    }}
                >
                    {timelineData.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveTimeline(i)}
                            style={{
                                padding: '0.6rem 1.2rem',
                                borderRadius: '2px',
                                border: `1px solid ${activeTimeline === i ? item.color : 'var(--glass-border)'}`,
                                background: activeTimeline === i ? `${item.color}18` : 'var(--glass-bg)',
                                color: activeTimeline === i ? item.color : 'var(--text-secondary)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}
                        >
                            {item.icon} {item.year}
                        </button>
                    ))}
                </div>

                {/* Active timeline card */}
                <div
                    className="glass rounded-lg border border-[#0066FF]/20"
                    style={{
                        maxWidth: 720,
                        margin: '0 auto',
                        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                        borderLeft: `4px solid ${timelineData[activeTimeline].color}`,
                        transition: 'border-color 0.3s ease',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '2.5rem' }}>{timelineData[activeTimeline].icon}</span>
                        <div>
                            <h3 className="text-xl sm:text-2xl font-bold" style={{ color: timelineData[activeTimeline].color }}>
                                {timelineData[activeTimeline].title}
                            </h3>
                            <span className="text-sm uppercase tracking-wide opacity-80" style={{ color: 'var(--text-secondary)' }}>
                                {timelineData[activeTimeline].year}
                            </span>
                        </div>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.7 }}>
                        {timelineData[activeTimeline].description}
                    </p>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '0.75rem',
                        }}
                    >
                        {timelineData[activeTimeline].highlights.map((h, j) => (
                            <div
                                key={j}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: '2px',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--glass-border)',
                                    fontSize: '0.8rem',
                                    color: 'var(--text-secondary)',
                                }}
                            >
                                <span style={{ color: timelineData[activeTimeline].color }}>✓</span> {h}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Progress dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                    {timelineData.map((item, i) => (
                        <div
                            key={i}
                            onClick={() => setActiveTimeline(i)}
                            style={{
                                width: activeTimeline === i ? 40 : 12,
                                height: 4,
                                borderRadius: 0,
                                background: activeTimeline === i ? item.color : 'var(--glass-border)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                            }}
                        />
                    ))}
                </div>
            </section>

            {/* ===================== SKILLS ===================== */}
            <section className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
                <p
                    className="uppercase tracking-widest text-sm font-semibold mb-2 text-center"
                    style={{ color: 'var(--secondary-color)', letterSpacing: '0.25em' }}
                >
                    What We Do
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-white">
                    Skills & Expertise
                </h2>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '1.25rem',
                    }}
                >
                    {skills.map((skill, i) => (
                        <div
                            key={i}
                            className="glass glass-hover rounded-sm"
                            style={{
                                padding: '1.75rem',
                                borderTop: `3px solid ${skill.color}`,
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '1.75rem' }}>{skill.icon}</span>
                                <h3 className="text-lg font-bold" style={{ color: skill.color }}>
                                    {skill.title}
                                </h3>
                            </div>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {skill.items.map((item, j) => (
                                    <li
                                        key={j}
                                        style={{
                                            fontSize: '0.875rem',
                                            color: 'var(--text-secondary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                        }}
                                    >
                                        <span style={{ color: skill.color, fontSize: '0.6rem' }}>●</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===================== PHILOSOPHY ===================== */}
            <section className="max-w-screen-lg mx-auto px-6 sm:px-10 lg:px-16" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
                <div
                    className="glass rounded-3xl text-center"
                    style={{
                        padding: 'clamp(2rem, 5vw, 4rem)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Decorative quote mark */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '-1rem',
                            left: '2rem',
                            fontSize: '8rem',
                            color: 'var(--accent-color)',
                            opacity: 0.08,
                            fontFamily: 'Georgia, serif',
                            lineHeight: 1,
                            pointerEvents: 'none',
                        }}
                    >
                        "
                    </div>

                    <p
                        className="uppercase tracking-widest text-sm font-semibold mb-4"
                        style={{ color: 'var(--secondary-color)', letterSpacing: '0.25em' }}
                    >
                        Our Philosophy
                    </p>
                    <h2
                        className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 gradient-text"
                        style={{ lineHeight: 1.3 }}
                    >
                        "Technology should empower everyone, not just the tech&#8209;savvy."
                    </h2>
                    <p
                        className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        Whether you're a citizen registering for NIN or a business scaling globally, we believe in making technology accessible, understandable, and effective. We bridge the gap between where you are and where you want to be.
                    </p>
                </div>
            </section>

            {/* ===================== CTA ===================== */}
            <section className="max-w-screen-lg mx-auto px-6 sm:px-10 lg:px-16" style={{ paddingTop: '2rem', paddingBottom: '6rem', textAlign: 'center' }}>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--accent-color)' }}>
                    Ready to Work Together?
                </h2>
                <p className="text-base sm:text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
                    Let's bridge the gap between your current challenges and future success.
                </p>
                <a
                    href="/contact"
                    style={{
                        display: 'inline-block',
                        padding: '0.9rem 2.5rem',
                        fontSize: '1rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        borderRadius: '0.75rem',
                        background: 'var(--accent-color)',
                        color: '#000',
                        textDecoration: 'none',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                        (e.target as HTMLElement).style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.transform = 'translateY(0)';
                        (e.target as HTMLElement).style.boxShadow = 'none';
                    }}
                >
                    Get in Touch →
                </a>
            </section>
        </div>
    );
}
