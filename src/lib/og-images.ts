// Social-share images (1200x630 JPEG) built by scripts/generate-og-images.mjs.
export type OgContentType = "blog" | "podcast" | "videos";

// Must match the names in scripts/lib/og-pages.mjs.
export type OgPage =
  | "home"
  | "about"
  | "blog"
  | "podcast"
  | "videos"
  | "terrific-30"
  | "contact"
  | "privacy"
  | "terms";

export function getOgImagePath(type: OgContentType, slug: string): string {
  return `/generated/og/${type}/${slug}.jpg`;
}

export function getPageOgImagePath(page: OgPage): string {
  return `/generated/og/pages/${page}.jpg`;
}
