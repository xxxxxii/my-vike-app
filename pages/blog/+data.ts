// https://vike.dev/data

import type { PageContextServer } from "vike/types";
import matter from "gray-matter";
import { useConfig } from "vike-vue/useConfig";

export type Post = {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  readTime: number;
  url: string;
};

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: PageContextServer) {
  // Load markdown files under content/blog
  // historical working pattern: relative to this TS file, two levels up to
  // project root, then into content/blog.  we request raw text via `as:` so
  // no further processing is done.
  const modules = import.meta.glob("/content/blog/*.md", { as: "raw" });
  console.log("Found modules:", Object.keys(modules));

  const config = useConfig();
  config({
    title: "Blog",
  });
  const posts: Post[] = [];
  for (const path in modules) {
    const slug = path.split("/").pop()?.slice(0, -3) || "";
    const content = await modules[path]();
    const { data: fm } = matter(content);
    posts.push({
      title: fm.title,
      slug,
      date: fm.date,
      excerpt: fm.excerpt,
      readTime: fm.readTime || 0,
      url: `/blog/${slug}`,
    });
  }

  // sort by date descending
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const PAGE_SIZE = 3;
  // determine page from query string
  // `pageContext.url` is now a proxy; use `urlParsed` which is a URL object
  // ready to query.  see warning printed earlier in the log.
  // https://vike.dev/migration/0.4.23
  let urlObj = pageContext.urlParsed;
  if (!urlObj || typeof urlObj.searchParams?.get !== "function") {
    // fallback to constructing our own URL; using base avoids invalid URL errors
    const s = pageContext.urlOriginal || "http://localhost/";
    urlObj = new URL(s, "http://localhost");
  }
  let page = parseInt(urlObj.searchParams.get("page") || "1", 10);
  if (isNaN(page) || page < 1) page = 1;

  const totalPages = Math.ceil(posts.length / PAGE_SIZE) || 1;
  if (page > totalPages) page = totalPages;

  const start = (page - 1) * PAGE_SIZE;
  const pagedPosts = posts.slice(start, start + PAGE_SIZE);

  return { posts: pagedPosts, page, totalPages };
}
