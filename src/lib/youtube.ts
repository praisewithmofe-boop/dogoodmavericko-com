export function getYoutubeThumbnail(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

export function getYoutubeEmbedUrl(youtubeId: string): string {
  return `https://www.youtube.com/embed/${youtubeId}`;
}

export function getYoutubeWatchUrl(youtubeId: string): string {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

// Pulls the 11-character video ID out of the common YouTube URL shapes
// (watch?v=, youtu.be/, /embed/, /shorts/) so content can be authored with a
// pasted URL instead of a pre-extracted ID. Does not fetch or scrape
// anything — pure string parsing against the standard URL structure.
export function extractYoutubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1).split("/")[0];
      return id || null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v");
      }
      const embedMatch = parsed.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/);
      if (embedMatch) return embedMatch[1];
    }

    return null;
  } catch {
    return null;
  }
}
