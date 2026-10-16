"use client";

import { useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import { submitNewsletterSignup } from "@/lib/ghl-optin";

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
  const inputId = useId();
  const inFlight = useRef(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const textColor = tone === "dark" ? "text-bone" : "text-charcoal";
  const subColor = tone === "dark" ? "text-fog" : "text-slate";
  const inputBorder = tone === "dark" ? "border-border-dark text-bone placeholder:text-fog" : "border-border text-charcoal placeholder:text-slate";

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || inFlight.current) return;
    inFlight.current = true;
    setStatus("loading");
    setError("");

    void submitNewsletterSignup({ email }).then((result) => {
      inFlight.current = false;
      if (result.ok) {
        setStatus("success");
        return;
      }
      setStatus("error");
      setError(result.error);
    });
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
        <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor={inputId} className="sr-only">
              Email address
            </label>
            <input
              id={inputId}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className={`w-full border bg-transparent px-4 py-3 text-body outline-none transition-colors ${inputBorder} focus-visible:border-gold-dark`}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center justify-center bg-gold px-6 py-3 text-button font-medium tracking-[0.02em] text-ink uppercase whitespace-nowrap transition-colors duration-200 hover:bg-gold-light disabled:opacity-60"
            >
              {status === "loading" ? "Subscribing…" : status === "error" ? "Try again" : "Subscribe"}
            </button>
          </div>
          {status === "error" ? (
            <p role="alert" className={`text-body ${textColor}`}>
              {error}
            </p>
          ) : null}
        </form>
      )}
    </div>
  );
}
