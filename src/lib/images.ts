import { slugify } from "@/lib/slug";

// Maps an uploaded image path ("/images/Consumer vs Producer .png") to the
// web-optimized, cleanly-named file built by scripts/optimize-images.mjs
// ("/generated/img/consumer-vs-producer.webp"). Anything that isn't under
// /images/ (title cards, external URLs, already-optimized paths) is returned
// unchanged, so this is safe to call on any image reference.
export function optimizedImageUrl(src: string): string;
export function optimizedImageUrl(src: string | undefined): string | undefined;
export function optimizedImageUrl(src: string | undefined): string | undefined {
  if (!src || !src.startsWith("/images/")) return src;
  const filename = src.slice("/images/".length).replace(/\.[^.]+$/, "");
  return `/generated/img/${slugify(decodeURI(filename))}.webp`;
}
