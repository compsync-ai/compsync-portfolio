<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useTheme } from "../../composables/useTheme";
import brandLogo from "../../assets/logo-compsync.svg";

defineEmits(["open-demo"]);

const { theme, toggleTheme } = useTheme();
const route = useRoute();
const isScrolled = ref(false);

const isBlog = computed(() => route.name === "blog-index" || route.name === "blog-post");

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
      <router-link to="/preview/v1" class="preview-header__brand">
        <img :src="brandLogo" alt="" width="30" height="30" class="preview-header__logo" />
        <span>CompSync</span>
      </router-link>

      <nav class="preview-header__nav" aria-label="Primary navigation">
        <router-link :to="{ path: '/preview/v1', hash: '#platform' }">Platform</router-link>
        <router-link :to="{ path: '/preview/v1', hash: '#workflow' }">Workflow</router-link>
        <router-link :to="{ path: '/preview/v1', hash: '#industries' }">Industries</router-link>
        <router-link to="/blog" :class="{ 'is-active': isBlog }">Blog</router-link>
      </nav>

      <div class="preview-header__actions">
        <button
          type="button"
          class="theme-toggle"
          :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleTheme"
        >
          <span class="theme-toggle__track">
            <span class="theme-toggle__thumb" :class="{ 'theme-toggle__thumb--dark': theme === 'dark' }">
              <!-- Sun icon -->
              <svg v-if="theme === 'dark'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke-linecap="round" />
              </svg>
              <!-- Moon icon -->
              <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </span>
        </button>

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
.preview-header__logo {
  display: block;
  border-radius: 8px;
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
.preview-header__nav a:hover::after,
.preview-header__nav a.is-active::after {
  transform: scaleX(1);
}
.preview-header__nav a.is-active {
  color: var(--brand);
}
.preview-header__actions {
  display: inline-flex;
  align-items: center;
  gap: 0.85rem;
}

/* Theme toggle */
.theme-toggle {
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  width: 52px;
  height: 28px;
  border-radius: 99px;
  position: relative;
}
.theme-toggle__track {
  position: absolute;
  inset: 0;
  border-radius: 99px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  transition: background 240ms ease, border-color 240ms ease;
}
.theme-toggle:hover .theme-toggle__track {
  border-color: var(--brand);
}
.theme-toggle__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 22px;
  height: 22px;
  border-radius: 99px;
  background: var(--bg-surface);
  color: var(--brand);
  display: grid;
  place-items: center;
  transition: transform 320ms var(--ease-spring), background 240ms ease, color 240ms ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
}
.theme-toggle__thumb--dark {
  transform: translateX(24px);
  background: var(--brand);
  color: white;
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
  .preview-header__inner { grid-template-columns: auto 1fr; }
}
</style>
