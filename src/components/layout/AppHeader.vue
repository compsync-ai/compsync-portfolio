<script setup>
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
        <a class="btn btn--ghost" href="#contact">Book Demo</a>
      </div>
    </div>
  </header>
</template>
