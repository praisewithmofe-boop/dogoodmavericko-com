export const HERO_CONTENT = {
  headline: "WELCOME TO THE WORLD OF DOGOOD MAVERICKO",
  subheadline:
    "Faith. Freedom. Entrepreneurship. Modern Moneymaking. Building an Online Lifestyle Business.",
  paragraph:
    "I'm Dogood Mavericko — writer, podcaster, and entrepreneur. I write about escaping the 9-to-5 rat race, building an online lifestyle business, and choosing a different road than the one you were handed.",
  primaryCta: { label: "Read the Blog", href: "/blog" },
  secondaryCta: { label: "Join Terrific 30", href: "/terrific-30" },
  image: "/images/hero-mountain-road.jpg",
};

export const ABOUT_CONTENT = {
  heading: "HI, I'M DOGOOD MAVERICKO",
  paragraphs: [
    `Hi, This is Dogood Mavericko, and I want to officially welcome you to my world.`,
    `Thank you for checking out my blog.`,
    `I hope you enjoy it.`,
    `I'm not exaggerating when I say that I will be sharing more value on this blog than many programs I've paid thousands for.`,
    `That's actually one of my goals: to give away better stuff for FREE than what other people charge for.`,
    `On this blog and in my email newsletter, I'm going to be sharing life-changing ideas about Faith, Freedom, Modern Moneymaking Methods, escaping the 9-to-5 rat race, entrepreneurship, money, financial freedom, and building an online lifestyle business.`,
    `I'll also be sharing amazing content and ideas that have made a big difference in my life. Hopefully, they will make a difference in yours too.`,
  ],
  cta: { label: "Read My Story", href: "/about" },
};

const topicLabels = [
  "Faith",
  "Freedom",
  "Entrepreneurship",
  "Modern Moneymaking",
  "Financial Freedom",
  "Online Business",
  "Lifestyle Business",
] as const;

export const TOPICS = topicLabels.map((label) => ({
  label,
  href: `/blog?category=${encodeURIComponent(label)}`,
}));
