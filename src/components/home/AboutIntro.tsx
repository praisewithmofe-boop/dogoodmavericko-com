import { Section } from "@/components/layout/PageContainer";
import { CtaButton } from "@/components/ui/CtaButton";
import { PortraitFrame } from "@/components/ui/PortraitFrame";
import { ABOUT_CONTENT } from "@/lib/home-content";

export function AboutIntro() {
  return (
    <Section tone="paper">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
        <PortraitFrame
          className="aspect-[4/5] w-full"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />

        <div className="flex flex-col justify-center gap-5">
          <h2 className="text-h2 font-semibold text-charcoal">{ABOUT_CONTENT.heading}</h2>
          <div className="flex flex-col gap-4">
            {ABOUT_CONTENT.paragraphs.map((paragraph, i) => (
              <p key={i} className="text-body-lg text-slate">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-2">
            <CtaButton href={ABOUT_CONTENT.cta.href} variant="secondary" size="md">
              {ABOUT_CONTENT.cta.label} →
            </CtaButton>
          </div>
        </div>
      </div>
    </Section>
  );
}
