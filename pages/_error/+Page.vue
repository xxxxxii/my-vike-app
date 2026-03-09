<template>
  <main class="error-page">
    <div class="error-card">
      <div class="error-code">{{ is404 ? "404" : "500" }}</div>
      <h1 class="error-heading">{{ heading }}</h1>
      <p class="error-reason">{{ abortReason }}</p>
      <div class="error-actions">
        <a href="/" class="btn-home">← 返回首页</a>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { usePageContext } from "vike-vue/usePageContext";

const pageContext = usePageContext();
let { is404, abortReason } = pageContext;
if (!abortReason) {
  abortReason = is404 ? "抱歉，您访问的页面不存在。" : "服务器发生了错误，请稍后重试。";
}
const heading = is404 ? "页面未找到" : "内部错误";
</script>

<style scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem 1rem;
}

.error-card {
  text-align: center;
  max-width: 480px;
  width: 100%;
}

.error-code {
  font-size: 6rem;
  font-weight: 800;
  line-height: 1;
  color: var(--color-primary, #0070f3);
  opacity: 0.15;
  letter-spacing: -4px;
  margin-bottom: 0.5rem;
  user-select: none;
}

.error-heading {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.75rem;
  color: var(--color-text, #333);
  letter-spacing: -0.5px;
}

.error-reason {
  color: var(--color-text-muted, #666);
  font-size: 1rem;
  margin: 0 0 2rem;
  line-height: 1.6;
}

.btn-home {
  display: inline-block;
  padding: 0.65rem 1.4rem;
  background: var(--color-primary, #0070f3);
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: background 0.15s ease, transform 0.15s ease;
}

.btn-home:hover {
  background: #0051a2;
  transform: translateY(-1px);
  color: #fff;
}

@media (max-width: 600px) {
  .error-code {
    font-size: 4rem;
  }

  .error-heading {
    font-size: 1.4rem;
  }
}
</style>
