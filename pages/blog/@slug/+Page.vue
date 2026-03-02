<template>
  <article v-if="post" class="post-detail">
    <h1>{{ post.title }}</h1>
    <p class="meta">
      {{ formatDate(post.date) }} · {{ post.readTime }} min 阅读
    </p>
    <client-only>
      <MdPreview v-if="post.markdown" :id="editorId" :modelValue="post.markdown" />
    </client-only>
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
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/preview.css";

const { post } = useData<Data>();
const editorId = `md-preview-${Math.random().toString(36).slice(2, 9)}`;

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

/* MdPreview styles override for custom theming */
:deep(.md-editor-preview) {
  background: transparent;
  padding: 0;
}

:deep(.md-editor-preview-wrapper) {
  padding: 0;
}

:deep(.md-preview) {
  font-size: 1rem;
  line-height: 1.8;
  color: #333;
}

/* Markdown content styling */
:deep(.md-preview h1),
:deep(.md-preview h2),
:deep(.md-preview h3),
:deep(.md-preview h4),
:deep(.md-preview h5),
:deep(.md-preview h6) {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  line-height: 1.3;
}

:deep(.md-preview h1) { font-size: 1.8rem; }
:deep(.md-preview h2) { font-size: 1.5rem; }
:deep(.md-preview h3) { font-size: 1.3rem; }
:deep(.md-preview h4) { font-size: 1.1rem; }
:deep(.md-preview h5),
:deep(.md-preview h6) { font-size: 1rem; }

:deep(.md-preview p) {
  margin: 1rem 0;
}

:deep(.md-preview a) {
  color: #2563eb;
  text-decoration: none;
  border-bottom: 1px dotted #2563eb;
}

:deep(.md-preview a:hover) {
  color: #1e4fd8;
  border-bottom-color: #1e4fd8;
}

:deep(.md-preview ul),
:deep(.md-preview ol) {
  margin: 1rem 0;
  padding-left: 2rem;
}

:deep(.md-preview li) {
  margin-bottom: 0.5rem;
}

:deep(.md-preview blockquote) {
  margin: 1.5rem 0;
  padding: 0.75rem 1rem;
  border-left: 4px solid #2563eb;
  background: #f5f9ff;
  color: #444;
}

:deep(.md-preview code:not(pre code)) {
  background: #f5f5f5;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: "Courier New", monospace;
  font-size: 0.9em;
  color: #d63384;
}

:deep(.md-preview pre) {
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

:deep(.md-preview pre code) {
  background: none;
  padding: 0;
  color: inherit;
  font-size: 0.9rem;
}

:deep(.md-preview img) {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin: 1rem 0;
}

:deep(.md-preview table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
}

:deep(.md-preview th),
:deep(.md-preview td) {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
}

:deep(.md-preview th) {
  background: #f5f5f5;
  font-weight: 600;
}

:deep(.md-preview hr) {
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
