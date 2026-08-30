import Link from "next/link";
import { Section } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";

const PATHWAYS = [
  {
    label: "Read",
    href: "/blog",
    description: "Explore Dogood's latest articles and ideas.",
  },
  {
    label: "Listen",
    href: "/podcast",
    description: "Listen to the podcast and conversations with interesting people.",
  },
  {
    label: "Watch",
    href: "/videos",
    description: "Explore videos and visual content.",
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
            <span className="text-h3 font-semibold text-charcoal transition-colors duration-300 group-hover:text-gold-light">
              {pathway.label}
            </span>
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
