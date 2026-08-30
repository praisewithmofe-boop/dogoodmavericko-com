// Generates a single flat JSON search index at public/search-index.json
// from every blog post, podcast episode, and video's frontmatter. Runs
// before `next dev`/`next build` (see package.json's predev/prebuild)
// alongside generate-thumbnails.mjs, so the index is always fresh and
// covers every piece of content — past and future — with zero manual
// step. Consumed client-side (fetched at /search-index.json) by
// SearchModal via Fuse.js, since a static export has no server/API route
// to query at request time.
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ROOT = path.resolve(import.meta.dirname, "..");
const CONTENT_TYPES = [
  { dir: "content/blog", type: "blog", urlPrefix: "/blog" },
  { dir: "content/podcast", type: "podcast", urlPrefix: "/podcast" },
  { dir: "content/videos", type: "video", urlPrefix: "/videos" },
];

function readEntries(dir, type, urlPrefix) {
  const absDir = path.join(ROOT, dir);
  if (!fs.existsSync(absDir)) return [];

  const files = fs.readdirSync(absDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(absDir, file), "utf8");
    const { data } = matter(raw);
    const slug = file.replace(/\.mdx?$/, "");

    return {
      title: data.title ?? slug,
      excerpt: data.excerpt ?? "",
      slug,
      url: `${urlPrefix}/${slug}`,
      type,
    };
  });
}

const index = CONTENT_TYPES.flatMap(({ dir, type, urlPrefix }) => readEntries(dir, type, urlPrefix));

const outPath = path.join(ROOT, "public/search-index.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(index));

console.log(`Wrote ${index.length} entries to public/search-index.json`);
