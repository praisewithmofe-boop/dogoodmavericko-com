import { ContentThumbnail } from "@/components/ui/ContentThumbnail";
import { resolveVideoImage } from "@/lib/thumbnails";

export function PlayIcon({ size = "md" }: { size?: "md" | "lg" }) {
  const dimensions = size === "lg" ? "h-16 w-16" : "h-14 w-14";
  return (
    <span
      className={`flex items-center justify-center rounded-full border border-gold bg-ink/70 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 ${dimensions}`}
    >
      <svg width="16" height="18" viewBox="0 0 16 18" fill="none" aria-hidden="true">
        <path d="M15 9L0.75 17.2942L0.75 0.705771L15 9Z" fill="var(--color-gold)" />
      </svg>
    </span>
  );
}

interface VideoThumbnailProps {
  slug: string;
  title: string;
  youtubeId?: string;
  thumbnail?: string;
  duration?: string;
  playIconSize?: "md" | "lg";
  priority?: boolean;
  className?: string;
}

export function VideoThumbnail({
  slug,
  title,
  youtubeId,
  thumbnail,
  duration,
  playIconSize = "md",
  priority = false,
  className = "",
}: VideoThumbnailProps) {
  const image = resolveVideoImage({ slug, youtubeId, thumbnail });

  return (
    <ContentThumbnail
      src={image}
      alt={`Dogood Mavericko video — ${title}`}
      ratio="16/9"
      priority={priority}
      overlay={<PlayIcon size={playIconSize} />}
      cornerBadge={
        duration ? (
          <span className="bg-ink px-2 py-1 text-meta font-medium text-bone">{duration}</span>
        ) : null
      }
      className={className}
    />
  );
}
