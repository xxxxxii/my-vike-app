<template>
  <a :href="href" :class="{ active: isActive }">
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
  // exact match requested
  if (props.exact) return urlPathname === props.href;
  // default behaviour: treat root specially, else prefix match
  if (props.href === "/") return urlPathname === "/";
  return urlPathname.startsWith(props.href);
});
</script>

<style scoped>
a {
  padding: 2px 10px;
  margin: 4px 0;
  text-decoration: none;
  color: #424242;

}
a.active {
  background-color: #eee;
  border-radius: 4px;
}
</style>
