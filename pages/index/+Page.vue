<template>
  <main class="home">
    <header class="hero">
      <h1 class="title">欢迎来到我的 博客</h1>
      <p class="tagline">这是一个基于 Vike + Vue 的轻量级 Markdown 博客，静态生成。浏览文章、使用搜索，并享受预渲染带来的高速体验。</p>
      <p class="actions">
        <a class="btn" href="/blog">查看文章 &raquo;</a>
        <a class="muted" href="/search">搜索文章</a>
      </p>
    </header>

    <section class="about">
      <h2>关于本站</h2>
      <p>
        本站演示了一个使用 Vike + Vite 构建的博客模版，支持 Markdown 写作、标签过滤、
        客户端搜索、RSS 生成与 Giscus 评论。文章在构建时预渲染以获得最佳性能，交互式组件在客户端按需加载。
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
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
