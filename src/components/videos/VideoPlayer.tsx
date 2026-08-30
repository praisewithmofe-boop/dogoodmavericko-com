import Image from "next/image";
import { PlayIcon } from "@/components/content/VideoThumbnail";
import { getYoutubeEmbedUrl } from "@/lib/youtube";
import { resolveVideoImage } from "@/lib/thumbnails";

interface VideoPlayerProps {
  slug: string;
  youtubeId?: string;
  thumbnail?: string;
  title: string;
}

export function VideoPlayer({ slug, youtubeId, thumbnail, title }: VideoPlayerProps) {
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

  const fallbackThumbnail = resolveVideoImage({ slug, thumbnail });

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-paper-dim">
      <Image
        src={fallbackThumbnail}
        alt={`Dogood Mavericko video — ${title}`}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/40">
        <PlayIcon size="lg" />
        <span className="text-meta font-medium uppercase tracking-[0.04em] text-bone">
          Video coming soon
        </span>
      </div>
    </div>
  );
}
