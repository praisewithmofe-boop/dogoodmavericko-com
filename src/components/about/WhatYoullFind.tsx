import { Section } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FIND_HERE_ITEMS } from "@/lib/about-content";

const iconProps = {
  width: 28,
  height: 28,
  viewBox: "0 0 28 28",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const ICONS: Record<(typeof FIND_HERE_ITEMS)[number]["label"], React.ReactNode> = {
  Faith: (
    <svg {...iconProps}>
      <path d="M14 4c-3 4-5 7-5 10a5 5 0 0 0 10 0c0-1.4-.6-2.8-1.6-4.2.1 1.6-.6 2.6-1.6 3-.4-2.4-1-4.2-1.8-8.8Z" />
    </svg>
  ),
  Freedom: (
    <svg {...iconProps}>
      <path d="M4 16c3-6 6-9 10-9s7 3 10 9" />
      <path d="M4 16c3 2 6 3 10 3s7-1 10-3" />
      <path d="M14 7v16" />
    </svg>
  ),
  "Modern Moneymaking": (
    <svg {...iconProps}>
      <path d="M5 19 11 12l4 4 8-9" />
      <path d="M17 7h6v6" />
    </svg>
  ),
  Entrepreneurship: (
    <svg {...iconProps}>
      <circle cx="14" cy="14" r="10" />
      <path d="m17.5 10.5-2.2 5.3-5.3 2.2 2.2-5.3z" />
    </svg>
  ),
  "Financial Freedom": (
    <svg {...iconProps}>
      <path d="M14 4l9 3.5v6c0 6-3.8 9.7-9 11-5.2-1.3-9-5-9-11v-6z" />
      <path d="M10.5 14l2.5 2.5 4.5-5" />
    </svg>
  ),
};

export function WhatYoullFind() {
  return (
    <Section tone="paper-dim">
      <SectionHeading
        eyebrow="On this site"
        title="What You'll Find Here"
        align="center"
        className="mb-14"
      />

      <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
        {FIND_HERE_ITEMS.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-4 text-center">
            <span className="text-gold-dark">{ICONS[item.label]}</span>
            <span className="text-body-lg font-semibold text-charcoal">{item.label}</span>
            <p className="text-body text-slate">{item.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
