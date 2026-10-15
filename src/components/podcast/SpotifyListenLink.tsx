import { PODCAST_PLATFORMS } from "@/lib/constants";

const SHOW_SPOTIFY_URL = PODCAST_PLATFORMS.find((platform) => platform.label === "Spotify")?.href;

interface SpotifyListenLinkProps {
  spotifyUrl?: string;
}

export function SpotifyListenLink({ spotifyUrl }: SpotifyListenLinkProps) {
  const href = spotifyUrl || SHOW_SPOTIFY_URL;
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-button font-medium uppercase tracking-[0.02em] text-gold-dark underline underline-offset-4 transition-colors hover:text-gold"
    >
      Listen on Spotify
    </a>
  );
}
