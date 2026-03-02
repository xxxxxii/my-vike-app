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

// prerender all blog post pages at build time. these pages are static
// so there is no need to run the loader on every request. enabling
// `prerender` also allows the site to be served as a pure static
// asset collection which is the most efficient for SSR.
export const prerender = true;

// create the glob once at module load so the resolver and import
// functions are cached. this avoids doing the glob lookup on every
// invocation of `data` (which may happen in SSR if not prerendered).
// the actual file is still fetched lazily when we call the function
// returned by the glob entry.
const modules = import.meta.glob<() => Promise<string>>(
  "/content/blog/*.md",
  { as: "raw" }
);

// instantiate a markdown-it parser once instead of inside the loader
// so we don't recreate the regex tables/objects on every request.
// configure highlight for code blocks by adding language class to <pre>.
const mdParser = new MarkdownIt({ 
  html: true,
  highlight: (code, lang) => {
    // wrap code in <pre> with language class for potential client-side highlighting
    if (lang) {
      return `<pre><code class="language-${lang}">${code}</code></pre>`;
    }
    return `<pre><code>${code}</code></pre>`;
  }
});

export async function data(pageContext: PageContextServer) {
  const { slug } = pageContext.routeParams;

  const key = Object.keys(modules).find((p) => p.endsWith(`${slug}.md`));
  if (!key) {
    return { post: undefined };
  }

  const raw = await modules[key]();
  const { data: fm, content: md } = matter(raw);
  // convert markdown to HTML (fast - parser created above)
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
