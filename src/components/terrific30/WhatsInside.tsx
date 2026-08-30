import { Section } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WHATS_INSIDE } from "@/lib/terrific30-content";

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

const ICONS: Record<(typeof WHATS_INSIDE)[number]["label"], React.ReactNode> = {
  "Real Success Stories": (
    <svg {...iconProps}>
      <path d="M5 6h18v13H12l-5 4v-4H5z" />
      <path d="M10 12h8M10 16h5" />
    </svg>
  ),
  "A Community, Not A Crowd": (
    <svg {...iconProps}>
      <circle cx="10" cy="10" r="3.5" />
      <circle cx="19" cy="12" r="2.8" />
      <path d="M4 22c0-3.6 2.7-6.5 6-6.5s6 2.9 6 6.5" />
      <path d="M17 22c.2-2.6 1.8-4.6 4-4.6" />
    </svg>
  ),
  "Practical Ideas": (
    <svg {...iconProps}>
      <path d="M14 4a6.5 6.5 0 0 0-3.5 12c.6.4 1 1.1 1 1.9V19h5v-1.1c0-.8.4-1.5 1-1.9A6.5 6.5 0 0 0 14 4Z" />
      <path d="M11.5 22h5M12.3 24h3.4" />
    </svg>
  ),
  "No Catch": (
    <svg {...iconProps}>
      <path d="M14 4l9 3.5v6c0 6-3.8 9.7-9 11-5.2-1.3-9-5-9-11v-6z" />
      <path d="M10.5 14l2.5 2.5 4.5-5" />
    </svg>
  ),
};

export function WhatsInside() {
  return (
    <Section tone="paper">
      <SectionHeading eyebrow="What You'll Get" title="What's Inside" align="center" className="mb-14" />

      <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {WHATS_INSIDE.map((item) => (
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
