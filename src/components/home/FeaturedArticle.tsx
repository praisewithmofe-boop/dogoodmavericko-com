import Link from "next/link";
import { Section } from "@/components/layout/PageContainer";
import { ContentThumbnail } from "@/components/ui/ContentThumbnail";
import { CtaButton } from "@/components/ui/CtaButton";
import { resolveBlogImage } from "@/lib/thumbnails";
import { getAllPosts } from "@/lib/content";
import { formatDate } from "@/lib/format";

export function FeaturedArticle() {
  const [post] = getAllPosts();
  if (!post) return null;

  return (
    <Section tone="paper">
      <span className="mb-8 block text-meta font-semibold uppercase tracking-[0.04em] text-gold-dark">
        Featured Article
      </span>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <Link href={`/blog/${post.slug}`} className="group block">
          <ContentThumbnail
            src={resolveBlogImage(post)}
            alt={`Dogood Mavericko — ${post.title}`}
            ratio="16/9"
          />
        </Link>

        <div className="flex flex-col justify-center gap-5">
          <span className="text-meta font-semibold uppercase tracking-[0.04em] text-gold-dark">
            {post.category}
          </span>
          <Link href={`/blog/${post.slug}`} className="group">
            <h2 className="text-h2 font-semibold text-charcoal transition-colors duration-200 group-hover:text-gold-dark">
              {post.title}
            </h2>
          </Link>

          <p className="text-body-lg text-slate">{post.excerpt}</p>

          <div className="flex items-center gap-3 pt-1 text-meta uppercase tracking-[0.04em] text-slate">
            <span>{formatDate(post.publishedAt)}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readTime}</span>
          </div>

          <div className="mt-2">
            <CtaButton href={`/blog/${post.slug}`} variant="secondary" size="md">
              Read Article →
            </CtaButton>
          </div>
        </div>
      </div>
    </Section>
  );
}
