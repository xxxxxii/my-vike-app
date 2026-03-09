<template>
  <div class="todo-list-wrap">
    <!-- 添加新任务 -->
    <form class="add-form" @submit.prevent="submitNewTodo">
      <input
        v-model="newTodo"
        class="add-input"
        type="text"
        placeholder="输入新的待办事项…"
        maxlength="200"
        autocomplete="off"
      />
      <button class="add-btn" type="submit" :disabled="!newTodo.trim()">添加</button>
    </form>

    <!-- 列表 -->
    <ul v-if="todoItems.length > 0" class="todo-items">
      <li
        v-for="(item, index) in todoItems"
        :key="index"
        class="todo-item"
        :class="{ completed: item.done }"
      >
        <label class="todo-check-label">
          <input
            type="checkbox"
            class="todo-checkbox"
            :checked="item.done"
            @change="toggleDone(index)"
          />
          <span class="check-icon">
            <svg v-if="item.done" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 8.5L6.5 12L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </label>
        <span class="todo-text">{{ item.text }}</span>
        <button class="delete-btn" @click="deleteItem(index)" title="删除">
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </button>
      </li>
    </ul>

    <!-- 空状态 -->
    <div v-else class="todo-empty">
      <span class="empty-icon">🎉</span>
      <p>暂无待办事项，添加一个吧！</p>
    </div>

    <!-- 底部统计 -->
    <div v-if="todoItems.length > 0" class="todo-footer">
      <span class="footer-count">共 {{ todoItems.length }} 项，已完成 {{ doneCount }} 项</span>
      <button
        v-if="doneCount > 0"
        class="clear-done-btn"
        @click="clearDone"
      >清除已完成</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Data } from "./+data";
import { useData } from "vike-vue/useData";
import { ref, computed } from "vue";

const { todoItemsInitial } = useData<Data>();

interface TodoItem {
  text: string;
  done: boolean;
}

const todoItems = ref<TodoItem[]>(
  todoItemsInitial.map((item: { text: string }) => ({ text: item.text, done: false }))
);
const newTodo = ref("");

const doneCount = computed(() => todoItems.value.filter((i) => i.done).length);

function submitNewTodo() {
  const text = newTodo.value.trim();
  if (!text) return;
  todoItems.value.push({ text, done: false });
  newTodo.value = "";
}

function toggleDone(index: number) {
  todoItems.value[index].done = !todoItems.value[index].done;
}

function deleteItem(index: number) {
  todoItems.value.splice(index, 1);
}

function clearDone() {
  todoItems.value = todoItems.value.filter((i) => !i.done);
}
</script>

<style scoped>
.todo-list-wrap {
  background: #fff;
  border: 1px solid var(--color-border, #eee);
  border-radius: 10px;
  padding: 1.25rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

/* 添加区 */
.add-form {
  display: flex;
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.add-input {
  flex: 1;
  padding: 0.6rem 0.9rem;
  border: 1px solid var(--color-border, #eee);
  border-radius: 7px;
  font-size: 0.95rem;
  color: var(--color-text, #333);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  background: #fafafa;
}

.add-input:focus {
  border-color: var(--color-primary, #0070f3);
  box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.1);
  background: #fff;
}

.add-btn {
  padding: 0.6rem 1.1rem;
  background: var(--color-primary, #0070f3);
  color: #fff;
  border: none;
  border-radius: 7px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease;
  white-space: nowrap;
}

.add-btn:hover:not(:disabled) {
  background: #0051a2;
  transform: translateY(-1px);
}

.add-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* 列表 */
.todo-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.75rem;
  border-radius: 7px;
  background: #fafafa;
  border: 1px solid transparent;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.todo-item:hover {
  background: #f5f5fa;
  border-color: var(--color-border, #eee);
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: var(--color-text-muted, #999);
}

/* 自定义 checkbox */
.todo-check-label {
  position: relative;
  flex-shrink: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.todo-checkbox {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.check-icon {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border, #ddd);
  border-radius: 5px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, border-color 0.15s ease;
  color: #fff;
}

.todo-checkbox:checked ~ .check-icon {
  background: var(--color-primary, #0070f3);
  border-color: var(--color-primary, #0070f3);
}

.check-icon svg {
  width: 12px;
  height: 12px;
}

/* 文字 */
.todo-text {
  flex: 1;
  font-size: 0.95rem;
  color: var(--color-text, #333);
  line-height: 1.4;
  word-break: break-word;
  transition: color 0.15s ease;
}

/* 删除按钮 */
.delete-btn {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: #bbb;
  padding: 0;
  transition: color 0.15s ease, background 0.15s ease;
}

.delete-btn:hover {
  color: #ef4444;
  background: #fee2e2;
}

.delete-btn svg {
  width: 14px;
  height: 14px;
}

/* 空状态 */
.todo-empty {
  text-align: center;
  padding: 2.5rem 1rem;
  color: var(--color-text-muted, #999);
  font-size: 0.95rem;
}

.empty-icon {
  display: block;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.todo-empty p {
  margin: 0;
}

/* 底部 */
.todo-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border, #eee);
  font-size: 0.85rem;
}

.footer-count {
  color: var(--color-text-muted, #888);
}

.clear-done-btn {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background 0.15s ease;
}

.clear-done-btn:hover {
  background: #fee2e2;
}

@media (max-width: 600px) {
  .add-form {
    flex-direction: column;
  }

  .add-btn {
    width: 100%;
  }
}
</style>
