<template>
  <article v-if="post" class="post-detail">
    <h1>{{ post.title }}</h1>
    <p class="meta">
      {{ formatDate(post.date) }} · {{ post.readTime }} min 阅读
    </p>
    <div class="content" v-html="post.content"></div>
    <p><a href="/blog">← 返回博客列表</a></p>
    <!-- Giscus comments section (only render on client to avoid SSR work) -->
    <client-only>
      <Comments />
    </client-only>
  </article>
  <p v-else>文章未找到。</p>
</template>

<script lang="ts" setup>
import { useData } from "vike-vue/useData";
import { useConfig } from "vike-vue/useConfig";
import type { Data } from "./+data";
import Comments from "../../../components/Comments.vue";

const { post } = useData<Data>();

// set document title and description for SEO
if (post) {
  const config = useConfig();
  config({
    title: post.title,
    meta: [
      { name: "description", content: post.excerpt },
      { property: "og:title", content: post.title },
      { property: "og:description", content: post.excerpt },
    ],
  });
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}
</script>

<style scoped>
.post-detail {
  max-width: 700px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.post-detail h1 {
  margin: 2rem 0 0.5rem;
  font-size: 2rem;
  letter-spacing: -0.5px;
}

.meta {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.content {
  line-height: 1.8;
  font-size: 1rem;
  color: #333;
}

/* Markdown content styling */
.content h1,
.content h2,
.content h3,
.content h4,
.content h5,
.content h6 {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  line-height: 1.3;
}

.content h1 { font-size: 1.8rem; }
.content h2 { font-size: 1.5rem; }
.content h3 { font-size: 1.3rem; }
.content h4 { font-size: 1.1rem; }
.content h5,
.content h6 { font-size: 1rem; }

.content p {
  margin: 1rem 0;
}

.content a {
  color: #2563eb;
  text-decoration: none;
  border-bottom: 1px dotted #2563eb;
}

.content a:hover {
  color: #1e4fd8;
  border-bottom-color: #1e4fd8;
}

.content ul,
.content ol {
  margin: 1rem 0;
  padding-left: 2rem;
}

.content li {
  margin-bottom: 0.5rem;
}

.content blockquote {
  margin: 1.5rem 0;
  padding: 0.75rem 1rem;
  border-left: 4px solid #2563eb;
  background: #f5f9ff;
  color: #444;
}

.content code {
  background: #f5f5f5;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: "Courier New", monospace;
  font-size: 0.9em;
  color: #d63384;
}

.content pre {
  background: #282c34;
  color: #abb2bf;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  margin: 1rem 0;
  line-height: 1.6;
  border: 1px solid #1e1e1e;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.content pre::before {
  content: attr(data-lang);
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  color: #abb2bf;
  padding: 0.25rem 0.5rem;
  border-radius: 0 6px 0 6px;
  font-size: 0.75rem;
  font-family: monospace;
}

.content pre code {
  background: none;
  padding: 0;
  color: inherit;
  font-size: 0.9rem;
}

/* Syntax highlighting for inline code */
.content code.language-js,
.content code.language-ts,
.content code.language-vue,
.content code.language-python,
.content code.language-bash,
.content code.language-html {
  color: #abb2bf;
}

.content img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin: 1rem 0;
}

.content table {
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
}

.content th,
.content td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
}

.content th {
  background: #f5f5f5;
  font-weight: 600;
}

.content hr {
  border: none;
  border-top: 2px solid #eee;
  margin: 2rem 0;
}

@media (max-width: 600px) {
  .post-detail {
    padding: 0 0.5rem;
    margin: 1rem auto;
  }
  .post-detail h1 {
    font-size: 1.5rem;
  }
  .meta {
    font-size: 0.9rem;
  }
  .content {
    font-size: 0.95rem;
  }
  .content h2 { font-size: 1.3rem; }
  .content h3 { font-size: 1.1rem; }
}
</style>
