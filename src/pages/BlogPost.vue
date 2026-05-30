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
    titleHtml: meta.titleHtml || "",
    author: meta.author || "",
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
        <h1 v-if="post.titleHtml" v-html="post.titleHtml"></h1>
        <h1 v-else>{{ post.title }}</h1>
        <p class="post__meta"><template v-if="post.author"><span class="post__byline">By {{ post.author }}</span> · </template><time>{{ post.publishedAt }}</time> · {{ post.readMinutes }} min read</p>
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
}
/* Padding lives on the article body, not on the outer wrapper, so the
   sticky PreviewHeader stays edge-to-edge — same approach as BlogIndex. */
.post > main {
  padding: var(--space-7) var(--space-5) var(--space-9);
}
.post__inner {
  max-width: 880px;
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
  font-size: clamp(1.75rem, 3.4vw, 2.4rem);
  line-height: 1.18;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  max-width: none;
}
.post h1 :deep(.post__brand) {
  color: var(--brand);
}
.post__meta {
  color: var(--text-tertiary);
  font-size: 0.9rem;
  margin: 0 0 var(--space-6);
}
.post__byline {
  color: var(--text-secondary);
  font-weight: 600;
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
.post__body :deep(img) {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  margin: var(--space-5) auto var(--space-6);
}
.post__body :deep(strong) {
  font-weight: 600;
  color: var(--text-primary);
}
.post__body :deep(.post__section) {
  font-weight: 800;
  color: var(--text-primary);
  margin: var(--space-6) 0 var(--space-3);
}
.post__body :deep(hr) {
  border: 0;
  border-top: 1px solid var(--border-subtle);
  margin: var(--space-7) 0 var(--space-5);
}
.post__body :deep(.post__bio) {
  color: var(--text-tertiary);
  font-size: 0.95rem;
  line-height: 1.6;
  font-style: italic;
}

@media (max-width: 720px) {
  /* Trim the very generous bottom padding so the post doesn't leave
     a giant white slab between the bio and the footer on phones. */
  .post > main { padding: var(--space-5) var(--space-4) var(--space-6); }
  .post h1 { font-size: clamp(1.5rem, 6.4vw, 2rem); }
  .post__tag { margin-top: var(--space-4); font-size: 0.72rem; }
  .post__meta { font-size: 0.82rem; margin-bottom: var(--space-5); }
  /* Body type was 17px on phones which read big next to the trim
     header. 16px sits more naturally on small screens. */
  .post__body { font-size: 1rem; line-height: 1.68; }
  .post__body :deep(h2) { font-size: 1.4rem; margin: var(--space-6) 0 var(--space-3); }
  .post__body :deep(h3) { font-size: 1.1rem; }
  .post__body :deep(blockquote) { padding: 0.2rem 0 0.2rem 0.85rem; }
  .post__body :deep(pre) { padding: 0.85rem; font-size: 0.82rem; }
}
</style>
