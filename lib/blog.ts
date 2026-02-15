import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    category: string;
    readTime: string;
    content: string;
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export function getAllPosts(): BlogPost[] {
    if (!fs.existsSync(BLOG_DIR)) return [];

    const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));

    const posts: BlogPost[] = files.map((filename) => {
        const filePath = path.join(BLOG_DIR, filename);
        const raw = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(raw);

        return {
            slug: filename.replace('.md', ''),
            title: data.title ?? 'Untitled',
            date: data.date ?? '',
            excerpt: data.excerpt ?? '',
            category: data.category ?? 'General',
            readTime: data.readTime ?? '3 min read',
            content,
        };
    });

    // Sort newest first
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
    const filePath = path.join(BLOG_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) return null;

    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);

    return {
        slug,
        title: data.title ?? 'Untitled',
        date: data.date ?? '',
        excerpt: data.excerpt ?? '',
        category: data.category ?? 'General',
        readTime: data.readTime ?? '3 min read',
        content,
    };
}
