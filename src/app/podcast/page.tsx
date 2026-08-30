import type { Metadata } from "next";
import { Section } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeaturedEpisode } from "@/components/podcast/FeaturedEpisode";
import { PlatformLinks } from "@/components/podcast/PlatformLinks";
import { PodcastIndexClient } from "@/components/podcast/PodcastIndexClient";
import { getAllEpisodes, toEpisodeSummary } from "@/lib/podcast";
import { PODCAST_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Podcast — Dogood Mavericko",
  description: "Conversations on faith, freedom, entrepreneurship, and building an online lifestyle business.",
};

export default function PodcastPage() {
  const episodes = getAllEpisodes();
  const [featured, ...rest] = episodes;

  return (
    <div className="flex flex-col">
      <Section tone="paper">
        <SectionHeading
          eyebrow={PODCAST_NAME}
          title="Listen To The Podcast"
          description="Real conversations about faith, freedom, entrepreneurship, and building a life on your own terms — including interviews with people who've actually done it."
          className="mb-10"
        />
        <PlatformLinks />
      </Section>

      {featured ? <FeaturedEpisode episode={featured} /> : null}

      <Section tone="paper-dim">
        <SectionHeading eyebrow="Browse" title="Latest Episodes" className="mb-10" />
        <PodcastIndexClient episodes={rest.map(toEpisodeSummary)} />
      </Section>
    </div>
  );
}
