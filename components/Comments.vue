<template>
  <section class="giscus-wrapper">
    <div id="giscus-container">
        <!-- <script
            is:inline
            data-astro-rerun
            src="https://giscus.app/client.js"
            data-repo="xxxxxii/ylBlogCommits"
            data-repo-id="R_kgDOLC5aZQ"
            data-category="Announcements"
            data-category-id="DIC_kwDOLC5aZc4CcUQO"
            data-mapping="pathname"
            data-strict="0"
            data-reactions-enabled="1"
            data-emit-metadata="0"
            data-input-position="top"
            data-theme="preferred_color_scheme"
            data-lang="en"
            data-loading="lazy"
            crossorigin="anonymous"
            async /> -->
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  const script = document.createElement("script");
  script.src = "https://giscus.app/client.js";
  script.setAttribute("data-repo", "xxxxxii/ylBlogCommits");
  script.setAttribute("data-repo-id", "R_kgDOLC5aZQ");
  script.setAttribute("data-category", "Announcements");
  script.setAttribute("data-category-id", "DIC_kwDOLC5aZc4CcUQO");
  script.setAttribute("data-mapping", "pathname");
  script.setAttribute("data-strict", "0");
  script.setAttribute("data-reactions-enabled", "1");
  script.setAttribute("data-emit-metadata", "0");
  script.setAttribute("data-input-position", "top");
  script.setAttribute("data-theme", "preferred_color_scheme");
  script.setAttribute("data-lang", "zh-CN");
    script.setAttribute("data-loading", "lazy");
  script.async = true;
  script.crossOrigin = "anonymous";

  const container = document.getElementById("giscus-container");
  if (container) {
    container.appendChild(script);
  }
});
</script>

<style scoped>
.giscus-wrapper {
  max-width: 700px;
  margin: 2rem auto;
  padding: 0 1rem;
  border-top: 1px solid #eee;
  padding-top: 2rem;
}

@media (max-width: 600px) {
  .giscus-wrapper {
    padding: 0 0.5rem;
    margin: 1rem auto;
  }
}
</style>
