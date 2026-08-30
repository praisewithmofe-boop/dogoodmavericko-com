import { Section } from "@/components/layout/PageContainer";
import { CtaButton } from "@/components/ui/CtaButton";

export function AboutFinalCta() {
  return (
    <Section tone="paper">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <h2 className="text-h2 font-semibold text-charcoal">
          Ready to start designing your life instead of just living it?
        </h2>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          <CtaButton href="/terrific-30" variant="primary" size="lg">
            Join Terrific 30
          </CtaButton>
          <CtaButton href="/blog" variant="secondary" size="lg">
            Read The Blog
          </CtaButton>
        </div>
      </div>
    </Section>
  );
}
