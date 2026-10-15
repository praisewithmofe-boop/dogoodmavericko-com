// Pulls new videos and podcast episodes from the public feeds and writes
// content files that do not exist yet. Never edits or deletes a file that is
// already in the repo, so a hand-edited entry stays as it was.
//
//   node scripts/sync-content.mjs            # write new files
//   node scripts/sync-content.mjs --dry-run  # print the plan, write nothing
//
// Feeds (no API key):
//   https://www.youtube.com/feeds/videos.xml?channel_id=UCAXxfgtqYzwngQoQf0A27RQ
//   https://anchor.fm/s/100000644/podcast/rss
//
// The YouTube feed only lists the latest 15 uploads. A run every few hours
// keeps up with about five uploads a day. A gap longer than that can miss
// a video once it falls off the feed.
//
// Podcast episodes are added only when they were published after the newest
// episode already on the site. Older RSS episodes are never backfilled.

import fs from "fs";
import path from "path";
import { slugify } from "./lib/slug.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const VIDEO_DIR = path.join(ROOT, "content", "videos");
const PODCAST_DIR = path.join(ROOT, "content", "podcast");
const IMAGE_DIR = path.join(ROOT, "public", "images");

const YOUTUBE_FEED =
  "https://www.youtube.com/feeds/videos.xml?channel_id=UCAXxfgtqYzwngQoQf0A27RQ";
const PODCAST_FEED = "https://anchor.fm/s/100000644/podcast/rss";

const DRY_RUN = process.argv.includes("--dry-run");
const UA = "dogoodmavericko-sync/1.0 (+https://dogoodmavericko.com)";

const SITE_NAME = "Dogood Mavericko";
const MAX_TITLE = 59;
const MAX_DESCRIPTION = 158;

const VIDEO_CATEGORIES = [
  "Faith",
  "Freedom",
  "Entrepreneurship",
  "Money",
  "Financial Freedom",
  "Modern Moneymaking",
  "Online Business",
  "Lifestyle Business",
  "Terrific 30",
];

// Page <title> values that are not content files. Keep in step with buildMetadata calls.
const STATIC_TITLES = [
  ["Dogood Mavericko — Faith, Freedom & Entrepreneurship", true],
  ["About", false],
  ["Blog", false],
  ["Podcast", false],
  ["Videos", false],
  ["Terrific 30", false],
  ["Contact Me", false],
  ["Privacy Policy", false],
  ["Terms & Conditions", false],
  ["Style Guide", false],
];

function fail(message) {
  console.error(`sync: ${message}`);
  process.exit(1);
}

async function fetchText(url) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": UA, Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*" },
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) fail(`Could not fetch ${url} (HTTP ${response.status})`);
  const text = await response.text();
  if (!text.trim()) fail(`Empty response from ${url}`);
  return text;
}

function decodeEntities(value) {
  return value
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function htmlToText(value) {
  return decodeEntities(value.replace(/<br\s*\/?>/gi, " ").replace(/<\/p>/gi, " ").replace(/<[^>]+>/g, ""))
    .replace(/\s+/g, " ")
    .trim();
}

// Drop social hashtags (#Terrific30) and emoji that sit at the end of the
// wording. A hash followed by a digit is an episode or day number (EP #190,
// Day #7), so it stays.
export function cleanTitle(value) {
  let text = htmlToText(value);
  text = text.replace(/#[\p{L}][\p{L}\p{N}_]*/gu, " ");
  text = text.replace(/(?:\s|\p{Extended_Pictographic}|\uFE0F|\u200D)+$/gu, "");
  return text.replace(/\s+/g, " ").trim();
}

function cleanDescription(value) {
  const text = cleanTitle(value);
  return text;
}

function tagText(block, tag) {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? decodeEntities(match[1]).trim() : "";
}

function attr(block, tag, name) {
  const match = block.match(new RegExp(`<${tag}\\b([^>]*)>`, "i"));
  if (!match) return "";
  const found = match[1].match(new RegExp(`${name}="([^"]*)"`, "i"));
  return found ? decodeEntities(found[1]) : "";
}

function isPodcastTitle(title) {
  return /EP\s*#/i.test(title);
}

function normalizeMatch(title) {
  return cleanTitle(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function episodeNumberFrom(title, block) {
  const fromTitle = title.match(/EP\s*#\s*(\d+)/i);
  if (fromTitle) return Number(fromTitle[1]);
  const fromTag = tagText(block, "itunes:episode");
  if (/^\d+$/.test(fromTag)) return Number(fromTag);
  if (tagText(block, "itunes:episodeType") === "trailer") return 0;
  return null;
}

function formatClock(raw) {
  const value = raw.trim();
  if (!value) return "";
  if (/^\d+$/.test(value)) {
    const total = Number(value);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    if (hours) return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }
  const parts = value.split(":").map((part) => Number(part));
  if (parts.some((part) => !Number.isFinite(part))) return "";
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    if (!hours) return `${minutes}:${String(seconds).padStart(2, "0")}`;
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  if (parts.length === 2) return `${parts[0]}:${String(parts[1]).padStart(2, "0")}`;
  return "";
}

function toIso(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) fail(`Unreadable date: ${value}`);
  return date.toISOString();
}

function yamlQuote(value) {
  return JSON.stringify(String(value));
}

function readQuoted(raw, key) {
  const match = raw.match(new RegExp(`^${key}:\\s*("(?:\\\\.|[^"])*"|\\S.*)$`, "m"));
  if (!match) return "";
  const value = match[1].trim();
  if (value.startsWith('"')) {
    try {
      return JSON.parse(value);
    } catch {
      return value.slice(1, -1);
    }
  }
  return value.replace(/^['"]|['"]$/g, "");
}

function listMdx(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((name) => name.endsWith(".mdx"));
}

function loadExisting() {
  const titles = new Set();
  const videoIds = new Set();
  const audioUrls = new Set();
  const episodeKeys = new Set();
  const slugs = new Set();
  const seoTitles = new Map();
  const seoDescriptions = new Map();
  let newestPodcastPublished = "";

  function rememberSeo(title, description, source, exact = false) {
    const seo = pageTitle(title, exact);
    if (!seoTitles.has(seo)) seoTitles.set(seo, source);
    if (description) {
      const desc = pageDescription(description);
      if (!seoDescriptions.has(desc)) seoDescriptions.set(desc, source);
    }
  }

  for (const [title, exact] of STATIC_TITLES) rememberSeo(title, "", "static", exact);

  for (const dir of [path.join(ROOT, "content", "blog"), VIDEO_DIR, PODCAST_DIR]) {
    for (const name of listMdx(dir)) {
      const full = path.join(dir, name);
      const raw = fs.readFileSync(full, "utf8");
      const title = readQuoted(raw, "title");
      const excerpt = readQuoted(raw, "excerpt");
      const slug = slugify(name.replace(/\.mdx$/, ""));
      slugs.add(slug);
      if (title) titles.add(title.trim().toLowerCase());
      rememberSeo(title, excerpt, path.relative(ROOT, full));
      const youtube = readQuoted(raw, "youtubeUrl");
      const id = youtubeIdFrom(youtube);
      if (id) videoIds.add(id);
      const audio = readQuoted(raw, "audioUrl");
      if (audio) audioUrls.add(audio);
      const spotify = readQuoted(raw, "spotifyUrl");
      if (spotify) episodeKeys.add(episodeKey(spotify));
      if (dir === PODCAST_DIR) {
        const published = readQuoted(raw, "publishedAt");
        if (!published) fail(`Podcast file ${name} is missing publishedAt`);
        const iso = toIso(published);
        if (iso > newestPodcastPublished) newestPodcastPublished = iso;
      }
    }
  }

  return {
    titles,
    videoIds,
    audioUrls,
    episodeKeys,
    slugs,
    seoTitles,
    seoDescriptions,
    newestPodcastPublished,
  };
}

function youtubeIdFrom(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return parsed.pathname.slice(1).split("/")[0] ?? "";
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") return parsed.searchParams.get("v") ?? "";
      const match = parsed.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/);
      if (match) return match[1];
    }
  } catch {
    return "";
  }
  return "";
}

function episodeKey(url) {
  try {
    const parts = new URL(url).pathname.split("/").filter(Boolean);
    return (parts.at(-1) ?? url).toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function truncate(text, max) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${base.replace(/[\s,;:.\-–—]+$/, "")}…`;
}

function trimTitle(title) {
  if (title.length <= MAX_TITLE) return title;
  const breaks = [
    [" — ", false],
    [" – ", false],
    [": ", false],
    ["… ", true],
    ["? ", true],
  ];
  let best = 0;
  for (const [marker, keepPunctuation] of breaks) {
    let index = title.indexOf(marker);
    while (index !== -1) {
      const end = keepPunctuation ? index + 1 : index;
      if (end <= MAX_TITLE && end >= 20) best = Math.max(best, end);
      index = title.indexOf(marker, index + 1);
    }
  }
  return best > 0 ? title.slice(0, best).trim() : truncate(title, MAX_TITLE);
}

function pageTitle(title, exact) {
  if (exact) return truncate(title, MAX_TITLE);
  const trimmed = trimTitle(title);
  const withBrand = `${trimmed} — ${SITE_NAME}`;
  return withBrand.length <= MAX_TITLE ? withBrand : trimmed;
}

function pageDescription(description) {
  return truncate(description, MAX_DESCRIPTION);
}

function categoryFor(rawTitle) {
  const tags = [...rawTitle.matchAll(/#([\p{L}\p{N}_]+)/gu)].map((match) => match[1].toLowerCase());
  if (tags.includes("terrific30")) return "Terrific 30";
  for (const category of VIDEO_CATEGORIES) {
    const key = category.toLowerCase().replace(/[^a-z0-9]+/g, "");
    if (tags.some((tag) => tag.replace(/[^a-z0-9]+/g, "") === key)) return category;
  }
  return "Terrific 30";
}

function parseYoutube(xml) {
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((match) => match[1]);
  if (!entries.length) fail("YouTube feed did not contain any entries");
  return entries.map((block) => {
    const id = tagText(block, "yt:videoId");
    const rawTitle = tagText(block, "title");
    const published = tagText(block, "published");
    const link = attr(block, "link", "href");
    const description = tagText(block, "media:description");
    if (!id || !rawTitle || !published || !link) {
      fail(`YouTube entry is missing id, title, date, or link (${id || rawTitle || "unknown"})`);
    }
    return { id, rawTitle, published: toIso(published), link, description };
  });
}

function parsePodcast(xml) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => match[1]);
  if (!items.length) fail("Podcast feed did not contain any episodes");
  return items.map((block) => {
    const rawTitle = tagText(block, "title");
    const description = tagText(block, "description") || tagText(block, "itunes:summary");
    const link = tagText(block, "link");
    const guid = tagText(block, "guid");
    const pubDate = tagText(block, "pubDate");
    const audioUrl = attr(block, "enclosure", "url");
    const artwork = attr(block, "itunes:image", "href");
    const duration = formatClock(tagText(block, "itunes:duration"));
    if (!rawTitle || !pubDate || !audioUrl || !link) {
      fail(`Podcast item is missing title, date, audio, or link (${rawTitle || guid || "unknown"})`);
    }
    const episodeNumber = episodeNumberFrom(rawTitle, block);
    if (episodeNumber === null) fail(`Podcast item has no episode number: ${rawTitle}`);
    if (!duration) fail(`Podcast item has no duration: ${rawTitle}`);
    if (!artwork) fail(`Podcast item has no artwork: ${rawTitle}`);
    return {
      rawTitle,
      description,
      link,
      guid,
      published: toIso(pubDate),
      audioUrl,
      artwork,
      duration,
      episodeNumber,
    };
  });
}

function planVideos(uploads, existing) {
  const planned = [];
  const skipped = [];
  const ordered = [...uploads].sort((a, b) => a.published.localeCompare(b.published));
  for (const upload of ordered) {
    if (isPodcastTitle(upload.rawTitle)) {
      skipped.push({ title: upload.rawTitle, reason: "podcast episode (EP #) — left for the podcast feed" });
      continue;
    }
    if (existing.videoIds.has(upload.id)) {
      skipped.push({ title: upload.rawTitle, reason: `video id ${upload.id} is already on the site` });
      continue;
    }
    const title = cleanTitle(upload.rawTitle);
    if (!title) fail(`Video ${upload.id} has an empty title after cleaning`);
    if (existing.titles.has(title.toLowerCase())) {
      skipped.push({ title, reason: "title is already used" });
      continue;
    }
    const slug = slugify(title);
    if (!slug) fail(`Video ${upload.id} produced an empty slug`);
    if (existing.slugs.has(slug) || fs.existsSync(path.join(VIDEO_DIR, `${slug}.mdx`))) {
      skipped.push({ title, reason: `slug ${slug} already exists` });
      continue;
    }
    const described = cleanDescription(upload.description);
    const excerpt = described || title;
    const item = {
      kind: "video",
      title,
      excerpt,
      slug,
      published: upload.published,
      youtubeUrl: upload.link,
      videoId: upload.id,
      category: categoryFor(upload.rawTitle),
      duration: "",
    };
    planned.push(item);
    existing.titles.add(title.toLowerCase());
    existing.videoIds.add(upload.id);
    existing.slugs.add(slug);
  }
  return { planned, skipped };
}

function planEpisodes(episodes, uploads, existing) {
  const youtubeByKey = new Map();
  for (const upload of uploads) {
    if (!isPodcastTitle(upload.rawTitle)) continue;
    const key = normalizeMatch(upload.rawTitle);
    const current = youtubeByKey.get(key);
    if (!current) youtubeByKey.set(key, upload);
    else if (current.id !== upload.id) youtubeByKey.set(key, null);
  }

  const cutoff = existing.newestPodcastPublished;
  if (!cutoff) {
    fail("No podcast episodes are on the site, so there is no cutoff. Refusing to add older RSS episodes.");
  }

  const planned = [];
  const skipped = [];
  const ordered = [...episodes].sort((a, b) => a.published.localeCompare(b.published));
  for (const episode of ordered) {
    const title = cleanTitle(episode.rawTitle);
    if (!title) fail(`Episode ${episode.guid || episode.audioUrl} has an empty title after cleaning`);
    const key = episodeKey(episode.link);
    if (existing.audioUrls.has(episode.audioUrl) || existing.episodeKeys.has(key)) {
      skipped.push({ title, reason: "episode is already on the site" });
      continue;
    }
    if (episode.published <= cutoff) {
      skipped.push({
        title,
        reason: `published ${episode.published} is not after the newest episode on the site (${cutoff})`,
      });
      continue;
    }
    if (existing.titles.has(title.toLowerCase())) {
      skipped.push({ title, reason: "title is already used" });
      continue;
    }
    const slug = slugify(title);
    if (!slug) fail(`Episode "${title}" produced an empty slug`);
    if (existing.slugs.has(slug) || fs.existsSync(path.join(PODCAST_DIR, `${slug}.mdx`))) {
      skipped.push({ title, reason: `slug ${slug} already exists` });
      continue;
    }
    const notes = htmlToText(episode.description);
    const excerpt = notes ? `${title}. ${notes}` : title;
    const match = youtubeByKey.get(normalizeMatch(episode.rawTitle));
    const youtubeUrl = match ? match.link : "";
    const imageName = artworkName(episode.episodeNumber, slug);
    planned.push({
      kind: "podcast",
      title,
      excerpt,
      body: notes || title,
      slug,
      published: episode.published,
      audioUrl: episode.audioUrl,
      artworkUrl: episode.artwork,
      imageName,
      coverImage: `/images/${imageName}`,
      youtubeUrl,
      spotifyUrl: episode.link,
      duration: episode.duration,
      episodeNumber: episode.episodeNumber,
    });
    existing.titles.add(title.toLowerCase());
    existing.audioUrls.add(episode.audioUrl);
    existing.episodeKeys.add(key);
    existing.slugs.add(slug);
    if (match) existing.videoIds.add(match.id);
  }
  return { planned, skipped };
}

function artworkName(episodeNumber, slug) {
  const preferred = episodeNumber === 0 ? "podcast-trailer.jpg" : `podcast-ep-${episodeNumber}.jpg`;
  if (!fs.existsSync(path.join(IMAGE_DIR, preferred))) return preferred;
  const fallback = `podcast-${slug}.jpg`;
  if (fs.existsSync(path.join(IMAGE_DIR, fallback))) {
    fail(`Artwork file already exists for episode ${episodeNumber} (${preferred} and ${fallback})`);
  }
  return fallback;
}

function assertSeo(planned, existing) {
  const titles = new Map(existing.seoTitles);
  const descriptions = new Map(existing.seoDescriptions);
  for (const item of planned) {
    const title = pageTitle(item.title, false);
    const description = pageDescription(item.excerpt);
    if (title.length >= 60) fail(`SEO title would be ${title.length} characters: ${title}`);
    if (description.length > 160) fail(`SEO description would be ${description.length} characters for ${item.title}`);
    if (titles.has(title)) {
      fail(`SEO title already used by ${titles.get(title)}: ${title}`);
    }
    if (descriptions.has(description)) {
      fail(`SEO description already used by ${descriptions.get(description)}: ${item.title}`);
    }
    titles.set(title, item.slug);
    descriptions.set(description, item.slug);
  }
}

async function lookupDuration(videoId) {
  try {
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0", Accept: "text/html" },
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) return "";
    const html = await response.text();
    const details = html.indexOf(`"videoId":"${videoId}"`);
    const windowText = details === -1 ? "" : html.slice(details, details + 2500);
    const match = windowText.match(/"lengthSeconds":"(\d+)"/);
    if (!match) return "";
    return formatClock(match[1]);
  } catch {
    return "";
  }
}

async function resolveSpotify(url) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(20000),
    });
    if (response.url && response.url.includes("spotify.com")) return response.url;
  } catch {
    // The feed link is already a Spotify URL. Keep it when the redirect hop fails.
  }
  return url;
}

async function mapPool(items, limit, worker) {
  const queue = [...items];
  async function run() {
    while (queue.length) {
      const item = queue.shift();
      await worker(item);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => run()));
}

async function downloadArtwork(episodes) {
  const groups = new Map();
  for (const episode of episodes) {
    if (!groups.has(episode.artworkUrl)) groups.set(episode.artworkUrl, []);
    groups.get(episode.artworkUrl).push(episode);
  }
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
  await mapPool([...groups.values()], 4, async (group) => {
    const episode = group[0];
    const response = await fetch(episode.artworkUrl, {
      redirect: "follow",
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) fail(`Artwork download failed for ${episode.title} (HTTP ${response.status})`);
    const bytes = Buffer.from(await response.arrayBuffer());
    const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8;
    const png = bytes[0] === 0x89 && bytes[1] === 0x50;
    const webp = bytes.subarray(0, 4).toString() === "RIFF";
    if (!jpeg && !png && !webp) fail(`Artwork for ${episode.title} is not a JPEG, PNG, or WebP`);
    const ext = jpeg ? ".jpg" : png ? ".png" : ".webp";
    const name = episode.imageName.replace(/\.[^.]+$/, ext);
    const dest = path.join(IMAGE_DIR, name);
    if (fs.existsSync(dest)) fail(`Refusing to overwrite artwork ${name}`);
    fs.writeFileSync(dest, bytes, { flag: "wx" });
    const coverImage = `/images/${name}`;
    for (const item of group) {
      item.imageName = name;
      item.coverImage = coverImage;
    }
  });
}

function writeExclusive(file, contents) {
  if (fs.existsSync(file)) fail(`Refusing to overwrite ${path.relative(ROOT, file)}`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents, { flag: "wx" });
}

function videoFile(video) {
  const lines = [
    "---",
    `title: ${yamlQuote(video.title)}`,
    `excerpt: ${yamlQuote(video.excerpt)}`,
    `category: ${yamlQuote(video.category)}`,
  ];
  if (video.duration) lines.push(`duration: ${yamlQuote(video.duration)}`);
  lines.push(
    `publishedAt: ${yamlQuote(video.published)}`,
    `youtubeUrl: ${yamlQuote(video.youtubeUrl)}`,
    "---",
    "",
    video.excerpt,
    "",
  );
  return lines.join("\n");
}

function episodeFile(episode) {
  const lines = [
    "---",
    `title: ${yamlQuote(episode.title)}`,
    `excerpt: ${yamlQuote(episode.excerpt)}`,
    `episodeNumber: ${episode.episodeNumber}`,
    `duration: ${yamlQuote(episode.duration)}`,
    `publishedAt: ${yamlQuote(episode.published)}`,
    `audioUrl: ${yamlQuote(episode.audioUrl)}`,
    `coverImage: ${yamlQuote(episode.coverImage)}`,
  ];
  if (episode.youtubeUrl) lines.push(`youtubeUrl: ${yamlQuote(episode.youtubeUrl)}`);
  lines.push(`spotifyUrl: ${yamlQuote(episode.spotifyUrl)}`, "---", "", episode.body, "");
  return lines.join("\n");
}

function printPlan(videos, videoSkips, episodes, episodeSkips) {
  console.log(DRY_RUN ? "Dry run: no files written." : "Sync plan:");
  console.log(`\nVideos to add: ${videos.length}`);
  for (const video of [...videos].sort((a, b) => b.published.localeCompare(a.published))) {
    console.log(`- ${video.title}`);
    console.log(`  date: ${video.published.slice(0, 10)}  slug: ${video.slug}`);
    console.log(`  youtube: ${video.youtubeUrl}`);
    console.log(`  page: /videos/${video.slug}/`);
  }
  if (videoSkips.length) {
    console.log(`\nVideos skipped: ${videoSkips.length}`);
    for (const skip of videoSkips) console.log(`- ${skip.title} — ${skip.reason}`);
  }
  console.log(`\nPodcast episodes to add: ${episodes.length}`);
  for (const episode of [...episodes].sort((a, b) => b.published.localeCompare(a.published))) {
    console.log(`- ${episode.title}`);
    console.log(`  date: ${episode.published.slice(0, 10)}  slug: ${episode.slug}  duration: ${episode.duration}`);
    console.log(`  audio: ${episode.audioUrl}`);
    console.log(`  artwork: ${episode.artworkUrl}`);
    console.log(`  spotify: ${episode.spotifyUrl}`);
    console.log(`  youtube: ${episode.youtubeUrl || "(no verifiable match in the channel RSS)"}`);
    console.log(`  page: /podcast/${episode.slug}/`);
  }
  if (episodeSkips.length) {
    console.log(`\nPodcast episodes skipped: ${episodeSkips.length}`);
    for (const skip of episodeSkips) console.log(`- ${skip.title} — ${skip.reason}`);
  }
}

async function main() {
  const [youtubeXml, podcastXml] = await Promise.all([fetchText(YOUTUBE_FEED), fetchText(PODCAST_FEED)]);
  const uploads = parseYoutube(youtubeXml);
  const episodes = parsePodcast(podcastXml);
  const existing = loadExisting();

  const videos = planVideos(uploads, existing);
  const podcast = planEpisodes(episodes, uploads, existing);
  assertSeo([...videos.planned, ...podcast.planned], existing);

  await mapPool(podcast.planned, 8, async (episode) => {
    episode.spotifyUrl = await resolveSpotify(episode.spotifyUrl);
  });

  if (!DRY_RUN) {
    await mapPool(videos.planned, 4, async (video) => {
      video.duration = await lookupDuration(video.videoId);
    });
    await downloadArtwork(podcast.planned);
    for (const video of videos.planned) {
      writeExclusive(path.join(VIDEO_DIR, `${video.slug}.mdx`), videoFile(video));
    }
    for (const episode of podcast.planned) {
      writeExclusive(path.join(PODCAST_DIR, `${episode.slug}.mdx`), episodeFile(episode));
    }
  }

  printPlan(videos.planned, videos.skipped, podcast.planned, podcast.skipped);
  const added = videos.planned.length + podcast.planned.length;
  console.log(added ? `\n${added} new ${added === 1 ? "entry" : "entries"}.` : "\nNothing new.");
}

main().catch((error) => {
  console.error(error?.stack || error);
  process.exit(1);
});
