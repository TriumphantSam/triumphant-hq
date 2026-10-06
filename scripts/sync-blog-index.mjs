/**
 * Writes content/blog-index.json from content/blog/*.md.
 * The sitemap imports that JSON so blog URLs stay in the server bundle
 * even when the Vercel file trace omits the markdown directory.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const blogDir = path.join(root, "content", "blog");
const outFile = path.join(root, "content", "blog-index.json");

if (!fs.existsSync(blogDir)) {
  console.error("sync-blog-index: content/blog is missing");
  process.exit(1);
}

const entries = fs
  .readdirSync(blogDir)
  .filter((file) => file.endsWith(".md"))
  .map((file) => {
    const raw = fs.readFileSync(path.join(blogDir, file), "utf8");
    const { data } = matter(raw);
    return {
      slug: file.replace(/\.md$/, ""),
      title: String(data.title ?? ""),
      date: String(data.date ?? ""),
      updated: data.updated ? String(data.updated) : undefined,
      published: data.published !== false,
    };
  })
  .filter((post) => post.published && post.date)
  .map(({ published, ...post }) => post)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

if (entries.length === 0) {
  console.error("sync-blog-index: no published posts found");
  process.exit(1);
}

fs.writeFileSync(outFile, `${JSON.stringify(entries, null, 2)}\n`);
console.log(`sync-blog-index: wrote ${entries.length} posts`);
