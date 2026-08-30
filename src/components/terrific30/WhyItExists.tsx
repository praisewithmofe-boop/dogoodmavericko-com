import { Section } from "@/components/layout/PageContainer";
import { WHY_IT_EXISTS } from "@/lib/terrific30-content";

export function WhyItExists() {
  return (
    <Section tone="paper-dim">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        <span className="text-meta font-semibold uppercase tracking-[0.04em] text-gold-dark">
          {WHY_IT_EXISTS.eyebrow}
        </span>
        <h2 className="text-h2 font-semibold text-charcoal">{WHY_IT_EXISTS.heading}</h2>
        <div className="flex flex-col gap-4">
          {WHY_IT_EXISTS.paragraphs.map((paragraph, i) => (
            <p key={i} className="text-body-lg text-slate">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
