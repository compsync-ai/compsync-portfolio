<script setup>
import { useRoute } from "vue-router";
import { computed, watch } from "vue";

const route = useRoute();
const themeClass = computed(() => route.meta?.theme === "dark" ? "theme-dark" : "theme-light");

watch(themeClass, (cls) => {
  document.documentElement.classList.toggle("theme-dark", cls === "theme-dark");
  document.documentElement.classList.toggle("theme-light", cls === "theme-light");
}, { immediate: true });
</script>

<template>
  <router-view v-slot="{ Component, route: r }">
    <component :is="Component" :key="r.path" />
  </router-view>
</template>
