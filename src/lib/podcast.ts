import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { formatDate } from "@/lib/format";
import { extractYoutubeId } from "@/lib/youtube";
import { resolvePodcastImage } from "@/lib/thumbnails";
import type { PodcastEpisode, PodcastEpisodeMeta, PodcastEpisodeSummary } from "@/types/content";

const PODCAST_DIR = path.join(process.cwd(), "content", "podcast");

function readEpisodeFile(filename: string): PodcastEpisode {
  const slug = filename.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(PODCAST_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title,
    excerpt: data.excerpt,
    episodeNumber: data.episodeNumber,
    duration: data.duration,
    publishedAt: data.publishedAt,
    guest: data.guest,
    coverImage: data.coverImage,
    thumbnail: data.thumbnail,
    audioUrl: data.audioUrl,
    youtubeId: data.youtubeId ?? (data.youtubeUrl ? (extractYoutubeId(data.youtubeUrl) ?? undefined) : undefined),
    youtubeUrl: data.youtubeUrl,
    spotifyUrl: data.spotifyUrl,
    applePodcastsUrl: data.applePodcastsUrl,
    rumbleUrl: data.rumbleUrl,
    draft: Boolean(data.draft),
    content,
  };
}

export function getAllEpisodes(): PodcastEpisode[] {
  const filenames = fs.readdirSync(PODCAST_DIR).filter((name) => name.endsWith(".mdx"));

  return filenames
    .map(readEpisodeFile)
    .filter((episode) => !episode.draft)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getEpisodeBySlug(slug: string): PodcastEpisode | undefined {
  const filePath = path.join(PODCAST_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;
  return readEpisodeFile(`${slug}.mdx`);
}

export function getRelatedEpisodes(episode: PodcastEpisode, count = 3): PodcastEpisode[] {
  return getAllEpisodes()
    .filter((e) => e.slug !== episode.slug)
    .slice(0, count);
}

export function toEpisodeSummary(episode: PodcastEpisodeMeta): PodcastEpisodeSummary {
  return {
    slug: episode.slug,
    title: episode.title,
    excerpt: episode.excerpt,
    episodeNumber: episode.episodeNumber,
    duration: episode.duration,
    publishedAt: formatDate(episode.publishedAt),
    guest: episode.guest,
    image: resolvePodcastImage(episode),
  };
}
