"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import type { SearchContentType, SearchIndexEntry } from "@/types/search";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TYPE_LABELS: Record<SearchContentType, string> = {
  blog: "Blog",
  podcast: "Podcast",
  video: "Video",
};

const MAX_RESULTS = 8;

// The site has no server at request time (static export to GitHub Pages),
// so search runs entirely client-side against a build-time JSON index
// (public/search-index.json, written by scripts/generate-search-index.mjs)
// fuzzy-matched with Fuse.js. Rendered once from SiteHeader and shared by
// both the desktop header trigger and the MobileNav trigger.
export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchIndexEntry[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Lazy-load the index the first time the modal is opened, not on every
  // page load.
  useEffect(() => {
    if (!isOpen || index !== null) return;
    fetch("/search-index.json")
      .then((res) => res.json())
      .then((data: SearchIndexEntry[]) => setIndex(data))
      .catch(() => setIndex([]));
  }, [isOpen, index]);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  // Clear the query after the close transition so re-opening starts fresh.
  useEffect(() => {
    if (isOpen) return;
    const timeout = setTimeout(() => setQuery(""), 200);
    return () => clearTimeout(timeout);
  }, [isOpen]);

  const fuse = useMemo(() => {
    if (!index) return null;
    return new Fuse(index, {
      keys: [
        { name: "title", weight: 0.7 },
        { name: "excerpt", weight: 0.3 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
    });
  }, [index]);

  const results = useMemo(() => {
    if (!fuse || query.trim() === "") return [];
    return fuse.search(query).slice(0, MAX_RESULTS).map((r) => r.item);
  }, [fuse, query]);

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-start justify-center bg-ink/70 px-4 pt-24 backdrop-blur-sm transition-opacity duration-200 ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      aria-hidden={!isOpen}
    >
      <div className="w-full max-w-xl border border-border-dark bg-ink-soft">
        <div className="flex items-center gap-3 border-b border-border-dark px-5 py-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-fog">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <line x1="21" y1="21" x2="16.2" y2="16.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, episodes, videos…"
            className="w-full bg-transparent text-body-lg text-bone outline-none placeholder:text-fog"
          />
        </div>

        {query.trim() !== "" ? (
          <div className="max-h-[60vh] overflow-y-auto">
            {results.length > 0 ? (
              <ul className="flex flex-col divide-y divide-border-dark">
                {results.map((result) => (
                  <li key={`${result.type}-${result.slug}`}>
                    <Link
                      href={result.url}
                      onClick={onClose}
                      className="group flex flex-col gap-1.5 px-5 py-4 transition-colors duration-150 hover:bg-ink"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-meta font-semibold uppercase tracking-[0.04em] text-gold-light">
                          {TYPE_LABELS[result.type]}
                        </span>
                        <span className="text-body font-semibold text-bone transition-colors duration-150 group-hover:text-gold-light">
                          {result.title}
                        </span>
                      </div>
                      {result.excerpt ? (
                        <p className="line-clamp-1 text-body text-fog">{result.excerpt}</p>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-8 text-center text-body text-fog">
                {index === null ? "Loading…" : `No results for “${query}”.`}
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
