<script setup>
import { useTheme } from "./composables/useTheme";
// Initialize theme so it applies to <html> on app boot.
useTheme();
</script>

<template>
  <router-view v-slot="{ Component, route: r }">
    <component :is="Component" :key="r.path" />
  </router-view>
</template>
