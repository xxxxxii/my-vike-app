<template>
  <article v-if="post" class="post-detail">
    <h1>{{ post.title }}</h1>
    <p class="meta">{{ formatDate(post.date) }} · {{ post.readTime }} min 阅读</p>
    <div class="content" v-html="post.content"></div>
    <p><a href="/blog">← 返回博客列表</a></p>
  </article>
  <p v-else>文章未找到。</p>
</template>

<script lang="ts" setup>
import { useData } from "vike-vue/useData";
import type { Data } from "./+data";

const { post } = useData<Data>();

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}
</script>

<style scoped>
.post-detail { max-width: 700px; margin: 2rem auto; padding: 0 1rem; }
.meta { color: #888; font-size: 0.9rem; margin-bottom: 1rem; }
.content { line-height: 1.7; }
</style>
