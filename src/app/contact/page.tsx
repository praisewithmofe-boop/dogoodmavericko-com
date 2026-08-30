import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { CtaButton } from "@/components/ui/CtaButton";

const CONTACT_EMAIL = "dogoodmavericko@gmail.com";

export const metadata: Metadata = {
  title: "Contact Me — Dogood Mavericko",
  description: "Get in touch with Dogood Mavericko.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-[70vh] items-center bg-paper">
      <PageContainer>
        <div className="mx-auto flex max-w-xl flex-col items-center gap-6 py-20 text-center">
          <h1 className="text-display font-semibold text-charcoal">Contact Me</h1>

          <p className="text-body-lg text-slate">
            To get in contact with me, please send an email to:
            <br />
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-gold-dark underline underline-offset-4 transition-colors hover:text-gold"
            >
              {CONTACT_EMAIL}
            </a>
          </p>

          <CtaButton href={`mailto:${CONTACT_EMAIL}`} variant="primary" size="lg" className="mt-2">
            Email Me →
          </CtaButton>
        </div>
      </PageContainer>
    </div>
  );
}
