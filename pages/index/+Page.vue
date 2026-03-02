<template>
  <main class="home">
    <header class="hero">
      <h1 class="title">Welcome to My Vike Blog</h1>
      <p class="tagline">A minimal Markdown-powered blog built with Vike + Vue. Read posts, search, and enjoy fast static pages.</p>
      <p class="actions">
        <a class="btn" href="/blog">查看文章 &raquo;</a>
        <a class="muted" href="/search">快速搜索</a>
      </p>
    </header>

    <section class="about">
      <h2>About this site</h2>
      <p>
        This blog demonstrates a clean Vike + Vite setup with Markdown content, tag filtering,
        client-side search, RSS generation and Giscus comments. Posts are pre-rendered for
        optimal performance while interactive widgets are loaded on the client.
      </p>
    </section>

    <Counter />
  </main>
</template>

<script setup lang="ts">
import Counter from "../../components/Counter.vue";
</script>

<style scoped>
.home { max-width: 900px; margin: 2.5rem auto; padding: 0 1rem; font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
.hero { text-align: center; padding: 2rem 1rem; background: linear-gradient(180deg, #ffffff 0%, #fbfbff 100%); border-radius: 8px; box-shadow: 0 4px 14px rgba(20,20,40,0.03); }
.title { margin: 0 0 0.5rem; font-size: 2rem; letter-spacing: -0.5px; }
.tagline { margin: 0 0 1rem; color: #555; max-width: 720px; margin-left: auto; margin-right: auto; }
.actions { margin-top: 1rem; display: flex; gap: 1rem; justify-content: center; }
.btn { background: #2563eb; color: white; padding: 0.6rem 1rem; border-radius: 6px; text-decoration: none; }
.btn:hover { background: #1e4fd8; }
.muted { color: #666; align-self: center; text-decoration: none; padding: 0.6rem; }
.about { margin-top: 1.75rem; background: #fff; padding: 1rem 1.25rem; border-radius: 6px; border: 1px solid #f0f0f5; }
.about h2 { margin-top: 0; }

@media (max-width: 600px) {
  .title { font-size: 1.5rem; }
  .actions { flex-direction: column; }
}
</style>
