import { Section } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LEARN_TOPICS } from "@/lib/terrific30-content";

export function WhatYoullLearn() {
  return (
    <Section tone="paper-dim">
      <SectionHeading
        eyebrow="Inside The Community"
        title="What You Can Learn"
        align="center"
        className="mb-12"
      />

      <div className="flex flex-wrap justify-center gap-3">
        {LEARN_TOPICS.map((topic) => (
          <span
            key={topic}
            className="border border-border bg-paper px-6 py-3 text-button font-medium uppercase tracking-[0.02em] text-charcoal"
          >
            {topic}
          </span>
        ))}
      </div>
    </Section>
  );
}
