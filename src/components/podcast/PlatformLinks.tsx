import { SocialIcon } from "@/components/ui/SocialIcon";
import { PODCAST_PLATFORMS } from "@/lib/constants";

interface PlatformLinksProps {
  tone?: "light" | "dark";
  className?: string;
}

export function PlatformLinks({ tone = "light", className = "" }: PlatformLinksProps) {
  const border = tone === "dark" ? "border-border-dark" : "border-border";
  const hoverBorder = tone === "dark" ? "hover:border-gold-light" : "hover:border-gold-dark";
  const text = tone === "dark" ? "text-fog" : "text-slate";
  const hoverText = tone === "dark" ? "group-hover:text-gold-light" : "group-hover:text-gold-dark";

  return (
    <div className={`grid grid-cols-2 gap-3 sm:grid-cols-4 ${className}`}>
      {PODCAST_PLATFORMS.map((platform) => (
        <a
          key={platform.label}
          href={platform.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${platform.verb} ${platform.label}`}
          className={`group flex flex-col items-center justify-center gap-2 border px-4 py-5 text-center transition-colors duration-200 ${border} ${hoverBorder}`}
        >
          <SocialIcon
            name={platform.icon}
            className={`h-6 w-6 ${text} transition-colors duration-200 ${hoverText}`}
          />
          <span
            className={`text-meta font-semibold uppercase tracking-[0.04em] ${text} transition-colors duration-200 ${hoverText}`}
          >
            {platform.label}
          </span>
        </a>
      ))}
    </div>
  );
}
