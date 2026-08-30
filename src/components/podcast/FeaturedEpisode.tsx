import Link from "next/link";
import { Section } from "@/components/layout/PageContainer";
import { ContentThumbnail } from "@/components/ui/ContentThumbnail";
import { CtaButton } from "@/components/ui/CtaButton";
import { AudioPlayer } from "@/components/podcast/AudioPlayer";
import { resolvePodcastImage } from "@/lib/thumbnails";
import { formatDate } from "@/lib/format";
import type { PodcastEpisodeMeta } from "@/types/content";

interface FeaturedEpisodeProps {
  episode: PodcastEpisodeMeta;
}

export function FeaturedEpisode({ episode }: FeaturedEpisodeProps) {
  return (
    <Section tone="paper">
      <span className="mb-8 block text-meta font-semibold uppercase tracking-[0.04em] text-gold-dark">
        Featured Episode
      </span>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <Link href={`/podcast/${episode.slug}`} className="group block">
          <ContentThumbnail
            src={resolvePodcastImage(episode)}
            alt={`Dogood Mavericko podcast — Episode ${episode.episodeNumber}: ${episode.title}`}
            ratio="16/9"
            priority
          />
        </Link>

        <div className="flex flex-col justify-center gap-5">
          <span className="text-meta font-semibold uppercase tracking-[0.04em] text-gold-dark">
            Episode {String(episode.episodeNumber).padStart(2, "0")}
            {episode.guest ? ` · With ${episode.guest}` : ""}
          </span>
          <Link href={`/podcast/${episode.slug}`} className="group">
            <h2 className="text-h2 font-semibold text-charcoal transition-colors duration-200 group-hover:text-gold-dark">
              {episode.title}
            </h2>
          </Link>
          <p className="text-body-lg text-slate">{episode.excerpt}</p>
          <div className="flex items-center gap-3 pt-1 text-meta uppercase tracking-[0.04em] text-slate">
            <span>{formatDate(episode.publishedAt)}</span>
            <span aria-hidden="true">·</span>
            <span>{episode.duration}</span>
          </div>

          <div className="mt-2">
            <AudioPlayer audioUrl={episode.audioUrl} />
          </div>

          <div className="mt-2">
            <CtaButton href={`/podcast/${episode.slug}`} variant="secondary" size="md">
              View Episode →
            </CtaButton>
          </div>
        </div>
      </div>
    </Section>
  );
}
