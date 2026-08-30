import Link from "next/link";
import { Section } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";

const PATHWAYS = [
  {
    label: "Read",
    href: "/blog",
    description: "Explore Dogood's latest articles and ideas.",
    icon: (
      <svg viewBox="0 0 64 64" width="44" height="44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="8,14 30,9 30,52 8,57" fill="#c69a3c" />
        <polygon points="56,14 34,9 34,52 56,57" fill="#c69a3c" />
      </svg>
    ),
  },
  {
    label: "Listen",
    href: "/podcast",
    description: "Listen to the podcast and conversations with interesting people.",
    icon: (
      <svg viewBox="0 0 64 64" width="44" height="44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 13 36 A 19 19 0 0 1 51 36" stroke="#c69a3c" strokeWidth="7" strokeLinecap="round" />
        <rect x="8" y="33" width="13" height="21" rx="6" fill="#c69a3c" />
        <rect x="43" y="33" width="13" height="21" rx="6" fill="#c69a3c" />
      </svg>
    ),
  },
  {
    label: "Watch",
    href: "/videos",
    description: "Explore videos and visual content.",
    icon: (
      <svg viewBox="0 0 64 64" width="44" height="44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="7" y="7" width="50" height="50" rx="14" fill="none" stroke="#c69a3c" strokeWidth="6" />
        <polygon points="26,20 26,44 46,32" fill="#c69a3c" />
      </svg>
    ),
  },
] as const;

export function StartHere() {
  return (
    <Section tone="paper-dim">
      <SectionHeading eyebrow="Where to begin" title="Start Here" className="mb-12" />

      <div className="grid grid-cols-1 gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
        {PATHWAYS.map((pathway) => (
          <Link
            key={pathway.label}
            href={pathway.href}
            className="group flex min-h-[280px] flex-col justify-between bg-paper p-8 transition-colors duration-300 hover:bg-ink md:min-h-[360px] md:p-10"
          >
            <div>
              <div className="mb-3.5">{pathway.icon}</div>
              <span className="text-h3 font-semibold text-charcoal transition-colors duration-300 group-hover:text-gold-light">
                {pathway.label}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-body-lg text-slate transition-colors duration-300 group-hover:text-fog">
                {pathway.description}
              </p>
              <span className="text-button font-medium uppercase tracking-[0.02em] text-gold-dark transition-colors duration-300 group-hover:text-gold-light">
                Explore →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
