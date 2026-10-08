import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getPageOgImagePath } from "@/lib/og-images";
import { Section } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeaturedVideo } from "@/components/videos/FeaturedVideo";
import { VideoIndexClient } from "@/components/videos/VideoIndexClient";
import { getAllVideos, toVideoSummary } from "@/lib/videos";
import { VIDEO_CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "Videos",
  description: "Videos on faith, freedom, entrepreneurship, and building an online lifestyle business.",
  path: "/videos",
  image: getPageOgImagePath("videos"),
});

export default function VideosPage() {
  const videos = getAllVideos();
  const [featured, ...rest] = videos;

  return (
    <div className="flex flex-col">
      <Section tone="paper">
        <SectionHeading
          as="h1"
          eyebrow="The Video Library"
          title="Watch The Videos"
          description="Faith, freedom, entrepreneurship, and everything in between — on video."
        />
      </Section>

      {featured ? <FeaturedVideo video={featured} /> : null}

      <Section tone="paper-dim">
        <SectionHeading eyebrow="Browse" title="Latest Videos" className="mb-10" />
        <VideoIndexClient videos={rest.map(toVideoSummary)} categories={VIDEO_CATEGORIES} />
      </Section>
    </div>
  );
}
