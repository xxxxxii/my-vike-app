<!-- https://vike.dev/Layout -->

<template>
  <div class="layout">
    <Sidebar>
      <Logo />
      <Link href="/">Home</Link>
      <Link href="/blog">Blog</Link>
      <Link href="/todo">Todo</Link>
    </Sidebar>
    <Content><slot /></Content>
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
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
}

/* Responsive: stack sidebar on top for narrow viewports */
@media (max-width: 600px) {
  .layout {
    flex-direction: column;
  }
}
</style>
