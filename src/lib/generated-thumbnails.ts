export type GeneratedThumbnailType = "blog" | "podcast" | "videos";

// Every generated title card lives at this predictable path under public/,
// written by scripts/generate-thumbnails.mjs before `next build`/`next dev`
// runs. This is the final fallback for blog, podcast, and video thumbnails —
// it always exists once the prebuild script has run, so callers can treat
// it as a guaranteed image, never `undefined`.
export function getGeneratedThumbnailUrl(type: GeneratedThumbnailType, slug: string): string {
  return `/generated/${type}/${slug}.png`;
}
