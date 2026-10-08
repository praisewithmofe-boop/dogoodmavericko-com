// Generates a 1200x630 JPEG social-share (og:image / twitter:image) for every
// blog post, podcast episode, video, and static page, written to
// public/generated/og/{type}/{slug}.jpg. Runs on every dev/build.
//
//  - If the content has its own image (blog `image:`, podcast `coverImage:`/
//    `thumbnail:`, video `thumbnail:`), that picture is cropped to 1200x630.
//  - Otherwise the branded title card is rendered at 1200x630.
//
// JPEG at ~80% keeps every file well under WhatsApp's ~300 KB preview limit.
import { ImageResponse } from "next/og.js";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import sharp from "sharp";
import { titleCard } from "./lib/title-card.mjs";
import { slugifyFilename } from "./lib/slug.mjs";
import { OG_PAGES } from "./lib/og-pages.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const WIDTH = 1200;
const HEIGHT = 630;

const CONTENT_TYPES = [
  { dir: "content/blog", out: "blog", image: (d) => d.image },
  { dir: "content/podcast", out: "podcast", image: (d) => d.coverImage || d.thumbnail },
  { dir: "content/videos", out: "videos", image: (d) => d.thumbnail },
];

async function renderCard(title) {
  const res = new ImageResponse(titleCard(title, WIDTH, HEIGHT), { width: WIDTH, height: HEIGHT });
  return Buffer.from(await res.arrayBuffer());
}

function toJpeg(input) {
  return sharp(input)
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}

async function writeOg(outPath, { imageFile, title }) {
  const source = imageFile ?? (await renderCard(title));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, await toJpeg(source));
}

function localImage(ref) {
  if (typeof ref !== "string" || !ref.startsWith("/images/")) return undefined;
  const file = path.join(ROOT, "public", decodeURI(ref));
  return fs.existsSync(file) ? file : undefined;
}

async function main() {
  let count = 0;

  for (const { dir, out, image } of CONTENT_TYPES) {
    const absDir = path.join(ROOT, dir);
    if (!fs.existsSync(absDir)) continue;

    for (const file of fs.readdirSync(absDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))) {
      const { data } = matter(fs.readFileSync(path.join(absDir, file), "utf8"));
      const slug = slugifyFilename(file);
      await writeOg(path.join(ROOT, "public/generated/og", out, `${slug}.jpg`), {
        imageFile: localImage(image(data)),
        title: data.title ?? slug,
      });
      count++;
    }
  }

  for (const page of OG_PAGES) {
    await writeOg(path.join(ROOT, "public/generated/og/pages", `${page.name}.jpg`), { title: page.title });
    count++;
  }

  console.log(`Generated ${count} social-share image(s) (1200x630).`);
}

main().catch((err) => {
  console.error("OG image generation failed:", err);
  process.exit(1);
});
