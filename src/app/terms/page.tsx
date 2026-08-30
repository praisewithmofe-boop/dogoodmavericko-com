import type { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Section, PageContainer } from "@/components/layout/PageContainer";
import { proseComponents } from "@/components/content/ArticleProse";
import { TERMS_CONTENT, LEGAL_CONTACT_EMAIL, LEGAL_LAST_UPDATED } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Terms & Conditions — Dogood Mavericko",
  description: "The terms and conditions for using the Dogood Mavericko website.",
};

export default function TermsPage() {
  return (
    <article className="flex flex-col">
      <Section tone="paper">
        <div className="mx-auto flex max-w-prose flex-col gap-3">
          <span className="text-meta font-semibold uppercase tracking-[0.04em] text-gold-dark">
            Legal
          </span>
          <h1 className="text-display font-semibold text-charcoal">Terms &amp; Conditions</h1>
          <p className="text-meta uppercase tracking-[0.04em] text-slate">
            Last updated: {LEGAL_LAST_UPDATED}
          </p>
        </div>
      </Section>

      <PageContainer className="mb-16">
        <div className="mx-auto max-w-prose">
          <MDXRemote source={TERMS_CONTENT} components={proseComponents} />
          <p className="text-body-lg">
            <a
              href={`mailto:${LEGAL_CONTACT_EMAIL}`}
              className="text-gold-dark underline underline-offset-2 transition-colors hover:text-gold"
            >
              {LEGAL_CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </PageContainer>

      <PageContainer className="py-10 text-center">
        <Link
          href="/"
          className="text-button font-medium uppercase tracking-[0.02em] text-gold-dark underline underline-offset-4"
        >
          ← Back To Home
        </Link>
      </PageContainer>
    </article>
  );
}
