import { getAllPosts } from "@/lib/content";
import { getAllEpisodes } from "@/lib/podcast";
import { getAllVideos } from "@/lib/videos";
import { PODCAST_NAME, SITE_NAME, SOCIAL_LINKS } from "@/lib/constants";
import { SITE_DESCRIPTION, canonicalUrl } from "@/lib/seo";

export const dynamic = "force-static";

// /llms.txt — a plain-text summary of the site for AI crawlers and assistants
// (https://llmstxt.org). Built from the same content as the site itself, so it
// stays current as posts, episodes, and videos are added.
export function GET() {
  const posts = getAllPosts();
  const episodes = getAllEpisodes();
  const videos = getAllVideos();

  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `Name note: "${SITE_NAME}" is one person's name — "Dogood" and "Mavericko" are the actual spellings (not "dog good" or "maverick"). Contact: dogoodmavericko@gmail.com.`,
    "",
    `${SITE_NAME} is a personal media brand: a blog, a podcast, and a video channel about faith, freedom, entrepreneurship, modern moneymaking, escaping the 9-to-5 rat race, and building an online lifestyle business. The site is also the home of Terrific 30, a free online community.`,
    "",
    "## Main pages",
    "",
    `- [Home](${canonicalUrl("/")}): Start here — featured articles, the podcast, and videos.`,
    `- [About](${canonicalUrl("/about")}): The story behind ${SITE_NAME}.`,
    `- [Blog](${canonicalUrl("/blog")}): Articles on faith, freedom, entrepreneurship, and online business.`,
    `- [Podcast](${canonicalUrl("/podcast")}): ${PODCAST_NAME}.`,
    `- [Videos](${canonicalUrl("/videos")}): Video library.`,
    `- [Terrific 30](${canonicalUrl("/terrific-30")}): A free online community for people exploring entrepreneurship and online business.`,
    `- [Contact](${canonicalUrl("/contact")}): Get in touch.`,
    "",
    "## Blog posts",
    "",
    ...posts.map((p) => `- [${p.title}](${canonicalUrl(`/blog/${p.slug}`)}): ${p.excerpt}`),
    "",
    "## Podcast episodes",
    "",
    ...episodes.map((e) => `- [${e.title}](${canonicalUrl(`/podcast/${e.slug}`)}): ${e.excerpt}`),
    "",
    "## Videos",
    "",
    ...videos.map((v) => `- [${v.title}](${canonicalUrl(`/videos/${v.slug}`)}): ${v.excerpt}`),
    "",
    "## Elsewhere",
    "",
    ...SOCIAL_LINKS.map((s) => `- [${s.label}](${s.href})`),
    "",
    "## Policies",
    "",
    `- [Privacy Policy](${canonicalUrl("/privacy")})`,
    `- [Terms & Conditions](${canonicalUrl("/terms")})`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
