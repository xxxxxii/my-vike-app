<template>
  <article v-if="post" class="post-detail">
    <h1>{{ post.title }}</h1>
    <p class="meta">
      {{ formatDate(post.date) }} · {{ post.readTime }} min 阅读
    </p>

    <div class="post-container" style="display:flex;">
      <!-- Main content -->
      <div class="post-content" style="flex:1;width: calc(100% - 280px)">
        <client-only style="width: 100%;">
          <MdPreview v-if="post.markdown" :mdHeadingId="mdHeadingId" style="width: 100%;" :id="editorId"
                     :modelValue="post.markdown" @onGetCatalog="onGetCatalog"/>
        </client-only>
      </div>

      <!-- Table of contents sidebar -->
      <aside class="toc-sidebar" style="flex: none;">
        <client-only>
          <div class="toc-container">
            <div class="toc-title">目录</div>
            <!-- Custom catalog rendering instead of MdCatalog -->
            <nav v-if="catalogList?.length > 0" class="toc-list"
                 style="display: flex; flex-direction: column; gap: 4px;">
              <a
                  v-for="item in catalogList"
                  :key="item.text"
                  :href="`#${item.anchor}`"
                  :class="[
                  'toc-link',
                  `toc-h${item.level}`,
                  { 'toc-active': activeCatalogId === item.anchor }
                ]"
                  @click.prevent="scrollToAnchor(item.anchor)"
              >
                {{ item.text }}
              </a>
            </nav>
            <p v-else class="toc-empty">暂无标题</p>
          </div>
        </client-only>
      </aside>
    </div>

    <p><a href="/blog">← 返回博客列表</a></p>
    <!-- Giscus comments section (only render on client to avoid SSR work) -->
    <client-only>
      <Comments/>
    </client-only>
  </article>
  <p v-else>文章未找到。</p>
</template>

<script lang="ts" setup>
import {useData} from "vike-vue/useData";
import {useConfig} from "vike-vue/useConfig";
import type {Data} from "./+data";
import Comments from "../../../components/Comments.vue";
import {MdPreview, MdCatalog} from "md-editor-v3";
import "md-editor-v3/lib/preview.css";
import {ref, onMounted, onUnmounted, nextTick} from "vue";
import {ClientOnly} from "vike-vue/ClientOnly";

const {post} = useData<Data>();
const editorId = `md-preview-${Math.random().toString(36).slice(2, 9)}`;
const showCatalog = ref(false);

// scrollable container for the article; default to root element
let scrollElement: HTMLElement | Document = document.documentElement;

// set document title and description for SEO
if (post) {
  const config = useConfig();
  config({
    title: post.title,
    meta: [
      {name: "description", content: post.excerpt},
      {property: "og:title", content: post.title},
      {property: "og:description", content: post.excerpt},
    ],
  });
}

interface CatalogItem {
  level: number;
  text: string;
  index?: string;
}

// catalog items from MdPreview: array of { level, text, anchor }
const catalogList = ref<Array<{ level: number; text: string; anchor: string }>>([]);
// id of currently active section (used to highlight toc link)
const activeCatalogId = ref<string>("");

const mdHeadingId = ({text, level, index}: CatalogItem) => `heading-${text}`;

function onGetCatalog(catalog: any) {
  // md-editor-v3 passes the list of headers when ready
  catalogList.value = catalog || [];
  // set first item as active initially
  if (catalogList.value.length > 0) {
    catalogList.value = catalogList.value?.map(item => {
      return {...item, anchor: `heading-${item?.text}`}
    })
    activeCatalogId.value = catalogList.value[0].anchor;
  }
}

// scroll handler to update activeCatalogId based on viewport position
// simple throttle wrapper to limit invocation frequency
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

// scroll handler to update activeCatalogId based on viewport position
function updateActiveOnScroll() {
  if (!catalogList.value.length) return;
  throttledUpdate();
}

function scrollToAnchor(anchor: string) {
  const el = document.getElementById(anchor);
  console.log(el, anchor, 'el')
  if (el) {
    console.log(el, 'el')
    activeCatalogId.value = anchor;
    // smooth scroll using scrollElement if available
    const top = el.getBoundingClientRect().top + (scrollElement instanceof HTMLElement ? scrollElement.scrollTop : window.scrollY);
    if (scrollElement && typeof (scrollElement as HTMLElement).scrollTo === 'function') {
      (scrollElement as HTMLElement).scrollTo({top, behavior: 'smooth'});
    } else {
      window.scrollTo({top, behavior: 'smooth'});
    }
  }
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}

// attach scroll listener once mounted
onMounted(() => {
  // when mounted, determine the actual scrolling element (could be body or html)
  const scrollElement = document;
  console.log(scrollElement, 'scrollElement')
  setTimeout(() => {
    showCatalog.value = true;
    // run once to set initial active state
    updateActiveOnScroll();
  }, 500);
  // listen on the scrolling element rather than window
  nextTick(() => {
    scrollElement.addEventListener("scroll", updateActiveOnScroll, {passive: true});
  });

});

// cleanup
onUnmounted(() => {
  scrollElement.removeEventListener("scroll", updateActiveOnScroll);
});
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

/* Custom TOC link styles */
.toc-list {
  display: flex;
  flex-direction: column;
}

.toc-link {
  color: #6b7280;
  text-decoration: none;
  padding: 0.25rem 0;
  transition: color 0.15s, padding-left 0.15s;
  font-size: 0.95rem;
}

.toc-link:hover {
  color: #2563eb;
}

.toc-active {
  color: #1e40af;
  font-weight: 700;
}

.toc-h1 {
  padding-left: 0rem;
}

.toc-h2 {
  padding-left: 0.5rem;
}

.toc-h3 {
  padding-left: 1rem;
}

.toc-h4 {
  padding-left: 1.5rem;
}

.toc-h5 {
  padding-left: 2rem;
}

.toc-h6 {
  padding-left: 2.5rem;
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

:deep(.md-preview h1) {
  font-size: 1.8rem;
}

:deep(.md-preview h2) {
  font-size: 1.5rem;
}

:deep(.md-preview h3) {
  font-size: 1.3rem;
}

:deep(.md-preview h4) {
  font-size: 1.1rem;
}

:deep(.md-preview h5),
:deep(.md-preview h6) {
  font-size: 1rem;
}

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
    width: 100%;
  }
}

/* Safety rules to prevent code-folding or wide content from expanding the page
   - ensure flex container and preview have constrained width
   - allow horizontal scrolling inside code blocks instead of pushing layout */
.post-container {
  min-width: 0;
}

.post-detail,
.post-content,
:deep(.md-editor-preview),
:deep(.md-editor-preview-wrapper),
:deep(.md-preview) {
  box-sizing: border-box;
  width: 100%;
}

:deep(.md-preview pre) {
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
  word-break: normal;
}

:deep(.md-preview code) {
  word-break: break-word;
}
</style>
