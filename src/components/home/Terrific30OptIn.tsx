"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { PageContainer } from "@/components/layout/PageContainer";

export function Terrific30OptIn() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    window.setTimeout(() => setStatus("success"), 600);
  }

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
            {status === "success" ? (
              <p className="text-body font-medium text-gold-dark">
                You&rsquo;re in. Check your inbox to confirm and get started.
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
              >
                <label htmlFor="t30-first-name" className="sr-only">
                  First name
                </label>
                <input
                  id="t30-first-name"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full border border-border bg-paper px-4 py-3 text-body text-charcoal outline-none transition-colors placeholder:text-slate focus-visible:border-gold-dark sm:w-40"
                />
                <label htmlFor="t30-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="t30-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-border bg-paper px-4 py-3 text-body text-charcoal outline-none transition-colors placeholder:text-slate focus-visible:border-gold-dark sm:flex-1"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center justify-center bg-gold px-6 py-3 text-button font-medium tracking-[0.02em] text-ink uppercase whitespace-nowrap transition-colors duration-200 hover:bg-gold-light disabled:opacity-60"
                >
                  {status === "loading" ? "Joining…" : "Join Terrific 30"}
                </button>
              </form>
            )}
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
