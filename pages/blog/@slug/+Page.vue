<template>
  <article v-if="post" class="post-detail">
    <div class="post-wrapper">
      <!-- 顶部导航 -->
      <nav class="post-nav">
        <a href="/blog" class="back-link">
          <span class="back-icon">←</span>
          返回列表
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
        </div>
      </header>

      <!-- 内容区 -->
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

        <!-- 右侧目录 -->
        <aside class="toc-sidebar" v-if="catalogList.length > 0">
          <div class="toc-card">
            <div class="toc-header">
              <span class="toc-title">目录</span>
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

      <!-- 底部 -->
      <nav class="post-footer">
        <a href="/blog" class="footer-link">← 返回文章列表</a>
      </nav>

      <!-- 评论区 -->
      <section class="comments-section">
        <h3 class="comments-title">评论</h3>
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
    <p>抱歉，您访问的文章不存在。</p>
    <a href="/blog" class="back-home">← 返回博客</a>
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
    window.scrollTo({ top: top - 100, behavior: "smooth" });

    window.removeEventListener("scroll", updateActiveOnScroll);
    setTimeout(() => {
      window.addEventListener("scroll", updateActiveOnScroll, { passive: true });
    }, 500);
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
  setTimeout(() => updateActiveOnScroll(), 300);
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
  min-height: 100vh;
  background: #f8f9fa;
}

.post-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 3rem;
}

/* 顶部导航 */
.post-nav { margin-bottom: 1rem; }

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  color: #6c757d;
  font-size: 0.8rem;
  text-decoration: none;
  transition: all 0.15s ease;
}

.back-link:hover {
  border-color: #667eea;
  color: #667eea;
}

/* 文章头部 */
.post-header {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.post-title {
  font-size: 1.85rem;
  font-weight: 700;
  margin: 0 0 0.75rem;
  color: #212529;
  line-height: 1.3;
}

.post-meta {
  font-size: 0.85rem;
  color: #868e96;
}

.meta-item { display: inline-flex; align-items: center; gap: 0.3rem; }

/* 内容区 */
.post-body {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.post-content {
  flex: 1;
  min-width: 0;
  background: #fff;
  border-radius: 12px;
  padding: 1.75rem 2rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

/* 目录 */
.toc-sidebar {
  width: 180px;
  flex-shrink: 0;
  position: sticky;
  top: 80px;
}

.toc-card {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

.toc-header {
  font-weight: 600;
  font-size: 0.8rem;
  color: #495057;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e9ecef;
}

.toc-nav { display: flex; flex-direction: column; gap: 0.15rem; }

.toc-link {
  color: #868e96;
  text-decoration: none;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.1s ease;
  line-height: 1.3;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toc-link:hover { color: #667eea; background: #f8f9fa; }

.toc-link.active {
  color: #667eea;
  background: #f0f4ff;
  font-weight: 500;
}

.toc-level-2 { padding-left: 0.75rem; }
.toc-level-3 { padding-left: 1rem; font-size: 0.7rem; }
.toc-level-4 { padding-left: 1.25rem; font-size: 0.7rem; }
.toc-level-5 { padding-left: 1.5rem; font-size: 0.7rem; }
.toc-level-6 { padding-left: 1.75rem; font-size: 0.7rem; }

/* 底部 */
.post-footer {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.footer-link {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
}

.footer-link:hover { text-decoration: underline; }

/* 评论区 */
.comments-section {
  margin-top: 2rem;
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.comments-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1rem;
  color: #212529;
}

/* 未找到 */
.not-found {
  text-align: center;
  padding: 4rem 2rem;
  background: #f8f9fa;
  min-height: 50vh;
}

.not-found-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }
.not-found h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
.not-found p { color: #868e96; margin-bottom: 1.5rem; }

.back-home {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #667eea;
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.9rem;
}

/* 响应式 */
@media (max-width: 900px) {
  .toc-sidebar { display: none; }
}

@media (max-width: 600px) {
  .post-wrapper { padding: 1rem 1rem 2rem; }
  .post-header { padding: 1.25rem; }
  .post-title { font-size: 1.4rem; }
  .post-content { padding: 1.25rem; border-radius: 10px; }
  .comments-section { padding: 1.25rem; }
}
</style>

<!-- Markdown 样式 -->
<style>
.md-preview-custom {
  font-size: 0.95rem;
  line-height: 1.75;
  color: #333;
}

.md-preview-custom .md-editor-preview-wrapper { padding: 0; }

.md-preview-custom h1,
.md-preview-custom h2,
.md-preview-custom h3,
.md-preview-custom h4,
.md-preview-custom h5,
.md-preview-custom h6 {
  margin-top: 1.75rem;
  margin-bottom: 0.6rem;
  font-weight: 600;
  line-height: 1.4;
  color: #212529;
}

.md-preview-custom h1 { font-size: 1.6rem; border-bottom: 1px solid #e9ecef; padding-bottom: 0.4rem; }
.md-preview-custom h2 { font-size: 1.35rem; }
.md-preview-custom h3 { font-size: 1.15rem; }
.md-preview-custom h4 { font-size: 1rem; }

.md-preview-custom p { margin: 0.9rem 0; }

.md-preview-custom a { color: #667eea; text-decoration: none; border-bottom: 1px dotted #667eea; }

.md-preview-custom ul, .md-preview-custom ol { margin: 0.8rem 0; padding-left: 1.5rem; }
.md-preview-custom li { margin-bottom: 0.35rem; }

.md-preview-custom blockquote {
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  border-left: 3px solid #667eea;
  background: #f8f9fa;
  color: #495057;
  border-radius: 0 4px 4px 0;
}

.md-preview-custom code:not(pre code) {
  background: #f1f3f4;
  padding: 0.15rem 0.35rem;
  border-radius: 3px;
  font-family: "SF Mono", Monaco, monospace;
  font-size: 0.85em;
  color: #e83e8c;
}

.md-preview-custom pre {
  background: #282c34;
  color: #abb2bf;
  padding: 1rem;
  overflow-x: auto;
  margin: 1rem 0;
  line-height: 1.5;
}

.md-preview-custom pre code { background: none; padding: 0; color: inherit; font-size: 0.8rem; }

.md-preview-custom img { max-width: 100%; height: auto; border-radius: 6px; margin: 1rem 0; }

.md-preview-custom table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
.md-preview-custom th, .md-preview-custom td { border: 1px solid #dee2e6; padding: 0.5rem 0.75rem; text-align: left; }
.md-preview-custom th { background: #f8f9fa; font-weight: 600; }

.md-preview-custom hr { border: none; border-top: 1px solid #dee2e6; margin: 1.5rem 0; }
</style>
