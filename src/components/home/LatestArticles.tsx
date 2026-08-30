import { Section } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArticleCard } from "@/components/content/ArticleCard";
import { CtaButton } from "@/components/ui/CtaButton";
import { getAllPosts, toArticleSummary } from "@/lib/content";

export function LatestArticles() {
  const latest = getAllPosts().slice(1, 4).map(toArticleSummary);

  return (
    <Section tone="paper-dim">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="From the blog" title="Latest From The Blog" />
        <CtaButton href="/blog" variant="secondary" size="md">
          View All Articles
        </CtaButton>
      </div>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {latest.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </Section>
  );
}
