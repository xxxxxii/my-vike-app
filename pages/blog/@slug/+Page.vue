<template>
  <article v-if="post" class="post-detail">
    <h1>{{ post.title }}</h1>
    <p class="meta">
      {{ formatDate(post.date) }} · {{ post.readTime }} min 阅读
    </p>
    <div class="content" v-html="post.content"></div>
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

const { post } = useData<Data>();

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
.meta {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}
.content {
  line-height: 1.7;
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
}
</style>
