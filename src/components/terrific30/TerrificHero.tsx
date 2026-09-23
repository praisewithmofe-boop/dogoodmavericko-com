import Image from "next/image";
import { PageContainer } from "@/components/layout/PageContainer";
import { GhlOptInForm } from "@/components/conversion/GhlOptInForm";
import { TERRIFIC30_HERO } from "@/lib/terrific30-content";
import { HERO_CONTENT } from "@/lib/home-content";

export function TerrificHero() {
  return (
    <section className="relative flex min-h-[85vh] w-full items-center overflow-hidden">
      <Image
        src={HERO_CONTENT.image}
        alt="An open mountain road through the Vikafjellet valley in Norway"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-ink/70" />

      <PageContainer className="relative py-24">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <span className="text-meta font-semibold uppercase tracking-[0.04em] text-gold-light">
            Free community
          </span>
          <h1 className="text-display font-semibold text-bone">{TERRIFIC30_HERO.headline}</h1>
          <p className="text-subhead text-fog">{TERRIFIC30_HERO.subheadline}</p>

          <div className="mt-4 flex w-full max-w-xl flex-col gap-3">
            <GhlOptInForm className="border-bone/20 shadow-lg" />
            <p className="text-meta tracking-[0.02em] text-fog">
              Free forever. No spam — unsubscribe any time.
            </p>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
