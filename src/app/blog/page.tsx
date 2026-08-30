import type { Metadata } from "next";
import { Suspense } from "react";
import { Section } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeaturedArticle } from "@/components/blog/FeaturedArticle";
import { BlogIndexClient } from "@/components/blog/BlogIndexClient";
import { getAllPosts, toArticleSummary } from "@/lib/content";
import { BLOG_CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog — Dogood Mavericko",
  description:
    "Articles on faith, freedom, entrepreneurship, and building an online lifestyle business.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="flex flex-col">
      <Section tone="paper">
        <SectionHeading
          eyebrow="The Blog"
          title="Ideas Worth Building A Life Around"
          description="Faith, freedom, entrepreneurship, and everything in between — the same ideas that have made the biggest difference in my own life."
        />
      </Section>

      {featured ? <FeaturedArticle article={featured} /> : null}

      <Section tone="paper-dim">
        <SectionHeading eyebrow="Browse" title="Latest Articles" className="mb-10" />
        {/* useSearchParams() (for the ?category= deep link) only works on the
            client, and Next requires a Suspense boundary around it so the
            rest of this page can still be statically exported. */}
        <Suspense fallback={null}>
          <BlogIndexClient articles={rest.map(toArticleSummary)} categories={BLOG_CATEGORIES} />
        </Suspense>
      </Section>
    </div>
  );
}
