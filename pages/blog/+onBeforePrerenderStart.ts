import type { PageContextBuiltIn } from "vike/types";
import matter from "gray-matter";

// This hook runs at build time. It returns the list of URLs for the
// parameterized `/blog/@slug` route so Vike can pre-render each article.
export async function onBeforePrerenderStart() {
  const modules = import.meta.glob("/content/blog/*.md", { as: "raw" });
  const urls: string[] = [];
  for (const path in modules) {
    const slug = path.split("/").pop()?.slice(0, -3) || "";
    if (slug) urls.push(`/blog/${slug}`);
  }
  // also pre-render paginated list pages
  // we need to know how many posts there are so we can generate
  // `/blog?page=2`, `/blog?page=3`, etc.  this matches the
  // logic in pages/blog/+data.ts where `PAGE_SIZE` is 3.
  const PAGE_SIZE = 3;
  const totalPosts = Object.keys(modules).length;
  const totalPages = Math.ceil(totalPosts / PAGE_SIZE) || 1;
  for (let p = 2; p <= totalPages; ++p) {
    urls.push(`/blog/${p}`);
  }
  return urls;
}
