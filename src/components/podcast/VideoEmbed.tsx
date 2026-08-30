interface VideoEmbedProps {
  youtubeId: string;
  title: string;
}

export function VideoEmbed({ youtubeId, title }: VideoEmbedProps) {
  return (
    <div className="aspect-video w-full overflow-hidden bg-ink">
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
