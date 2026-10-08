import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getPageOgImagePath } from "@/lib/og-images";
import { AboutHero } from "@/components/about/AboutHero";
import { WhatYoullFind } from "@/components/about/WhatYoullFind";
import { Mission } from "@/components/about/Mission";
import { AboutFinalCta } from "@/components/about/AboutFinalCta";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: "The story behind Dogood Mavericko — faith, freedom, entrepreneurship, and why he gives away his best ideas for free.",
  path: "/about",
  image: getPageOgImagePath("about"),
});

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <AboutHero />
      <WhatYoullFind />
      <Mission />
      <AboutFinalCta />
    </div>
  );
}
