import { Section } from "@/components/layout/PageContainer";
import { MISSION_CONTENT } from "@/lib/about-content";

export function Mission() {
  return (
    <Section tone="ink">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <span className="text-meta font-semibold uppercase tracking-[0.04em] text-gold-light">
          {MISSION_CONTENT.eyebrow}
        </span>
        <h2 className="text-h2 font-semibold text-bone">{MISSION_CONTENT.headline}</h2>
        <div className="flex flex-col gap-4">
          {MISSION_CONTENT.paragraphs.map((paragraph, i) => (
            <p key={i} className="text-body-lg text-fog">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
