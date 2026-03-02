---
title: "用 Vite + Vike 构建轻量型 SSR 应用"
date: "2026-02-20"
excerpt: "介绍如何使用 Vite 与 Vike 快速搭建可渲染为 HTML 的交互式页面。"
readTime: 5
---

## 官网地址

[https://vike.dev](https://vike.dev)

## 创建项目

```bash
npm create vike@latest --- --vue
```

```vue
<template>
  <article v-if="post" class="post-detail">
    <h1>{{ post.title }}</h1>
    <p class="meta">
      {{ formatDate(post.date) }} · {{ post.readTime }} min 阅读
    </p>
    <!-- <div>
      <MdPreview
        :id="id"
        :modelValue="post.content"
        :autoFoldThreshold="100"
        showCodeRowNumber
        :theme="'dark'"
        :codeTheme="'github'"
        :previewTheme="'github'"
      />
    </div> -->
    <div class="content" v-html="post.content"></div>
    <p><a href="/blog">← 返回博客列表</a></p>
    <!-- Giscus comments section (only render on client to avoid SSR work) -->
    <!-- <client-only> -->
    <Comments />
    <!-- </client-only> -->
  </article>
  <p v-else>文章未找到。</p>
</template>

<script lang="ts" setup>
import { useData } from "vike-vue/useData";
import { useConfig } from "vike-vue/useConfig";
import type { Data } from "./+data";
import Comments from "../../../components/Comments.vue";
import { MdPreview, MdCatalog, config } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
// import 'md-editor-v3/lib/preview.css';

config({})

const id = "preview-only";
const scrollElement = document.documentElement;

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
```
