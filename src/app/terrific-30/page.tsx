import type { Metadata } from "next";
import { Section } from "@/components/layout/PageContainer";
import { TerrificHero } from "@/components/terrific30/TerrificHero";
import { WhatItIs } from "@/components/terrific30/WhatItIs";
import { WhyItExists } from "@/components/terrific30/WhyItExists";
import { WhatsInside } from "@/components/terrific30/WhatsInside";
import { WhatYoullLearn } from "@/components/terrific30/WhatYoullLearn";
import { WhyFree } from "@/components/terrific30/WhyFree";
import { Terrific30OptIn } from "@/components/home/Terrific30OptIn";
import { CLOSING_CTA } from "@/lib/terrific30-content";

export const metadata: Metadata = {
  title: "Terrific 30 — Dogood Mavericko",
  description:
    "A free online community for people who want to explore entrepreneurship, modern moneymaking, freedom, and building an online lifestyle business.",
};

export default function Terrific30Page() {
  return (
    <div className="flex flex-col">
      <TerrificHero />
      <WhatItIs />
      <WhyItExists />
      <WhatsInside />
      <WhatYoullLearn />
      <WhyFree />

      <Section tone="paper">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <h2 className="text-h2 font-semibold text-charcoal">{CLOSING_CTA.headline}</h2>
          <p className="text-body-lg text-slate">{CLOSING_CTA.subheadline}</p>
        </div>
      </Section>

      <Terrific30OptIn />
    </div>
  );
}
