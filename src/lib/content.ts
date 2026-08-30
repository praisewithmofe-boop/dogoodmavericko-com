import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { calculateReadTime, formatDate } from "@/lib/format";
import type { ArticleSummary, BlogPost, BlogPostMeta } from "@/types/content";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function readPostFile(filename: string): BlogPost {
  const slug = filename.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title,
    excerpt: data.excerpt,
    category: data.category,
    author: data.author ?? "Dogood Mavericko",
    publishedAt: data.publishedAt,
    updatedAt: data.updatedAt,
    readTime: data.readTime ?? calculateReadTime(content),
    image: data.image,
    draft: Boolean(data.draft),
    content,
  };
}

export function getAllPosts(): BlogPost[] {
  const filenames = fs.readdirSync(BLOG_DIR).filter((name) => name.endsWith(".mdx"));

  return filenames
    .map(readPostFile)
    .filter((post) => !post.draft)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;
  return readPostFile(`${slug}.mdx`);
}

export function getRelatedPosts(post: BlogPost, count = 3): BlogPost[] {
  const others = getAllPosts().filter((p) => p.slug !== post.slug);
  const sameCategory = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  return [...sameCategory, ...rest].slice(0, count);
}

export function toArticleSummary(post: BlogPostMeta): ArticleSummary {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    publishedAt: formatDate(post.publishedAt),
    readTime: post.readTime,
    image: post.image,
  };
}
