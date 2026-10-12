import { PODCAST_NAME, PODCAST_PLATFORMS, SITE_NAME, SOCIAL_LINKS } from "@/lib/constants";
import { SITE_DESCRIPTION, SITE_URL, absoluteUrl, canonicalUrl } from "@/lib/seo";
import type { BlogPost, PodcastEpisode, Video } from "@/types/content";

const CONTEXT = "https://schema.org";

const logo = {
  "@type": "ImageObject",
  url: `${SITE_URL}/icon.png`,
  width: 512,
  height: 512,
};

// Every official profile, so search engines and AI assistants can tell they
// are all the same person/brand. Podcast listings are included.
const sameAs = [
  ...new Set([
    ...SOCIAL_LINKS.map((s) => s.href),
    ...PODCAST_PLATFORMS.map((p) => p.href),
    "https://creators.spotify.com/pod/profile/dogood-mavericko/",
  ]),
];

const SITE_EMAIL = "dogoodmavericko@gmail.com";
const PERSON_DESCRIPTION =
  "Dogood Mavericko is a writer, podcaster, and entrepreneur sharing ideas on faith, freedom, entrepreneurship, escaping the 9-to-5 rat race, modern moneymaking, and building an online lifestyle business. Host of The Dogood Mavericko Podcast and home of the free Terrific 30 community.";

const author = {
  "@type": "Person",
  name: SITE_NAME,
  url: canonicalUrl("/about"),
};

const publisher = {
  "@type": "Organization",
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo,
};

// Site-wide: who runs the site (Organization) and the site itself (WebSite).
// Rendered once in the root layout, so it is on every page.
export function siteLd() {
  return {
    "@context": CONTEXT,
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo,
        description: SITE_DESCRIPTION,
        email: SITE_EMAIL,
        founder: { "@id": `${SITE_URL}/#person` },
        sameAs,
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: SITE_NAME,
        url: canonicalUrl("/about"),
        mainEntityOfPage: `${SITE_URL}/`,
        jobTitle: "Writer, Podcaster and Entrepreneur",
        description: PERSON_DESCRIPTION,
        email: SITE_EMAIL,
        image: absoluteUrl("/generated/img/img-0246.webp"),
        knowsAbout: [
          "Faith",
          "Freedom",
          "Entrepreneurship",
          "Modern moneymaking",
          "Online lifestyle business",
          "Escaping the 9-to-5 rat race",
        ],
        sameAs,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en-US",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": "https://terrific30.com/#organization",
        name: "Terrific 30",
        url: "https://terrific30.com/",
        description:
          "A free online community for people who want to explore entrepreneurship, modern moneymaking, freedom, and building an online lifestyle business.",
        founder: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

export function blogPostingLd(post: BlogPost, imagePath: string) {
  const url = canonicalUrl(`/blog/${post.slug}`);
  return {
    "@context": CONTEXT,
    "@type": "BlogPosting",
    headline: post.title.slice(0, 110),
    description: post.excerpt,
    image: [absoluteUrl(imagePath)],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: post.author && post.author !== SITE_NAME ? { ...author, name: post.author } : author,
    publisher,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    articleSection: post.category,
    inLanguage: "en-US",
  };
}

// "42 min" -> "PT42M"; "1:02:30" or "14:52" -> "PT1H2M30S" / "PT14M52S"
function isoDuration(duration: string): string | undefined {
  const minutes = duration.match(/^(\d+)\s*min/i);
  if (minutes) return `PT${minutes[1]}M`;
  const parts = duration.split(":").map(Number);
  if (parts.length >= 2 && parts.every((n) => Number.isFinite(n))) {
    const [h, m, s] = parts.length === 3 ? parts : [0, parts[0], parts[1]];
    return `PT${h ? `${h}H` : ""}${m}M${s}S`;
  }
  return undefined;
}

export function podcastEpisodeLd(episode: PodcastEpisode, imagePath: string) {
  const url = canonicalUrl(`/podcast/${episode.slug}`);
  return {
    "@context": CONTEXT,
    "@type": "PodcastEpisode",
    name: episode.title,
    description: episode.excerpt,
    url,
    image: absoluteUrl(imagePath),
    datePublished: episode.publishedAt,
    episodeNumber: episode.episodeNumber,
    timeRequired: isoDuration(episode.duration),
    inLanguage: "en-US",
    partOfSeries: {
      "@type": "PodcastSeries",
      name: PODCAST_NAME,
      url: canonicalUrl("/podcast"),
    },
    author,
    publisher,
  };
}

// Only emitted for videos that actually have a playable YouTube embed — Google
// rejects VideoObject markup that has no contentUrl/embedUrl.
export function videoObjectLd(video: Video, imagePath: string) {
  if (!video.youtubeId) return undefined;
  return {
    "@context": CONTEXT,
    "@type": "VideoObject",
    name: video.title,
    description: video.excerpt,
    thumbnailUrl: [absoluteUrl(imagePath)],
    uploadDate: video.publishedAt,
    duration: isoDuration(video.duration),
    embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
    url: canonicalUrl(`/videos/${video.slug}`),
    publisher,
  };
}
