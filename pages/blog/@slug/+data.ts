import type { PageContextServer } from "vike/types";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";

export type PostDetail = {
  title: string;
  date: string;
  excerpt: string;
  readTime: number;
  content: string; // HTML
  slug: string;
};

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: PageContextServer) {
  const { slug } = pageContext.routeParams;
  const modules = import.meta.glob("/content/blog/*.md", { as: "raw" });
  const key = Object.keys(modules).find((p) => p.endsWith(`${slug}.md`));
  console.log("Looking for slug:", slug,modules, "Found key:", key);
    
  if (!key) {
    return { post: undefined };
  }
  const raw = await modules[key]();
  const { data: fm, content: md } = matter(raw);
  // convert markdown to HTML
  const mdParser = new MarkdownIt({ html: true });
  const html = mdParser.render(md);

  return {
    post: {
      title: fm.title,
      date: fm.date,
      excerpt: fm.excerpt,
      readTime: fm.readTime || 0,
      content: html,
      slug,
    } as PostDetail,
  };
}
