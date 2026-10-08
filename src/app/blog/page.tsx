import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getPageOgImagePath } from "@/lib/og-images";
import { Section } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeaturedArticle } from "@/components/blog/FeaturedArticle";
import { BlogIndexClient } from "@/components/blog/BlogIndexClient";
import { getAllPosts, toArticleSummary } from "@/lib/content";
import { BLOG_CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description: "Articles on faith, freedom, entrepreneurship, and building an online lifestyle business.",
  path: "/blog",
  image: getPageOgImagePath("blog"),
});

export default function BlogPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="flex flex-col">
      <Section tone="paper">
        <SectionHeading
          as="h1"
          eyebrow="The Blog"
          title="Ideas Worth Building A Life Around"
          description="Faith, freedom, entrepreneurship, and everything in between — the same ideas that have made the biggest difference in my own life."
        />
      </Section>

      {featured ? <FeaturedArticle article={featured} /> : null}

      <Section tone="paper-dim">
        <SectionHeading eyebrow="Browse" title="Latest Articles" className="mb-10" />
        <BlogIndexClient articles={rest.map(toArticleSummary)} categories={BLOG_CATEGORIES} />
      </Section>
    </div>
  );
}
