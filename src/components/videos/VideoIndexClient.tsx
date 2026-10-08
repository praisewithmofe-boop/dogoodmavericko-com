"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { VideoCard } from "@/components/content/VideoCard";
import type { VideoSummary } from "@/types/content";

interface VideoIndexClientProps {
  videos: VideoSummary[];
  categories: readonly string[];
}

export function VideoIndexClient({ videos, categories }: VideoIndexClientProps) {
  // Reads the ?category= deep link in the browser. useSyncExternalStore (rather
  // than useSearchParams) keeps the video grid in the static HTML for search
  // engines; the server snapshot is "no category".
  const urlCategory = useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).get("category"),
    () => null,
  );

  const [picked, setPicked] = useState<string | null | undefined>(undefined);
  const category = picked === undefined ? urlCategory : picked;

  const filtered = useMemo(() => {
    if (!category) return videos;
    return videos.filter((video) => video.category === category);
  }, [videos, category]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setPicked(null)}
          className={`border px-5 py-2.5 text-button font-medium uppercase tracking-[0.02em] transition-colors duration-200 ${
            category === null
              ? "border-gold-dark bg-charcoal text-bone"
              : "border-border bg-paper text-charcoal hover:border-gold-dark hover:text-gold-dark"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setPicked(c)}
            className={`border px-5 py-2.5 text-button font-medium uppercase tracking-[0.02em] transition-colors duration-200 ${
              category === c
                ? "border-gold-dark bg-charcoal text-bone"
                : "border-border bg-paper text-charcoal hover:border-gold-dark hover:text-gold-dark"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((video) => (
            <VideoCard key={video.slug} video={video} />
          ))}
        </div>
      ) : (
        <p className="text-body-lg text-slate">No videos in this category yet.</p>
      )}
    </div>
  );
}
