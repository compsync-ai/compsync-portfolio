<script setup>
import { computed } from "vue";
import DocumentationPage from "./pages/DocumentationPage.vue";
import LandingPage from "./pages/LandingPage.vue";
import NotFoundPage from "./pages/NotFoundPage.vue";

const appBasePath = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");
const currentPath = computed(() => {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";

  if (!appBasePath || appBasePath === "/") {
    return pathname;
  }

  if (pathname === appBasePath) {
    return "/";
  }

  if (pathname.startsWith(`${appBasePath}/`)) {
    return pathname.slice(appBasePath.length) || "/";
  }

  return pathname;
});

const routeName = computed(() => {
  if (currentPath.value === "/") return "home";
  if (["/rulebook", "/rule-book"].includes(currentPath.value)) return "rulebook";
  return "not-found";
});
</script>

<template>
  <LandingPage v-if="routeName === 'home'" />
  <DocumentationPage v-else-if="routeName === 'rulebook'" />
  <NotFoundPage v-else />
</template>
