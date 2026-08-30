import Link from "next/link";
import { ContentThumbnail } from "@/components/ui/ContentThumbnail";
import type { PodcastEpisodeSummary } from "@/types/content";

interface PodcastCardProps {
  episode: PodcastEpisodeSummary;
  tone?: "light" | "dark";
  className?: string;
}

export function PodcastCard({ episode, tone = "light", className = "" }: PodcastCardProps) {
  const titleColor = tone === "dark" ? "text-bone" : "text-charcoal";
  const titleHover = tone === "dark" ? "group-hover:text-gold-light" : "group-hover:text-gold-dark";
  const bodyColor = tone === "dark" ? "text-fog" : "text-slate";

  return (
    <Link
      href={`/podcast/${episode.slug}`}
      className={`group flex flex-col gap-4 sm:flex-row sm:items-start ${className}`}
    >
      <ContentThumbnail
        src={episode.image}
        alt={`Dogood Mavericko podcast — Episode ${episode.episodeNumber}: ${episode.title}`}
        ratio="16/9"
        fallbackTone={tone}
        className="w-full shrink-0 sm:w-48"
      />

      <div className="flex flex-1 flex-col gap-2">
        <span className="text-meta font-semibold uppercase tracking-[0.04em] text-gold-dark">
          Episode {String(episode.episodeNumber).padStart(2, "0")}
        </span>
        <h3 className={`text-h3 font-semibold transition-colors duration-200 ${titleColor} ${titleHover}`}>
          {episode.title}
        </h3>
        {episode.guest ? (
          <span className={`text-meta uppercase tracking-[0.04em] ${bodyColor}`}>
            with {episode.guest}
          </span>
        ) : null}
        <p className={`line-clamp-2 text-body ${bodyColor}`}>{episode.excerpt}</p>
        <div className={`flex items-center gap-2 pt-1 text-meta uppercase tracking-[0.04em] ${bodyColor}`}>
          <span>{episode.publishedAt}</span>
          <span aria-hidden="true">·</span>
          <span>{episode.duration}</span>
        </div>
      </div>
    </Link>
  );
}
