<template>
  <aside id="sidebar" class="sidebar">
    <slot />
  </aside>
</template>

<style scoped>
.sidebar {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
