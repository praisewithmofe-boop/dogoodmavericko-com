export const SITE_NAME = "Dogood Mavericko";

export const PORTRAIT_IMAGE: string | null = "/images/IMG_0246.png";

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Podcast", href: "/podcast" },
  { label: "Videos", href: "/videos" },
  { label: "Terrific 30", href: "/terrific-30" },
  { label: "Contact Me", href: "/contact" },
] as const;

export const PRIMARY_CTA = {
  label: "Join Terrific 30",
  href: "/terrific-30",
} as const;

export const BLOG_CATEGORIES = [
  "Faith",
  "Freedom",
  "Entrepreneurship",
  "Money",
  "Financial Freedom",
  "Modern Moneymaking",
  "Online Business",
  "Lifestyle Business",
] as const;

export const VIDEO_CATEGORIES = [...BLOG_CATEGORIES, "Terrific 30"] as const;

export const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/maverickodogood/",
    icon: "instagram",
    verb: "Follow",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@dogoodmavericko6354/videos",
    icon: "youtube",
    verb: "Subscribe to",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61554031959520",
    icon: "facebook",
    verb: "Follow",
  },
  {
    label: "Rumble",
    href: "https://rumble.com/user/DogoodMavericko?e9s=src_v1_sa%2Csrc_v1_sa_o",
    icon: "rumble",
    verb: "Follow",
  },
  {
    label: "Substack",
    href: "https://substack.com/@dogoodmavericko",
    icon: "substack",
    verb: "Follow",
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@dogood_mavericko",
    icon: "tiktok",
    verb: "Follow",
  },
  {
    label: "Snapchat",
    href: "https://www.snapchat.com/@dogoodmaverico?share_id=CydZCzDZ1pU&locale=en-GB",
    icon: "snapchat",
    verb: "Follow",
  },
] as const;

export const PODCAST_NAME = "The Dogood Mavericko Podcast";

// Only platforms where the user supplied a complete, unambiguous URL.
// iHeart / Amazon Music / Podbean / Castbox / Pocket Casts were pasted with
// "..." truncation (likely from a social-post preview) — the real paths are
// unknown, so a guessed link would risk 404ing for real listeners. Add them
// once the full URLs are available.
export const PODCAST_PLATFORMS = [
  {
    label: "Apple Podcasts",
    href: "https://podcasts.apple.com/podcast/id1798221121",
    icon: "applepodcasts",
    verb: "Listen on",
  },
  {
    label: "Spotify",
    href: "https://open.spotify.com/show/2Q3HWeVhSxnnS9YsVIh4NS",
    icon: "spotify",
    verb: "Listen on",
  },
  {
    label: "Rumble",
    href: "https://rumble.com/user/DogoodMavericko",
    icon: "rumble",
    verb: "Watch on",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@dogoodmavericko6354",
    icon: "youtube",
    verb: "Watch on",
  },
] as const;

export const FOOTER_NAV_GROUPS = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Podcast", href: "/podcast" },
      { label: "Videos", href: "/videos" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Terrific 30", href: "/terrific-30" },
      { label: "Contact Me", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
] as const;
