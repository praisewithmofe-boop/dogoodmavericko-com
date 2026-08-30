interface AudioPlayerProps {
  audioUrl?: string;
  tone?: "light" | "dark";
}

// Renders a native player once a real audio file is attached to an episode
// (frontmatter `audioUrl`). Until then, renders nothing — the platform
// buttons carry the "listen/watch" job. Swapping in a richer custom player
// later only means changing what this component returns; call sites don't
// need to change.
export function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  if (!audioUrl) return null;

  return (
    <audio controls preload="none" className="w-full" src={audioUrl}>
      Your browser does not support the audio element.
    </audio>
  );
}
