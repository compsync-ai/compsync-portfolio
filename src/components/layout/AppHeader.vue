<script setup>
const emit = defineEmits(["open-demo"]);

defineProps({
  links: {
    type: Array,
    default: () => []
  }
});
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner container">
      <a class="brand" href="#">
        <span class="brand__dot"></span>
        <span class="brand__text">compsync.ai</span>
      </a>

      <nav class="site-nav" aria-label="Primary navigation">
        <a v-for="link in links" :key="link.href" :href="link.href">{{ link.label }}</a>
      </nav>

      <div class="site-header__actions">
        <button type="button" class="btn btn--ghost" @click="emit('open-demo')">
          Book Demo
        </button>
      </div>
    </div>
  </header>
</template>
