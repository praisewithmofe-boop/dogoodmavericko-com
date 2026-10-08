"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
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
  // Topic" pills) in the browser. useSyncExternalStore (rather than
  // useSearchParams) lets the full article grid still be rendered into the
  // static HTML for search engines; the server snapshot is "no category", and
  // the browser switches to the real value right after hydration.
  const urlCategory = useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).get("category"),
    () => null,
  );

  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string | null | undefined>(undefined);
  const category = picked === undefined ? urlCategory : picked;
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

  const hasMore = visibleCount < filtered.length;

  function selectCategory(next: string | null) {
    setPicked(next);
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

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Every match is rendered (so all posts are linked in the page HTML);
              the ones past the current page are simply hidden until "Load More". */}
          {filtered.map((article, i) => (
            <div key={article.slug} className={i < visibleCount ? "contents" : "hidden"}>
              <ArticleCard article={article} />
            </div>
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
