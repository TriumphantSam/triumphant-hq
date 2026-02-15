import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({ slug: post.slug }));
}

const categoryColors: Record<string, string> = {
    'Personal Growth': '#00ff88',
    'SEO Tips': '#00ccff',
    'AI & Tech': '#a855f7',
    'General': '#f59e0b',
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) notFound();

    const catColor = categoryColors[post.category] || '#f59e0b';

    // Simple markdown-to-HTML (headings, bold, links, lists, paragraphs)
    const renderContent = (md: string) => {
        const lines = md.split('\n');
        const elements: React.ReactNode[] = [];
        let i = 0;

        while (i < lines.length) {
            const line = lines[i].trim();

            if (!line) { i++; continue; }

            // Headings
            if (line.startsWith('## ')) {
                elements.push(
                    <h2 key={i} style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-color)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                        {line.slice(3)}
                    </h2>
                );
            } else if (line.startsWith('### ')) {
                elements.push(
                    <h3 key={i} style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--secondary-color)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                        {line.slice(4)}
                    </h3>
                );
            }
            // List items
            else if (line.startsWith('- ')) {
                const listItems: React.ReactNode[] = [];
                while (i < lines.length && lines[i].trim().startsWith('- ')) {
                    const text = lines[i].trim().slice(2);
                    listItems.push(
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <span style={{ color: catColor, marginTop: '0.2rem' }}>•</span>
                            <span dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text-primary)">$1</strong>').replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: var(--accent-color); text-decoration: underline">$1</a>') }} />
                        </li>
                    );
                    i++;
                }
                elements.push(
                    <ul key={`list-${i}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                        {listItems}
                    </ul>
                );
                continue;
            }
            // Paragraphs
            else {
                elements.push(
                    <p
                        key={i}
                        style={{ lineHeight: 1.8, marginBottom: '1rem' }}
                        dangerouslySetInnerHTML={{
                            __html: line
                                .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text-primary)">$1</strong>')
                                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: var(--accent-color); text-decoration: underline">$1</a>'),
                        }}
                    />
                );
            }
            i++;
        }
        return elements;
    };

    return (
        <div className="min-h-screen">
            {/* Back link */}
            <section
                className="max-w-screen-md mx-auto px-6 sm:px-10 lg:px-16"
                style={{ paddingTop: '3rem' }}
            >
                <Link
                    href="/tech-diary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.9rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem' }}
                >
                    ← Back to Tech Diary
                </Link>
            </section>

            {/* Post */}
            <article
                className="max-w-screen-md mx-auto px-6 sm:px-10 lg:px-16"
                style={{ paddingBottom: '6rem' }}
            >
                {/* Meta */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <span
                        style={{
                            fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.75rem', borderRadius: '9999px',
                            background: `${catColor}18`, border: `1px solid ${catColor}40`, color: catColor,
                        }}
                    >
                        {post.category}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>· {post.readTime}</span>
                </div>

                {/* Title */}
                <h1
                    className="gradient-text"
                    style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.25, marginBottom: '2rem' }}
                >
                    {post.title}
                </h1>

                {/* Content */}
                <div style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                    {renderContent(post.content)}
                </div>

                {/* Divider + CTA */}
                <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '3rem', paddingTop: '2rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        Enjoyed this post? Check out more in the Tech Diary.
                    </p>
                    <Link
                        href="/tech-diary"
                        style={{
                            display: 'inline-block', padding: '0.7rem 2rem', fontSize: '0.9rem', fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '0.75rem',
                            border: '1px solid var(--accent-color)', color: 'var(--accent-color)',
                            textDecoration: 'none', transition: 'all 0.2s',
                        }}
                    >
                        View All Posts →
                    </Link>
                </div>
            </article>
        </div>
    );
}
