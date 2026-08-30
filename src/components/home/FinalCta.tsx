import { Section } from "@/components/layout/PageContainer";
import { CtaButton } from "@/components/ui/CtaButton";

export function FinalCta() {
  return (
    <Section tone="ink">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <h2 className="text-h2 font-semibold text-bone">Build A Different Kind Of Life.</h2>
        <p className="text-body-lg text-fog">Join Terrific 30 for free.</p>
        <CtaButton href="/terrific-30" variant="primary" size="lg">
          Join Terrific 30 →
        </CtaButton>
      </div>
    </Section>
  );
}
