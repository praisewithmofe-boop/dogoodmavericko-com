import Image from "next/image";
import { CtaButton } from "@/components/ui/CtaButton";
import { PageContainer } from "@/components/layout/PageContainer";
import { HERO_CONTENT } from "@/lib/home-content";

export function Hero() {
  return (
    <section className="relative min-h-[680px] w-full overflow-hidden lg:aspect-[16/9] lg:min-h-0">
      <Image
        src={HERO_CONTENT.image}
        alt="Dogood Mavericko standing on an open mountain road through the Vikafjellet valley in Norway"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-ink/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 via-45% to-transparent to-70%" />

      <div className="absolute inset-x-0 bottom-0">
        <PageContainer>
          <div className="flex max-w-3xl flex-col gap-5 pb-14 lg:pb-16">
            <h1 className="text-display font-semibold text-bone">{HERO_CONTENT.headline}</h1>
            <p className="text-subhead font-medium text-gold-light">{HERO_CONTENT.subheadline}</p>
            <p className="max-w-xl text-body-lg text-fog">{HERO_CONTENT.paragraph}</p>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <CtaButton href={HERO_CONTENT.primaryCta.href} variant="primary" size="lg">
                {HERO_CONTENT.primaryCta.label}
              </CtaButton>
              <CtaButton href={HERO_CONTENT.secondaryCta.href} variant="outline-light" size="lg">
                {HERO_CONTENT.secondaryCta.label}
              </CtaButton>
            </div>
          </div>
        </PageContainer>
      </div>
    </section>
  );
}
