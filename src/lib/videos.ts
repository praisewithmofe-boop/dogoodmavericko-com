import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { formatDate } from "@/lib/format";
import { extractYoutubeId } from "@/lib/youtube";
import { resolveVideoImage } from "@/lib/thumbnails";
import type { Video, VideoMeta, VideoSummary } from "@/types/content";

const VIDEOS_DIR = path.join(process.cwd(), "content", "videos");

function readVideoFile(filename: string): Video {
  const slug = filename.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(VIDEOS_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title,
    excerpt: data.excerpt,
    category: data.category,
    duration: data.duration,
    publishedAt: data.publishedAt,
    youtubeId: data.youtubeId ?? (data.youtubeUrl ? (extractYoutubeId(data.youtubeUrl) ?? undefined) : undefined),
    youtubeUrl: data.youtubeUrl,
    thumbnail: data.thumbnail,
    rumbleUrl: data.rumbleUrl,
    draft: Boolean(data.draft),
    content,
  };
}

export function getAllVideos(): Video[] {
  const filenames = fs.readdirSync(VIDEOS_DIR).filter((name) => name.endsWith(".mdx"));

  return filenames
    .map(readVideoFile)
    .filter((video) => !video.draft)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getVideoBySlug(slug: string): Video | undefined {
  const filePath = path.join(VIDEOS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;
  return readVideoFile(`${slug}.mdx`);
}

export function getRelatedVideos(video: Video, count = 3): Video[] {
  const others = getAllVideos().filter((v) => v.slug !== video.slug);
  const sameCategory = others.filter((v) => v.category === video.category);
  const rest = others.filter((v) => v.category !== video.category);
  return [...sameCategory, ...rest].slice(0, count);
}

export function toVideoSummary(video: VideoMeta): VideoSummary {
  return {
    slug: video.slug,
    title: video.title,
    excerpt: video.excerpt,
    category: video.category,
    duration: video.duration,
    publishedAt: formatDate(video.publishedAt),
    youtubeId: video.youtubeId,
    thumbnail: resolveVideoImage(video),
  };
}
