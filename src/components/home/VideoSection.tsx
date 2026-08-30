import Link from "next/link";
import { Section } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideoThumbnail } from "@/components/content/VideoThumbnail";
import { VideoCard } from "@/components/content/VideoCard";
import { CtaButton } from "@/components/ui/CtaButton";
import { getAllVideos, toVideoSummary } from "@/lib/videos";
import { formatDate } from "@/lib/format";

export function VideoSection() {
  const [featured, ...rest] = getAllVideos();
  const supporting = rest.slice(0, 2).map(toVideoSummary);
  if (!featured) return null;

  return (
    <Section tone="paper">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="On YouTube" title="Watch The Latest Videos" />
        <CtaButton href="/videos" variant="secondary" size="md">
          View All Videos
        </CtaButton>
      </div>

      <Link href={`/videos/${featured.slug}`} className="group mb-10 block">
        <VideoThumbnail
          title={featured.title}
          youtubeId={featured.youtubeId}
          thumbnail={featured.thumbnail}
          duration={featured.duration}
          playIconSize="lg"
        />
        <div className="mt-5 flex flex-col gap-2">
          <span className="text-meta font-semibold uppercase tracking-[0.04em] text-gold-dark">
            {featured.category}
          </span>
          <h3 className="text-h3 font-semibold text-charcoal transition-colors duration-200 group-hover:text-gold-dark">
            {featured.title}
          </h3>
          <span className="text-meta uppercase tracking-[0.04em] text-slate">
            {formatDate(featured.publishedAt)} · {featured.duration}
          </span>
        </div>
      </Link>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
        {supporting.map((video) => (
          <VideoCard key={video.slug} video={video} />
        ))}
      </div>
    </Section>
  );
}
