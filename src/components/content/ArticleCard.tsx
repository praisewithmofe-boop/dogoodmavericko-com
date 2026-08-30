import Link from "next/link";
import { ContentThumbnail } from "@/components/ui/ContentThumbnail";
import { resolveBlogImage } from "@/lib/thumbnails";
import type { ArticleSummary } from "@/types/content";

interface ArticleCardProps {
  article: ArticleSummary;
  className?: string;
}

export function ArticleCard({ article, className = "" }: ArticleCardProps) {
  return (
    <Link href={`/blog/${article.slug}`} className={`group flex flex-col gap-4 ${className}`}>
      <ContentThumbnail
        src={resolveBlogImage(article.image)}
        alt={`Dogood Mavericko — ${article.title}`}
        ratio="16/9"
      />

      <div className="flex flex-col gap-2">
        <span className="text-meta font-semibold uppercase tracking-[0.04em] text-gold-dark">
          {article.category}
        </span>
        <h3 className="text-h3 font-semibold text-charcoal transition-colors duration-200 group-hover:text-gold-dark">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-body text-slate">{article.excerpt}</p>
        <div className="flex items-center gap-2 pt-1 text-meta uppercase tracking-[0.04em] text-slate">
          <span>{article.publishedAt}</span>
          <span aria-hidden="true">·</span>
          <span>{article.readTime}</span>
        </div>
      </div>
    </Link>
  );
}
