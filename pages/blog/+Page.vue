<template>
  <main class="blog-list">
    <h1>博客</h1>
    <ul>
      <li v-for="post in pagedPosts" :key="post.slug" class="post-item">
        <a :href="post.url" class="post-link">
          <h2>{{ post.title }}</h2>
          <p class="meta">{{ formatDate(post.date) }} · {{ post.readTime }} min</p>
          <p class="excerpt">{{ post.excerpt }}</p>
        </a>
      </li>
    </ul>

    <nav class="pagination" aria-label="分页">
      <button
        :disabled="currentPage <= 1"
        @click="previousPage"
        class="prev"
      >上一页</button>
      <span class="page-info">第 {{ currentPage }} / {{ totalPages }} 页</span>
      <button
        :disabled="currentPage >= totalPages"
        @click="nextPage"
        class="next"
      >下一页</button>
    </nav>
  </main>
</template>

<script lang="ts" setup>
import { useData } from "vike-vue/useData";
import { ref, computed } from "vue";
import type { Data } from "./+data";

const { allPosts } = useData<Data>();
const PAGE_SIZE = 10;

const currentPage = ref(1);

const totalPages = computed(() => Math.ceil(allPosts.length / PAGE_SIZE) || 1);

const pagedPosts = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return allPosts.slice(start, start + PAGE_SIZE);
});

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString();
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
</script>

<style scoped>
.blog-list { max-width: 800px; margin: 2rem auto; padding: 0 1rem; font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
.post-item { margin-bottom: 1.5rem; }
.post-link { color: inherit; text-decoration: none; }
.meta { color: #888; font-size: 0.9rem; }
.excerpt { color: #444; }
.pagination { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 2rem; }
.pagination button { padding: 0.5rem 1rem; }
.pagination .page-info { font-size: 0.9rem; }

/* mobile tweaks */
@media (max-width: 600px) {
  .blog-list { padding: 0 0.5rem; margin: 1rem auto; }
  .post-item h2 { font-size: 1.2rem; }
  .meta, .excerpt { font-size: 0.9rem; }
  .pagination { flex-direction: column; gap: 0.5rem; }
  .pagination button { width: 100%; }
}
</style>
