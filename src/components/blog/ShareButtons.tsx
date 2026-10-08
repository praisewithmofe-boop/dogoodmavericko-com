"use client";

import { useState } from "react";
import { canonicalUrl } from "@/lib/seo";

interface ShareButtonsProps {
  title: string;
  path: string;
}

const linkClass =
  "text-button font-medium uppercase tracking-[0.02em] text-charcoal transition-colors hover:text-gold-dark";

export function ShareButtons({ title, path }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Always share the canonical production URL (not localhost or a preview
  // domain), and build the links at render time so they are real, crawlable
  // hrefs that also work without JavaScript.
  const url = canonicalUrl(path);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4 border-y border-border py-6">
      <span className="text-meta font-semibold uppercase tracking-[0.04em] text-slate">Share</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        X
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        LinkedIn
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        Facebook
      </a>
      <button type="button" onClick={handleCopy} className={linkClass}>
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}
