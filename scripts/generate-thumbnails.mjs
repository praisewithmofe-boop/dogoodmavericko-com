// Generates a branded title-card PNG for every blog post, podcast episode,
// and video, written to public/generated/{type}/{slug}.png. Runs before
// `next dev`/`next build` (see package.json's predev/prebuild scripts) so
// every piece of content — past and future — automatically has a thumbnail
// with zero manual per-post work. Uses next/og's ImageResponse as a plain
// build-time utility (it needs no request/route context, just a React
// element tree), so this needs no extra dependencies beyond what Next.js
// already ships.
//
// Note the explicit "next/og.js" specifier below, not "next/og" — Node's
// plain ESM resolution (outside Next's own bundler) needs the real file
// path to find it.
import { ImageResponse } from "next/og.js";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { titleCard } from "./lib/title-card.mjs";
import { slugifyFilename } from "./lib/slug.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const CONTENT_TYPES = [
  { dir: "content/blog", out: "public/generated/blog" },
  { dir: "content/podcast", out: "public/generated/podcast" },
  { dir: "content/videos", out: "public/generated/videos" },
];

const WIDTH = 1280;
const HEIGHT = 720;

async function generateOne(filePath, outDir) {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  const slug = slugifyFilename(path.basename(filePath));
  const title = data.title ?? slug;

  const res = new ImageResponse(titleCard(title, WIDTH, HEIGHT), { width: WIDTH, height: HEIGHT });
  const buf = Buffer.from(await res.arrayBuffer());

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, `${slug}.png`), buf);
  return slug;
}

async function main() {
  let count = 0;
  for (const { dir, out } of CONTENT_TYPES) {
    const absDir = path.join(ROOT, dir);
    const absOut = path.join(ROOT, out);
    if (!fs.existsSync(absDir)) continue;

    const files = fs.readdirSync(absDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
    for (const file of files) {
      const slug = await generateOne(path.join(absDir, file), absOut);
      console.log(`generated ${out}/${slug}.png`);
      count++;
    }
  }
  console.log(`Generated ${count} thumbnail(s).`);
}

main().catch((err) => {
  console.error("Thumbnail generation failed:", err);
  process.exit(1);
});
