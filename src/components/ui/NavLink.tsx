"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
  onClick?: () => void;
}

export function NavLink({ href, children, className = "", tone = "light", onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  const idle = tone === "dark" ? "text-bone" : "text-charcoal";
  const active = tone === "dark" ? "text-gold-light" : "text-gold-dark";
  const hover = tone === "dark" ? "hover:text-gold-light" : "hover:text-gold-dark";

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`relative text-button font-medium transition-colors duration-200 ${hover} ${
        isActive ? active : idle
      } ${className}`}
    >
      {children}
      <span
        className={`absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-200 ${
          isActive ? "scale-x-100" : ""
        }`}
      />
    </Link>
  );
}
