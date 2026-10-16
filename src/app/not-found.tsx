import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { CtaButton } from "@/components/ui/CtaButton";

export const metadata: Metadata = {
  title: "Page Not Found — Dogood Mavericko",
  description: "That page isn’t on this site. Visit the blog or the podcast.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center bg-paper">
      <PageContainer>
        <div className="mx-auto flex max-w-xl flex-col items-center gap-6 py-20 text-center">
          <span className="text-meta font-semibold uppercase tracking-[0.04em] text-gold-dark">404</span>
          <h1 className="text-display font-semibold text-charcoal">Page not found</h1>
          <p className="text-body-lg text-slate">
            That page isn’t on this site. The blog and the podcast are both good places to start.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
            <CtaButton href="/blog" variant="primary" size="lg">
              Read the Blog
            </CtaButton>
            <CtaButton href="/podcast" variant="secondary" size="lg">
              Listen to the Podcast
            </CtaButton>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
