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
// the highlight function returns only the code content; markdown-it
// wraps it with <pre> and <code> tags. store language as data-lang
// for css to display.
const mdParser = new MarkdownIt({ 
  html: true,
  highlight: (code, lang) => {
    // return only the highlighted code; markdown-it will wrap with <pre><code>
    // we'll use CSS to display the language tag via ::before
    return code;
  }
});

// post-process HTML to add data-lang to pre tags for language label display
function processCodeBlocks(html: string): string {
  return html.replace(
    /<pre><code class="language-([^"]*)">/g,
    '<pre data-lang="$1"><code class="language-$1">'
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
  // convert markdown to HTML (fast - parser created above)
  let html = mdParser.render(md);
  // post-process to add data-lang attribute to pre tags for CSS language display
  html = processCodeBlocks(html);

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
