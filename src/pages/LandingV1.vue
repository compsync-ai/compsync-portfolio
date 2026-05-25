<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import PreviewHeader from "../components/preview/PreviewHeader.vue";
import PreviewFooter from "../components/preview/PreviewFooter.vue";
import DemoModal from "../components/preview/DemoModal.vue";
import WorkflowDataflow from "../components/preview/WorkflowDataflow.vue";
import ParticleNetwork from "../components/effects/ParticleNetwork.vue";
import DashboardMock from "../components/platform/DashboardMock.vue";
import AlertDrawerMock from "../components/platform/AlertDrawerMock.vue";
import reportsImage from "../assets/images/platform/reports-page.png";
import { gsap } from "gsap";
import { useTheme } from "../composables/useTheme";
import {
  heroHeadline,
  industries,
  platformPillars,
  trustBar,
  blogTeasers
} from "../data/project";

const { theme } = useTheme();
const showDemo = ref(false);
const heroRef = ref(null);
const headlineRef = ref(null);
const productRef = ref(null);
const bentoRef = ref(null);

const animatedKpis = ref([
  { label: "Average case triage", target: 45, suffix: "s", value: 0 },
  { label: "Alert → SAR rate", target: 5, suffix: "%", value: 0 },
  { label: "Rule packs deployed", target: 30, suffix: "+", value: 0 }
]);

// Typewriter state for the four bento card metrics.
// Each entry tracks the text typed so far + whether the cursor should blink.
const metricsTyped = ref(platformPillars.map(() => ""));
const metricsTyping = ref(platformPillars.map(() => false));
let typewriterStarted = false;
let typewriterObserver = null;
let typewriterTimeouts = [];
let isAlive = true;

let reveals = [];
let kpiTl = null;

function startTypewriter() {
  if (typewriterStarted) return;
  typewriterStarted = true;

  const charDelay = 50;       // ms per character
  const interCellDelay = 320; // pause between cells after one finishes
  let cumulativeMs = 500;     // initial delay after the cells fade in

  platformPillars.forEach((pillar, idx) => {
    const text = pillar.metric;
    const startT = setTimeout(() => {
      if (!isAlive) return;
      metricsTyping.value[idx] = true;
      let char = 0;
      const typeNext = () => {
        if (!isAlive) return;
        char += 1;
        metricsTyped.value[idx] = text.slice(0, char);
        if (char < text.length) {
          const t = setTimeout(typeNext, charDelay);
          typewriterTimeouts.push(t);
        } else {
          // Done typing this cell — leave the cursor for a beat then hide.
          const t = setTimeout(() => {
            if (!isAlive) return;
            metricsTyping.value[idx] = false;
          }, 260);
          typewriterTimeouts.push(t);
        }
      };
      typeNext();
    }, cumulativeMs);
    typewriterTimeouts.push(startT);
    cumulativeMs += text.length * charDelay + interCellDelay;
  });
}

function startKpiCount() {
  if (kpiTl) return;
  kpiTl = gsap.timeline();
  animatedKpis.value.forEach((kpi, i) => {
    const proxy = { v: 0 };
    kpiTl.to(proxy, {
      v: kpi.target,
      duration: 1.4,
      ease: "power3.out",
      onUpdate: () => {
        animatedKpis.value[i].value = Math.round(proxy.v * 10) / 10;
      }
    }, i * 0.18);
  });
}

onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  if (headlineRef.value) {
    tl.from(headlineRef.value.querySelectorAll(".lp-hero__eyebrow, .lp-hero__title, .lp-hero__lead, .lp-hero__cta, .lp-hero__trust"), {
      y: 26,
      opacity: 0,
      duration: 0.95,
      stagger: 0.12
    });
  }
  if (productRef.value) {
    tl.from(productRef.value, { y: 40, opacity: 0, duration: 1.1, ease: "power4.out" }, "-=0.5");
  }

  const revealEls = document.querySelectorAll(".lp-reveal");
  reveals = Array.from(revealEls).map((el) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            gsap.to(el, { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" });
            if (el.dataset.lpStartKpis === "true") startKpiCount();
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.18 }
    );
    gsap.set(el, { y: 30, opacity: 0 });
    observer.observe(el);
    return observer;
  });

  // Trigger the bento metric typewriter once the cell grid is in view.
  if (bentoRef.value) {
    typewriterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            startTypewriter();
            typewriterObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    typewriterObserver.observe(bentoRef.value);
  }
});

onBeforeUnmount(() => {
  isAlive = false;
  reveals.forEach((o) => o.disconnect());
  kpiTl?.kill();
  typewriterObserver?.disconnect();
  typewriterTimeouts.forEach((t) => clearTimeout(t));
  typewriterTimeouts = [];
});
</script>

<template>
  <div class="preview-root lp">
    <PreviewHeader @open-demo="showDemo = true" />

    <main>
      <!-- HERO -->
      <section ref="heroRef" class="lp-hero" id="platform">
        <div class="lp-hero__bg">
          <ParticleNetwork :variant="theme" :particle-count="130" :max-connections="3" :connection-distance="1.3" />
          <div class="lp-hero__grid"></div>
          <div class="lp-hero__mesh"></div>
        </div>

        <div class="lp-hero__inner" ref="headlineRef">
          <div class="lp-hero__copy">
            <p class="lp-hero__eyebrow">
              <span class="lp-hero__eyebrow-dot"></span>
              {{ heroHeadline.eyebrow }}
            </p>
            <h1 class="lp-hero__title">
              <span>Real-time</span>
              <span class="lp-hero__title-accent">transaction monitoring</span>
              <span>with audit trails examiners&nbsp;trust.</span>
            </h1>
            <p class="lp-hero__lead">{{ heroHeadline.lead }}</p>
            <div class="lp-hero__cta">
              <button type="button" class="lp-btn lp-btn--primary" @click="showDemo = true">
                Book a demo
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <a href="#workflow" class="lp-btn lp-btn--ghost">See how it works</a>
            </div>
            <ul class="lp-hero__trust">
              <li v-for="item in trustBar" :key="item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8">
                  <path d="M4 12L9 17L20 6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                {{ item }}
              </li>
            </ul>
          </div>
        </div>

        <div ref="productRef" class="lp-hero__product">
          <div class="lp-hero__product-glow"></div>
          <DashboardMock :variant="theme" />
        </div>
      </section>

      <!-- METRIC BAR -->
      <section class="lp-metrics lp-reveal" data-lp-start-kpis="true">
        <div class="lp-metrics__inner">
          <div v-for="(kpi, i) in animatedKpis" :key="i" class="lp-metric">
            <p class="lp-metric__value">
              <span v-if="kpi.label === 'Average case triage'">&lt;</span>{{ kpi.value }}<span class="lp-metric__suffix">{{ kpi.suffix }}</span>
            </p>
            <p class="lp-metric__label">{{ kpi.label }}</p>
          </div>
          <div class="lp-metric">
            <p class="lp-metric__value lp-metric__value--text">Early access</p>
            <p class="lp-metric__label">Product stage</p>
          </div>
        </div>
      </section>

      <!-- PILLARS BENTO -->
      <section class="lp-section">
        <div class="lp-container">
          <div class="lp-section-head lp-reveal">
            <p class="lp-eyebrow">The platform</p>
            <h2>Everything a compliance team needs, assembled, not glued together.</h2>
            <p class="lp-section-sub">
              One layer for monitoring, scoring, casework, and reporting.
            </p>
          </div>

          <div class="lp-bento" ref="bentoRef">
            <article v-for="(pillar, i) in platformPillars" :key="pillar.title" class="lp-bento__cell lp-reveal" :class="`lp-bento__cell--${i}`">
              <div class="lp-bento__tag">
                <span
                  class="lp-bento__dot"
                  :class="{ 'lp-bento__dot--beat': metricsTyping[i] }"
                ></span>
                {{ pillar.tag }}
              </div>
              <h3>{{ pillar.title }}</h3>
              <p>{{ pillar.body }}</p>
              <p class="lp-bento__metric" :aria-label="pillar.metric">
                <span aria-hidden="true">{{ metricsTyped[i] }}</span><span
                  v-if="metricsTyping[i]"
                  class="lp-bento__cursor"
                  aria-hidden="true"
                ></span>
              </p>
            </article>
          </div>
        </div>
      </section>

      <!-- WORKFLOW -->
      <section class="lp-section lp-workflow" id="workflow">
        <div class="lp-container">
          <div class="lp-section-head lp-reveal">
            <p class="lp-eyebrow">The workflow</p>
            <h2>From raw transactions to investigation-ready cases in minutes.</h2>
          </div>
          <div class="lp-reveal">
            <WorkflowDataflow :variant="theme" />
          </div>
        </div>
      </section>

      <!-- INVESTIGATION SHOWCASE -->
      <section class="lp-section lp-invest">
        <div class="lp-container lp-invest__inner">
          <div class="lp-invest__copy lp-reveal">
            <p class="lp-eyebrow">Investigation, not triage</p>
            <h2>Every alert arrives investigation-ready.</h2>
            <p class="lp-section-sub">
              Entity context, triggered transaction, rule fired, score breakdown, suggested next steps. One screen, full audit trail.
            </p>
            <ul class="lp-invest__list">
              <li><strong>Explainable scoring.</strong> Every score traces to a rule, a signal, and a threshold.</li>
              <li><strong>Guided checklist.</strong> Investigation steps mapped to your program's policy.</li>
              <li><strong>Shadow new rules.</strong> Test against historical traffic before going live.</li>
              <li><strong>Audit-grade log.</strong> Every analyst action, model output, and disposition recorded.</li>
            </ul>
          </div>
          <div class="lp-invest__product lp-reveal">
            <AlertDrawerMock :variant="theme" />
          </div>
        </div>
      </section>

      <!-- REPORTING SHOWCASE -->
      <section class="lp-section lp-reporting">
        <div class="lp-container lp-reporting__inner">
          <div class="lp-reporting__copy lp-reveal">
            <p class="lp-eyebrow">Reporting &amp; Audit Trail</p>
            <h2>Program health you can hand to your board.</h2>
            <p class="lp-section-sub">
              FFIEC-aligned metrics, full audit trail, one-click examiner exports.
            </p>
            <ul class="lp-reporting__bullets">
              <li><strong>Program health score.</strong> FFIEC examiner-readiness at a glance.</li>
              <li><strong>Aging and funnel.</strong> See where alerts sit and how they convert to cases and SARs.</li>
              <li><strong>BPI benchmarks.</strong> Compare your SAR rate against bank-wide ranges.</li>
              <li><strong>Audit-ready exports.</strong> One click to a PDF you can hand an examiner.</li>
            </ul>
          </div>
          <div class="lp-reporting__product lp-reveal">
            <div class="lp-window">
              <header class="lp-window__chrome">
                <span class="lp-window__dot"></span>
                <span class="lp-window__dot"></span>
                <span class="lp-window__dot"></span>
                <span class="lp-window__url">compsync.us/dashboard/reports</span>
              </header>
              <div class="lp-window__viewport">
                <img :src="reportsImage" alt="CompSync Reports page showing Program Health score, FFIEC metrics, alert aging distribution, and SAR conversion funnel" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- INDUSTRIES -->
      <section class="lp-section lp-industries" id="industries">
        <div class="lp-container">
          <div class="lp-section-head lp-reveal">
            <p class="lp-eyebrow">Built for</p>
            <h2>The compliance stack, wherever you live in financial services.</h2>
          </div>

          <div class="lp-industries__grid">
            <article v-for="ind in industries" :key="ind.key" class="lp-industry lp-reveal">
              <h3>{{ ind.title }}</h3>
              <p>{{ ind.summary }}</p>
              <ul>
                <li v-for="need in ind.needs" :key="need">
                  <span class="lp-industry__dot"></span>{{ need }}
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <!-- BLOG -->
      <section class="lp-section lp-blog">
        <div class="lp-container">
          <div class="lp-section-head lp-reveal">
            <p class="lp-eyebrow">Blog</p>
            <h2>Field notes from the CompSync team.</h2>
            <p class="lp-section-sub">Trends, deep-dives, and playbooks.</p>
          </div>
          <div class="lp-blog__grid">
            <router-link v-for="post in blogTeasers" :key="post.slug" :to="`/blog/${post.slug}`" class="lp-blog__card lp-reveal">
              <p class="lp-blog__tag">{{ post.tag }}</p>
              <h3>{{ post.title }}</h3>
              <p class="lp-blog__excerpt">{{ post.excerpt }}</p>
              <p class="lp-blog__meta">
                <time>{{ post.publishedAt }}</time>
                <span>· {{ post.readMinutes }} min read</span>
              </p>
            </router-link>
          </div>
          <p class="lp-blog__all">
            <router-link to="/blog">Read all posts →</router-link>
          </p>
        </div>
      </section>
    </main>

    <PreviewFooter />
    <DemoModal :open="showDemo" @close="showDemo = false" />
  </div>
</template>

<style>
.lp {
  background: var(--bg-canvas);
  color: var(--text-primary);
  font-family: var(--font-sans);
  overflow-x: clip;
  transition: background 320ms ease, color 320ms ease;
}

/* ============== HERO ============== */
.lp-hero {
  position: relative;
  padding: clamp(3rem, 8vw, 6.5rem) 1.5rem 4rem;
  isolation: isolate;
}
.lp-hero__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
}
.lp-hero__grid {
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(0deg, transparent, transparent 39px, var(--grid-line) 39px, var(--grid-line) 40px),
    repeating-linear-gradient(90deg, transparent, transparent 39px, var(--grid-line) 39px, var(--grid-line) 40px);
  mask-image: radial-gradient(ellipse 80% 90% at 50% 50%, black 35%, transparent 85%);
  -webkit-mask-image: radial-gradient(ellipse 80% 90% at 50% 50%, black 35%, transparent 85%);
}
.lp-hero__mesh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 55% 45% at 18% 28%, var(--mesh-1) 0%, transparent 60%),
    radial-gradient(ellipse 50% 35% at 85% 18%, var(--mesh-2) 0%, transparent 55%),
    radial-gradient(ellipse 70% 50% at 50% 100%, var(--mesh-1) 0%, transparent 70%);
  pointer-events: none;
}
.theme-dark .lp-hero__bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, var(--bg-canvas) 0%, transparent 50%, transparent 50%, var(--bg-canvas) 100%);
  pointer-events: none;
}

.lp-hero__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 0 3rem;
  position: relative;
}
.lp-hero__copy { max-width: 920px; }

.lp-hero__eyebrow {
  margin: 0 0 1.3rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.34rem 0.9rem;
  border-radius: 99px;
  background: color-mix(in srgb, var(--brand) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--brand) 25%, transparent);
  color: var(--brand);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.theme-dark .lp-hero__eyebrow { color: #2dd4bf; border-color: rgba(45, 212, 191, 0.35); }
.lp-hero__eyebrow-dot {
  width: 6px;
  height: 6px;
  border-radius: 99px;
  background: var(--brand);
  animation: lpPulse 1.8s ease-in-out infinite;
}
.theme-dark .lp-hero__eyebrow-dot { background: #2dd4bf; box-shadow: 0 0 12px #2dd4bf; }

.lp-hero__title {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1em;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2.4rem, 5.8vw, 4.4rem);
  line-height: 1.05;
  letter-spacing: -0.025em;
  color: var(--text-primary);
}
.lp-hero__title-accent {
  font-style: italic;
  background: linear-gradient(90deg, var(--brand-bright) 0%, var(--brand) 60%, var(--brand-deep) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.theme-dark .lp-hero__title-accent {
  background: linear-gradient(90deg, #2dd4bf 0%, #0f8f7a 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.lp-hero__lead {
  margin: 1.4rem 0 0;
  max-width: 56ch;
  color: var(--text-secondary);
  font-size: 1.12rem;
  line-height: 1.62;
}
.lp-hero__cta {
  margin: 1.8rem 0 0;
  display: flex;
  gap: 0.85rem;
  flex-wrap: wrap;
}
.lp .lp-hero__trust {
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
  display: flex;
  gap: 1.4rem;
  flex-wrap: wrap;
  color: var(--text-tertiary);
  font-size: 0.86rem;
}
.lp-hero__trust li {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}
.lp-hero__trust svg { color: var(--brand); }
.theme-dark .lp-hero__trust svg { color: #2dd4bf; }

.lp-hero__product {
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
}
.lp-hero__product-glow {
  position: absolute;
  inset: -30px -30px -60px;
  background:
    radial-gradient(ellipse 50% 30% at 50% 50%, color-mix(in srgb, var(--brand) 22%, transparent) 0%, transparent 70%),
    radial-gradient(ellipse 70% 40% at 50% 100%, color-mix(in srgb, var(--brand) 12%, transparent) 0%, transparent 70%);
  filter: blur(36px);
  z-index: -1;
}
.theme-dark .lp-hero__product-glow {
  background:
    radial-gradient(ellipse 50% 30% at 50% 50%, rgba(15, 143, 122, 0.35) 0%, transparent 70%),
    radial-gradient(ellipse 70% 40% at 50% 100%, rgba(45, 212, 191, 0.22) 0%, transparent 70%);
  filter: blur(40px);
}

/* Buttons */
.lp-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.78rem 1.3rem;
  border-radius: 99px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  border: 0;
  transition: transform 200ms var(--ease-out-quint), background 220ms ease, box-shadow 220ms ease;
  text-decoration: none;
}
.lp-btn--primary {
  background: var(--brand);
  color: white;
  box-shadow: 0 12px 30px var(--brand-glow);
}
.lp-btn--primary:hover {
  transform: translateY(-2px);
  background: var(--brand-bright);
  box-shadow: 0 18px 42px var(--brand-glow);
}
.lp-btn--ghost {
  background: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
}
.theme-dark .lp-btn--ghost {
  background: rgba(45, 212, 191, 0.08);
  border-color: rgba(45, 212, 191, 0.35);
  color: #2dd4bf;
}
.lp-btn--ghost:hover { border-color: var(--brand); color: var(--brand); background: var(--bg-elevated); }
.theme-dark .lp-btn--ghost:hover {
  border-color: #2dd4bf;
  color: #2dd4bf;
  background: rgba(45, 212, 191, 0.15);
}
.lp-btn--xl { padding: 1rem 1.6rem; font-size: 1rem; }
.lp-btn svg { transition: transform 220ms var(--ease-out-quint); }
.lp-btn:hover svg { transform: translateX(3px); }

/* ============== METRICS BAR ============== */
.lp-metrics {
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
  background: linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg-canvas) 100%);
  padding: 2.6rem 1.5rem;
}
.lp-metrics__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}
.lp-metric { display: grid; gap: 0.35rem; }
.lp-metric__value {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2rem, 3.4vw, 2.8rem);
  line-height: 1;
  color: var(--text-primary);
  font-feature-settings: "tnum";
}
.lp-metric__value--text { font-size: clamp(1.4rem, 2.4vw, 1.9rem); }
.lp-metric__suffix {
  font-size: 0.65em;
  color: var(--brand);
  margin-left: 0.08em;
}
.theme-dark .lp-metric__suffix { color: #2dd4bf; }
.lp-metric__label {
  margin: 0;
  color: var(--text-tertiary);
  font-size: 0.86rem;
}

/* ============== SECTION SHELL ============== */
.lp-section {
  padding: clamp(4rem, 8vw, 7rem) 1.5rem;
}
.lp-container {
  max-width: 1280px;
  margin: 0 auto;
}
.lp-eyebrow {
  margin: 0 0 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.78rem;
  color: var(--brand);
  font-weight: 700;
}
.theme-dark .lp-eyebrow { color: #2dd4bf; }
.lp-section-head {
  max-width: 720px;
  margin-bottom: 3rem;
}
.lp-section-head h2 {
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.8rem, 3.6vw, 2.8rem);
  line-height: 1.15;
  letter-spacing: -0.015em;
  color: var(--text-primary);
}
.lp-section-sub {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1.02rem;
  line-height: 1.65;
  max-width: 56ch;
}

/* ============== BENTO ============== */
.lp-bento {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 1fr;
  gap: 1rem;
}
.lp-bento__cell {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 1.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  position: relative;
  overflow: hidden;
  transition: transform 280ms var(--ease-out-quint), border-color 280ms ease, box-shadow 280ms ease, background 280ms ease;
}
/* Hover sheen — radial green wash from bottom-left that fades in. */
.lp-bento__cell::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 110% 90% at 30% 110%, color-mix(in srgb, var(--brand) 16%, transparent) 0%, transparent 60%),
    linear-gradient(135deg, color-mix(in srgb, var(--brand) 6%, transparent) 0%, transparent 55%);
  opacity: 0;
  transition: opacity 520ms var(--ease-out-quint);
  pointer-events: none;
  z-index: 0;
}
.lp-bento__cell > * { position: relative; z-index: 1; }
.lp-bento__cell:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--brand) 40%, transparent);
  box-shadow:
    0 18px 42px color-mix(in srgb, var(--brand) 15%, transparent),
    0 4px 12px color-mix(in srgb, var(--brand) 10%, transparent),
    0 0 0 1px color-mix(in srgb, var(--brand) 18%, transparent);
}
.lp-bento__cell:hover::before { opacity: 1; }
.theme-dark .lp-bento__cell::before {
  background:
    radial-gradient(ellipse 110% 90% at 30% 110%, rgba(45, 212, 191, 0.18) 0%, transparent 60%),
    linear-gradient(135deg, rgba(45, 212, 191, 0.09) 0%, transparent 55%);
}
.theme-dark .lp-bento__cell {
  background: linear-gradient(180deg, rgba(15, 143, 122, 0.06) 0%, var(--bg-surface) 100%);
}
.theme-dark .lp-bento__cell:hover {
  border-color: rgba(45, 212, 191, 0.35);
  box-shadow:
    0 22px 50px rgba(45, 212, 191, 0.22),
    0 6px 16px rgba(45, 212, 191, 0.13),
    0 0 0 1px rgba(45, 212, 191, 0.26);
}
.theme-dark .lp-bento__cell::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(45, 212, 191, 0.18) 0%, transparent 70%);
  transform: translate(40%, -40%);
  pointer-events: none;
}
.lp-bento__cell--0 { grid-column: span 4; }
.lp-bento__cell--1 { grid-column: span 2; }
.lp-bento__cell--2 { grid-column: span 2; }
.lp-bento__cell--3 { grid-column: span 4; }

.theme-light .lp-bento__cell--0,
.theme-light .lp-bento__cell--3 {
  background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-elevated) 100%);
}

.lp-bento__tag {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.74rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--brand);
  font-weight: 700;
}
.theme-dark .lp-bento__tag { color: #2dd4bf; }
.lp-bento__dot {
  width: 5px;
  height: 5px;
  border-radius: 99px;
  background: var(--brand);
  transform-origin: center;
}
.theme-dark .lp-bento__dot { background: #2dd4bf; box-shadow: 0 0 10px #2dd4bf; }
/* Heartbeat — only while the typewriter is actively writing this cell. */
.lp-bento__dot--beat {
  animation: lpHeartbeat 1.15s ease-in-out infinite;
}
@keyframes lpHeartbeat {
  0%, 70%, 100% { transform: scale(1); }
  14%          { transform: scale(1.55); }
  28%          { transform: scale(1); }
  42%          { transform: scale(1.35); }
}
.lp-bento__cell h3 {
  margin: 0.2rem 0 0;
  font-size: 1.22rem;
  font-weight: 700;
  letter-spacing: -0.005em;
  color: var(--text-primary);
}
.lp-bento__cell p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.94rem;
  line-height: 1.6;
}
.lp-bento__metric {
  margin-top: auto !important;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--brand) !important;
  padding-top: 0.8rem;
  border-top: 1px dashed var(--border-default);
  min-height: calc(0.8rem + 1.5em); /* reserve height so cell layout doesn't jump while typing */
  white-space: nowrap;
}
.theme-dark .lp-bento__metric { color: #2dd4bf !important; border-top-color: rgba(45, 212, 191, 0.25); }
.lp-bento__cursor {
  display: inline-block;
  width: 0.55ch;
  height: 1em;
  vertical-align: -2px;
  margin-left: 2px;
  background: currentColor;
  animation: lpCursorBlink 0.85s steps(1) infinite;
}
@keyframes lpCursorBlink {
  50% { opacity: 0; }
}

/* ============== INVESTIGATION ============== */
.lp-invest__inner {
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: 4rem;
  align-items: center;
}
.lp-invest__list {
  margin: 1.6rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.7rem;
  color: var(--text-secondary);
  font-size: 0.96rem;
  line-height: 1.55;
}
.lp-invest__list li {
  padding-left: 1.4rem;
  position: relative;
}
.lp-invest__list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.55rem;
  width: 7px;
  height: 7px;
  border-radius: 99px;
  background: var(--brand);
}
.theme-dark .lp-invest__list li::before {
  background: var(--brand);
  box-shadow: 0 0 12px var(--brand);
}
.lp-invest__list strong { color: var(--text-primary); }

/* ============== REPORTING ============== */
.lp-reporting__inner {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 4rem;
  align-items: center;
}
.lp-reporting__bullets {
  margin: 1.6rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.7rem;
  color: var(--text-secondary);
  font-size: 0.96rem;
  line-height: 1.55;
}
.lp-reporting__bullets li {
  padding-left: 1.4rem;
  position: relative;
}
.lp-reporting__bullets li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.55rem;
  width: 7px;
  height: 7px;
  border-radius: 99px;
  background: var(--brand);
}
.theme-dark .lp-reporting__bullets li::before { box-shadow: 0 0 12px var(--brand); }
.lp-reporting__bullets strong { color: var(--text-primary); }

.lp-window {
  border-radius: 14px;
  border: 1px solid var(--border-default);
  background: var(--bg-surface);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}
.theme-dark .lp-window {
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(45, 212, 191, 0.12);
}
.lp-window__chrome {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 0.85rem;
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border-subtle);
}
.lp-window__dot {
  width: 10px;
  height: 10px;
  border-radius: 99px;
  background: var(--text-tertiary);
  opacity: 0.35;
}
.lp-window__dot:nth-child(1) { background: #ef4444; opacity: 0.8; }
.lp-window__dot:nth-child(2) { background: #f59e0b; opacity: 0.8; }
.lp-window__dot:nth-child(3) { background: #10b981; opacity: 0.8; }
.lp-window__url {
  margin-left: 0.9rem;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  color: var(--text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.lp-window__viewport {
  position: relative;
  max-height: 520px;
  overflow: hidden;
  background: #ffffff;
}
.lp-window__viewport::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 120px;
  background: linear-gradient(180deg, transparent 0%, var(--bg-surface) 100%);
  pointer-events: none;
}
.lp-window__viewport img {
  display: block;
  width: 100%;
  height: auto;
  transition: transform 720ms var(--ease-out-quint);
}
.lp-window:hover .lp-window__viewport img {
  transform: translateY(-50px);
}

/* ============== INDUSTRIES ============== */
.lp-industries__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
.lp-industry {
  padding: 1.6rem 1.5rem;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
  display: grid;
  gap: 0.8rem;
  position: relative;
  overflow: hidden;
  transition: transform 280ms var(--ease-out-quint), border-color 280ms ease, box-shadow 280ms ease, background 280ms ease;
}
/* Same hover sheen as the bento cells, kept light-intensity. */
.lp-industry::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 110% 90% at 30% 110%, color-mix(in srgb, var(--brand) 16%, transparent) 0%, transparent 60%),
    linear-gradient(135deg, color-mix(in srgb, var(--brand) 6%, transparent) 0%, transparent 55%);
  opacity: 0;
  transition: opacity 520ms var(--ease-out-quint);
  pointer-events: none;
  z-index: 0;
}
.lp-industry > * { position: relative; z-index: 1; }
.lp-industry:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--brand) 40%, transparent);
  box-shadow:
    0 18px 42px color-mix(in srgb, var(--brand) 15%, transparent),
    0 4px 12px color-mix(in srgb, var(--brand) 10%, transparent),
    0 0 0 1px color-mix(in srgb, var(--brand) 18%, transparent);
}
.lp-industry:hover::before { opacity: 1; }
.theme-dark .lp-industry::before {
  background:
    radial-gradient(ellipse 110% 90% at 30% 110%, rgba(45, 212, 191, 0.18) 0%, transparent 60%),
    linear-gradient(135deg, rgba(45, 212, 191, 0.09) 0%, transparent 55%);
}
.theme-dark .lp-industry:hover {
  border-color: rgba(45, 212, 191, 0.35);
  box-shadow:
    0 22px 50px rgba(45, 212, 191, 0.22),
    0 6px 16px rgba(45, 212, 191, 0.13),
    0 0 0 1px rgba(45, 212, 191, 0.26);
}
.lp-industry h3 {
  margin: 0;
  font-size: 1.08rem;
  font-weight: 700;
}
.lp-industry > p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.92rem;
  line-height: 1.55;
}
.lp-industry ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: var(--text-tertiary);
}
.lp-industry ul li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.lp-industry__dot {
  width: 4px;
  height: 4px;
  border-radius: 99px;
  background: var(--brand);
}

/* ============== BLOG ============== */
.lp-blog__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
}
.lp-blog__card {
  display: grid;
  gap: 0.55rem;
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
  color: inherit;
  transition: transform 280ms var(--ease-out-quint), border-color 280ms ease, box-shadow 280ms ease;
}
.lp-blog__card:hover {
  transform: translateY(-3px);
  border-color: var(--brand);
  box-shadow: var(--shadow-md);
}
.theme-dark .lp-blog__card:hover { border-color: rgba(45, 212, 191, 0.4); }
.lp-blog__tag {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  color: var(--brand);
  font-weight: 700;
}
.theme-dark .lp-blog__tag { color: #2dd4bf; }
.lp-blog__card h3 {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.35;
  letter-spacing: -0.005em;
}
.lp-blog__excerpt {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.55;
}
.lp-blog__meta {
  margin: 0.4rem 0 0;
  color: var(--text-tertiary);
  font-size: 0.82rem;
  display: flex;
  gap: 0.5rem;
}
.lp .lp-blog__all {
  text-align: center;
  margin: 1rem 0 0;
}
.lp-blog__all a {
  color: var(--brand);
  font-weight: 600;
  border-bottom: 1px dashed currentColor;
}
.theme-dark .lp-blog__all a { color: #2dd4bf; }

@keyframes lpPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.35); }
}

/* RESPONSIVE */
@media (max-width: 1100px) {
  .lp-bento { grid-template-columns: repeat(2, 1fr); }
  .lp-bento__cell--0,
  .lp-bento__cell--1,
  .lp-bento__cell--2,
  .lp-bento__cell--3 { grid-column: span 1; }
  .lp-industries__grid { grid-template-columns: repeat(2, 1fr); }
  .lp-blog__grid { grid-template-columns: 1fr; }
  .lp-invest__inner { grid-template-columns: 1fr; }
  .lp-reporting__inner { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .lp-metrics__inner { grid-template-columns: 1fr 1fr; }
  .lp-industries__grid { grid-template-columns: 1fr; }
}
</style>
