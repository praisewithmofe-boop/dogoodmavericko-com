"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { VideoCard } from "@/components/content/VideoCard";
import type { VideoSummary } from "@/types/content";

interface VideoIndexClientProps {
  videos: VideoSummary[];
  categories: readonly string[];
}

export function VideoIndexClient({ videos, categories }: VideoIndexClientProps) {
  // Reads the ?category= deep link on the client — there's no server at
  // request time under static export to read this for us.
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? undefined;

  const [category, setCategory] = useState<string | null>(initialCategory ?? null);

  const filtered = useMemo(() => {
    if (!category) return videos;
    return videos.filter((video) => video.category === category);
  }, [videos, category]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setCategory(null)}
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
            onClick={() => setCategory(c)}
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
