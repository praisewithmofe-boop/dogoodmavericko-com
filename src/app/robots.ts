import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

// Crawling is allowed everywhere; the sitemap tells search engines what to
// index. (The internal /style-guide page is kept out of results with a
// noindex tag rather than a Disallow rule, so crawlers can actually see it.)
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
