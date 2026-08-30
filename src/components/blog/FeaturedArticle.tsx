import Link from "next/link";
import { Section } from "@/components/layout/PageContainer";
import { ContentThumbnail } from "@/components/ui/ContentThumbnail";
import { CtaButton } from "@/components/ui/CtaButton";
import { resolveBlogImage } from "@/lib/thumbnails";
import { formatDate } from "@/lib/format";
import type { BlogPostMeta } from "@/types/content";

interface FeaturedArticleProps {
  article: BlogPostMeta;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <Section tone="paper">
      <span className="mb-8 block text-meta font-semibold uppercase tracking-[0.04em] text-gold-dark">
        Featured Article
      </span>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <Link href={`/blog/${article.slug}`} className="group block">
          <ContentThumbnail
            src={resolveBlogImage(article.image)}
            alt={`Dogood Mavericko — ${article.title}`}
            ratio="16/9"
            priority
          />
        </Link>

        <div className="flex flex-col justify-center gap-5">
          <span className="text-meta font-semibold uppercase tracking-[0.04em] text-gold-dark">
            {article.category}
          </span>
          <Link href={`/blog/${article.slug}`} className="group">
            <h2 className="text-h2 font-semibold text-charcoal transition-colors duration-200 group-hover:text-gold-dark">
              {article.title}
            </h2>
          </Link>
          <p className="text-body-lg text-slate">{article.excerpt}</p>
          <div className="flex items-center gap-3 pt-1 text-meta uppercase tracking-[0.04em] text-slate">
            <span>{article.author}</span>
            <span aria-hidden="true">·</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readTime}</span>
          </div>
          <div className="mt-2">
            <CtaButton href={`/blog/${article.slug}`} variant="secondary" size="md">
              Read Article →
            </CtaButton>
          </div>
        </div>
      </div>
    </Section>
  );
}
