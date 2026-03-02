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
  return urls;
}
