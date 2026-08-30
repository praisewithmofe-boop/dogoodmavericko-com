import Link from "next/link";
import { Section } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TOPICS } from "@/lib/home-content";

export function TopicsSection() {
  return (
    <Section tone="paper-dim">
      <SectionHeading eyebrow="Dig deeper" title="Explore By Topic" align="center" className="mb-12" />

      <div className="flex flex-wrap justify-center gap-3">
        {TOPICS.map((topic) => (
          <Link
            key={topic.href}
            href={topic.href}
            className="border border-border bg-paper px-6 py-3 text-button font-medium uppercase tracking-[0.02em] text-charcoal transition-colors duration-200 hover:border-gold-dark hover:text-gold-dark"
          >
            {topic.label}
          </Link>
        ))}
      </div>
    </Section>
  );
}
