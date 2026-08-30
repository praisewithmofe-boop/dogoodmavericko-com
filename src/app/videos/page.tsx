import type { Metadata } from "next";
import { Suspense } from "react";
import { Section } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeaturedVideo } from "@/components/videos/FeaturedVideo";
import { VideoIndexClient } from "@/components/videos/VideoIndexClient";
import { getAllVideos, toVideoSummary } from "@/lib/videos";
import { VIDEO_CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Videos — Dogood Mavericko",
  description: "Videos on faith, freedom, entrepreneurship, and building an online lifestyle business.",
};

export default function VideosPage() {
  const videos = getAllVideos();
  const [featured, ...rest] = videos;

  return (
    <div className="flex flex-col">
      <Section tone="paper">
        <SectionHeading
          eyebrow="The Video Library"
          title="Watch The Videos"
          description="Faith, freedom, entrepreneurship, and everything in between — on video."
        />
      </Section>

      {featured ? <FeaturedVideo video={featured} /> : null}

      <Section tone="paper-dim">
        <SectionHeading eyebrow="Browse" title="Latest Videos" className="mb-10" />
        {/* useSearchParams() (for the ?category= deep link) only works on the
            client, and Next requires a Suspense boundary around it so the
            rest of this page can still be statically exported. */}
        <Suspense fallback={null}>
          <VideoIndexClient videos={rest.map(toVideoSummary)} categories={VIDEO_CATEGORIES} />
        </Suspense>
      </Section>
    </div>
  );
}
