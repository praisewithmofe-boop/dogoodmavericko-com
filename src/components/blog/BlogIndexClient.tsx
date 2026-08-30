"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArticleCard } from "@/components/content/ArticleCard";
import { CtaButton } from "@/components/ui/CtaButton";
import type { ArticleSummary } from "@/types/content";

const PAGE_SIZE = 6;

interface BlogIndexClientProps {
  articles: ArticleSummary[];
  categories: readonly string[];
}

export function BlogIndexClient({ articles, categories }: BlogIndexClientProps) {
  // Reads the ?category= deep link (e.g. from the homepage's "Explore by
  // Topic" pills) on the client — there's no server at request time under
  // static export to read this for us.
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? undefined;

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(initialCategory ?? null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesCategory = !category || article.category === category;
      const matchesQuery =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [articles, query, category]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  function selectCategory(next: string | null) {
    setCategory(next);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => selectCategory(null)}
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
              onClick={() => selectCategory(c)}
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

        <label htmlFor="blog-search" className="sr-only">
          Search articles
        </label>
        <input
          id="blog-search"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
          placeholder="Search articles…"
          className="w-full max-w-md border border-border bg-paper px-4 py-3 text-body text-charcoal outline-none transition-colors placeholder:text-slate focus-visible:border-gold-dark"
        />
      </div>

      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-body-lg text-slate">No articles match your search yet.</p>
      )}

      {hasMore ? (
        <div className="flex justify-center">
          <CtaButton
            variant="secondary"
            size="md"
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
          >
            Load More
          </CtaButton>
        </div>
      ) : null}
    </div>
  );
}
