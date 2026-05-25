<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import PreviewHeader from "../components/preview/PreviewHeader.vue";
import PreviewFooter from "../components/preview/PreviewFooter.vue";
import DemoModal from "../components/preview/DemoModal.vue";
import WorkflowDataflow from "../components/preview/WorkflowDataflow.vue";
import ParticleNetwork from "../components/effects/ParticleNetwork.vue";
import DashboardMock from "../components/platform/DashboardMock.vue";
import AlertDrawerMock from "../components/platform/AlertDrawerMock.vue";
import { gsap } from "gsap";
import {
  heroHeadline,
  industries,
  platformPillars,
  trustBar,
  blogTeasers
} from "../data/project";

const showDemo = ref(false);
const heroRef = ref(null);
const headlineRef = ref(null);
const productRef = ref(null);

const animatedKpis = ref([
  { label: "Average case triage", target: 45, suffix: "s", value: 0 },
  { label: "Alert → SAR rate", target: 5, suffix: "%", value: 0 },
  { label: "Rule packs deployed", target: 30, suffix: "+", value: 0 }
]);

let reveals = [];
let kpiTl = null;

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
  // Hero entrance
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  if (headlineRef.value) {
    tl.from(headlineRef.value.querySelectorAll(".dh-hero__eyebrow, .dh-hero__title, .dh-hero__lead, .dh-hero__cta, .dh-hero__trust"), {
      y: 26,
      opacity: 0,
      duration: 0.95,
      stagger: 0.12
    });
  }
  if (productRef.value) {
    tl.from(productRef.value, { y: 40, opacity: 0, duration: 1.1, ease: "power4.out" }, "-=0.5");
  }

  // Scroll reveals
  const revealEls = document.querySelectorAll(".dh-reveal");
  reveals = Array.from(revealEls).map((el) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            gsap.to(el, { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" });
            if (el.dataset.dhStartKpis === "true") startKpiCount();
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
});

onBeforeUnmount(() => {
  reveals.forEach((o) => o.disconnect());
  kpiTl?.kill();
});
</script>

<template>
  <div class="preview-root preview-dark">
    <PreviewHeader variant="dark" @open-demo="showDemo = true" />

    <main>
      <!-- HERO -->
      <section ref="heroRef" class="dh-hero" id="platform">
        <div class="dh-hero__bg">
          <ParticleNetwork variant="dark" :particle-count="160" :max-connections="6" :connection-distance="1.5" />
          <div class="dh-hero__mesh"></div>
        </div>

        <div class="dh-hero__inner" ref="headlineRef">
          <div class="dh-hero__copy">
            <p class="dh-hero__eyebrow">{{ heroHeadline.eyebrow }}</p>
            <h1 class="dh-hero__title">
              <span>Real-time</span>
              <span class="dh-hero__title-accent">transaction monitoring</span>
              <span>with audit trails examiners trust.</span>
            </h1>
            <p class="dh-hero__lead">{{ heroHeadline.lead }}</p>
            <div class="dh-hero__cta">
              <button type="button" class="dh-btn dh-btn--primary" @click="showDemo = true">
                Book a demo
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <a href="#workflow" class="dh-btn dh-btn--ghost">See how it works</a>
            </div>
            <ul class="dh-hero__trust">
              <li v-for="item in trustBar" :key="item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8">
                  <path d="M4 12L9 17L20 6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                {{ item }}
              </li>
            </ul>
          </div>
        </div>

        <div ref="productRef" class="dh-hero__product">
          <div class="dh-hero__product-glow"></div>
          <DashboardMock variant="dark" />
        </div>
      </section>

      <!-- METRIC BAR -->
      <section class="dh-metrics dh-reveal" data-dh-start-kpis="true">
        <div class="dh-metrics__inner">
          <div v-for="(kpi, i) in animatedKpis" :key="i" class="dh-metric">
            <p class="dh-metric__value">
              <span v-if="kpi.label === 'Average case triage'">&lt;</span>{{ kpi.value }}<span class="dh-metric__suffix">{{ kpi.suffix }}</span>
            </p>
            <p class="dh-metric__label">{{ kpi.label }}</p>
          </div>
          <div class="dh-metric">
            <p class="dh-metric__value">Early access</p>
            <p class="dh-metric__label">Product stage</p>
          </div>
        </div>
      </section>

      <!-- PILLARS BENTO -->
      <section class="dh-section dh-pillars">
        <div class="dh-container">
          <div class="dh-section-head dh-reveal">
            <p class="dh-eyebrow">The platform</p>
            <h2>Everything a compliance team needs — assembled, not glued together.</h2>
            <p class="dh-section-sub">
              CompSync is one operating layer that monitors, scores, investigates, and reports — with the audit trail running through every action.
            </p>
          </div>

          <div class="dh-bento">
            <article v-for="(pillar, i) in platformPillars" :key="pillar.title" class="dh-bento__cell dh-reveal" :class="`dh-bento__cell--${i}`">
              <div class="dh-bento__tag">
                <span class="dh-bento__dot"></span>
                {{ pillar.tag }}
              </div>
              <h3>{{ pillar.title }}</h3>
              <p>{{ pillar.body }}</p>
              <p class="dh-bento__metric">{{ pillar.metric }}</p>
            </article>
          </div>
        </div>
      </section>

      <!-- WORKFLOW -->
      <section class="dh-section dh-workflow" id="workflow">
        <div class="dh-container">
          <div class="dh-section-head dh-reveal">
            <p class="dh-eyebrow">The workflow</p>
            <h2>From raw transactions to investigation-ready cases in minutes.</h2>
          </div>
          <div class="dh-reveal">
            <WorkflowDataflow variant="dark" />
          </div>
        </div>
      </section>

      <!-- INVESTIGATION SHOWCASE -->
      <section class="dh-section dh-invest">
        <div class="dh-container dh-invest__inner">
          <div class="dh-invest__copy dh-reveal">
            <p class="dh-eyebrow">Investigation, not triage</p>
            <h2>Every alert arrives investigation-ready.</h2>
            <p class="dh-section-sub">
              When an alert opens, your analyst sees the entity context, the triggered transaction, the rule that fired, the risk score breakdown, and AI-suggested next steps — all on one screen, all logged to the audit trail.
            </p>
            <ul class="dh-invest__list">
              <li><strong>Explainable scoring</strong> — every score traces to a rule, a signal, and a threshold.</li>
              <li><strong>Guided checklist</strong> — investigation steps mapped to your program's policy.</li>
              <li><strong>Shadow new rules</strong> — test against historical traffic before going live.</li>
              <li><strong>Audit-grade log</strong> — every analyst action, model output, and disposition recorded.</li>
            </ul>
          </div>
          <div class="dh-invest__product dh-reveal">
            <AlertDrawerMock variant="dark" />
          </div>
        </div>
      </section>

      <!-- INDUSTRIES -->
      <section class="dh-section dh-industries" id="industries">
        <div class="dh-container">
          <div class="dh-section-head dh-reveal">
            <p class="dh-eyebrow">Built for</p>
            <h2>The compliance stack — wherever you live in financial services.</h2>
          </div>

          <div class="dh-industries__grid">
            <article v-for="ind in industries" :key="ind.key" class="dh-industry dh-reveal">
              <h3>{{ ind.title }}</h3>
              <p>{{ ind.summary }}</p>
              <ul>
                <li v-for="need in ind.needs" :key="need">
                  <span class="dh-industry__dot"></span>{{ need }}
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <!-- INSIGHTS / BLOG -->
      <section class="dh-section dh-blog">
        <div class="dh-container">
          <div class="dh-section-head dh-reveal">
            <p class="dh-eyebrow">Insights</p>
            <h2>Field notes from the CompSync team.</h2>
            <p class="dh-section-sub">Compliance trends, engineering deep-dives, and operational playbooks.</p>
          </div>
          <div class="dh-blog__grid">
            <router-link v-for="post in blogTeasers" :key="post.slug" :to="`/blog/${post.slug}`" class="dh-blog__card dh-reveal">
              <p class="dh-blog__tag">{{ post.tag }}</p>
              <h3>{{ post.title }}</h3>
              <p class="dh-blog__excerpt">{{ post.excerpt }}</p>
              <p class="dh-blog__meta">
                <time>{{ post.publishedAt }}</time>
                <span>· {{ post.readMinutes }} min read</span>
              </p>
            </router-link>
          </div>
          <p class="dh-blog__all">
            <router-link to="/blog">Read all insights →</router-link>
          </p>
        </div>
      </section>

      <!-- CTA -->
      <section class="dh-section dh-cta" id="contact">
        <div class="dh-cta__inner dh-reveal">
          <div class="dh-cta__copy">
            <p class="dh-eyebrow">Talk to CompSync</p>
            <h2>Compliance infrastructure your examiner will recognize — your ops team will love.</h2>
            <p>We're working with a small number of early adopters across banking, fintech, payments, and crypto. If you're evaluating a modern AML/compliance stack, we can show you exactly how CompSync would fit your program — usually inside one 30-minute call.</p>
          </div>
          <div class="dh-cta__actions">
            <button type="button" class="dh-btn dh-btn--primary dh-btn--xl" @click="showDemo = true">
              Book a demo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <a href="mailto:team@compsync.us" class="dh-cta__email">team@compsync.us</a>
          </div>
        </div>
      </section>
    </main>

    <PreviewFooter variant="dark" />
    <DemoModal :open="showDemo" @close="showDemo = false" />
  </div>
</template>

<style scoped>
.preview-dark {
  background: var(--bg-canvas);
  color: var(--text-primary);
  font-family: var(--font-sans);
  overflow-x: hidden;
}

/* ============== HERO ============== */
.dh-hero {
  position: relative;
  padding: clamp(3.5rem, 8vw, 7rem) 1.5rem 4rem;
  isolation: isolate;
}
.dh-hero__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
}
.dh-hero__mesh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 50% at 20% 30%, rgba(15, 143, 122, 0.22) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 85% 15%, rgba(45, 212, 191, 0.18) 0%, transparent 55%),
    radial-gradient(ellipse 70% 50% at 50% 100%, rgba(15, 143, 122, 0.12) 0%, transparent 70%);
  pointer-events: none;
}
.dh-hero__bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(0deg, var(--bg-canvas) 0%, transparent 50%, transparent 50%, var(--bg-canvas) 100%),
    repeating-linear-gradient(0deg, transparent, transparent 39px, var(--grid-line) 39px, var(--grid-line) 40px),
    repeating-linear-gradient(90deg, transparent, transparent 39px, var(--grid-line) 39px, var(--grid-line) 40px);
  opacity: 0.5;
  pointer-events: none;
}
.dh-hero__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 4rem) 0 3rem;
  position: relative;
}
.dh-hero__copy {
  max-width: 920px;
}
.dh-hero__eyebrow {
  margin: 0 0 1.2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.34rem 0.9rem;
  border-radius: 99px;
  background: rgba(15, 143, 122, 0.12);
  border: 1px solid rgba(15, 143, 122, 0.35);
  color: #2dd4bf;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.02em;
}
.dh-hero__eyebrow::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 99px;
  background: #2dd4bf;
  box-shadow: 0 0 14px #2dd4bf;
  animation: dhPulse 1.8s ease-in-out infinite;
}
.dh-hero__title {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1em;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2.4rem, 6vw, 4.6rem);
  line-height: 1.05;
  letter-spacing: -0.025em;
  color: var(--text-primary);
}
.dh-hero__title-accent {
  font-style: italic;
  background: linear-gradient(90deg, #2dd4bf 0%, #0f8f7a 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.dh-hero__lead {
  margin: 1.4rem 0 0;
  max-width: 56ch;
  color: var(--text-secondary);
  font-size: 1.12rem;
  line-height: 1.62;
}
.dh-hero__cta {
  margin: 1.8rem 0 0;
  display: flex;
  gap: 0.85rem;
  flex-wrap: wrap;
}
.dh-hero__trust {
  list-style: none;
  margin: 2rem 0 0;
  padding: 0;
  display: flex;
  gap: 1.4rem;
  flex-wrap: wrap;
  color: var(--text-tertiary);
  font-size: 0.86rem;
}
.dh-hero__trust li {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}
.dh-hero__trust svg { color: var(--brand); }

.dh-hero__product {
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 0;
}
.dh-hero__product-glow {
  position: absolute;
  inset: -30px -30px -60px;
  background:
    radial-gradient(ellipse 50% 30% at 50% 50%, rgba(15, 143, 122, 0.35) 0%, transparent 70%),
    radial-gradient(ellipse 70% 40% at 50% 100%, rgba(45, 212, 191, 0.22) 0%, transparent 70%);
  filter: blur(40px);
  z-index: -1;
}

/* Buttons */
.dh-btn {
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
}
.dh-btn--primary {
  background: var(--brand);
  color: white;
  box-shadow: 0 14px 38px rgba(15, 143, 122, 0.45);
}
.dh-btn--primary:hover {
  transform: translateY(-2px);
  background: var(--brand-bright);
  box-shadow: 0 20px 50px rgba(15, 143, 122, 0.6);
}
.dh-btn--ghost {
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  text-decoration: none;
}
.dh-btn--ghost:hover { border-color: var(--brand); color: var(--brand); }
.dh-btn--xl {
  padding: 1rem 1.6rem;
  font-size: 1rem;
}
.dh-btn svg { transition: transform 220ms var(--ease-out-quint); }
.dh-btn:hover svg { transform: translateX(3px); }

/* ============== METRICS BAR ============== */
.dh-metrics {
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
  background: linear-gradient(180deg, rgba(15, 143, 122, 0.04) 0%, transparent 100%);
  padding: 2.5rem 1.5rem;
}
.dh-metrics__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}
.dh-metric { display: grid; gap: 0.35rem; }
.dh-metric__value {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2rem, 3.4vw, 2.8rem);
  line-height: 1;
  color: var(--text-primary);
  font-feature-settings: "tnum";
}
.dh-metric__suffix {
  font-size: 0.65em;
  color: #2dd4bf;
  margin-left: 0.08em;
}
.dh-metric__label {
  margin: 0;
  color: var(--text-tertiary);
  font-size: 0.86rem;
}

/* ============== SECTION SHELL ============== */
.dh-section {
  padding: clamp(4rem, 8vw, 7rem) 1.5rem;
}
.dh-container {
  max-width: 1280px;
  margin: 0 auto;
}
.dh-eyebrow {
  margin: 0 0 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.78rem;
  color: #2dd4bf;
  font-weight: 700;
}
.dh-section-head {
  max-width: 720px;
  margin-bottom: 3rem;
}
.dh-section-head h2 {
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.8rem, 3.6vw, 2.8rem);
  line-height: 1.15;
  letter-spacing: -0.015em;
  color: var(--text-primary);
}
.dh-section-sub {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1.02rem;
  line-height: 1.65;
  max-width: 56ch;
}

/* ============== BENTO ============== */
.dh-bento {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 1fr;
  gap: 1rem;
}
.dh-bento__cell {
  background: linear-gradient(180deg, rgba(15, 143, 122, 0.06) 0%, var(--bg-surface) 100%);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  position: relative;
  overflow: hidden;
  transition: transform 280ms var(--ease-out-quint), border-color 280ms ease, box-shadow 280ms ease;
}
.dh-bento__cell:hover {
  transform: translateY(-3px);
  border-color: rgba(45, 212, 191, 0.4);
  box-shadow: 0 22px 48px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(45, 212, 191, 0.25);
}
.dh-bento__cell::after {
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
.dh-bento__cell--0 { grid-column: span 4; }
.dh-bento__cell--1 { grid-column: span 2; }
.dh-bento__cell--2 { grid-column: span 2; }
.dh-bento__cell--3 { grid-column: span 4; }

.dh-bento__tag {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.74rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #2dd4bf;
  font-weight: 700;
}
.dh-bento__dot {
  width: 5px;
  height: 5px;
  border-radius: 99px;
  background: #2dd4bf;
  box-shadow: 0 0 10px #2dd4bf;
}
.dh-bento__cell h3 {
  margin: 0.2rem 0 0;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.005em;
  color: var(--text-primary);
}
.dh-bento__cell p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.94rem;
  line-height: 1.6;
}
.dh-bento__metric {
  margin-top: auto !important;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: #2dd4bf !important;
  padding-top: 0.8rem;
  border-top: 1px dashed rgba(45, 212, 191, 0.25);
}

/* ============== INVESTIGATION ============== */
.dh-invest__inner {
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: 4rem;
  align-items: center;
}
.dh-invest__list {
  margin: 1.6rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.7rem;
  color: var(--text-secondary);
  font-size: 0.96rem;
  line-height: 1.55;
}
.dh-invest__list li {
  padding-left: 1.4rem;
  position: relative;
}
.dh-invest__list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.55rem;
  width: 7px;
  height: 7px;
  border-radius: 99px;
  background: var(--brand);
  box-shadow: 0 0 12px var(--brand);
}
.dh-invest__list strong { color: var(--text-primary); }

/* ============== INDUSTRIES ============== */
.dh-industries__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
.dh-industry {
  padding: 1.5rem 1.4rem;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
  display: grid;
  gap: 0.8rem;
  transition: transform 280ms var(--ease-out-quint), border-color 280ms ease, background 280ms ease;
}
.dh-industry:hover {
  transform: translateY(-3px);
  border-color: rgba(45, 212, 191, 0.4);
  background: linear-gradient(180deg, rgba(15, 143, 122, 0.08) 0%, var(--bg-surface) 100%);
}
.dh-industry h3 {
  margin: 0;
  font-size: 1.08rem;
  font-weight: 700;
}
.dh-industry > p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.92rem;
  line-height: 1.55;
}
.dh-industry ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: var(--text-tertiary);
}
.dh-industry ul li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.dh-industry__dot {
  width: 4px;
  height: 4px;
  border-radius: 99px;
  background: var(--brand);
}

/* ============== BLOG ============== */
.dh-blog__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
}
.dh-blog__card {
  display: grid;
  gap: 0.55rem;
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
  color: inherit;
  transition: transform 280ms var(--ease-out-quint), border-color 280ms ease, box-shadow 280ms ease;
}
.dh-blog__card:hover {
  transform: translateY(-3px);
  border-color: rgba(45, 212, 191, 0.4);
  box-shadow: 0 18px 38px rgba(0, 0, 0, 0.4);
}
.dh-blog__tag {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  color: #2dd4bf;
  font-weight: 700;
}
.dh-blog__card h3 {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.35;
  letter-spacing: -0.005em;
}
.dh-blog__excerpt {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.55;
}
.dh-blog__meta {
  margin: 0.4rem 0 0;
  color: var(--text-tertiary);
  font-size: 0.82rem;
  display: flex;
  gap: 0.5rem;
}
.dh-blog__all {
  text-align: center;
  margin: 2.5rem 0 0;
}
.dh-blog__all a {
  color: #2dd4bf;
  font-weight: 600;
  border-bottom: 1px dashed currentColor;
}

/* ============== CTA ============== */
.dh-cta {
  padding: 6rem 1.5rem;
}
.dh-cta__inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: clamp(2.5rem, 5vw, 4rem);
  border-radius: 28px;
  background:
    radial-gradient(ellipse 90% 80% at 100% 0%, rgba(45, 212, 191, 0.28) 0%, transparent 60%),
    linear-gradient(135deg, #0a1f1c 0%, #050b0a 100%);
  border: 1px solid rgba(45, 212, 191, 0.25);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(45, 212, 191, 0.18);
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 2.5rem;
  align-items: center;
  position: relative;
  overflow: hidden;
}
.dh-cta__inner::before {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(45, 212, 191, 0.06) 39px, rgba(45, 212, 191, 0.06) 40px);
  opacity: 0.3;
  pointer-events: none;
}
.dh-cta__copy h2 {
  margin: 0 0 0.9rem;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.7rem, 3.2vw, 2.4rem);
  line-height: 1.15;
  letter-spacing: -0.015em;
}
.dh-cta__copy p { color: var(--text-secondary); margin: 0; font-size: 1rem; line-height: 1.62; }
.dh-cta__actions {
  display: grid;
  gap: 0.8rem;
  justify-items: start;
  position: relative;
  z-index: 2;
}
.dh-cta__email {
  color: var(--text-tertiary);
  font-size: 0.9rem;
  border-bottom: 1px dashed currentColor;
}

@keyframes dhPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.4); }
}

/* RESPONSIVE */
@media (max-width: 1100px) {
  .dh-bento { grid-template-columns: repeat(2, 1fr); }
  .dh-bento__cell--0,
  .dh-bento__cell--1,
  .dh-bento__cell--2,
  .dh-bento__cell--3 { grid-column: span 1; }
  .dh-industries__grid { grid-template-columns: repeat(2, 1fr); }
  .dh-blog__grid { grid-template-columns: 1fr; }
  .dh-invest__inner { grid-template-columns: 1fr; }
  .dh-cta__inner { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .dh-metrics__inner { grid-template-columns: 1fr 1fr; }
  .dh-industries__grid { grid-template-columns: 1fr; }
}
</style>
