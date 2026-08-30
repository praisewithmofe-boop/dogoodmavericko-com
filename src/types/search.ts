export type SearchContentType = "blog" | "podcast" | "video";

// Mirrors the shape written by scripts/generate-search-index.mjs into
// public/search-index.json. Kept in sync manually since the generator is a
// plain Node script, not TypeScript.
export interface SearchIndexEntry {
  title: string;
  excerpt: string;
  slug: string;
  url: string;
  type: SearchContentType;
}
