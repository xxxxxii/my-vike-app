<template>
  <aside id="sidebar" class="sidebar">
    <slot />
  </aside>
</template>

<style scoped>
.sidebar {
  padding: 20px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  line-height: 1.8em;
  border-right: 2px solid #eee;
}

/* mobile: make sidebar horizontal and collapse margin */
@media (max-width: 600px) {
  .sidebar {
    flex-direction: row;
    border-right: none;
    border-bottom: 2px solid #eee;
    overflow-x: auto;
  }
  .sidebar ::slotted(*) {
    margin-right: 1rem;
  }
}
</style>
