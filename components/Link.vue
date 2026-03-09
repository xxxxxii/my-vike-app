<template>
  <a :href="href" :class="['nav-link', { active: isActive }]">
    <slot />
  </a>
</template>

<script lang="ts" setup>
import { usePageContext } from "vike-vue/usePageContext";
import { computed } from "vue";

const props = defineProps<{
  href: string;
  exact?: boolean;
}>();

const pageContext = usePageContext();
const isActive = computed(() => {
  const { urlPathname } = pageContext;
  if (!props.href) return false;
  if (props.exact) return urlPathname === props.href;
  if (props.href === "/") return urlPathname === "/";
  return urlPathname.startsWith(props.href);
});
</script>

<style scoped>
.nav-link {
  display: block;
  padding: 0.6rem 0.85rem;
  margin: 0.15rem 0;
  text-decoration: none;
  color: var(--color-text-muted, #666);
  font-size: 0.95rem;
  border-radius: 8px;
  transition: all 0.15s ease;
}

.nav-link:hover {
  background: #f5f5f5;
  color: var(--color-text, #333);
}

.nav-link.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-weight: 500;
}
</style>
