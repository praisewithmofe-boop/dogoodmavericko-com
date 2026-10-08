// Compresses and resizes every image dropped into public/images/ into
// web-ready WebP files under public/generated/img/ (gitignored, rebuilt on
// every dev/build run, same as the thumbnails and search index):
//
//   public/images/Consumer vs Producer .png   (1.4 MB, spaces in the name)
//     -> public/generated/img/consumer-vs-producer.webp      (<=1280px wide)
//     -> public/generated/img/consumer-vs-producer-640.webp  (<=640px wide)
//
// The site never links to the originals: src/lib/images.ts maps any
// "/images/<anything>" path to the optimized, cleanly-named file, and
// src/lib/image-loader.ts picks the 640 or 1280 variant per screen size. So
// uploading a huge photo with a messy filename "just works" — no manual
// resizing or renaming needed.
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { slugifyFilename } from "./lib/slug.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC_DIR = path.join(ROOT, "public/images");
const OUT_DIR = path.join(ROOT, "public/generated/img");
const EXT = /\.(png|jpe?g|webp)$/i;

const VARIANTS = [
  { suffix: "", width: 1280, quality: 80 },
  { suffix: "-640", width: 640, quality: 78 },
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  if (!fs.existsSync(SRC_DIR)) return;

  const seen = new Map();
  let made = 0;
  let skipped = 0;

  for (const file of fs.readdirSync(SRC_DIR).filter((f) => EXT.test(f))) {
    const slug = slugifyFilename(file);
    if (seen.has(slug)) {
      console.warn(`! "${file}" and "${seen.get(slug)}" both map to "${slug}" — the second one wins`);
    }
    seen.set(slug, file);

    const input = path.join(SRC_DIR, file);
    const inputMtime = fs.statSync(input).mtimeMs;

    for (const v of VARIANTS) {
      const output = path.join(OUT_DIR, `${slug}${v.suffix}.webp`);
      if (fs.existsSync(output) && fs.statSync(output).mtimeMs >= inputMtime) {
        skipped++;
        continue;
      }
      await sharp(input)
        .rotate()
        .resize({ width: v.width, withoutEnlargement: true })
        .webp({ quality: v.quality })
        .toFile(output);
      made++;
    }
  }

  console.log(`Optimized images: ${made} written, ${skipped} up to date.`);
}

main().catch((err) => {
  console.error("Image optimization failed:", err);
  process.exit(1);
});
