import { SocialIcon } from "@/components/ui/SocialIcon";
import { SITE_NAME, SOCIAL_LINKS } from "@/lib/constants";

interface SocialLinksProps {
  tone?: "light" | "dark";
  className?: string;
}

export function SocialLinks({ tone = "dark", className = "" }: SocialLinksProps) {
  const idle = tone === "dark" ? "text-fog" : "text-slate";
  const hoverText = tone === "dark" ? "hover:text-gold-light" : "hover:text-gold-dark";
  const hoverBorder = tone === "dark" ? "hover:border-gold-light" : "hover:border-gold-dark";
  const ring = tone === "dark" ? "border-border-dark" : "border-border";

  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      {SOCIAL_LINKS.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${social.verb} ${SITE_NAME} on ${social.label}`}
          className={`flex h-11 w-11 items-center justify-center border ${ring} ${idle} transition-all duration-200 hover:scale-105 ${hoverText} ${hoverBorder}`}
        >
          <SocialIcon name={social.icon} className="h-[18px] w-[18px]" />
        </a>
      ))}
    </div>
  );
}
