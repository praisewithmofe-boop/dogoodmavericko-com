import { Section } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaButton } from "@/components/ui/CtaButton";
import { ContentThumbnail } from "@/components/ui/ContentThumbnail";
import { PodcastCard } from "@/components/content/PodcastCard";
import { PlatformLinks } from "@/components/podcast/PlatformLinks";
import { resolvePodcastImage } from "@/lib/thumbnails";
import { getAllEpisodes, toEpisodeSummary } from "@/lib/podcast";
import { formatDate } from "@/lib/format";

export function PodcastSection() {
  const [featured, ...rest] = getAllEpisodes();
  const latest = rest.slice(0, 2).map(toEpisodeSummary);
  if (!featured) return null;

  return (
    <Section tone="ink">
      <SectionHeading
        eyebrow="The Podcast"
        title="Listen To The Podcast"
        tone="dark"
        description="Real conversations about faith, freedom, entrepreneurship, and building a life on your own terms — including interviews with people who've actually done it."
        className="mb-12"
      />

      <div className="mb-16 grid grid-cols-1 gap-10 border-b border-border-dark pb-16 lg:grid-cols-2 lg:gap-16">
        <ContentThumbnail
          src={resolvePodcastImage(featured)}
          alt={`Dogood Mavericko podcast — Episode ${featured.episodeNumber}: ${featured.title}`}
          ratio="16/9"
          fallbackTone="dark"
        />

        <div className="flex flex-col justify-center gap-5">
          <span className="text-meta font-semibold uppercase tracking-[0.04em] text-gold-light">
            Episode {String(featured.episodeNumber).padStart(2, "0")}
          </span>
          <h3 className="text-h2 font-semibold text-bone">{featured.title}</h3>
          <p className="text-body-lg text-fog">{featured.excerpt}</p>
          <span className="text-meta uppercase tracking-[0.04em] text-fog">
            {formatDate(featured.publishedAt)} · {featured.duration}
          </span>

          <div className="mt-2 flex flex-wrap items-center gap-4">
            <CtaButton href={`/podcast/${featured.slug}`} variant="primary" size="md">
              Listen Now
            </CtaButton>
          </div>

          <PlatformLinks tone="dark" className="mt-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {latest.map((episode) => (
          <PodcastCard key={episode.slug} episode={episode} tone="dark" />
        ))}
      </div>
    </Section>
  );
}
