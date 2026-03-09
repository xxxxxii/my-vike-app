<!-- https://vike.dev/Layout -->

<template>
  <div class="layout">
    <div class="layout-sidebar">
      <Sidebar>
        <Logo />
        <nav class="nav-links">
          <Link href="/" exact>🏠 首页</Link>
          <Link href="/blog">📚 博客</Link>
          <Link href="/todo">📝 待办</Link>
          <Link href="/star-wars">🎬 星球大战</Link>
        </nav>
      </Sidebar>
    </div>
    <div class="layout-content">
      <Content><slot /></Content>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Content from "../components/Content.vue";
import Link from "../components/Link.vue";
import Logo from "../components/Logo.vue";
import Sidebar from "../components/Sidebar.vue";
</script>

<style>
:root {
  --color-text: #333;
  --color-text-muted: #666;
  --color-border: #eee;
  --color-primary: #0070f3;
  --spacing-xs: 8px;
  --spacing-sm: 12px;
  --spacing-md: 20px;
  --spacing-lg: 30px;
  --sidebar-width: 220px;
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: var(--color-text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #fafafa;
}

a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: #0051a2;
}
</style>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

/* 固定侧边栏 - 桌面端 */
.layout-sidebar {
  width: var(--sidebar-width, 220px);
  flex-shrink: 0;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  background: #fff;
  border-right: 1px solid var(--color-border, #eee);
  overflow-y: auto;
  z-index: 100;
}

.layout-content {
  flex: 1;
  margin-left: var(--sidebar-width, 220px);
  min-width: 0;
}

/* 导航链接容器 */
.nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem 0;
}

/* 移动端布局 */
@media (max-width: 768px) {
  .layout {
    flex-direction: column;
  }

  .layout-sidebar {
    position: relative;
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--color-border, #eee);
    overflow-x: auto;
  }

  .layout-content {
    margin-left: 0;
  }

  .nav-links {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    padding: 0.75rem 1rem;
    gap: 0.5rem;
  }
}
</style>
