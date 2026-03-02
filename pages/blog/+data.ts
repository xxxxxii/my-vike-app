// https://vike.dev/data

import type { PageContextServer } from "vike/types";
import matter from "gray-matter";
import { useConfig } from "vike-vue/useConfig";

// prerender the blog list page at build time so the index is a static HTML
export const prerender = true;

// perform the glob at module init so the resolver is cached and not repeated
// on each loader invocation. when prerendering, the loader will run once
// during the build and consume this cached map.
const modules = import.meta.glob("/content/blog/*.md", { as: "raw" });

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
  // Load markdown files under content/blog using the precomputed `modules` map

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
  // determine current page. if the route includes a `page` param (see
  // +route.ts below) use that, otherwise fall back to the `?page=` query
  // for backwards compatibility during development.
  let page = 1;
  if (pageContext.routeParams?.page) {
    page = parseInt(pageContext.routeParams.page, 10);
  } else {
    // query string fallback
    let urlObj = pageContext.urlParsed;
    if (!urlObj || typeof urlObj.searchParams?.get !== "function") {
      const s = pageContext.urlOriginal || "http://localhost/";
      urlObj = new URL(s, "http://localhost");
    }
    page = parseInt(urlObj.searchParams.get("page") || "1", 10);
  }
  if (isNaN(page) || page < 1) page = 1;

  const totalPages = Math.ceil(posts.length / PAGE_SIZE) || 1;
  if (page > totalPages) page = totalPages;

  const start = (page - 1) * PAGE_SIZE;
  const pagedPosts = posts.slice(start, start + PAGE_SIZE);

  return { posts: pagedPosts, page, totalPages };
}
