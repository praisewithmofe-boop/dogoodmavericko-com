import { PageContainer } from "@/components/layout/PageContainer";
import { GhlOptInForm } from "@/components/conversion/GhlOptInForm";

export function Terrific30OptIn() {
  return (
    <section className="border-b border-border bg-paper-dim">
      <PageContainer>
        <div className="grid grid-cols-1 items-center gap-8 py-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:py-8">
          <div className="flex flex-col gap-2">
            <span className="text-meta font-semibold uppercase tracking-[0.04em] text-gold-dark">
              Free community
            </span>
            <h2 className="text-h3 font-semibold text-charcoal">Join Terrific 30</h2>
            <p className="max-w-md text-body text-slate">
              Join our free online community and discover ideas, stories, and strategies around
              entrepreneurship, online business, freedom, and building a life on your own terms.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <GhlOptInForm className="border-border bg-paper" />
            <p className="text-meta tracking-[0.02em] text-slate">
              Free forever. No spam — unsubscribe any time.
            </p>

            <a
              href="https://t.co/xx1yXpnWSi"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex w-fit items-center text-button font-semibold uppercase tracking-[0.02em] text-gold-dark underline-offset-4 transition-all duration-200 hover:underline"
            >
              Terrific 30 →
            </a>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
