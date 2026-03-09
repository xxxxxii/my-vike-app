<template>
  <main class="sw-list">
    <h1 class="sw-title">🎬 Star Wars Movies</h1>
    <ol class="movie-list">
      <li v-for="item in movies" :key="item.id" class="movie-item">
        <a :href="'/star-wars/' + item.id" class="movie-link">
          <span class="movie-name">{{ item.title }}</span>
          <span class="movie-date">{{ item.release_date }}</span>
        </a>
      </li>
    </ol>
    <p class="source">
      数据来源：<a href="https://brillout.github.io/star-wars" target="_blank" rel="noopener">brillout.github.io/star-wars</a>
    </p>
  </main>
</template>

<script lang="ts" setup>
import { useData } from "vike-vue/useData";
import type { Data } from "./+data.js";

const { movies } = useData<Data>();
</script>

<style scoped>
.sw-list {
  max-width: 680px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.sw-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--color-text, #333);
  letter-spacing: -0.5px;
}

.movie-list {
  list-style: none;
  counter-reset: movie-counter;
  padding: 0;
  margin: 0 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.movie-item {
  counter-increment: movie-counter;
}

.movie-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1.1rem;
  border: 1px solid var(--color-border, #eee);
  border-radius: 8px;
  background: #fff;
  color: var(--color-text, #333);
  text-decoration: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
}

.movie-link::before {
  content: counter(movie-counter) ".";
  font-weight: 600;
  color: var(--color-primary, #0070f3);
  margin-right: 0.75rem;
  min-width: 1.5rem;
}

.movie-link:hover {
  border-color: var(--color-primary, #0070f3);
  box-shadow: 0 2px 8px rgba(0, 112, 243, 0.12);
  transform: translateY(-1px);
  color: var(--color-primary, #0070f3);
}

.movie-name {
  font-weight: 500;
  flex: 1;
}

.movie-date {
  font-size: 0.85rem;
  color: var(--color-text-muted, #666);
  white-space: nowrap;
  margin-left: 1rem;
}

.source {
  font-size: 0.85rem;
  color: var(--color-text-muted, #666);
  margin-top: 1.5rem;
}

@media (max-width: 600px) {
  .sw-title {
    font-size: 1.4rem;
  }

  .movie-link {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .movie-date {
    margin-left: 0;
  }
}
</style>
