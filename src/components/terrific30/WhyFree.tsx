import { Section } from "@/components/layout/PageContainer";
import { WHY_FREE } from "@/lib/terrific30-content";

export function WhyFree() {
  return (
    <Section tone="ink">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        <span className="text-meta font-semibold uppercase tracking-[0.04em] text-gold-light">
          {WHY_FREE.eyebrow}
        </span>
        <h2 className="text-h2 font-semibold text-bone">{WHY_FREE.heading}</h2>
        <div className="flex flex-col gap-4">
          {WHY_FREE.paragraphs.map((paragraph, i) => (
            <p key={i} className="text-body-lg text-fog">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
