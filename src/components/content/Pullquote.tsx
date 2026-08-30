interface PullquoteProps {
  text: string;
  attribution?: string;
  tone?: "light" | "dark";
  className?: string;
}

export function Pullquote({ text, attribution, tone = "light", className = "" }: PullquoteProps) {
  const textColor = tone === "dark" ? "text-bone" : "text-charcoal";
  const attributionColor = tone === "dark" ? "text-fog" : "text-slate";

  return (
    <blockquote className={`border-l-2 border-gold py-1 pl-6 ${className}`}>
      <p className={`text-h3 font-medium ${textColor}`}>&ldquo;{text}&rdquo;</p>
      {attribution ? (
        <footer className={`mt-3 text-meta uppercase tracking-[0.04em] ${attributionColor}`}>
          {attribution}
        </footer>
      ) : null}
    </blockquote>
  );
}
