<template>
  <main class="sw-detail">
    <a href="/star-wars" class="back-link">← 返回影片列表</a>
    <div class="movie-card">
      <h1 class="movie-title">{{ movie.title }}</h1>
      <ul class="movie-info">
        <li>
          <span class="info-label">上映日期</span>
          <span class="info-value">{{ movie.release_date }}</span>
        </li>
        <li>
          <span class="info-label">导演</span>
          <span class="info-value">{{ movie.director }}</span>
        </li>
        <li>
          <span class="info-label">制片人</span>
          <span class="info-value">{{ movie.producer }}</span>
        </li>
      </ul>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { useData } from "vike-vue/useData";
import type { Data } from "./+data.js";

const { movie } = useData<Data>();
</script>

<style scoped>
.sw-detail {
  max-width: 680px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.back-link {
  display: inline-block;
  margin-bottom: 1.5rem;
  color: var(--color-primary, #0070f3);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.15s ease;
}

.back-link:hover {
  color: #0051a2;
}

.movie-card {
  background: #fff;
  border: 1px solid var(--color-border, #eee);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.movie-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 1.5rem;
  letter-spacing: -0.5px;
  color: var(--color-text, #333);
}

.movie-info {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.movie-info li {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--color-border, #eee);
}

.movie-info li:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: var(--color-text-muted, #666);
  font-size: 0.85rem;
  min-width: 5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  color: var(--color-text, #333);
  font-size: 1rem;
}

@media (max-width: 600px) {
  .movie-title {
    font-size: 1.5rem;
  }

  .movie-card {
    padding: 1.25rem;
  }
}
</style>
