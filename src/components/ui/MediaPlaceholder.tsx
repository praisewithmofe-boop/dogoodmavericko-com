interface MediaPlaceholderProps {
  ratio?: "4/3" | "16/9" | "1/1";
  tone?: "light" | "dark";
  className?: string;
  icon?: React.ReactNode;
}

const ratioClasses: Record<NonNullable<MediaPlaceholderProps["ratio"]>, string> = {
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-video",
  "1/1": "aspect-square",
};

export function MediaPlaceholder({
  ratio = "4/3",
  tone = "light",
  className = "",
  icon,
}: MediaPlaceholderProps) {
  const bg = tone === "dark" ? "bg-ink-soft" : "bg-paper-dim";
  const monogramColor = tone === "dark" ? "text-fog/25" : "text-slate/25";

  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${bg} ${ratioClasses[ratio]} ${className}`}
    >
      {icon ?? <span className={`text-h3 font-bold tracking-[0.02em] ${monogramColor}`}>DM</span>}
    </div>
  );
}
