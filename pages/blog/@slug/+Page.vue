<template>
  <article v-if="post" class="post-detail">
    <h1>{{ post.title }}</h1>
    <p class="meta">
      {{ formatDate(post.date) }} · {{ post.readTime }} min 阅读
    </p>
    
    <div class="post-container">
      <!-- Main content -->
      <div class="post-content">
        <MdPreview v-if="post.markdown" :id="editorId" :modelValue="post.markdown" />
      </div>
      
      <!-- Table of contents sidebar -->
      <aside class="toc-sidebar">
        <!-- container always rendered (even server-side) so the user sees the
             outline box; the catalog itself can render on the server too. -->
        <div v-if="post.markdown" class="toc-container">
          <div class="toc-title">目录</div>
          <p v-if="!tocReady" class="toc-loading">正在加载目录…</p>
          <!-- pass scrollElement to ensure the catalog can track scroll position -->
          <MdCatalog v-if="tocReady" :editorId="editorId" scrollElement="html" />
        </div>
      </aside>
    </div>
    
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
import { MdPreview, MdCatalog } from "md-editor-v3";
import "md-editor-v3/lib/preview.css";
import { ref, onMounted } from "vue";

const { post } = useData<Data>();
const editorId = `md-preview-${Math.random().toString(36).slice(2, 9)}`;

// flag used to show a loading message until the catalog component
// has been mounted on the client.  It can never be true during SSR.
const tocReady = ref(false);
onMounted(() => {
  tocReady.value = true;
});

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

/* Two-column layout with TOC */
.post-container {
  display: flex;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.post-content {
  flex: 1;
  min-width: 0;
  max-width: 700px;
}

.toc-sidebar {
  width: 280px;
  position: sticky;
  top: 100px;
  height: fit-content;
  /* ensure sidebar is always rendered; layout will stack on small screens */
  display: block;
}

.toc-container {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  background: #f9fafb;
  font-size: 0.9rem;
}

.toc-title {
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
  font-size: 1rem;
}

.toc-loading {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

/* Table of contents styling */
:deep(.md-catalog) {
  list-style: none;
  padding: 0;
  margin: 0;
}

:deep(.md-catalog li) {
  margin: 0;
  padding-left: 0;
}

:deep(.md-catalog a) {
  color: #6b7280;
  text-decoration: none;
  border-bottom: none;
  transition: color 0.2s;
  display: block;
  padding: 0.4rem 0;
}

:deep(.md-catalog a:hover) {
  color: #2563eb;
}

:deep(.md-catalog a.active) {
  color: #2563eb;
  font-weight: 600;
}

/* Show TOC on larger screens (desktop + tablet) */
@media (min-width: 768px) {
  
  .post-detail {
    max-width: unset;
  }
  
  .post-container {
    padding: 0 1rem;
  }
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

@media (max-width: 1023px) {
  .post-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .toc-sidebar {
    display: none;
  }
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
  .post-content {
    max-width: 100%;
  }
}
</style>
