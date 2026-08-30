import { getYoutubeThumbnail } from "@/lib/youtube";

// Single source of truth for "which image wins" across the site. Every card,
// featured block, and detail page resolves its thumbnail through one of
// these three functions instead of re-deriving the priority itself.

export function resolveBlogImage(image?: string): string | undefined {
  return image || undefined;
}

interface PodcastImageInput {
  coverImage?: string;
  thumbnail?: string;
  youtubeId?: string;
}

// Priority: dedicated cover art > manually supplied thumbnail > the
// YouTube frame for the episode's video (if any) > caller falls back to the
// generic placeholder.
export function resolvePodcastImage({ coverImage, thumbnail, youtubeId }: PodcastImageInput): string | undefined {
  if (coverImage) return coverImage;
  if (thumbnail) return thumbnail;
  if (youtubeId) return getYoutubeThumbnail(youtubeId);
  return undefined;
}

interface VideoImageInput {
  youtubeId?: string;
  thumbnail?: string;
}

// Priority: for a YouTube video, the real YouTube frame is the correct
// thumbnail — it always wins when a video ID is present. A manually supplied
// thumbnail is the fallback for everything else (e.g. Rumble-only videos
// with no YouTube ID), then the generic placeholder.
export function resolveVideoImage({ youtubeId, thumbnail }: VideoImageInput): string | undefined {
  if (youtubeId) return getYoutubeThumbnail(youtubeId);
  if (thumbnail) return thumbnail;
  return undefined;
}
