import Link from "next/link";

interface WordmarkProps {
  tone?: "light" | "dark";
  className?: string;
}

export function Wordmark({ tone = "light", className = "" }: WordmarkProps) {
  const primary = tone === "dark" ? "text-bone" : "text-charcoal";

  return (
    <Link
      href="/"
      className={`text-button font-bold tracking-[0.01em] whitespace-nowrap ${className}`}
      aria-label="Dogood Mavericko — Home"
    >
      <span className={primary}>Dogood Mavericko</span>
    </Link>
  );
}
