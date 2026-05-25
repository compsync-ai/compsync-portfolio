<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  variant: { type: String, default: "light" }
});
defineEmits(["open-demo"]);

const isScrolled = ref(false);

function onScroll() {
  isScrolled.value = window.scrollY > 24;
}

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<template>
  <header class="preview-header" :class="{ 'preview-header--scrolled': isScrolled }">
    <div class="preview-header__inner">
      <router-link to="/" class="preview-header__brand">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="9" fill="var(--brand)" />
          <path d="M9 16.5L13.5 21L23 11.5" stroke="white" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>CompSync</span>
      </router-link>

      <nav class="preview-header__nav" aria-label="Primary navigation">
        <a href="#platform">Platform</a>
        <a href="#workflow">Workflow</a>
        <a href="#industries">Industries</a>
        <router-link to="/blog">Insights</router-link>
      </nav>

      <div class="preview-header__actions">
        <router-link :to="variant === 'dark' ? '/preview/light' : '/preview/dark'" class="preview-header__theme-swap">
          <span v-if="variant === 'dark'">View light</span>
          <span v-else>View dark</span>
        </router-link>
        <button type="button" class="btn-primary" @click="$emit('open-demo')">
          Book a demo
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.preview-header {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(14px) saturate(180%);
  -webkit-backdrop-filter: blur(14px) saturate(180%);
  background: color-mix(in srgb, var(--bg-canvas) 70%, transparent);
  border-bottom: 1px solid transparent;
  transition: border-color 220ms ease, background 220ms ease;
}
.preview-header--scrolled {
  border-bottom-color: var(--border-subtle);
  background: color-mix(in srgb, var(--bg-canvas) 88%, transparent);
}
.preview-header__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.85rem 1.5rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1.5rem;
}
.preview-header__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  font-size: 1.05rem;
  color: var(--text-primary);
}
.preview-header__nav {
  justify-self: center;
  display: inline-flex;
  gap: 1.8rem;
  font-size: 0.92rem;
  color: var(--text-secondary);
  font-weight: 500;
}
.preview-header__nav a {
  position: relative;
  padding: 0.4rem 0.2rem;
  color: inherit;
  transition: color 180ms ease;
}
.preview-header__nav a::after {
  content: "";
  position: absolute;
  bottom: 0.2rem;
  left: 0.2rem;
  right: 0.2rem;
  height: 1px;
  background: var(--brand);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 220ms var(--ease-out-quint);
}
.preview-header__nav a:hover {
  color: var(--text-primary);
}
.preview-header__nav a:hover::after {
  transform: scaleX(1);
}
.preview-header__actions {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
}
.preview-header__theme-swap {
  font-size: 0.85rem;
  color: var(--text-tertiary);
  padding: 0.4rem 0.7rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-subtle);
  transition: color 180ms ease, border-color 180ms ease;
}
.preview-header__theme-swap:hover {
  color: var(--brand);
  border-color: var(--brand);
}
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: var(--brand);
  color: white;
  border: 0;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: var(--radius-pill);
  box-shadow: 0 6px 18px var(--brand-glow);
  cursor: pointer;
  transition: transform 180ms var(--ease-out-quint), box-shadow 220ms ease, background 220ms ease;
}
.btn-primary:hover {
  transform: translateY(-1px);
  background: var(--brand-bright);
  box-shadow: 0 10px 24px var(--brand-glow);
}
.btn-primary svg {
  transition: transform 220ms var(--ease-out-quint);
}
.btn-primary:hover svg {
  transform: translateX(3px);
}

@media (max-width: 880px) {
  .preview-header__nav { display: none; }
  .preview-header__theme-swap { display: none; }
  .preview-header__inner { grid-template-columns: auto 1fr; }
}
</style>
