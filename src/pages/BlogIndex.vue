<script setup>
import { computed, ref } from "vue";
import { blogTeasers } from "../data/project";
import PreviewHeader from "../components/preview/PreviewHeader.vue";
import PreviewFooter from "../components/preview/PreviewFooter.vue";
import DemoModal from "../components/preview/DemoModal.vue";

const showDemo = ref(false);

// Eager-load all markdown posts so we can show metadata for everything
const modules = import.meta.glob("../content/blog/*.md", { eager: true, query: "?raw", import: "default" });

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

const posts = computed(() => {
  const fromMd = Object.entries(modules).map(([path, raw]) => {
    const slug = path.split("/").pop().replace(/\.md$/, "");
    const { meta } = parseFrontmatter(raw);
    return {
      slug,
      title: meta.title || slug,
      excerpt: meta.excerpt || "",
      excerptHtml: meta.excerptHtml || "",
      tag: meta.tag || "Blog",
      readMinutes: Number(meta.readMinutes || 5),
      publishedAt: meta.publishedAt || ""
    };
  });
  // Fall back to teasers if no md files exist
  const list = fromMd.length ? fromMd : blogTeasers;
  return [...list].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
});
</script>

<template>
  <div class="preview-root blog-index">
    <PreviewHeader @open-demo="showDemo = true" />

    <main>
      <header class="blog-index__hero">
        <div class="blog-index__inner">
          <p class="eyebrow">Blog</p>
          <h1>Notes from the CompSync team on compliance, risk, and the future of AML.</h1>
        </div>
      </header>

      <section class="blog-index__list">
        <article v-for="post in posts" :key="post.slug" class="post-card">
          <router-link :to="`/blog/${post.slug}`" class="post-card__link">
            <p class="post-card__tag">{{ post.tag }}</p>
            <h2>{{ post.title }}</h2>
            <p v-if="post.excerptHtml" class="post-card__excerpt" v-html="post.excerptHtml"></p>
            <p v-else class="post-card__excerpt">{{ post.excerpt }}</p>
            <footer class="post-card__meta">
              <time>{{ post.publishedAt }}</time>
              <span>· {{ post.readMinutes }} min read</span>
            </footer>
          </router-link>
        </article>
      </section>

      <p class="blog-index__back">
        <router-link to="/">← Back to CompSync</router-link>
      </p>
    </main>

    <PreviewFooter />
    <DemoModal :open="showDemo" @close="showDemo = false" />
  </div>
</template>

<style scoped>
.blog-index {
  min-height: 100vh;
  padding-bottom: var(--space-9);
}
.blog-index__hero {
  padding: var(--space-9) var(--space-5) var(--space-7);
  background: linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg-canvas) 100%);
  border-bottom: 1px solid var(--border-subtle);
}
.blog-index__inner {
  max-width: 880px;
  margin: 0 auto;
}
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.78rem;
  color: var(--brand);
  font-weight: 700;
  margin: 0 0 var(--space-3);
}
.blog-index__hero h1 {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.6vw, 3.4rem);
  line-height: 1.12;
  letter-spacing: -0.02em;
  margin: 0 0 var(--space-4);
  font-weight: 400;
  max-width: 22ch;
  color: var(--text-primary);
}
.lead {
  color: var(--text-secondary);
  font-size: 1.05rem;
  max-width: 60ch;
  margin: 0;
}
.blog-index__list {
  max-width: 880px;
  margin: var(--space-7) auto 0;
  padding: 0 var(--space-5);
  display: grid;
  gap: var(--space-5);
}
.post-card {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  transition: transform 240ms var(--ease-out-quint), box-shadow 240ms var(--ease-out-quint), border-color 240ms ease;
}
.post-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-default);
}
.post-card__link {
  display: block;
  padding: var(--space-5) var(--space-6);
  color: inherit;
}
.post-card__tag {
  margin: 0 0 var(--space-2);
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--brand);
  font-weight: 600;
}
.post-card h2 {
  margin: 0 0 var(--space-3);
  font-size: 1.3rem;
  line-height: 1.32;
  letter-spacing: -0.005em;
  color: var(--text-primary);
}
.post-card__excerpt {
  margin: 0 0 var(--space-4);
  color: var(--text-secondary);
  line-height: 1.6;
}
.post-card__meta {
  display: flex;
  gap: var(--space-2);
  font-size: 0.84rem;
  color: var(--text-tertiary);
}
.blog-index__back {
  text-align: center;
  margin: var(--space-8) 0 0;
  font-size: 0.9rem;
}
.blog-index__back a {
  color: var(--brand);
  border-bottom: 1px dashed currentColor;
}

@media (max-width: 720px) {
  /* Hero was 96px top / 48px bottom — way too generous for a phone screen.
     Trim and let the title settle on three readable lines. */
  .blog-index__hero { padding: var(--space-6) var(--space-4) var(--space-5); }
  .blog-index__hero h1 { font-size: clamp(1.6rem, 6.8vw, 2.2rem); }
  .blog-index__list { margin-top: var(--space-5); padding: 0 var(--space-4); gap: var(--space-4); }
  /* Reduce card padding so titles get more horizontal room and don't
     wrap into 4-5 line stacks on phones. */
  .post-card__link { padding: var(--space-4) var(--space-4); }
  .post-card h2 { font-size: 1.05rem; line-height: 1.3; }
  .post-card__excerpt { font-size: 0.92rem; }
  .post-card__meta { font-size: 0.78rem; }
}
</style>
