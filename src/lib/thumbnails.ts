import { getYoutubeThumbnail } from "@/lib/youtube";
import { getGeneratedThumbnailUrl } from "@/lib/generated-thumbnails";

// Single source of truth for "which image wins" across the site. Every card,
// featured block, and detail page resolves its thumbnail through one of
// these three functions instead of re-deriving the priority itself. All
// three always return a real URL — the final fallback is the branded title
// card auto-generated at build time from the post/episode/video's title, so
// nothing ever renders as a blank placeholder.

interface BlogImageInput {
  slug: string;
  image?: string;
}

export function resolveBlogImage({ slug, image }: BlogImageInput): string {
  if (image) return image;
  return getGeneratedThumbnailUrl("blog", slug);
}

interface PodcastImageInput {
  slug: string;
  coverImage?: string;
  thumbnail?: string;
  youtubeId?: string;
}

// Priority: dedicated cover art > manually supplied thumbnail > the
// YouTube frame for the episode's video (if any) > generated title card.
export function resolvePodcastImage({ slug, coverImage, thumbnail, youtubeId }: PodcastImageInput): string {
  if (coverImage) return coverImage;
  if (thumbnail) return thumbnail;
  if (youtubeId) return getYoutubeThumbnail(youtubeId);
  return getGeneratedThumbnailUrl("podcast", slug);
}

interface VideoImageInput {
  slug: string;
  youtubeId?: string;
  thumbnail?: string;
}

// Priority: for a YouTube video, the real YouTube frame is the correct
// thumbnail — it always wins when a video ID is present. A manually supplied
// thumbnail is next (e.g. Rumble-only videos with no YouTube ID), then the
// generated title card.
export function resolveVideoImage({ slug, youtubeId, thumbnail }: VideoImageInput): string {
  if (youtubeId) return getYoutubeThumbnail(youtubeId);
  if (thumbnail) return thumbnail;
  return getGeneratedThumbnailUrl("videos", slug);
}
