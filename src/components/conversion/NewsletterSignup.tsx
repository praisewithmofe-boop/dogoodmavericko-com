"use client";

import { useState } from "react";
import type { FormEvent } from "react";

interface NewsletterSignupProps {
  tone?: "light" | "dark";
  variant?: "full" | "compact";
  headline?: string;
  description?: string;
  className?: string;
}

export function NewsletterSignup({
  tone = "light",
  variant = "full",
  headline = "Join the newsletter",
  description = "One email a week — faith, freedom, and building a life on your own terms. No noise.",
  className = "",
}: NewsletterSignupProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [email, setEmail] = useState("");

  const textColor = tone === "dark" ? "text-bone" : "text-charcoal";
  const subColor = tone === "dark" ? "text-fog" : "text-slate";
  const inputBorder = tone === "dark" ? "border-border-dark text-bone placeholder:text-fog" : "border-border text-charcoal placeholder:text-slate";

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    window.setTimeout(() => setStatus("success"), 600);
  }

  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {variant === "full" ? (
        <div className="flex flex-col gap-2">
          <h3 className={`text-h3 font-semibold ${textColor}`}>{headline}</h3>
          <p className={`text-body ${subColor} max-w-md`}>{description}</p>
        </div>
      ) : null}

      {status === "success" ? (
        <p className={`text-body font-medium ${tone === "dark" ? "text-gold-light" : "text-gold-dark"}`}>
          You&rsquo;re in. Check your inbox to confirm.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={`w-full border bg-transparent px-4 py-3 text-body outline-none transition-colors ${inputBorder} focus-visible:border-gold-dark`}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center justify-center bg-gold px-6 py-3 text-button font-medium tracking-[0.02em] text-ink uppercase whitespace-nowrap transition-colors duration-200 hover:bg-gold-light disabled:opacity-60"
          >
            {status === "loading" ? "Joining…" : "Subscribe"}
          </button>
        </form>
      )}
    </div>
  );
}
