<template>
  <main class="blog-list">
    <h1>博客</h1>
    <ul>
      <li v-for="post in posts" :key="post.slug" class="post-item">
        <a :href="post.url" class="post-link">
          <h2>{{ post.title }}</h2>
          <p class="meta">{{ formatDate(post.date) }} · {{ post.readTime }} min</p>
          <p class="excerpt">{{ post.excerpt }}</p>
        </a>
      </li>
    </ul>

    <nav class="pagination" aria-label="分页">
      <button
        :disabled="page <= 1"
        @click="go(page - 1)"
        class="prev"
      >上一页</button>
      <span class="page-info">第 {{ page }} / {{ totalPages }} 页</span>
      <button
        :disabled="page >= totalPages"
        @click="go(page + 1)"
        class="next"
      >下一页</button>
    </nav>
  </main>
</template>

<script lang="ts" setup>
import { useData } from "vike-vue/useData";
import type { Data } from "./+data";

const { posts, page, totalPages } = useData<Data>();

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}

function go(p: number) {
  const url = new URL(window.location.href);
  url.searchParams.set("page", String(p));
  window.location.href = url.toString();
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
</style>
