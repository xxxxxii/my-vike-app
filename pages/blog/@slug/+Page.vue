<template>
  <article v-if="post" class="post-detail">
    <!-- 文章头部 -->
    <header class="post-header">
      <a href="/blog" class="back-badge">
        ← 返回列表
      </a>
      <h1 class="post-title">{{ post.title }}</h1>
      <div class="post-meta">
        <span class="meta-icon">📅</span>
        <span>{{ formatDate(post.date) }}</span>
        <span class="meta-sep">·</span>
        <span class="meta-icon">⏱</span>
        <span>{{ post.readTime }} min 阅读</span>
      </div>
    </header>

    <!-- 内容区域：双栏布局 -->
    <div class="post-container">
      <!-- 主内容 -->
      <div class="post-content">
        <ClientOnly>
          <MdPreview
            v-if="post.markdown"
            :mdHeadingId="mdHeadingId"
            :id="editorId"
            :modelValue="post.markdown"
            @onGetCatalog="onGetCatalog"
            class="md-preview-custom"
          />
        </ClientOnly>
      </div>

      <!-- 目录侧边栏 -->
      <aside class="toc-sidebar" v-if="catalogList.length > 0">
        <div class="toc-card">
          <div class="toc-title">
            <span class="toc-icon">📑</span>
            文章目录
          </div>
          <nav class="toc-nav">
            <a
              v-for="item in catalogList"
              :key="item.anchor"
              :href="`#${item.anchor}`"
              class="toc-link"
              :class="[`toc-level-${item.level}`, { active: activeCatalogId === item.anchor }]"
              @click.prevent="scrollToAnchor(item.anchor)"
            >
              {{ item.text }}
            </a>
          </nav>
        </div>
      </aside>
    </div>

    <!-- 评论区 -->
    <div class="comments-section">
      <ClientOnly>
        <Comments />
      </ClientOnly>
    </div>
  </article>
  <div v-else class="not-found">
    <h1>文章未找到</h1>
    <p>抱歉，您访问的文章不存在或已被删除。</p>
    <a href="/blog" class="back-home">← 返回博客列表</a>
  </div>
</template>

<script lang="ts" setup>
import { useData } from "vike-vue/useData";
import { useConfig } from "vike-vue/useConfig";
import type { Data } from "./+data";
import Comments from "../../../components/Comments.vue";
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/preview.css";
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { ClientOnly } from "vike-vue/ClientOnly";

const { post } = useData<Data>();
const editorId = `md-preview-${Math.random().toString(36).slice(2, 9)}`;

// 设置 SEO
if (post.value) {
  const config = useConfig();
  config({
    title: post.value.title,
    meta: [
      { name: "description", content: post.value.excerpt },
      { property: "og:title", content: post.value.title },
      { property: "og:description", content: post.value.excerpt },
    ],
  });
}

interface CatalogItem {
  level: number;
  text: string;
  anchor: string;
}

const catalogList = ref<CatalogItem[]>([]);
const activeCatalogId = ref<string>("");

const mdHeadingId = ({ text }: { text: string; level: number; index: number }) => `heading-${text}`;

function onGetCatalog(catalog: any) {
  if (catalog && catalog.length > 0) {
    catalogList.value = catalog.map((item: any) => ({
      level: item.level,
      text: item.text,
      anchor: `heading-${item.text}`,
    }));
    activeCatalogId.value = catalogList.value[0]?.anchor || "";
  }
}

// 节流函数
function throttle(fn: () => void, wait = 100) {
  let last = 0;
  return () => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn();
    }
  };
}

const throttledUpdate = throttle(() => {
  if (!catalogList.value.length) return;
  const offsets = catalogList.value.map((item) => {
    const el = document.getElementById(item.anchor);
    return el ? el.getBoundingClientRect().top : Infinity;
  });
  let idx = offsets.findIndex((t) => t >= 0);
  if (idx === -1) idx = offsets.length - 1;
  activeCatalogId.value = catalogList.value[idx]?.anchor || "";
});

function updateActiveOnScroll() {
  if (!catalogList.value.length) return;
  throttledUpdate();
}

function scrollToAnchor(anchor: string) {
  const el = document.getElementById(anchor);
  if (el) {
    activeCatalogId.value = anchor;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

onMounted(() => {
  setTimeout(() => {
    updateActiveOnScroll();
  }, 300);
  nextTick(() => {
    window.addEventListener("scroll", updateActiveOnScroll, { passive: true });
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateActiveOnScroll);
});
</script>

<style scoped>
.post-detail {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.25rem;
}

/* 文章头部 */
.post-header {
  max-width: 800px;
  margin: 0 auto 2.5rem;
  text-align: center;
}

.back-badge {
  display: inline-block;
  padding: 0.4rem 0.85rem;
  background: #f5f7fa;
  color: #666;
  border-radius: 20px;
  font-size: 0.8rem;
  text-decoration: none;
  margin-bottom: 1.25rem;
  transition: all 0.15s ease;
}

.back-badge:hover {
  background: #eef0f5;
  color: var(--color-primary, #0070f3);
}

.post-title {
  font-size: 2.4rem;
  font-weight: 700;
  margin: 0 0 1rem;
  color: var(--color-text, #333);
  letter-spacing: -0.6px;
  line-height: 1.3;
}

.post-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text-muted, #888);
}

.meta-icon {
  font-size: 0.85rem;
}

.meta-sep {
  opacity: 0.4;
}

/* 内容容器 */
.post-container {
  display: flex;
  gap: 2.5rem;
  max-width: 1100px;
  margin: 0 auto;
}

.post-content {
  flex: 1;
  min-width: 0;
  max-width: 800px;
}

/* 目录侧边栏 */
.toc-sidebar {
  width: 240px;
  flex-shrink: 0;
}

.toc-card {
  position: sticky;
  top: 100px;
  background: #fafbfc;
  border: 1px solid var(--color-border, #eee);
  border-radius: 12px;
  padding: 1.25rem;
}

.toc-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-text, #333);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toc-icon {
  font-size: 1rem;
}

.toc-nav {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.toc-link {
  color: var(--color-text-muted, #777);
  text-decoration: none;
  font-size: 0.85rem;
  padding: 0.3rem 0;
  border-left: 2px solid transparent;
  padding-left: 0.75rem;
  transition: all 0.12s ease;
  line-height: 1.4;
}

.toc-link:hover {
  color: var(--color-primary, #0070f3);
  border-left-color: #ddd;
}

.toc-link.active {
  color: var(--color-primary, #0070f3);
  border-left-color: var(--color-primary, #0070f3);
  font-weight: 500;
}

.toc-level-1 { font-weight: 500; }
.toc-level-2 { padding-left: 1.25rem; }
.toc-level-3 { padding-left: 1.75rem; font-size: 0.82rem; }
.toc-level-4 { padding-left: 2.25rem; font-size: 0.8rem; }
.toc-level-5 { padding-left: 2.75rem; font-size: 0.78rem; }
.toc-level-6 { padding-left: 3.25rem; font-size: 0.76rem; }

/* 评论区 */
.comments-section {
  max-width: 800px;
  margin: 4rem auto 0;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border, #eee);
}

/* 未找到 */
.not-found {
  text-align: center;
  padding: 4rem 1rem;
}

.not-found h1 {
  font-size: 1.75rem;
  margin-bottom: 0.75rem;
}

.not-found p {
  color: var(--color-text-muted, #666);
  margin-bottom: 1.5rem;
}

.back-home {
  color: var(--color-primary, #0070f3);
  text-decoration: none;
}

.back-home:hover {
  text-decoration: underline;
}

/* 响应式 */
@media (max-width: 1023px) {
  .post-container {
    flex-direction: column;
  }

  .toc-sidebar {
    display: none;
  }
}

@media (max-width: 600px) {
  .post-detail {
    padding: 1.5rem 1rem;
  }

  .post-title {
    font-size: 1.65rem;
  }

  .post-meta {
    font-size: 0.8rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .post-header {
    margin-bottom: 1.5rem;
  }
}
</style>

<!-- Markdown 内容样式 -->
<style>
/* 覆盖 md-editor-v3 默认样式 */
.md-preview-custom {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #374151;
}

.md-preview-custom .md-editor-preview-wrapper {
  padding: 0;
}

.md-preview-custom h1,
.md-preview-custom h2,
.md-preview-custom h3,
.md-preview-custom h4,
.md-preview-custom h5,
.md-preview-custom h6 {
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  line-height: 1.4;
  color: #111827;
}

.md-preview-custom h1 { font-size: 2rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
.md-preview-custom h2 { font-size: 1.6rem; }
.md-preview-custom h3 { font-size: 1.35rem; }
.md-preview-custom h4 { font-size: 1.15rem; }

.md-preview-custom p {
  margin: 1.1rem 0;
}

.md-preview-custom a {
  color: #2563eb;
  text-decoration: none;
  border-bottom: 1px dotted #2563eb;
}

.md-preview-custom a:hover {
  border-bottom-style: solid;
}

.md-preview-custom ul,
.md-preview-custom ol {
  margin: 1rem 0;
  padding-left: 1.75rem;
}

.md-preview-custom li {
  margin-bottom: 0.5rem;
}

.md-preview-custom blockquote {
  margin: 1.5rem 0;
  padding: 0.75rem 1.25rem;
  border-left: 4px solid #2563eb;
  background: #f8fafc;
  color: #475569;
  border-radius: 0 6px 6px 0;
}

.md-preview-custom code:not(pre code) {
  background: #f1f5f9;
  padding: 0.2rem 0.45rem;
  border-radius: 4px;
  font-family: "SF Mono", Monaco, Consolas, monospace;
  font-size: 0.9em;
  color: #dc2626;
}

.md-preview-custom pre {
  background: #1e293b;
  color: #e2e8f0;
  padding: 1.1rem;
  border-radius: 10px;
  overflow-x: auto;
  margin: 1.25rem 0;
  line-height: 1.6;
}

.md-preview-custom pre code {
  background: none;
  padding: 0;
  color: inherit;
  font-size: 0.875rem;
}

.md-preview-custom img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1.25rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.md-preview-custom table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.25rem 0;
}

.md-preview-custom th,
.md-preview-custom td {
  border: 1px solid #e5e7eb;
  padding: 0.65rem 0.85rem;
  text-align: left;
}

.md-preview-custom th {
  background: #f9fafb;
  font-weight: 600;
}

.md-preview-custom hr {
  border: none;
  border-top: 2px solid #eee;
  margin: 2.5rem 0;
}
</style>
