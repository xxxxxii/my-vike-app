<template>
  <main class="todo-page">
    <div class="todo-header">
      <h1 class="todo-title">📝 待办事项</h1>
      <p class="todo-subtitle">保持高效，逐一完成你的任务</p>
    </div>
    <TodoList />
  </main>
</template>

<script lang="ts" setup>
import TodoList from "./TodoList.vue";
</script>

<style scoped>
.todo-page {
  max-width: 620px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.todo-header {
  margin-bottom: 1.5rem;
}

.todo-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 0.4rem;
  color: var(--color-text, #333);
  letter-spacing: -0.5px;
}

.todo-subtitle {
  margin: 0;
  color: var(--color-text-muted, #666);
  font-size: 0.95rem;
}

@media (max-width: 600px) {
  .todo-title {
    font-size: 1.4rem;
  }
}
</style>
