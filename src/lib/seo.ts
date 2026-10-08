import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const SITE_URL = "https://dogoodmavericko.com";
export const SITE_DESCRIPTION =
  "Writer, podcaster, and entrepreneur exploring faith, freedom, and the online lifestyle business — home of Terrific 30.";

// Search engines cut titles at ~60 characters and descriptions at ~160.
const MAX_TITLE = 59;
const MAX_DESCRIPTION = 158;

function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${base.replace(/[\s,;:.\-–—]+$/, "")}…`;
}

// Shortens an over-long title at a natural break (" — ", ": ", "…", "?") when
// there is one, so it reads as a complete thought; otherwise at a word boundary.
function trimTitle(title: string): string {
  if (title.length <= MAX_TITLE) return title;

  // [text that marks the break, whether the punctuation stays in the title]
  const breaks: [string, boolean][] = [
    [" — ", false],
    [" – ", false],
    [": ", false],
    ["… ", true],
    ["? ", true],
  ];
  let best = 0;
  for (const [marker, keepPunctuation] of breaks) {
    let i = title.indexOf(marker);
    while (i !== -1) {
      const end = keepPunctuation ? i + 1 : i;
      if (end <= MAX_TITLE && end >= 20) best = Math.max(best, end);
      i = title.indexOf(marker, i + 1);
    }
  }
  return best > 0 ? title.slice(0, best).trim() : truncate(title, MAX_TITLE);
}

// "Page Title — Dogood Mavericko", dropping the brand suffix whenever the
// result would run past ~60 characters (and shortening the title itself if it
// is still too long on its own).
export function seoTitle(title: string): string {
  const trimmed = trimTitle(title);
  const withBrand = `${trimmed} — ${SITE_NAME}`;
  return withBrand.length <= MAX_TITLE ? withBrand : trimmed;
}

export function seoDescription(description: string): string {
  return truncate(description, MAX_DESCRIPTION);
}

// The site uses trailingSlash, so every canonical URL ends in "/".
export function canonicalUrl(path: string): string {
  const trimmed = path.replace(/^\/+|\/+$/g, "");
  return trimmed ? `${SITE_URL}/${trimmed}/` : `${SITE_URL}/`;
}

export function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

interface PageSeo {
  title: string;
  // Use `title` as-is instead of appending " — Dogood Mavericko" (homepage).
  exactTitle?: boolean;
  description: string;
  path: string;
  // Site-relative path to the 1200x630 share image.
  image: string;
  imageAlt?: string;
  noindex?: boolean;
  article?: { publishedTime: string; modifiedTime?: string; section?: string };
}

// One place that produces every page's <title>, description, canonical URL,
// Open Graph and Twitter tags, so no page can ship without them.
export function buildMetadata(page: PageSeo): Metadata {
  const title = page.exactTitle ? truncate(page.title, MAX_TITLE) : seoTitle(page.title);
  const description = seoDescription(page.description);
  const url = canonicalUrl(page.path);
  const images = [
    { url: page.image, width: 1200, height: 630, alt: page.imageAlt ?? page.title },
  ];

  return {
    title,
    description,
    alternates: { canonical: url },
    ...(page.noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      images,
      ...(page.article
        ? {
            type: "article" as const,
            publishedTime: page.article.publishedTime,
            modifiedTime: page.article.modifiedTime,
            section: page.article.section,
            authors: [SITE_NAME],
          }
        : { type: "website" as const }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [page.image],
    },
  };
}
