<template>
  <article v-if="post" class="post-detail">
    <!-- 文章内容区 -->
    <div class="post-wrapper">
      <!-- 返回导航 -->
      <nav class="post-nav">
        <a href="/blog" class="back-link">
          <span class="back-icon">←</span>
          返回文章列表
        </a>
      </nav>

      <!-- 文章头部 -->
      <header class="post-header">
        <h1 class="post-title">{{ post.title }}</h1>
        <div class="post-meta">
          <span class="meta-item">
            <span class="meta-icon">📅</span>
            {{ formatDate(post.date) }}
          </span>
          <span class="meta-sep">|</span>
          <span class="meta-item">
            <span class="meta-icon">⏱</span>
            {{ post.readTime }} min 阅读
          </span>
        </div>
      </header>

      <!-- 主内容区 -->
      <div class="post-body">
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

        <!-- 右侧固定目录 -->
        <aside class="toc-sidebar" v-if="catalogList.length > 0">
          <div class="toc-card">
            <div class="toc-header">
              <span class="toc-icon">📑</span>
              <span class="toc-title">文章目录</span>
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

      <!-- 底部导航 -->
      <nav class="post-footer-nav">
        <a href="/blog" class="footer-link">← 返回文章列表</a>
      </nav>

      <!-- 评论区 -->
      <section class="comments-section">
        <h3 class="comments-title">💬 评论</h3>
        <ClientOnly>
          <Comments />
        </ClientOnly>
      </section>
    </div>
  </article>

  <!-- 未找到 -->
  <div v-else class="not-found">
    <div class="not-found-icon">📄</div>
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
/* 整体容器 */
.post-detail {
  min-height: 100vh;
  background: #fafbfc;
}

.post-wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

/* 顶部导航 */
.post-nav {
  margin-bottom: 1.5rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  background: #fff;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  color: var(--color-text-muted, #6b7280);
  font-size: 0.85rem;
  text-decoration: none;
  transition: all 0.15s ease;
}

.back-link:hover {
  border-color: var(--color-primary, #667eea);
  color: var(--color-primary, #667eea);
}

.back-icon {
  font-size: 0.9rem;
}

/* 文章头部 */
.post-header {
  background: #fff;
  border-radius: 16px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--color-border, #eee);
}

.post-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 1.25rem;
  color: #1a1a2e;
  letter-spacing: -0.6px;
  line-height: 1.25;
}

.post-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: var(--color-text-muted, #888);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.meta-icon {
  font-size: 0.95rem;
}

.meta-sep {
  color: #ddd;
}

/* 内容区 */
.post-body {
  display: flex;
  gap: 2rem;
  position: relative;
}

.post-content {
  flex: 1;
  min-width: 0;
  background: #fff;
  border-radius: 16px;
  padding: 2rem 2.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--color-border, #eee);
}

/* 固定目录 */
.toc-sidebar {
  width: 200px;
  flex-shrink: 0;
  position: sticky;
  top: 100px;
  height: fit-content;
  max-height: calc(100vh - 140px);
  overflow-y: auto;
}

.toc-card {
  background: #fff;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--color-border, #eee);
}

.toc-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-text, #333);
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border, #eee);
}

.toc-icon {
  font-size: 1rem;
}

.toc-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.toc-link {
  color: var(--color-text-muted, #777);
  text-decoration: none;
  font-size: 0.82rem;
  padding: 0.35rem 0.5rem;
  border-radius: 6px;
  transition: all 0.12s ease;
  line-height: 1.4;
}

.toc-link:hover {
  background: #f5f7fa;
  color: var(--color-primary, #667eea);
}

.toc-link.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-weight: 500;
}

.toc-level-1 { font-weight: 500; }
.toc-level-2 { padding-left: 1rem; }
.toc-level-3 { padding-left: 1.5rem; font-size: 0.78rem; }
.toc-level-4 { padding-left: 2rem; font-size: 0.75rem; }
.toc-level-5 { padding-left: 2.5rem; font-size: 0.72rem; }
.toc-level-6 { padding-left: 3rem; font-size: 0.7rem; }

/* 底部导航 */
.post-footer-nav {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border, #eee);
}

.footer-link {
  color: var(--color-primary, #667eea);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
}

.footer-link:hover {
  text-decoration: underline;
}

/* 评论区 */
.comments-section {
  margin-top: 3rem;
  background: #fff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--color-border, #eee);
}

.comments-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 1.5rem;
  color: var(--color-text, #333);
}

/* 未找到 */
.not-found {
  text-align: center;
  padding: 6rem 2rem;
  background: #fafbfc;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.not-found-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.not-found h1 {
  font-size: 1.75rem;
  margin-bottom: 0.75rem;
  color: var(--color-text, #333);
}

.not-found p {
  color: var(--color-text-muted, #666);
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.back-home {
  display: inline-block;
  padding: 0.65rem 1.25rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: transform 0.15s ease;
}

.back-home:hover {
  transform: translateY(-2px);
  color: #fff;
}

/* 响应式 */
@media (max-width: 1100px) {
  .toc-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .post-wrapper {
    padding: 1.25rem 1rem 3rem;
  }

  .post-header {
    padding: 1.5rem;
  }

  .post-title {
    font-size: 1.65rem;
  }

  .post-content {
    padding: 1.5rem;
    border-radius: 12px;
  }

  .post-meta {
    font-size: 0.8rem;
  }

  .comments-section {
    padding: 1.5rem;
  }
}
</style>

<!-- Markdown 内容样式 -->
<style>
.md-preview-custom {
  font-size: 1.02rem;
  line-height: 1.85;
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
  margin-top: 2.2rem;
  margin-bottom: 0.8rem;
  font-weight: 700;
  line-height: 1.35;
  color: #1a1a2e;
}

.md-preview-custom h1 { font-size: 1.9rem; border-bottom: 2px solid #f0f0f0; padding-bottom: 0.6rem; }
.md-preview-custom h2 { font-size: 1.55rem; }
.md-preview-custom h3 { font-size: 1.3rem; }
.md-preview-custom h4 { font-size: 1.1rem; }
.md-preview-custom h5 { font-size: 1rem; }
.md-preview-custom h6 { font-size: 0.95rem; color: #6b7280; }

.md-preview-custom p {
  margin: 1.15rem 0;
}

.md-preview-custom a {
  color: #667eea;
  text-decoration: none;
  border-bottom: 1px dotted #667eea;
}

.md-preview-custom a:hover {
  border-bottom-style: solid;
}

.md-preview-custom ul,
.md-preview-custom ol {
  margin: 1.1rem 0;
  padding-left: 1.75rem;
}

.md-preview-custom li {
  margin-bottom: 0.55rem;
}

.md-preview-custom li::marker {
  color: #667eea;
}

.md-preview-custom blockquote {
  margin: 1.5rem 0;
  padding: 1rem 1.25rem;
  border-left: 4px solid #667eea;
  background: linear-gradient(135deg, #f8fafc 0%, #f0f4ff 100%);
  color: #475569;
  border-radius: 0 8px 8px 0;
}

.md-preview-custom blockquote p {
  margin: 0;
}

.md-preview-custom code:not(pre code) {
  background: #f1f5f9;
  padding: 0.22rem 0.5rem;
  border-radius: 4px;
  font-family: "SF Mono", Monaco, Consolas, monospace;
  font-size: 0.88em;
  color: #dc2626;
}

.md-preview-custom pre {
  background: #1e293b;
  color: #e2e8f0;
  padding: 1.25rem;
  overflow-x: auto;
  margin: 1.5rem 0;
  line-height: 1.65;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.md-preview-custom pre code {
  background: none;
  padding: 0;
  color: inherit;
  font-size: 0.85rem;
}

.md-preview-custom img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  margin: 1.5rem 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.md-preview-custom table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  font-size: 0.95rem;
}

.md-preview-custom th,
.md-preview-custom td {
  border: 1px solid #e5e7eb;
  padding: 0.75rem 1rem;
  text-align: left;
}

.md-preview-custom th {
  background: #f9fafb;
  font-weight: 600;
}

.md-preview-custom hr {
  border: none;
  border-top: 2px dashed #e5e7eb;
  margin: 2.5rem 0;
}
</style>
