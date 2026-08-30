import Link from "next/link";
import { Section } from "@/components/layout/PageContainer";
import { CtaButton } from "@/components/ui/CtaButton";
import { VideoPlayer } from "@/components/videos/VideoPlayer";
import { formatDate } from "@/lib/format";
import type { VideoMeta } from "@/types/content";

interface FeaturedVideoProps {
  video: VideoMeta;
}

export function FeaturedVideo({ video }: FeaturedVideoProps) {
  return (
    <Section tone="paper">
      <span className="mb-8 block text-meta font-semibold uppercase tracking-[0.04em] text-gold-dark">
        Featured Video
      </span>

      <VideoPlayer slug={video.slug} youtubeId={video.youtubeId} thumbnail={video.thumbnail} title={video.title} />

      <div className="mt-8 flex flex-col gap-4">
        <span className="text-meta font-semibold uppercase tracking-[0.04em] text-gold-dark">
          {video.category}
        </span>
        <Link href={`/videos/${video.slug}`} className="group">
          <h2 className="text-h2 font-semibold text-charcoal transition-colors duration-200 group-hover:text-gold-dark">
            {video.title}
          </h2>
        </Link>
        <p className="max-w-prose text-body-lg text-slate">{video.excerpt}</p>
        <div className="flex items-center gap-3 text-meta uppercase tracking-[0.04em] text-slate">
          <span>{formatDate(video.publishedAt)}</span>
          <span aria-hidden="true">·</span>
          <span>{video.duration}</span>
        </div>
        <div className="mt-2">
          <CtaButton href={`/videos/${video.slug}`} variant="secondary" size="md">
            Watch Now →
          </CtaButton>
        </div>
      </div>
    </Section>
  );
}
