"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import { PageContainer } from "@/components/layout/PageContainer";
import { TERRIFIC30_HERO } from "@/lib/terrific30-content";
import { HERO_CONTENT } from "@/lib/home-content";

export function TerrificHero() {
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
            {status === "success" ? (
              <p className="text-body-lg font-medium text-gold-light">
                You&rsquo;re in. Check your inbox to confirm and get started.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                <label htmlFor="t30-hero-first-name" className="sr-only">
                  First name
                </label>
                <input
                  id="t30-hero-first-name"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full border border-bone/30 bg-paper/95 px-4 py-3.5 text-body text-charcoal outline-none transition-colors placeholder:text-slate focus-visible:border-gold-light sm:w-40"
                />
                <label htmlFor="t30-hero-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="t30-hero-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-bone/30 bg-paper/95 px-4 py-3.5 text-body text-charcoal outline-none transition-colors placeholder:text-slate focus-visible:border-gold-light sm:flex-1"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center justify-center bg-gold px-6 py-3.5 text-button font-medium tracking-[0.02em] text-ink uppercase whitespace-nowrap transition-colors duration-200 hover:bg-gold-light disabled:opacity-60"
                >
                  {status === "loading" ? "Joining…" : TERRIFIC30_HERO.cta}
                </button>
              </form>
            )}
            <p className="text-meta tracking-[0.02em] text-fog">
              Free forever. No spam — unsubscribe any time.
            </p>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
