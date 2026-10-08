// Runtime copy of scripts/lib/slug.mjs — keep the two in sync. Content files
// can be dropped in with any filename ("My Post.mdx"); the URL slug is always
// derived from it here so a messy filename can never produce a broken route.
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function slugFromFilename(filename: string): string {
  return slugify(filename.replace(/\.mdx?$/, ""));
}
