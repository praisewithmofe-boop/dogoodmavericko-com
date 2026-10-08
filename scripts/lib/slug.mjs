// Single definition of "what makes a clean URL slug", shared by every build
// script. Must stay in sync with src/lib/slug.ts (the runtime copy).
export function slugify(input) {
  return String(input)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// "Consumer vs Producer .png" -> "consumer-vs-producer"
export function slugifyFilename(filename) {
  return slugify(String(filename).replace(/\.[^.]+$/, ""));
}
