import { getAllPosts } from '@/lib/blog';
import Link from 'next/link';

const categoryColors: Record<string, string> = {
    'AI & Automation': '#00ff88',
    'Digital Products': '#00ccff',
    'Sales & Funnels': '#f59e0b',
    'Workflow Design': '#a855f7',
    'Market Intelligence': '#ff6b6b',
    'General': '#f59e0b',
};

export default async function BlogPage() {
    const posts = getAllPosts();

    return (
        <div className="min-h-screen">
            <section
                className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16"
                style={{ paddingTop: '8rem', paddingBottom: '3rem', textAlign: 'center' }}
            >
                <p
                    className="uppercase tracking-widest text-sm font-semibold mb-4"
                    style={{ color: 'var(--accent-color)', letterSpacing: '0.25em' }}
                >
                    Blog
                </p>
                <h1
                    className="gradient-text"
                    style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem' }}
                >
                    Practical articles that turn interest into action
                </h1>
                <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', color: 'var(--text-secondary)', maxWidth: 700, margin: '0 auto', lineHeight: 1.7 }}>
                    Useful breakdowns, local examples, and implementation notes built around the Digital Forge products and the real problems founders, creators, and operators face.
                </p>
            </section>

            <section
                className="max-w-screen-lg mx-auto px-6 sm:px-10 lg:px-16"
                style={{ paddingBottom: '6rem' }}
            >
                {posts.length === 0 ? (
                    <div className="glass rounded-2xl" style={{ padding: '4rem', textAlign: 'center' }}>
                        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📝</span>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-color)', marginBottom: '0.5rem' }}>
                            Fresh articles are on the way
                        </h2>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            The next product-backed journal entry will land here automatically.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {posts.map((post) => {
                            const catColor = categoryColors[post.category] || '#f59e0b';
                            return (
                                <Link
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
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

                                        <h2 style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                                            {post.title}
                                        </h2>

                                        <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                            {post.excerpt}
                                        </p>

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
