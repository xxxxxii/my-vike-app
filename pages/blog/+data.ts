// https://vike.dev/data

import type { PageContextServer } from "vike/types";
import matter from "gray-matter";
import { useConfig } from "vike-vue/useConfig";

// prerender the blog list page at build time so the index is a static HTML.
// all posts are returned to the client; pagination happens client-side.
export const prerender = true;
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

  // return all posts; client-side pagination will handle the slicing.
  return { allPosts: posts };
}
