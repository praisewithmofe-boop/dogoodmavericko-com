interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className = "",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";
  const titleColor = tone === "dark" ? "text-bone" : "text-charcoal";
  const descColor = tone === "dark" ? "text-fog" : "text-slate";
  const eyebrowColor = tone === "dark" ? "text-gold-light" : "text-gold-dark";

  return (
    <div className={`flex flex-col gap-4 ${alignClass} ${className}`}>
      {eyebrow ? (
        <span className={`text-meta font-semibold uppercase tracking-[0.04em] ${eyebrowColor}`}>
          {eyebrow}
        </span>
      ) : null}
      <h2 className={`text-h2 font-semibold ${titleColor}`}>{title}</h2>
      {description ? (
        <p className={`text-body-lg max-w-2xl ${descColor}`}>{description}</p>
      ) : null}
    </div>
  );
}
