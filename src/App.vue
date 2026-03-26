<script setup>
import { computed } from "vue";
import DocumentationPage from "./pages/DocumentationPage.vue";
import NotFoundPage from "./pages/NotFoundPage.vue";

const currentPath = computed(() => window.location.pathname.replace(/\/+$/, "") || "/");
const isHomeRoute = computed(() => currentPath.value === "/");
</script>

<template>
  <DocumentationPage v-if="isHomeRoute" />
  <NotFoundPage v-else />
</template>
