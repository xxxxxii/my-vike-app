import type { Config } from "vike/types";
import vikeVue from "vike-vue/config";

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/head-tags
  prerender: true,
  title: "My Vike App",
  description: "Demo showcasing Vike",

  // 启用客户端路由，使页面过渡动画生效
  clientRouting: true,

  extends: [vikeVue],
} as Config;
