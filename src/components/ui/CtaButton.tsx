import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline-light";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium uppercase whitespace-nowrap " +
  "text-button tracking-[0.02em] transition-colors duration-200 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  primary:
    "bg-gold text-ink hover:bg-gold-light active:bg-gold-dark",
  secondary:
    "border border-charcoal text-charcoal hover:border-gold-dark hover:text-gold-dark",
  ghost:
    "text-bone hover:text-gold-light",
  "outline-light":
    "border border-bone text-bone hover:border-gold-light hover:text-gold-light",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3",
  lg: "px-8 py-4",
};

interface SharedProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

type LinkProps = SharedProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export function CtaButton(props: LinkProps | ButtonProps) {
  const { variant = "primary", size = "md", className = "", children, ...rest } = props;
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if ("href" in rest && rest.href) {
    return (
      <Link
        className={classes}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
