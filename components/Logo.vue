<template>
  <div class="logo-container">
    <a href="/" class="logo-link">
      <img src="../assets/logo.svg" height="40" width="40" alt="logo" class="logo-img" />
      <span class="logo-text">My Vike App</span>
    </a>
  </div>
</template>

<style scoped>
.logo-container {
  padding: 0.5rem 0 1.25rem;
  border-bottom: 1px solid var(--color-border, #eee);
  margin-bottom: 0.75rem;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  text-decoration: none;
}

.logo-img {
  flex-shrink: 0;
}

.logo-text {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text, #333);
  letter-spacing: -0.3px;
}

/* 移动端：Logo 居中 */
@media (max-width: 768px) {
  .logo-container {
    display: flex;
    justify-content: center;
    padding: 0.75rem 0;
  }
}
</style>
