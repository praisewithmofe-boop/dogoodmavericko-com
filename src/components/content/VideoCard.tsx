import Link from "next/link";
import { VideoThumbnail } from "@/components/content/VideoThumbnail";
import type { VideoSummary } from "@/types/content";

interface VideoCardProps {
  video: VideoSummary;
  className?: string;
}

export function VideoCard({ video, className = "" }: VideoCardProps) {
  return (
    <Link href={`/videos/${video.slug}`} className={`group flex flex-col gap-4 ${className}`}>
      <VideoThumbnail
        slug={video.slug}
        title={video.title}
        youtubeId={video.youtubeId}
        thumbnail={video.thumbnail}
        duration={video.duration}
      />

      <div className="flex flex-col gap-2">
        <span className="text-meta font-semibold uppercase tracking-[0.04em] text-gold-dark">
          {video.category}
        </span>
        <h3 className="text-h3 font-semibold text-charcoal transition-colors duration-200 group-hover:text-gold-dark">
          {video.title}
        </h3>
        <p className="line-clamp-2 text-body text-slate">{video.excerpt}</p>
        <span className="text-meta uppercase tracking-[0.04em] text-slate">{video.publishedAt}</span>
      </div>
    </Link>
  );
}
