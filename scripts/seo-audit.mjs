// SEO audit of the built static export (out/). Run after `npm run build`:
//   npm run seo:audit
// Checks every page for: unique <title> (<60 chars), unique meta description
// (<=160), canonical, robots/noindex, og:/twitter: tags and 1200x630 og:image,
// exactly one H1, heading order, image alt text, JSON-LD, and broken internal
// links/assets. Informational by default; pass --strict to exit 1 on errors.
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "out");
const SITE = "https://dogoodmavericko.com";
const STRICT = process.argv.includes("--strict");

if (!fs.existsSync(OUT)) {
  console.error("out/ not found — run `npm run build` first.");
  process.exit(1);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

const files = walk(OUT);
const htmlFiles = files
  .filter((f) => f.endsWith(".html"))
  .filter((f) => !/\/(404|_not-found)(\/index)?\.html$/.test(f))
  .filter((f) => !f.includes("/_next/"));

const redirectStubs = htmlFiles.filter((f) => /http-equiv="refresh"/i.test(fs.readFileSync(f, "utf8")));
const pageFiles = htmlFiles.filter((f) => !redirectStubs.includes(f));
const referencedAssets = new Set();

const fileSet = new Set(files.map((f) => "/" + path.relative(OUT, f).split(path.sep).join("/")));

function urlOf(file) {
  let rel = "/" + path.relative(OUT, file).split(path.sep).join("/");
  rel = rel.replace(/index\.html$/, "");
  return rel;
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`${name}=("([^"]*)"|'([^']*)')`, "i"));
  return m ? (m[2] ?? m[3]) : undefined;
}

function decode(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function meta(html, key, value) {
  const tags = html.match(/<meta\s[^>]*>/gi) ?? [];
  for (const t of tags) {
    if (attr(t, key)?.toLowerCase() === value.toLowerCase()) return decode(attr(t, "content") ?? "");
  }
  return undefined;
}

const issues = [];
const titles = new Map();
const descriptions = new Map();
const rows = [];

function add(url, level, msg) {
  issues.push({ url, level, msg });
}

for (const stub of redirectStubs) add(urlOf(stub), "info", "redirect stub (meta refresh) — skipped");

for (const file of pageFiles) {
  const html = fs.readFileSync(file, "utf8");
  const url = urlOf(file);
  const row = { url };

  // title
  const titleMatches = [...html.matchAll(/<title>([\s\S]*?)<\/title>/gi)];
  const title = titleMatches.length ? decode(titleMatches[titleMatches.length - 1][1]) : "";
  row.title = title.length;
  if (!title) add(url, "error", "missing <title>");
  else if (title.length >= 60) add(url, "error", `title is ${title.length} chars (needs <60): "${title}"`);
  if (title) titles.set(title, [...(titles.get(title) ?? []), url]);

  // description
  const desc = meta(html, "name", "description");
  row.desc = desc?.length ?? 0;
  if (!desc) add(url, "error", "missing meta description");
  else if (desc.length > 160) add(url, "error", `description is ${desc.length} chars (max 160)`);
  if (desc) descriptions.set(desc, [...(descriptions.get(desc) ?? []), url]);

  // canonical
  const canon = (html.match(/<link\s[^>]*rel="canonical"[^>]*>/i) ?? [])[0];
  const canonHref = canon ? attr(canon, "href") : undefined;
  row.canonical = Boolean(canonHref);
  if (!canonHref) add(url, "error", "missing canonical");
  else if (canonHref !== SITE + url) add(url, "warn", `canonical (${canonHref}) differs from page URL (${SITE + url})`);

  // robots
  const robots = meta(html, "name", "robots");
  if (robots && /noindex/i.test(robots)) add(url, "info", `noindex set (${robots})`);

  // open graph / twitter
  const ogImage = meta(html, "property", "og:image");
  row.og = Boolean(ogImage);
  if (!meta(html, "property", "og:title")) add(url, "error", "missing og:title");
  if (!meta(html, "property", "og:description")) add(url, "error", "missing og:description");
  if (!ogImage) add(url, "error", "missing og:image");
  else {
    if (meta(html, "property", "og:image:width") !== "1200" || meta(html, "property", "og:image:height") !== "630")
      add(url, "warn", "og:image width/height not declared as 1200x630");
    const p = decodeURI(ogImage.replace(SITE, "").split("?")[0]);
    if (ogImage.startsWith(SITE) && !fileSet.has(p)) add(url, "error", `og:image file not found: ${p}`);
  }
  if (!meta(html, "name", "twitter:card")) add(url, "warn", "missing twitter:card");

  // headings
  const headings = [...html.matchAll(/<h([1-6])[\s>][^]*?<\/h\1>/gi)].map((m) => ({
    level: Number(m[1]),
    text: decode(m[0].replace(/<[^>]+>/g, "")).trim().slice(0, 60),
  }));
  const h1s = headings.filter((h) => h.level === 1);
  row.h1 = h1s.length;
  if (h1s.length !== 1) add(url, "error", `${h1s.length} H1s (needs exactly 1)`);
  let prev = 0;
  for (const h of headings) {
    if (prev && h.level > prev + 1) add(url, "error", `heading skips h${prev} → h${h.level} ("${h.text}")`);
    prev = h.level;
  }

  // images
  const imgs = html.match(/<img\s[^>]*>/gi) ?? [];
  for (const i of imgs) {
    const alt = attr(i, "alt");
    if (alt === undefined) add(url, "error", `<img> without alt: ${(attr(i, "src") ?? "").slice(0, 80)}`);
    else if (alt.trim() === "" && attr(i, "aria-hidden") !== "true")
      add(url, "warn", `<img> with empty alt: ${(attr(i, "src") ?? "").slice(0, 80)}`);
  }

  // JSON-LD
  const ld = html.match(/<script type="application\/ld\+json"[^>]*>/gi) ?? [];
  row.jsonld = ld.length;
  if (!ld.length) add(url, "warn", "no JSON-LD structured data");

  for (const m of html.matchAll(/\/(?:images|generated)\/[^"\s,)]+/g)) referencedAssets.add(decodeURIComponent(m[0]));

  // internal links + assets
  const hrefs = [...html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)].map((m) => m[1]);
  for (const h of new Set(hrefs)) {
    if (h.startsWith("//")) continue;
    const dec = decodeURI(h);
    const candidates = [dec, dec.endsWith("/") ? dec + "index.html" : dec + "/index.html", dec + ".html"];
    if (!candidates.some((c) => fileSet.has(c)))
      add(url, /noindex/i.test(robots ?? "") ? "info" : "error", `broken internal link/asset: ${h}`);
  }

  rows.push(row);
}

for (const [t, urls] of titles) if (urls.length > 1) add(urls.join(", "), "error", `duplicate title "${t}"`);
for (const [d, urls] of descriptions) if (urls.length > 1) add(urls.join(", "), "error", `duplicate description "${d.slice(0, 50)}…"`);

// big images in public/
const bigImages = files
  .filter((f) => /\.(png|jpe?g|gif)$/i.test(f) && !f.includes("/_next/") && !f.includes("/generated/"))
  .map((f) => ({ f: "/" + path.relative(OUT, f), kb: Math.round(fs.statSync(f).size / 1024) }))
  .filter((x) => x.kb > 250)
  .sort((a, b) => b.kb - a.kb);
for (const b of bigImages) {
  if (referencedAssets.has(b.f)) add("(assets)", "warn", `large unoptimized image used on a page: ${b.f} (${b.kb} KB)`);
  else add("(assets)", "info", `large original not used by any page (still deployed): ${b.f} (${b.kb} KB)`);
}

// sitemap / robots / llms
for (const f of ["/robots.txt", "/sitemap.xml", "/llms.txt"]) {
  if (!fileSet.has(f)) add("(site)", "error", `${f} not found in out/`);
}
if (fileSet.has("/sitemap.xml")) {
  const sm = fs.readFileSync(path.join(OUT, "sitemap.xml"), "utf8");
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const pageUrls = new Set(pageFiles.map((f) => SITE + urlOf(f)));
  for (const u of pageUrls) {
    const row = rows.find((r) => SITE + r.url === u);
    const noindex = issues.some((i) => i.url === row?.url && i.level === "info" && /noindex/.test(i.msg));
    if (!locs.includes(u) && !noindex) add("(sitemap)", "error", `page missing from sitemap: ${u}`);
  }
  for (const l of locs) if (!pageUrls.has(l)) add("(sitemap)", "error", `sitemap lists non-existent page: ${l}`);
}

const errors = issues.filter((i) => i.level === "error");
const warns = issues.filter((i) => i.level === "warn");
const infos = issues.filter((i) => i.level === "info");

console.log(`\nAudited ${pageFiles.length} pages in out/\n`);
for (const level of ["error", "warn", "info"]) {
  const list = issues.filter((i) => i.level === level);
  if (!list.length) continue;
  console.log(`${level.toUpperCase()} (${list.length})`);
  for (const i of list) console.log(`  ${i.url}  —  ${i.msg}`);
  console.log("");
}
console.log(`Summary: ${errors.length} errors, ${warns.length} warnings, ${infos.length} notes`);
if (STRICT && errors.length) process.exit(1);
