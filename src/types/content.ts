export interface ArticleSummary {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  image?: string;
}

// Frontmatter shape for content/blog/*.mdx — the seam a future WordPress
// migration would map onto post fields (title, slug, excerpt, category,
// author, date, featured image, body).
export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string; // ISO 8601
  updatedAt?: string; // ISO 8601
  readTime: string;
  image?: string;
  draft?: boolean;
}

export interface BlogPost extends BlogPostMeta {
  content: string; // raw MDX body
}

export interface PodcastEpisodeSummary {
  slug: string;
  title: string;
  excerpt: string;
  episodeNumber: number;
  duration: string;
  publishedAt: string;
  guest?: string;
  image?: string;
}

// Frontmatter shape for content/podcast/*.mdx — show notes live in the MDX body.
export interface PodcastEpisodeMeta {
  slug: string;
  title: string;
  excerpt: string;
  episodeNumber: number;
  duration: string;
  publishedAt: string; // ISO 8601
  guest?: string;
  // Image priority: the YouTube frame when a video id is present, otherwise
  // coverImage, then thumbnail, then the generated title card. See lib/thumbnails.ts.
  coverImage?: string;
  thumbnail?: string;
  audioUrl?: string;
  youtubeId?: string;
  // Alternative to youtubeId — a full YouTube URL, parsed into an ID at load
  // time (lib/youtube.ts#extractYoutubeId). Set either one.
  youtubeUrl?: string;
  // Per-episode platform links. The listen link uses spotifyUrl when set
  // and otherwise the show-wide Spotify URL in PODCAST_PLATFORMS.
  spotifyUrl?: string;
  applePodcastsUrl?: string;
  rumbleUrl?: string;
  draft?: boolean;
}

export interface PodcastEpisode extends PodcastEpisodeMeta {
  content: string; // raw MDX show notes
}

export interface VideoSummary {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  duration: string;
  publishedAt: string;
  youtubeId?: string;
  thumbnail?: string;
}

// Frontmatter shape for content/videos/*.mdx — the description lives in the
// MDX body; youtubeId drives both the embed and the real YouTube thumbnail.
// Image priority: the YouTube frame (from youtubeId/youtubeUrl) always wins
// when present > manually supplied thumbnail (e.g. for Rumble-only videos) >
// generic fallback. See lib/thumbnails.ts.
export interface VideoMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  duration: string;
  publishedAt: string; // ISO 8601
  youtubeId?: string;
  // Alternative to youtubeId — a full YouTube URL, parsed into an ID at load
  // time (lib/youtube.ts#extractYoutubeId). Set either one.
  youtubeUrl?: string;
  thumbnail?: string;
  // Set when the video is hosted on Rumble instead of (or in addition to)
  // YouTube. Not yet used for embedding — kept here so a Rumble player can
  // be added later without a data-model change.
  rumbleUrl?: string;
  draft?: boolean;
}

export interface Video extends VideoMeta {
  content: string; // raw MDX description
}
