import { Section } from "@/components/layout/PageContainer";
import { PortraitFrame } from "@/components/ui/PortraitFrame";
import { Pullquote } from "@/components/content/Pullquote";
import { ABOUT_STORY } from "@/lib/about-content";

export function AboutHero() {
  return (
    <Section tone="paper" className="pt-12 md:pt-16 lg:pt-20">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <PortraitFrame className="aspect-[3/4] w-full" sizes="(min-width: 1024px) 42vw, 100vw" />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-meta font-semibold uppercase tracking-[0.04em] text-gold-dark">
              {ABOUT_STORY.eyebrow}
            </span>
            <h1 className="text-display font-semibold text-charcoal">{ABOUT_STORY.headline}</h1>
          </div>

          <div className="flex flex-col gap-4">
            {ABOUT_STORY.intro.map((paragraph, i) => (
              <p key={i} className="text-body-lg text-slate">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {ABOUT_STORY.journey.map((paragraph, i) => (
              <p key={i} className="text-body-lg text-slate">
                {paragraph}
              </p>
            ))}
          </div>

          <Pullquote
            text={ABOUT_STORY.quote.text}
            attribution={ABOUT_STORY.quote.attribution}
            className="my-2"
          />

          <div className="flex flex-col gap-4">
            {ABOUT_STORY.beliefs.map((paragraph, i) => (
              <p key={i} className="text-body-lg text-slate">
                {paragraph}
              </p>
            ))}
            {ABOUT_STORY.expect.map((paragraph, i) => (
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
