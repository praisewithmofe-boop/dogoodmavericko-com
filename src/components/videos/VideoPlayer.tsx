import Image from "next/image";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { PlayIcon } from "@/components/content/VideoThumbnail";
import { getYoutubeEmbedUrl } from "@/lib/youtube";

interface VideoPlayerProps {
  youtubeId?: string;
  thumbnail?: string;
  title: string;
}

export function VideoPlayer({ youtubeId, thumbnail, title }: VideoPlayerProps) {
  if (youtubeId) {
    return (
      <div className="aspect-video w-full overflow-hidden bg-ink">
        <iframe
          src={getYoutubeEmbedUrl(youtubeId)}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  const fallbackThumbnail = thumbnail ?? undefined;

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-paper-dim">
      {fallbackThumbnail ? (
        <Image
          src={fallbackThumbnail}
          alt={`Dogood Mavericko video — ${title}`}
          fill
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <MediaPlaceholder ratio="16/9" className="h-full" />
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/40">
        <PlayIcon size="lg" />
        <span className="text-meta font-medium uppercase tracking-[0.04em] text-bone">
          Video coming soon
        </span>
      </div>
    </div>
  );
}
