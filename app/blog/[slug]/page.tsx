import type { Metadata } from 'next';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { resolveBlogCta } from '@/lib/blog-cta';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import NextStepPanel from '@/components/marketing/NextStepPanel';
import JsonLd from '@/components/seo/JsonLd';
import { articleJsonLd, buildPageMetadata } from '@/lib/seo';

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return {};
    return buildPageMetadata({
        title: post.title,
        description: post.excerpt || `${post.title} — insights from Triumphant HQ.`,
        path: `/blog/${post.slug}`,
        keywords: [post.category, 'Triumphant HQ blog', 'digital growth Nigeria'],
    });
}

const categoryColors: Record<string, string> = {
    'AI & Automation': '#00ff88',
    'Digital Products': '#00ccff',
    'Sales & Funnels': '#f59e0b',
    'Workflow Design': '#a855f7',
    'Market Intelligence': '#ff6b6b',
    'General': '#f59e0b',
};

function renderInlineMarkdown(text: string) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text-primary)">$1</strong>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: var(--accent-color); text-decoration: underline">$1</a>');
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) notFound();

    const catColor = categoryColors[post.category] || '#f59e0b';
    const cta = resolveBlogCta(post);

    const renderContent = (md: string) => {
        const lines = md.split('\n');
        const elements: React.ReactNode[] = [];
        let i = 0;

        while (i < lines.length) {
            const line = lines[i].trim();

            if (!line) {
                i++;
                continue;
            }

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
            } else if (line.startsWith('|') && i + 1 < lines.length && lines[i + 1].trim().startsWith('|')) {
                const tableLines: string[] = [];
                while (i < lines.length && lines[i].trim().startsWith('|')) {
                    tableLines.push(lines[i].trim());
                    i++;
                }
                const rows = tableLines
                    .map((entry) => entry.split('|').slice(1, -1).map((cell) => cell.trim()))
                    .filter((cells) => cells.length > 0);
                const header = rows[0] || [];
                const body = rows.slice(2);
                elements.push(
                    <div key={`table-${i}`} style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                            <thead>
                                <tr>
                                    {header.map((cell, idx) => (
                                        <th
                                            key={`${i}-h-${idx}`}
                                            style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
                                            dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(cell) }}
                                        />
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {body.map((row, rowIndex) => (
                                    <tr key={`${i}-r-${rowIndex}`}>
                                        {row.map((cell, cellIndex) => (
                                            <td
                                                key={`${i}-c-${rowIndex}-${cellIndex}`}
                                                style={{ padding: '0.75rem', borderBottom: '1px solid #64748b', color: 'var(--text-secondary)', verticalAlign: 'top' }}
                                                dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(cell) }}
                                            />
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
                continue;
            } else if (line.startsWith('- ')) {
                const listItems: React.ReactNode[] = [];
                while (i < lines.length && lines[i].trim().startsWith('- ')) {
                    const text = lines[i].trim().slice(2);
                    listItems.push(
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <span style={{ color: catColor, marginTop: '0.2rem' }}>•</span>
                            <span dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(text) }} />
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
            } else {
                elements.push(
                    <p
                        key={i}
                        style={{ lineHeight: 1.8, marginBottom: '1rem' }}
                        dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(line) }}
                    />
                );
            }

            i++;
        }
        return elements;
    };

    const faqSchema = post.faqSchema.length > 0
        ? {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: post.faqSchema.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.answer,
                },
            })),
        }
        : null;

    return (
        <div className="min-h-screen">
            <JsonLd
                data={articleJsonLd({
                    title: post.title,
                    description: post.excerpt || post.title,
                    path: `/blog/${post.slug}`,
                    datePublished: post.date,
                })}
            />
            {faqSchema ? (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            ) : null}

            <section
                className="max-w-screen-md mx-auto px-6 sm:px-10 lg:px-16"
                style={{ paddingTop: '3rem' }}
            >
                <Link
                    href="/blog"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.9rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem' }}
                >
                    ← Back to Blog
                </Link>
            </section>

            <article
                className="max-w-screen-md mx-auto px-6 sm:px-10 lg:px-16"
                style={{ paddingBottom: '6rem' }}
            >
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

                <h1
                    className="gradient-text"
                    style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.25, marginBottom: '1rem' }}
                >
                    {post.title}
                </h1>

                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                    {post.excerpt}
                </p>

                <div style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                    {renderContent(post.content)}
                </div>

                {post.relatedLinks.length > 0 ? (
                    <div className="next-step-panel mt-10">
                        <p className="eyebrow">Related links</p>
                        <div className="mt-5 flex flex-col gap-3">
                            {post.relatedLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-[1.02rem] font-medium text-blue-600 transition hover:text-blue-800"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : null}

                <div className="mt-12">
                    <NextStepPanel
                        eyebrow={cta.eyebrow}
                        title={cta.title}
                        description={cta.description}
                        actions={[
                            {
                                href: cta.primary.href,
                                label: cta.primary.label,
                                variant: "primary",
                            },
                            {
                                href: cta.secondary.href,
                                label: cta.secondary.label,
                                variant: "secondary",
                            },
                        ]}
                    />
                </div>
            </article>
        </div>
    );
}
