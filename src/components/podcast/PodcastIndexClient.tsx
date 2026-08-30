"use client";

import { useMemo, useState } from "react";
import { PodcastCard } from "@/components/content/PodcastCard";
import type { PodcastEpisodeSummary } from "@/types/content";

interface PodcastIndexClientProps {
  episodes: PodcastEpisodeSummary[];
}

export function PodcastIndexClient({ episodes }: PodcastIndexClientProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return episodes;
    return episodes.filter(
      (episode) =>
        episode.title.toLowerCase().includes(q) ||
        episode.excerpt.toLowerCase().includes(q) ||
        episode.guest?.toLowerCase().includes(q),
    );
  }, [episodes, query]);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <label htmlFor="podcast-search" className="sr-only">
          Search episodes
        </label>
        <input
          id="podcast-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search episodes…"
          className="w-full max-w-md border border-border bg-paper px-4 py-3 text-body text-charcoal outline-none transition-colors placeholder:text-slate focus-visible:border-gold-dark"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {filtered.map((episode) => (
            <PodcastCard key={episode.slug} episode={episode} />
          ))}
        </div>
      ) : (
        <p className="text-body-lg text-slate">No episodes match your search yet.</p>
      )}
    </div>
  );
}
