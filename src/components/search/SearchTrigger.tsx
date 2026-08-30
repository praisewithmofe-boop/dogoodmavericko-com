interface SearchTriggerProps {
  onClick: () => void;
  tone?: "light" | "dark";
  className?: string;
}

// The magnifying-glass icon button that opens SearchModal — used in both
// SiteHeader (desktop nav) and MobileNav (slide-out menu), so it takes a
// tone prop the same way NavLink does to work on both light and dark
// backgrounds.
export function SearchTrigger({ onClick, tone = "light", className = "" }: SearchTriggerProps) {
  const idle = tone === "dark" ? "text-bone" : "text-charcoal";
  const hover = tone === "dark" ? "hover:text-gold-light" : "hover:text-gold-dark";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Search the site"
      className={`flex h-10 w-10 items-center justify-center transition-colors duration-200 ${idle} ${hover} ${className}`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <line x1="21" y1="21" x2="16.2" y2="16.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
}
