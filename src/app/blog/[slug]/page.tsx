import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Section, PageContainer } from "@/components/layout/PageContainer";
import { ContentThumbnail } from "@/components/ui/ContentThumbnail";
import { ArticleCard } from "@/components/content/ArticleCard";
import { NewsletterSignup } from "@/components/conversion/NewsletterSignup";
import { Terrific30OptIn } from "@/components/home/Terrific30OptIn";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { proseComponents } from "@/components/content/ArticleProse";
import { getAllPosts, getPostBySlug, getRelatedPosts, toArticleSummary } from "@/lib/content";
import { resolveBlogImage } from "@/lib/thumbnails";
import { formatDate } from "@/lib/format";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} — Dogood Mavericko`,
    description: post.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post).map(toArticleSummary);

  return (
    <article className="flex flex-col">
      <Section tone="paper">
        <div className="mx-auto flex max-w-prose flex-col gap-5">
          <span className="text-meta font-semibold uppercase tracking-[0.04em] text-gold-dark">
            {post.category}
          </span>
          <h1 className="text-display font-semibold text-charcoal">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-meta uppercase tracking-[0.04em] text-slate">
            <span>{post.author}</span>
            <span aria-hidden="true">·</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </Section>

      <PageContainer className="mb-16">
        <ContentThumbnail
          src={resolveBlogImage(post)}
          alt={`Dogood Mavericko — ${post.title}`}
          ratio="16/9"
          priority
          sizes="(min-width: 1024px) 896px, 100vw"
          className="mx-auto max-w-4xl"
        />
      </PageContainer>

      <PageContainer>
        <div className="mx-auto max-w-prose">
          <MDXRemote source={post.content} components={proseComponents} />
        </div>
      </PageContainer>

      <PageContainer className="mt-4 mb-16">
        <div className="mx-auto max-w-prose">
          <ShareButtons title={post.title} path={`/blog/${post.slug}`} />
        </div>
      </PageContainer>

      {related.length > 0 ? (
        <Section tone="paper-dim">
          <h2 className="mb-10 text-h3 font-semibold text-charcoal">Related Articles</h2>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </Section>
      ) : null}

      <Section tone="paper">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <NewsletterSignup />
        </div>
      </Section>

      <Terrific30OptIn />

      <PageContainer className="py-10 text-center">
        <Link
          href="/blog"
          className="text-button font-medium uppercase tracking-[0.02em] text-gold-dark underline underline-offset-4"
        >
          ← Back To All Articles
        </Link>
      </PageContainer>
    </article>
  );
}
