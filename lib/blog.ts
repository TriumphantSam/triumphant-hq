import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import blogIndex from '@/content/blog-index.json';

export interface BlogPost {
    slug: string;
    title: string;
    /** Title tag when the visible headline is longer than 60 characters. */
    metaTitle?: string;
    date: string;
    /** ISO date of the last substantive edit. Falls back to `date` for sitemap lastmod. */
    updated?: string;
    excerpt: string;
    category: string;
    readTime: string;
    content: string;
    published: boolean;
    productHref?: string;
    ctaLabel?: string;
    serviceHref?: string;
    serviceCtaLabel?: string;
    serviceCtaTitle?: string;
    serviceCtaDescription?: string;
    faqSchema: Array<{ question: string; answer: string }>;
    relatedLinks: Array<{ label: string; href: string }>;
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function parsePost(filename: string): BlogPost {
    const filePath = path.join(BLOG_DIR, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);

    return {
        slug: filename.replace('.md', ''),
        title: data.title ?? 'Untitled',
        metaTitle: data.metaTitle || undefined,
        date: data.date ?? '',
        updated: data.updated || undefined,
        excerpt: data.excerpt ?? '',
        category: data.category ?? 'General',
        readTime: data.readTime ?? '3 min read',
        content,
        published: data.published !== false,
        productHref: data.productHref ?? '',
        ctaLabel: data.ctaLabel ?? '',
        serviceHref: data.serviceHref ?? '',
        serviceCtaLabel: data.serviceCtaLabel ?? '',
        serviceCtaTitle: data.serviceCtaTitle ?? '',
        serviceCtaDescription: data.serviceCtaDescription ?? '',
        faqSchema: Array.isArray(data.faqSchema) ? data.faqSchema : [],
        relatedLinks: Array.isArray(data.relatedLinks) ? data.relatedLinks : [],
    };
}

export function getAllPosts(includeDrafts = false): BlogPost[] {
    if (!fs.existsSync(BLOG_DIR)) return [];

    const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));

    const posts = files.map(parsePost).filter((post) => includeDrafts || post.published);

    // Sort newest first
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export type BlogSitemapEntry = {
    slug: string;
    date: string;
    updated?: string;
};

/**
 * Posts for the sitemap.
 * Prefer the markdown directory when it is present (local builds and static generation).
 * If the directory is missing — which happens when the Vercel sitemap function is traced
 * without content/blog — fall back to the JSON index bundled with this module.
 */
export function getBlogSitemapEntries(): BlogSitemapEntry[] {
    if (fs.existsSync(BLOG_DIR)) {
        const posts = getAllPosts();
        if (posts.length > 0) {
            return posts.map((post) => ({
                slug: post.slug,
                date: post.date,
                updated: post.updated,
            }));
        }
    }

    return (blogIndex as BlogSitemapEntry[]).map((post) => ({
        slug: post.slug,
        date: post.date,
        updated: post.updated,
    }));
}

export function getPostBySlug(slug: string, includeDrafts = false): BlogPost | null {
    const filePath = path.join(BLOG_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) return null;

    const post = parsePost(`${slug}.md`);
    if (!includeDrafts && !post.published) return null;
    return post;
}
