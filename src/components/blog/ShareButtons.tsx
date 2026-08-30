"use client";

import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  path: string;
}

export function ShareButtons({ title, path }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  function getUrl() {
    return `${window.location.origin}${path}`;
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(getUrl());
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
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=`}
        onClick={(e) => {
          e.preventDefault();
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(getUrl())}`,
            "_blank",
            "noopener,noreferrer",
          );
        }}
        className="text-button font-medium uppercase tracking-[0.02em] text-charcoal transition-colors hover:text-gold-dark"
      >
        X
      </a>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getUrl())}`,
            "_blank",
            "noopener,noreferrer",
          );
        }}
        className="text-button font-medium uppercase tracking-[0.02em] text-charcoal transition-colors hover:text-gold-dark"
      >
        LinkedIn
      </a>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`,
            "_blank",
            "noopener,noreferrer",
          );
        }}
        className="text-button font-medium uppercase tracking-[0.02em] text-charcoal transition-colors hover:text-gold-dark"
      >
        Facebook
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="text-button font-medium uppercase tracking-[0.02em] text-charcoal transition-colors hover:text-gold-dark"
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}
