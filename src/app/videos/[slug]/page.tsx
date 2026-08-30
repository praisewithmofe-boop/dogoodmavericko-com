import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Section, PageContainer } from "@/components/layout/PageContainer";
import { VideoPlayer } from "@/components/videos/VideoPlayer";
import { VideoCard } from "@/components/content/VideoCard";
import { ArticleCard } from "@/components/content/ArticleCard";
import { NewsletterSignup } from "@/components/conversion/NewsletterSignup";
import { Terrific30OptIn } from "@/components/home/Terrific30OptIn";
import { proseComponents } from "@/components/content/ArticleProse";
import { getAllVideos, getVideoBySlug, getRelatedVideos, toVideoSummary } from "@/lib/videos";
import { getAllPosts, toArticleSummary } from "@/lib/content";
import { formatDate } from "@/lib/format";

interface VideoPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllVideos().map((video) => ({ slug: video.slug }));
}

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const video = getVideoBySlug(slug);
  if (!video) return {};

  return {
    title: `${video.title} — Dogood Mavericko`,
    description: video.excerpt,
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { slug } = await params;
  const video = getVideoBySlug(slug);
  if (!video) notFound();

  const relatedVideos = getRelatedVideos(video).map(toVideoSummary);
  const relatedPosts = getAllPosts()
    .filter((post) => post.category === video.category)
    .slice(0, 3)
    .map(toArticleSummary);

  return (
    <article className="flex flex-col">
      <Section tone="paper">
        <div className="mx-auto flex max-w-prose flex-col gap-5">
          <span className="text-meta font-semibold uppercase tracking-[0.04em] text-gold-dark">
            {video.category}
          </span>
          <h1 className="text-display font-semibold text-charcoal">{video.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-meta uppercase tracking-[0.04em] text-slate">
            <span>{formatDate(video.publishedAt)}</span>
            <span aria-hidden="true">·</span>
            <span>{video.duration}</span>
          </div>
        </div>
      </Section>

      <PageContainer className="mb-16">
        <VideoPlayer slug={video.slug} youtubeId={video.youtubeId} thumbnail={video.thumbnail} title={video.title} />
      </PageContainer>

      <PageContainer>
        <div className="mx-auto max-w-prose">
          <MDXRemote source={video.content} components={proseComponents} />
        </div>
      </PageContainer>

      {relatedVideos.length > 0 ? (
        <Section tone="paper-dim">
          <h2 className="mb-10 text-h3 font-semibold text-charcoal">Related Videos</h2>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {relatedVideos.map((relatedVideo) => (
              <VideoCard key={relatedVideo.slug} video={relatedVideo} />
            ))}
          </div>
        </Section>
      ) : null}

      {relatedPosts.length > 0 ? (
        <Section tone="paper">
          <h2 className="mb-10 text-h3 font-semibold text-charcoal">From The Blog</h2>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((post) => (
              <ArticleCard key={post.slug} article={post} />
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
          href="/videos"
          className="text-button font-medium uppercase tracking-[0.02em] text-gold-dark underline underline-offset-4"
        >
          ← Back To All Videos
        </Link>
      </PageContainer>
    </article>
  );
}
