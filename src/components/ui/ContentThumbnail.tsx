import Image from "next/image";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";

interface ContentThumbnailProps {
  src?: string;
  alt: string;
  ratio?: "16/9" | "4/3" | "1/1";
  overlay?: React.ReactNode;
  cornerBadge?: React.ReactNode;
  priority?: boolean;
  sizes?: string;
  className?: string;
  fallbackTone?: "light" | "dark";
}

// The one thumbnail renderer every content card/featured block/detail page
// uses — real image with a subtle hover zoom, or the site's standard
// fallback box, so nothing ever renders as a blank space. Which src to pass
// in is decided upstream by lib/thumbnails.ts.
export function ContentThumbnail({
  src,
  alt,
  ratio = "16/9",
  overlay,
  cornerBadge,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  className = "",
  fallbackTone = "light",
}: ContentThumbnailProps) {
  return (
    <div className={`relative ${className}`}>
      {src ? (
        <div
          className={`relative w-full overflow-hidden ${ratio === "16/9" ? "aspect-video" : ratio === "1/1" ? "aspect-square" : "aspect-[4/3]"} ${
            fallbackTone === "dark" ? "bg-ink-soft" : "bg-paper-dim"
          }`}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
      ) : (
        <MediaPlaceholder
          ratio={ratio}
          tone={fallbackTone}
          className="w-full transition-opacity duration-300 group-hover:opacity-90"
        />
      )}
      {overlay ? (
        <div className="absolute inset-0 flex items-center justify-center">{overlay}</div>
      ) : null}
      {cornerBadge ? <span className="absolute right-3 bottom-3">{cornerBadge}</span> : null}
    </div>
  );
}
