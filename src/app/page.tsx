import type { Metadata } from "next";
import { buildMetadata, SITE_DESCRIPTION } from "@/lib/seo";
import { getPageOgImagePath } from "@/lib/og-images";
import { Terrific30OptIn } from "@/components/home/Terrific30OptIn";
import { Hero } from "@/components/home/Hero";
import { AboutIntro } from "@/components/home/AboutIntro";
import { StartHere } from "@/components/home/StartHere";
import { FeaturedArticle } from "@/components/home/FeaturedArticle";
import { LatestArticles } from "@/components/home/LatestArticles";
import { PodcastSection } from "@/components/home/PodcastSection";
import { VideoSection } from "@/components/home/VideoSection";
import { TopicsSection } from "@/components/home/TopicsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { FinalCta } from "@/components/home/FinalCta";

export const metadata: Metadata = buildMetadata({
  title: "Dogood Mavericko — Faith, Freedom & Entrepreneurship",
  exactTitle: true,
  description: SITE_DESCRIPTION,
  path: "/",
  image: getPageOgImagePath("home"),
});

export default function Home() {
  return (
    <div className="flex flex-col">
      <Terrific30OptIn />
      <Hero />
      <AboutIntro />
      <StartHere />
      <FeaturedArticle />
      <LatestArticles />
      <PodcastSection />
      <VideoSection />
      <TopicsSection />
      <NewsletterSection />
      <FinalCta />
    </div>
  );
}
