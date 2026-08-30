import { Section, PageContainer } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaButton } from "@/components/ui/CtaButton";
import { ArticleCard } from "@/components/content/ArticleCard";
import { PodcastCard } from "@/components/content/PodcastCard";
import { VideoCard } from "@/components/content/VideoCard";
import { NewsletterSignup } from "@/components/conversion/NewsletterSignup";
import type { ArticleSummary, PodcastEpisodeSummary, VideoSummary } from "@/types/content";

const articles: ArticleSummary[] = [
  {
    slug: "the-case-for-radical-financial-freedom",
    title: "The Case for Radical Financial Freedom",
    excerpt:
      "Why chasing a paycheck is the riskiest financial strategy of all, and what to build instead.",
    category: "Money & Freedom",
    publishedAt: "Jul 14, 2026",
    readTime: "8 min read",
  },
  {
    slug: "faith-as-a-founder",
    title: "Faith as a Founder: Building on Something Solid",
    excerpt: "What eighteen months of building in the dark taught me about conviction.",
    category: "Faith",
    publishedAt: "Jul 2, 2026",
    readTime: "6 min read",
  },
  {
    slug: "the-30-day-audit-that-changed-everything",
    title: "The 30-Day Audit That Changed Everything",
    excerpt: "A simple framework for auditing your time, money, and attention this month.",
    category: "Entrepreneurship",
    publishedAt: "Jun 21, 2026",
    readTime: "5 min read",
  },
];

const episodes: PodcastEpisodeSummary[] = [
  {
    slug: "starting-with-nothing",
    title: "Starting With Nothing — And Why That's an Advantage",
    excerpt: "A candid conversation on building leverage before you have capital.",
    episodeNumber: 42,
    duration: "51 min",
    publishedAt: "Jul 10, 2026",
  },
  {
    slug: "the-discipline-of-rest",
    title: "The Discipline of Rest",
    excerpt: "Why sabbath is a competitive advantage most entrepreneurs ignore.",
    episodeNumber: 41,
    duration: "38 min",
    publishedAt: "Jul 3, 2026",
  },
];

const videos: VideoSummary[] = [
  {
    slug: "morning-routine-2026",
    title: "My Actual Morning Routine in 2026",
    excerpt: "A real walkthrough of the habits that actually stuck, and the ones that didn't.",
    category: "Lifestyle Business",
    duration: "12:04",
    publishedAt: "Jul 8, 2026",
  },
  {
    slug: "how-i-price-digital-products",
    title: "How I Price Digital Products (Real Numbers)",
    excerpt: "The actual pricing math behind a real digital product launch, no hypotheticals.",
    category: "Entrepreneurship",
    duration: "18:41",
    publishedAt: "Jun 29, 2026",
  },
  {
    slug: "inside-terrific-30",
    title: "Inside Terrific 30: A Full Walkthrough",
    excerpt: "A complete look inside the community before you decide to join.",
    category: "Terrific 30",
    duration: "09:57",
    publishedAt: "Jun 18, 2026",
  },
];

export default function StyleGuidePage() {
  return (
    <div className="flex flex-col">
      <Section tone="paper" className="pb-12 md:pb-12">
        <SectionHeading
          eyebrow="Internal only"
          title="Design system &amp; component style guide"
          description="A living reference for every reusable primitive in the Dogood Mavericko design system — colors, type, buttons, cards, and site chrome. Not a real page."
        />
      </Section>

      {/* COLOR */}
      <Section tone="paper-dim">
        <SectionHeading eyebrow="Foundations" title="Color" className="mb-10" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { name: "Ink", class: "bg-ink", text: "text-bone" },
            { name: "Paper", class: "bg-paper border border-border", text: "text-charcoal" },
            { name: "Paper Dim", class: "bg-paper-dim border border-border", text: "text-charcoal" },
            { name: "Gold", class: "bg-gold", text: "text-ink" },
            { name: "Gold Dark", class: "bg-gold-dark", text: "text-bone" },
            { name: "Charcoal", class: "bg-charcoal", text: "text-bone" },
          ].map((swatch) => (
            <div key={swatch.name} className="flex flex-col gap-3">
              <div className={`flex aspect-square items-end p-3 ${swatch.class}`}>
                <span className={`text-meta font-medium ${swatch.text}`}>{swatch.name}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* TYPE */}
      <Section tone="paper">
        <SectionHeading eyebrow="Foundations" title="Typography" className="mb-10" />
        <div className="flex flex-col gap-8">
          <div className="border-b border-border pb-8">
            <span className="text-meta uppercase tracking-[0.04em] text-slate">
              Display — Hero headlines
            </span>
            <p className="text-display font-semibold text-charcoal">Build a life you own.</p>
          </div>
          <div className="border-b border-border pb-8">
            <span className="text-meta uppercase tracking-[0.04em] text-slate">
              H2 — Section headlines
            </span>
            <p className="text-h2 font-semibold text-charcoal">Latest from the blog</p>
          </div>
          <div className="border-b border-border pb-8">
            <span className="text-meta uppercase tracking-[0.04em] text-slate">
              H3 — Subheadings
            </span>
            <p className="text-h3 font-semibold text-charcoal">
              The Case for Radical Financial Freedom
            </p>
          </div>
          <div className="border-b border-border pb-8">
            <span className="text-meta uppercase tracking-[0.04em] text-slate">
              Body — Reading copy
            </span>
            <p className="max-w-2xl text-body-lg text-charcoal">
              Why chasing a paycheck is the riskiest financial strategy of all, and what to build
              instead — a practical framework for thinking about risk, leverage, and time.
            </p>
          </div>
          <div>
            <span className="text-meta uppercase tracking-[0.04em] text-slate">
              Meta &amp; buttons
            </span>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <span className="text-meta uppercase tracking-[0.04em] text-slate">
                Jul 14, 2026 · 8 min read
              </span>
              <span className="text-button font-medium uppercase tracking-[0.02em] text-gold-dark">
                Join Terrific 30
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* BUTTONS */}
      <Section tone="paper-dim">
        <SectionHeading eyebrow="Components" title="Buttons" className="mb-10" />
        <div className="flex flex-wrap items-center gap-4">
          <CtaButton href="#" variant="primary" size="lg">
            Join Terrific 30
          </CtaButton>
          <CtaButton href="#" variant="primary" size="md">
            Subscribe
          </CtaButton>
          <CtaButton href="#" variant="secondary" size="md">
            Read the Archive
          </CtaButton>
        </div>
      </Section>

      {/* ARTICLE CARDS */}
      <Section tone="paper">
        <SectionHeading eyebrow="Components" title="Article card" className="mb-10" />
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </Section>

      {/* PODCAST CARDS */}
      <Section tone="paper-dim">
        <SectionHeading eyebrow="Components" title="Podcast card" className="mb-10" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {episodes.map((episode) => (
            <PodcastCard key={episode.slug} episode={episode} />
          ))}
        </div>
      </Section>

      {/* VIDEO CARDS */}
      <Section tone="paper">
        <SectionHeading eyebrow="Components" title="Video card" className="mb-10" />
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <VideoCard key={video.slug} video={video} />
          ))}
        </div>
      </Section>

      {/* NEWSLETTER */}
      <Section tone="ink">
        <SectionHeading
          eyebrow="Components"
          title="Newsletter signup"
          tone="dark"
          className="mb-10"
        />
        <NewsletterSignup tone="dark" />
      </Section>

      <PageContainer className="py-16">
        <p className="text-meta uppercase tracking-[0.04em] text-slate">
          Header and footer are rendered globally in the root layout — scroll up/down to review
          them.
        </p>
      </PageContainer>
    </div>
  );
}
