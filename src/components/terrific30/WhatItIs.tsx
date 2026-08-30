import { Section } from "@/components/layout/PageContainer";
import { PortraitFrame } from "@/components/ui/PortraitFrame";
import { WHAT_IT_IS } from "@/lib/terrific30-content";

export function WhatItIs() {
  return (
    <Section tone="paper">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
        <PortraitFrame className="aspect-[4/5] w-full" sizes="(min-width: 1024px) 50vw, 100vw" />

        <div className="flex flex-col justify-center gap-5">
          <span className="text-meta font-semibold uppercase tracking-[0.04em] text-gold-dark">
            {WHAT_IT_IS.eyebrow}
          </span>
          <h2 className="text-h2 font-semibold text-charcoal">{WHAT_IT_IS.heading}</h2>
          <div className="flex flex-col gap-4">
            {WHAT_IT_IS.paragraphs.map((paragraph, i) => (
              <p key={i} className="text-body-lg text-slate">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
