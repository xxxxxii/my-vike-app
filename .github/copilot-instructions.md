# Copilot Instructions

This project is a simple Markdown-powered blog built with Vike (0.4.255), Vite (7.3.1) and Vue 3.

## Architecture

- **Pages** live under `pages/`. Vike's filesystem-based routing uses `+Page.vue` and `+data.ts` files in each folder. Use `useData<T>()` in page components to access loader data.
- **Content** is stored in `content/blog/*.md`. Frontmatter uses YAML with fields like `title`, `date`, `excerpt`, `readTime`, and `tags`.
- **Loaders** (`+data.ts`) parse Markdown using `gray-matter` and `markdown-it`. Avoid doing expensive work per-request; put globals outside the function and enable `export const prerender = true` for static pages.
- **Routing**: Blog list is at `/blog`, individual articles at `/blog/:slug`.
- **SEO/Meta**: Use `useConfig()` from `vike-vue` to set `title` and `meta` tags in page components.
- **Search**: Client-side Fuse.js index built on the `/search` page; the loader returns all posts.
- **RSS**: A build-time script `scripts/generate-rss.js` creates `public/rss.xml` because Vike can't serve XML directly via a page route.
- **Comments**: `components/Comments.vue` wraps Giscus. The component is loaded only on the client using `<client-only>` or `onMounted` to avoid SSR overhead. Update `data-repo-id` and `data-category-id` with your GitHub values.

## Conventions & Tips

- Use the `?raw` glob query when importing Markdown files to avoid deprecation warnings.
- When filtering or paginating in loaders, use `pageContext.urlParsed` (fallback to `urlOriginal`) instead of the deprecated `pageContext.url`.
- For SSR optimization, mark static pages with `export const prerender = true;` and move any repeated work (markdown parser instantiation, glob lookup) outside of the `data` function.
- Media and layout components should not rely on `window`/`document` directly; wrap client-only logic in `onMounted` or use the `<client-only>` component from `vike-vue`.
- Use `vike-vue/useData` and `useConfig` for type-safe access to loader data and metadata.
- Glossary:
  - **Post**: `PostDetail` type defined in loaders
  - **Tag filtering**: Enabled via query param `?tag=foo` on `/blog`

Feel free to modify or extend the blog; the core patterns above will guide correct usage for additional pages or features.