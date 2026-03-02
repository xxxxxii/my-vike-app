import type { PageContextServer } from "vike/types";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";

export type PostDetail = {
  title: string;
  date: string;
  excerpt: string;
  readTime: number;
  markdown: string; // raw markdown content (no HTML rendering)
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
// Note: now we just return raw markdown, no HTML conversion needed
const mdParser = new MarkdownIt({ 
  html: true
});

// post-process HTML to add data-lang attribute to pre tags for language label display
// This is kept for reference but not used since we return raw markdown now
function enhanceCodeBlocks(html: string): string {
  // markdown-it outputs: <pre><code class="language-js">code</code></pre>
  // we want:          <pre data-lang="js"><code class="language-js">code</code></pre>
  return html.replace(
    /<pre><code class="language-([^"]*)">/g,
    '<pre data-lang="$1"><code class="language-$1">'
  ).replace(
    /<pre><code>/g,
    '<pre data-lang="text"><code>'
  );
}

export async function data(pageContext: PageContextServer) {
  const { slug } = pageContext.routeParams;

  const key = Object.keys(modules).find((p) => p.endsWith(`${slug}.md`));
  if (!key) {
    return { post: undefined };
  }

  const raw = await modules[key]();
  const { data: fm, content: md } = matter(raw);
  
  // return raw markdown content; md-editor-v3 will render it
  return {
    post: {
      title: fm.title,
      date: fm.date,
      excerpt: fm.excerpt,
      readTime: fm.readTime || 0,
      markdown: md,
      slug,
    } as PostDetail,
  };
}
