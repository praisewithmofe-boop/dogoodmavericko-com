import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Section, PageContainer } from "@/components/layout/PageContainer";
import { ContentThumbnail } from "@/components/ui/ContentThumbnail";
import { AudioPlayer } from "@/components/podcast/AudioPlayer";
import { VideoEmbed } from "@/components/podcast/VideoEmbed";
import { PlatformLinks } from "@/components/podcast/PlatformLinks";
import { PodcastCard } from "@/components/content/PodcastCard";
import { NewsletterSignup } from "@/components/conversion/NewsletterSignup";
import { Terrific30OptIn } from "@/components/home/Terrific30OptIn";
import { proseComponents } from "@/components/content/ArticleProse";
import { getAllEpisodes, getEpisodeBySlug, getRelatedEpisodes, toEpisodeSummary } from "@/lib/podcast";
import { resolvePodcastImage } from "@/lib/thumbnails";
import { formatDate } from "@/lib/format";

interface EpisodePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllEpisodes().map((episode) => ({ slug: episode.slug }));
}

export async function generateMetadata({ params }: EpisodePageProps): Promise<Metadata> {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);
  if (!episode) return {};

  const title = `${episode.title} — Dogood Mavericko`;
  const image = encodeURI(resolvePodcastImage(episode));

  return {
    title,
    description: episode.excerpt,
    openGraph: { title, description: episode.excerpt, images: [image] },
    twitter: { card: "summary_large_image", title, description: episode.excerpt, images: [image] },
  };
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);
  if (!episode) notFound();

  const related = getRelatedEpisodes(episode).map(toEpisodeSummary);

  return (
    <article className="flex flex-col">
      <Section tone="paper">
        <div className="mx-auto flex max-w-prose flex-col gap-5">
          <span className="text-meta font-semibold uppercase tracking-[0.04em] text-gold-dark">
            Episode {String(episode.episodeNumber).padStart(2, "0")}
            {episode.guest ? ` · With ${episode.guest}` : ""}
          </span>
          <h1 className="text-display font-semibold text-charcoal">{episode.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-meta uppercase tracking-[0.04em] text-slate">
            <span>{formatDate(episode.publishedAt)}</span>
            <span aria-hidden="true">·</span>
            <span>{episode.duration}</span>
          </div>
        </div>
      </Section>

      <PageContainer className="mb-10">
        {episode.youtubeId ? (
          <VideoEmbed youtubeId={episode.youtubeId} title={episode.title} />
        ) : (
          <ContentThumbnail
            src={resolvePodcastImage(episode)}
            alt={`Dogood Mavericko podcast — Episode ${episode.episodeNumber}: ${episode.title}`}
            ratio="16/9"
            priority
            sizes="(min-width: 1024px) 896px, 100vw"
            className="mx-auto max-w-4xl"
          />
        )}
      </PageContainer>

      <PageContainer className="mb-16">
        <div className="mx-auto flex max-w-prose flex-col gap-4">
          <AudioPlayer audioUrl={episode.audioUrl} />
          <h2 className="text-h3 font-semibold text-charcoal">Listen / Watch On</h2>
          <PlatformLinks />
        </div>
      </PageContainer>

      <PageContainer>
        <div className="mx-auto max-w-prose">
          <h2 className="mb-6 text-h3 font-semibold text-charcoal">Show Notes</h2>
          <MDXRemote source={episode.content} components={proseComponents} />
        </div>
      </PageContainer>

      {related.length > 0 ? (
        <Section tone="paper-dim">
          <h2 className="mb-10 text-h3 font-semibold text-charcoal">Related Episodes</h2>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {related.map((relatedEpisode) => (
              <PodcastCard key={relatedEpisode.slug} episode={relatedEpisode} />
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
          href="/podcast"
          className="text-button font-medium uppercase tracking-[0.02em] text-gold-dark underline underline-offset-4"
        >
          ← Back To All Episodes
        </Link>
      </PageContainer>
    </article>
  );
}
