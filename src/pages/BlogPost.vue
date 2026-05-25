<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { marked } from "marked";
import PreviewHeader from "../components/preview/PreviewHeader.vue";
import PreviewFooter from "../components/preview/PreviewFooter.vue";
import DemoModal from "../components/preview/DemoModal.vue";

const showDemo = ref(false);

const route = useRoute();
const router = useRouter();
const modules = import.meta.glob("../content/blog/*.md", { eager: true, query: "?raw", import: "default" });

// Persist and restore scroll position across page refreshes for blog posts,
// so a reader who refreshes mid-article lands back where they were.
// In-app navigation (back / forward / link click) is handled separately by
// Vue Router's scrollBehavior — this only kicks in on a reload of the same URL.
function scrollKey() {
  return `blog-scroll:${route.fullPath}`;
}

let scrollSaveTimer = null;
function onScrollSave() {
  clearTimeout(scrollSaveTimer);
  scrollSaveTimer = setTimeout(() => {
    try {
      sessionStorage.setItem(scrollKey(), String(window.scrollY));
    } catch {
      // ignore quota / privacy errors
    }
  }, 150);
}

onMounted(() => {
  // Only restore on a refresh (reload) — not on regular client-side nav.
  try {
    const nav = performance.getEntriesByType("navigation")[0];
    if (nav && nav.type === "reload") {
      const saved = sessionStorage.getItem(scrollKey());
      if (saved !== null) {
        const y = parseInt(saved, 10);
        // Wait a frame so the post body has laid out before we jump.
        requestAnimationFrame(() => window.scrollTo(0, y));
      }
    }
  } catch {
    // ignore
  }
  window.addEventListener("scroll", onScrollSave, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScrollSave);
  clearTimeout(scrollSaveTimer);
});

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^"(.*)"$/, "$1");
    meta[key] = value;
  }
  return { meta, body: match[2] };
}

const post = computed(() => {
  const slug = route.params.slug;
  const path = `../content/blog/${slug}.md`;
  const raw = modules[path];
  if (!raw) return null;
  const { meta, body } = parseFrontmatter(raw);
  return {
    slug,
    title: meta.title || slug,
    tag: meta.tag || "Blog",
    publishedAt: meta.publishedAt || "",
    readMinutes: meta.readMinutes || 5,
    html: marked.parse(body)
  };
});

watch(post, (p) => {
  if (!p) {
    router.replace({ name: "not-found" });
  }
});
</script>

<template>
  <div v-if="post" class="preview-root post">
    <PreviewHeader @open-demo="showDemo = true" />

    <main>
      <article class="post__inner">
        <p class="post__back"><router-link to="/blog">← All posts</router-link></p>
        <p class="post__tag">{{ post.tag }}</p>
        <h1>{{ post.title }}</h1>
        <p class="post__meta"><time>{{ post.publishedAt }}</time> · {{ post.readMinutes }} min read</p>
        <div class="post__body" v-html="post.html"></div>
      </article>
    </main>

    <PreviewFooter />
    <DemoModal :open="showDemo" @close="showDemo = false" />
  </div>
</template>

<style scoped>
.post {
  min-height: 100vh;
  padding: var(--space-7) var(--space-5) var(--space-9);
}
.post__inner {
  max-width: 720px;
  margin: 0 auto;
}
.post__back a {
  color: var(--brand);
  font-size: 0.92rem;
  border-bottom: 1px dashed currentColor;
}
.post__tag {
  margin-top: var(--space-6);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: var(--brand);
  font-weight: 700;
}
.post h1 {
  margin: var(--space-3) 0 var(--space-4);
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2rem, 4.2vw, 3rem);
  line-height: 1.12;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}
.post__meta {
  color: var(--text-tertiary);
  font-size: 0.9rem;
  margin: 0 0 var(--space-6);
}
.post__body {
  color: var(--text-primary);
  font-size: 1.07rem;
  line-height: 1.72;
}
.post__body :deep(h2) {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 1.85rem;
  line-height: 1.2;
  letter-spacing: -0.01em;
  margin: var(--space-7) 0 var(--space-3);
}
.post__body :deep(h3) {
  font-size: 1.25rem;
  font-weight: 700;
  margin: var(--space-6) 0 var(--space-3);
}
.post__body :deep(p) { margin: 0 0 var(--space-4); color: var(--text-secondary); }
.post__body :deep(ul), .post__body :deep(ol) { margin: 0 0 var(--space-4); padding-left: 1.4rem; color: var(--text-secondary); }
.post__body :deep(li) { margin: 0 0 var(--space-2); }
.post__body :deep(a) {
  color: var(--brand);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.post__body :deep(blockquote) {
  border-left: 3px solid var(--brand);
  padding: 0.3rem 0 0.3rem 1rem;
  color: var(--text-secondary);
  font-style: italic;
  margin: var(--space-5) 0;
}
.post__body :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.92em;
  background: var(--bg-elevated);
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
}
.post__body :deep(pre) {
  background: var(--bg-inset);
  padding: 1rem;
  border-radius: var(--radius-md);
  overflow-x: auto;
  font-size: 0.88rem;
}
</style>
