import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/content";
import { getAllEpisodes } from "@/lib/podcast";
import { getAllVideos } from "@/lib/videos";
import { canonicalUrl } from "@/lib/seo";

// Static export: render once at build time.
export const dynamic = "force-static";

// Lists every public page. New posts/episodes/videos are picked up
// automatically on the next build. Draft content is left out.
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const episodes = getAllEpisodes();
  const videos = getAllVideos();

  const newest = (dates: string[]) => dates.sort().at(-1);
  const postsUpdated = newest(posts.map((p) => p.updatedAt ?? p.publishedAt));
  const episodesUpdated = newest(episodes.map((e) => e.publishedAt));
  const videosUpdated = newest(videos.map((v) => v.publishedAt));
  const siteUpdated = newest([postsUpdated, episodesUpdated, videosUpdated].filter(Boolean) as string[]);

  const hubs: { path: string; lastModified?: string }[] = [
    { path: "/", lastModified: siteUpdated },
    { path: "/about" },
    { path: "/blog", lastModified: postsUpdated },
    { path: "/podcast", lastModified: episodesUpdated },
    { path: "/videos", lastModified: videosUpdated },
    { path: "/terrific-30" },
    { path: "/contact" },
    { path: "/privacy" },
    { path: "/terms" },
  ];

  return [
    ...hubs.map((h) => ({ url: canonicalUrl(h.path), lastModified: h.lastModified })),
    ...posts.map((p) => ({
      url: canonicalUrl(`/blog/${p.slug}`),
      lastModified: p.updatedAt ?? p.publishedAt,
    })),
    ...episodes.map((e) => ({
      url: canonicalUrl(`/podcast/${e.slug}`),
      lastModified: e.publishedAt,
    })),
    ...videos.map((v) => ({
      url: canonicalUrl(`/videos/${v.slug}`),
      lastModified: v.publishedAt,
    })),
  ];
}
