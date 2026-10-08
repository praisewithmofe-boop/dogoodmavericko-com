"use client";

// Custom next/image loader. A static export has no image-optimization server,
// so instead scripts/optimize-images.mjs pre-builds two WebP sizes of every
// uploaded image and this loader just picks the right one per screen width:
// phones/cards get the 640px file, larger slots get the 1280px file. Anything
// else (title-card PNGs, YouTube thumbnails, icons) is served as-is.
export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  const optimized = src.match(/^(\/generated\/img\/.+)\.webp$/);
  if (optimized && !optimized[1].endsWith("-640")) {
    return width <= 640 ? `${optimized[1]}-640.webp` : src;
  }
  return src;
}
