import { getAllPosts } from '@/lib/blog';
import Link from 'next/link';

const categoryColors: Record<string, string> = {
    'Personal Growth': '#00ff88',
    'SEO Tips': '#00ccff',
    'AI & Tech': '#a855f7',
    'General': '#f59e0b',
};

export default function TechDiaryPage() {
    const posts = getAllPosts();

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
                    Tech Diary
                </p>
                <h1
                    className="gradient-text"
                    style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem' }}
                >
                    Insights, Tutorials & Journey
                </h1>
                <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
                    Sharing what I learn as I re-learn code in the AI era, alongside practical tips for SEO, tech, and digital growth.
                </p>
            </section>

            {/* ===================== POSTS ===================== */}
            <section
                className="max-w-screen-lg mx-auto px-6 sm:px-10 lg:px-16"
                style={{ paddingBottom: '6rem' }}
            >
                {posts.length === 0 ? (
                    <div className="glass rounded-2xl" style={{ padding: '4rem', textAlign: 'center' }}>
                        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📝</span>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-color)', marginBottom: '0.5rem' }}>
                            Coming Soon
                        </h2>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Blog posts are on the way. Check back soon!
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {posts.map((post) => {
                            const catColor = categoryColors[post.category] || '#f59e0b';
                            return (
                                <Link
                                    key={post.slug}
                                    href={`/tech-diary/${post.slug}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <article
                                        className="glass glass-hover rounded-2xl"
                                        style={{
                                            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                                            borderLeft: `4px solid ${catColor}`,
                                            transition: 'transform 0.3s, box-shadow 0.3s',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {/* Meta row */}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                            <span
                                                style={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '9999px',
                                                    background: `${catColor}18`,
                                                    border: `1px solid ${catColor}40`,
                                                    color: catColor,
                                                }}
                                            >
                                                {post.category}
                                            </span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                · {post.readTime}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h2 style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                                            {post.title}
                                        </h2>

                                        {/* Excerpt */}
                                        <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                            {post.excerpt}
                                        </p>

                                        {/* Read more */}
                                        <span style={{ display: 'inline-block', marginTop: '0.75rem', fontSize: '0.85rem', fontWeight: 600, color: catColor }}>
                                            Read more →
                                        </span>
                                    </article>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
