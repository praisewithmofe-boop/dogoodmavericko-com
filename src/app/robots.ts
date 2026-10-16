import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

// Search and AI-answer crawlers. Everything is already allowed by the "*" rule
// below; listing them by name states the intent explicitly (some crawlers and
// site-audit tools only look for their own name) and keeps them allowed if the
// default rule is ever tightened.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "Google-Extended",
  "PerplexityBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Applebot-Extended",
  "CCBot",
];

// Crawling is allowed everywhere; the sitemap tells search engines what to index.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_CRAWLERS, allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
