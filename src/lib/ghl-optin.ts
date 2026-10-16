"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";

/**
 * Public relay URL for Terrific 30 signups.
 * Set NEXT_PUBLIC_GHL_OPTIN_URL at build time, or paste the workers.dev URL here.
 * This file must only contain that public URL — the GoHighLevel token stays on the Worker.
 */
export const CONFIGURED_GHL_OPTIN_URL = "";

const envOptInUrl = process.env.NEXT_PUBLIC_GHL_OPTIN_URL?.trim() ?? "";

export const GHL_OPTIN_URL = envOptInUrl || CONFIGURED_GHL_OPTIN_URL;

const UNAVAILABLE = "Signup isn’t available right now. Please try again in a little while.";
const NETWORK = "We couldn’t reach the signup service. Please check your connection and try again.";
const GENERIC = "We couldn’t complete your signup. Please try again.";

export type OptInResult = { ok: true } | { ok: false; error: string };

export async function submitTerrific30OptIn(input: {
  firstName: string;
  email: string;
}): Promise<OptInResult> {
  const email = input.email.trim();
  const firstName = input.firstName.trim();
  if (!email) return { ok: false, error: "Enter a valid email address." };
  if (!GHL_OPTIN_URL) return { ok: false, error: UNAVAILABLE };

  try {
    const response = await fetch(GHL_OPTIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(firstName ? { firstName, email } : { email }),
      cache: "no-store",
    });

    let payload: { ok?: boolean; error?: string } | null = null;
    try {
      payload = (await response.json()) as { ok?: boolean; error?: string };
    } catch {
      payload = null;
    }

    if (response.ok && payload?.ok === true) return { ok: true };
    return { ok: false, error: readableError(payload?.error) ?? GENERIC };
  } catch {
    return { ok: false, error: NETWORK };
  }
}

function readableError(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const message = value.trim();
  if (!message || message.length > 180) return null;
  if (/[\r\n<>]/.test(message)) return null;
  return message;
}

export function useTerrific30OptIn() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const inFlight = useRef(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setStatus("loading");
    setError("");

    void submitTerrific30OptIn({ firstName, email }).then((result) => {
      inFlight.current = false;
      if (result.ok) {
        setStatus("success");
        return;
      }
      setStatus("error");
      setError(result.error);
    });
  }

  return { status, error, firstName, setFirstName, email, setEmail, handleSubmit };
}
