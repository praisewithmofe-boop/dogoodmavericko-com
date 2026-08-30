import { Section } from "@/components/layout/PageContainer";
import { NewsletterSignup } from "@/components/conversion/NewsletterSignup";

export function NewsletterSection() {
  return (
    <Section tone="paper">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <span className="text-meta font-semibold uppercase tracking-[0.04em] text-gold-dark">
          The Newsletter
        </span>
        <h2 className="text-h2 font-semibold text-charcoal">
          Get The Best Ideas Delivered To Your Inbox
        </h2>
        <p className="text-body-lg text-slate">
          Dogood&rsquo;s newsletter shares ideas around faith, freedom, entrepreneurship, money, and
          building an online lifestyle business — straight to your inbox, no fluff.
        </p>
        <NewsletterSignup variant="compact" className="w-full max-w-md" />
      </div>
    </Section>
  );
}
