<template>
  <main class="blog-page">
    <header class="blog-header">
      <h1 class="blog-title">📚 文章列表</h1>
      <p class="blog-desc">探索技术世界，分享开发心得</p>
    </header>

    <div class="posts-grid">
      <article
        v-for="post in pagedPosts"
        :key="post.slug"
        class="post-card"
      >
        <a :href="post.url" class="post-link">
          <div class="post-card-inner">
            <h2 class="post-title">{{ post.title }}</h2>
            <div class="post-meta">
              <span class="meta-date">{{ formatDate(post.date) }}</span>
              <span class="meta-divider">·</span>
              <span class="meta-readtime">{{ post.readTime }} min 阅读</span>
            </div>
            <p class="post-excerpt">{{ post.excerpt }}</p>
            <span class="read-more">阅读全文 →</span>
          </div>
        </a>
      </article>
    </div>

    <nav class="pagination" v-if="totalPages > 1">
      <button
        :disabled="currentPage <= 1"
        @click="previousPage"
        class="page-btn prev"
      >
        ← 上一页
      </button>
      <div class="page-dots">
        <span
          v-for="page in visiblePages"
          :key="page"
          class="page-dot"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </span>
      </div>
      <button
        :disabled="currentPage >= totalPages"
        @click="nextPage"
        class="page-btn next"
      >
        下一页 →
      </button>
    </nav>
  </main>
</template>

<script lang="ts" setup>
import { useData } from "vike-vue/useData";
import { ref, computed } from "vue";
import type { Data } from "./+data";

const { allPosts } = useData<Data>();
const PAGE_SIZE = 6;

const currentPage = ref(1);
const totalPages = computed(() => {
  const posts = allPosts || [];
  return Math.ceil(posts.length / PAGE_SIZE) || 1;
});

const pagedPosts = computed(() => {
  const posts = allPosts || [];
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return posts.slice(start, start + PAGE_SIZE);
});

const visiblePages = computed(() => {
  const pages: number[] = [];
  const total = totalPages.value;
  const current = currentPage.value;
  
  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, 5);
    } else if (current >= total - 2) {
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      for (let i = current - 2; i <= current + 2; i++) pages.push(i);
    }
  }
  return pages;
});

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("zh-CN");
  } catch {
    return iso;
  }
}

function previousPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function goToPage(page: number) {
  currentPage.value = page;
}
</script>

<style scoped>
.blog-page {
  max-width: 900px;
  margin: 2.5rem auto;
  padding: 0 1.25rem;
}

.blog-header {
  text-align: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border, #eee);
}

.blog-title {
  font-size: 2.1rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: var(--color-text, #333);
  letter-spacing: -0.5px;
}

.blog-desc {
  font-size: 1rem;
  color: var(--color-text-muted, #666);
  margin: 0;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.post-card {
  background: #fff;
  border: 1px solid var(--color-border, #eee);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: var(--color-primary, #0070f3);
}

.post-link {
  display: block;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.post-card-inner {
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}

.post-title {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0 0 0.65rem;
  color: var(--color-text, #333);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-meta {
  font-size: 0.8rem;
  color: var(--color-text-muted, #888);
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.meta-divider {
  opacity: 0.5;
}

.post-excerpt {
  font-size: 0.9rem;
  color: #555;
  margin: 0 0 1rem;
  line-height: 1.6;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-more {
  font-size: 0.85rem;
  color: var(--color-primary, #0070f3);
  font-weight: 500;
  transition: color 0.15s ease;
}

.post-card:hover .read-more {
  color: #0051a2;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
  flex-wrap: wrap;
}

.page-btn {
  padding: 0.55rem 1rem;
  border: 1px solid var(--color-border, #eee);
  background: #fff;
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--color-text, #333);
  cursor: pointer;
  transition: all 0.15s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--color-primary, #0070f3);
  color: var(--color-primary, #0070f3);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-dots {
  display: flex;
  gap: 0.4rem;
}

.page-dot {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 0.85rem;
  color: var(--color-text-muted, #666);
  cursor: pointer;
  transition: all 0.15s ease;
}

.page-dot:hover {
  background: #f5f5f5;
  color: var(--color-primary, #0070f3);
}

.page-dot.active {
  background: var(--color-primary, #0070f3);
  color: #fff;
  font-weight: 500;
}

@media (max-width: 600px) {
  .blog-page {
    padding: 0 1rem;
    margin: 1.5rem auto;
  }

  .blog-title {
    font-size: 1.6rem;
  }

  .posts-grid {
    gap: 1rem;
  }

  .post-card-inner {
    padding: 1.1rem;
  }

  .pagination {
    gap: 0.5rem;
  }

  .page-dots {
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: 0.5rem;
  }
}
</style>
