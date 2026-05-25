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
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  if (headlineRef.value) {
    tl.from(headlineRef.value.querySelectorAll(".lh-hero__eyebrow, .lh-hero__title, .lh-hero__lead, .lh-hero__cta, .lh-hero__trust"), {
      y: 26,
      opacity: 0,
      duration: 0.95,
      stagger: 0.12
    });
  }
  if (productRef.value) {
    tl.from(productRef.value, { y: 40, opacity: 0, duration: 1.1, ease: "power4.out" }, "-=0.5");
  }

  const revealEls = document.querySelectorAll(".lh-reveal");
  reveals = Array.from(revealEls).map((el) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            gsap.to(el, { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" });
            if (el.dataset.lhStartKpis === "true") startKpiCount();
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
  <div class="preview-root preview-light">
    <PreviewHeader variant="light" @open-demo="showDemo = true" />

    <main>
      <!-- HERO -->
      <section ref="heroRef" class="lh-hero" id="platform">
        <div class="lh-hero__bg">
          <ParticleNetwork variant="light" :particle-count="120" :max-connections="5" :connection-distance="1.6" />
          <div class="lh-hero__grid"></div>
          <div class="lh-hero__mesh"></div>
        </div>

        <div class="lh-hero__inner" ref="headlineRef">
          <div class="lh-hero__copy">
            <p class="lh-hero__eyebrow">
              <span class="lh-hero__eyebrow-dot"></span>
              {{ heroHeadline.eyebrow }}
            </p>
            <h1 class="lh-hero__title">
              <span>Real-time</span>
              <span class="lh-hero__title-accent">transaction monitoring</span>
              <span>with audit trails examiners&nbsp;trust.</span>
            </h1>
            <p class="lh-hero__lead">{{ heroHeadline.lead }}</p>
            <div class="lh-hero__cta">
              <button type="button" class="lh-btn lh-btn--primary" @click="showDemo = true">
                Book a demo
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <a href="#workflow" class="lh-btn lh-btn--ghost">See how it works</a>
            </div>
            <ul class="lh-hero__trust">
              <li v-for="item in trustBar" :key="item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8">
                  <path d="M4 12L9 17L20 6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                {{ item }}
              </li>
            </ul>
          </div>
        </div>

        <div ref="productRef" class="lh-hero__product">
          <div class="lh-hero__product-shadow"></div>
          <DashboardMock variant="light" />
        </div>
      </section>

      <!-- METRIC BAR -->
      <section class="lh-metrics lh-reveal" data-lh-start-kpis="true">
        <div class="lh-metrics__inner">
          <div v-for="(kpi, i) in animatedKpis" :key="i" class="lh-metric">
            <p class="lh-metric__value">
              <span v-if="kpi.label === 'Average case triage'">&lt;</span>{{ kpi.value }}<span class="lh-metric__suffix">{{ kpi.suffix }}</span>
            </p>
            <p class="lh-metric__label">{{ kpi.label }}</p>
          </div>
          <div class="lh-metric">
            <p class="lh-metric__value lh-metric__value--text">Early access</p>
            <p class="lh-metric__label">Product stage</p>
          </div>
        </div>
      </section>

      <!-- PILLARS BENTO -->
      <section class="lh-section">
        <div class="lh-container">
          <div class="lh-section-head lh-reveal">
            <p class="lh-eyebrow">The platform</p>
            <h2>Everything a compliance team needs — assembled, not glued together.</h2>
            <p class="lh-section-sub">
              CompSync is one operating layer that monitors, scores, investigates, and reports — with the audit trail running through every action.
            </p>
          </div>

          <div class="lh-bento">
            <article v-for="(pillar, i) in platformPillars" :key="pillar.title" class="lh-bento__cell lh-reveal" :class="`lh-bento__cell--${i}`">
              <div class="lh-bento__tag">
                <span class="lh-bento__dot"></span>
                {{ pillar.tag }}
              </div>
              <h3>{{ pillar.title }}</h3>
              <p>{{ pillar.body }}</p>
              <p class="lh-bento__metric">{{ pillar.metric }}</p>
            </article>
          </div>
        </div>
      </section>

      <!-- WORKFLOW -->
      <section class="lh-section lh-workflow" id="workflow">
        <div class="lh-container">
          <div class="lh-section-head lh-reveal">
            <p class="lh-eyebrow">The workflow</p>
            <h2>From raw transactions to investigation-ready cases in minutes.</h2>
          </div>
          <div class="lh-reveal">
            <WorkflowDataflow variant="light" />
          </div>
        </div>
      </section>

      <!-- INVESTIGATION SHOWCASE -->
      <section class="lh-section lh-invest">
        <div class="lh-container lh-invest__inner">
          <div class="lh-invest__copy lh-reveal">
            <p class="lh-eyebrow">Investigation, not triage</p>
            <h2>Every alert arrives investigation-ready.</h2>
            <p class="lh-section-sub">
              When an alert opens, your analyst sees the entity context, the triggered transaction, the rule that fired, the risk score breakdown, and AI-suggested next steps — all on one screen, all logged to the audit trail.
            </p>
            <ul class="lh-invest__list">
              <li><strong>Explainable scoring</strong> — every score traces to a rule, a signal, and a threshold.</li>
              <li><strong>Guided checklist</strong> — investigation steps mapped to your program's policy.</li>
              <li><strong>Shadow new rules</strong> — test against historical traffic before going live.</li>
              <li><strong>Audit-grade log</strong> — every analyst action, model output, and disposition recorded.</li>
            </ul>
          </div>
          <div class="lh-invest__product lh-reveal">
            <AlertDrawerMock variant="light" />
          </div>
        </div>
      </section>

      <!-- INDUSTRIES -->
      <section class="lh-section lh-industries" id="industries">
        <div class="lh-container">
          <div class="lh-section-head lh-reveal">
            <p class="lh-eyebrow">Built for</p>
            <h2>The compliance stack — wherever you live in financial services.</h2>
          </div>

          <div class="lh-industries__grid">
            <article v-for="ind in industries" :key="ind.key" class="lh-industry lh-reveal">
              <h3>{{ ind.title }}</h3>
              <p>{{ ind.summary }}</p>
              <ul>
                <li v-for="need in ind.needs" :key="need">
                  <span class="lh-industry__dot"></span>{{ need }}
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <!-- INSIGHTS / BLOG -->
      <section class="lh-section lh-blog">
        <div class="lh-container">
          <div class="lh-section-head lh-reveal">
            <p class="lh-eyebrow">Insights</p>
            <h2>Field notes from the CompSync team.</h2>
            <p class="lh-section-sub">Compliance trends, engineering deep-dives, and operational playbooks.</p>
          </div>
          <div class="lh-blog__grid">
            <router-link v-for="post in blogTeasers" :key="post.slug" :to="`/blog/${post.slug}`" class="lh-blog__card lh-reveal">
              <p class="lh-blog__tag">{{ post.tag }}</p>
              <h3>{{ post.title }}</h3>
              <p class="lh-blog__excerpt">{{ post.excerpt }}</p>
              <p class="lh-blog__meta">
                <time>{{ post.publishedAt }}</time>
                <span>· {{ post.readMinutes }} min read</span>
              </p>
            </router-link>
          </div>
          <p class="lh-blog__all">
            <router-link to="/blog">Read all insights →</router-link>
          </p>
        </div>
      </section>

      <!-- CTA -->
      <section class="lh-section lh-cta" id="contact">
        <div class="lh-cta__inner lh-reveal">
          <div class="lh-cta__copy">
            <p class="lh-eyebrow">Talk to CompSync</p>
            <h2>Compliance infrastructure your examiner will recognize — your ops team will love.</h2>
            <p>We're working with a small number of early adopters across banking, fintech, payments, and crypto. If you're evaluating a modern AML/compliance stack, we can show you exactly how CompSync would fit your program — usually inside one 30-minute call.</p>
          </div>
          <div class="lh-cta__actions">
            <button type="button" class="lh-btn lh-btn--primary lh-btn--xl" @click="showDemo = true">
              Book a demo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <a href="mailto:team@compsync.us" class="lh-cta__email">team@compsync.us</a>
          </div>
        </div>
      </section>
    </main>

    <PreviewFooter variant="light" />
    <DemoModal :open="showDemo" @close="showDemo = false" />
  </div>
</template>

<style scoped>
.preview-light {
  background: var(--bg-canvas);
  color: var(--text-primary);
  font-family: var(--font-sans);
  overflow-x: hidden;
}

/* ============== HERO ============== */
.lh-hero {
  position: relative;
  padding: clamp(3rem, 8vw, 6.5rem) 1.5rem 4rem;
  isolation: isolate;
}
.lh-hero__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
}
.lh-hero__grid {
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(15, 143, 122, 0.06) 39px, rgba(15, 143, 122, 0.06) 40px),
    repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(15, 143, 122, 0.06) 39px, rgba(15, 143, 122, 0.06) 40px);
  mask-image: radial-gradient(ellipse 70% 80% at 50% 50%, black 40%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 70% 80% at 50% 50%, black 40%, transparent 80%);
}
.lh-hero__mesh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 40% at 15% 30%, rgba(15, 143, 122, 0.10) 0%, transparent 60%),
    radial-gradient(ellipse 40% 30% at 85% 20%, rgba(45, 212, 191, 0.10) 0%, transparent 55%);
  pointer-events: none;
}

.lh-hero__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: clamp(2rem, 4vw, 4rem) 0 3rem;
  position: relative;
}
.lh-hero__copy {
  max-width: 920px;
}
.lh-hero__eyebrow {
  margin: 0 0 1.4rem;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.34rem 0.95rem;
  border-radius: 99px;
  background: rgba(15, 143, 122, 0.08);
  border: 1px solid rgba(15, 143, 122, 0.18);
  color: var(--brand-deep);
  font-size: 0.8rem;
  font-weight: 600;
}
.lh-hero__eyebrow-dot {
  width: 6px;
  height: 6px;
  border-radius: 99px;
  background: var(--brand);
  box-shadow: 0 0 0 0 rgba(15, 143, 122, 0.5);
  animation: lhPulse 1.6s ease-out infinite;
}
.lh-hero__title {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1em;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2.3rem, 5.8vw, 4.4rem);
  line-height: 1.05;
  letter-spacing: -0.025em;
  color: var(--text-primary);
}
.lh-hero__title-accent {
  font-style: italic;
  color: var(--brand);
  background: linear-gradient(90deg, #0f8f7a 0%, #16a085 50%, #0b6b5f 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.lh-hero__lead {
  margin: 1.4rem 0 0;
  max-width: 56ch;
  color: var(--text-secondary);
  font-size: 1.12rem;
  line-height: 1.62;
}
.lh-hero__cta {
  margin: 1.8rem 0 0;
  display: flex;
  gap: 0.85rem;
  flex-wrap: wrap;
}
.lh-hero__trust {
  list-style: none;
  margin: 2.2rem 0 0;
  padding: 0;
  display: flex;
  gap: 1.4rem;
  flex-wrap: wrap;
  color: var(--text-tertiary);
  font-size: 0.86rem;
}
.lh-hero__trust li {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}
.lh-hero__trust svg { color: var(--brand); }

.lh-hero__product {
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
}
.lh-hero__product-shadow {
  position: absolute;
  inset: -30px -30px -60px;
  background:
    radial-gradient(ellipse 50% 30% at 50% 50%, rgba(15, 143, 122, 0.16) 0%, transparent 70%),
    radial-gradient(ellipse 70% 40% at 50% 100%, rgba(15, 143, 122, 0.12) 0%, transparent 70%);
  filter: blur(30px);
  z-index: -1;
}

/* Buttons */
.lh-btn {
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
.lh-btn--primary {
  background: var(--brand);
  color: white;
  box-shadow: 0 12px 30px rgba(15, 143, 122, 0.32);
}
.lh-btn--primary:hover {
  transform: translateY(-2px);
  background: var(--brand-bright);
  box-shadow: 0 18px 42px rgba(15, 143, 122, 0.45);
}
.lh-btn--ghost {
  background: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
}
.lh-btn--ghost:hover { border-color: var(--brand); color: var(--brand); }
.lh-btn--xl { padding: 1rem 1.6rem; font-size: 1rem; }
.lh-btn svg { transition: transform 220ms var(--ease-out-quint); }
.lh-btn:hover svg { transform: translateX(3px); }

/* ============== METRICS BAR ============== */
.lh-metrics {
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
  background: linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg-canvas) 100%);
  padding: 2.6rem 1.5rem;
}
.lh-metrics__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}
.lh-metric { display: grid; gap: 0.35rem; }
.lh-metric__value {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2rem, 3.4vw, 2.8rem);
  line-height: 1;
  color: var(--text-primary);
  font-feature-settings: "tnum";
}
.lh-metric__value--text { font-size: clamp(1.4rem, 2.4vw, 1.9rem); }
.lh-metric__suffix {
  font-size: 0.65em;
  color: var(--brand);
  margin-left: 0.08em;
}
.lh-metric__label {
  margin: 0;
  color: var(--text-tertiary);
  font-size: 0.86rem;
}

/* ============== SECTION SHELL ============== */
.lh-section {
  padding: clamp(4rem, 8vw, 7rem) 1.5rem;
}
.lh-container {
  max-width: 1280px;
  margin: 0 auto;
}
.lh-eyebrow {
  margin: 0 0 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.78rem;
  color: var(--brand);
  font-weight: 700;
}
.lh-section-head {
  max-width: 720px;
  margin-bottom: 3rem;
}
.lh-section-head h2 {
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.8rem, 3.6vw, 2.8rem);
  line-height: 1.15;
  letter-spacing: -0.015em;
  color: var(--text-primary);
}
.lh-section-sub {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1.02rem;
  line-height: 1.65;
  max-width: 56ch;
}

/* ============== BENTO ============== */
.lh-bento {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 1fr;
  gap: 1rem;
}
.lh-bento__cell {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 1.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  position: relative;
  overflow: hidden;
  transition: transform 280ms var(--ease-out-quint), border-color 280ms ease, box-shadow 280ms ease;
}
.lh-bento__cell:hover {
  transform: translateY(-3px);
  border-color: var(--border-default);
  box-shadow: var(--shadow-md);
}
.lh-bento__cell--0 { grid-column: span 4; background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-elevated) 100%); }
.lh-bento__cell--1 { grid-column: span 2; }
.lh-bento__cell--2 { grid-column: span 2; }
.lh-bento__cell--3 { grid-column: span 4; background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-elevated) 100%); }

.lh-bento__tag {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.74rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--brand);
  font-weight: 700;
}
.lh-bento__dot {
  width: 5px;
  height: 5px;
  border-radius: 99px;
  background: var(--brand);
}
.lh-bento__cell h3 {
  margin: 0.2rem 0 0;
  font-size: 1.22rem;
  font-weight: 700;
  letter-spacing: -0.005em;
  color: var(--text-primary);
}
.lh-bento__cell p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.94rem;
  line-height: 1.6;
}
.lh-bento__metric {
  margin-top: auto !important;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--brand) !important;
  padding-top: 0.8rem;
  border-top: 1px dashed var(--border-default);
}

/* ============== INVESTIGATION ============== */
.lh-invest__inner {
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: 4rem;
  align-items: center;
}
.lh-invest__list {
  margin: 1.6rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.7rem;
  color: var(--text-secondary);
  font-size: 0.96rem;
  line-height: 1.55;
}
.lh-invest__list li {
  padding-left: 1.4rem;
  position: relative;
}
.lh-invest__list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.55rem;
  width: 7px;
  height: 7px;
  border-radius: 99px;
  background: var(--brand);
}
.lh-invest__list strong { color: var(--text-primary); }

/* ============== INDUSTRIES ============== */
.lh-industries__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
.lh-industry {
  padding: 1.6rem 1.5rem;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
  display: grid;
  gap: 0.8rem;
  transition: transform 280ms var(--ease-out-quint), border-color 280ms ease, box-shadow 280ms ease;
}
.lh-industry:hover {
  transform: translateY(-3px);
  border-color: var(--brand);
  box-shadow: var(--shadow-md);
}
.lh-industry h3 {
  margin: 0;
  font-size: 1.08rem;
  font-weight: 700;
}
.lh-industry > p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.92rem;
  line-height: 1.55;
}
.lh-industry ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: var(--text-tertiary);
}
.lh-industry ul li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.lh-industry__dot {
  width: 4px;
  height: 4px;
  border-radius: 99px;
  background: var(--brand);
}

/* ============== BLOG ============== */
.lh-blog__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
}
.lh-blog__card {
  display: grid;
  gap: 0.55rem;
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
  color: inherit;
  transition: transform 280ms var(--ease-out-quint), border-color 280ms ease, box-shadow 280ms ease;
}
.lh-blog__card:hover {
  transform: translateY(-3px);
  border-color: var(--brand);
  box-shadow: var(--shadow-md);
}
.lh-blog__tag {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  color: var(--brand);
  font-weight: 700;
}
.lh-blog__card h3 {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.35;
  letter-spacing: -0.005em;
}
.lh-blog__excerpt {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.55;
}
.lh-blog__meta {
  margin: 0.4rem 0 0;
  color: var(--text-tertiary);
  font-size: 0.82rem;
  display: flex;
  gap: 0.5rem;
}
.lh-blog__all {
  text-align: center;
  margin: 2.5rem 0 0;
}
.lh-blog__all a {
  color: var(--brand);
  font-weight: 600;
  border-bottom: 1px dashed currentColor;
}

/* ============== CTA ============== */
.lh-cta {
  padding: 6rem 1.5rem;
}
.lh-cta__inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: clamp(2.5rem, 5vw, 4rem);
  border-radius: 28px;
  background:
    radial-gradient(ellipse 80% 80% at 100% 0%, rgba(15, 143, 122, 0.10) 0%, transparent 60%),
    linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-elevated) 100%);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-lg);
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 2.5rem;
  align-items: center;
}
.lh-cta__copy h2 {
  margin: 0 0 0.9rem;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.7rem, 3.2vw, 2.4rem);
  line-height: 1.15;
  letter-spacing: -0.015em;
}
.lh-cta__copy p { color: var(--text-secondary); margin: 0; font-size: 1rem; line-height: 1.62; }
.lh-cta__actions {
  display: grid;
  gap: 0.8rem;
  justify-items: start;
}
.lh-cta__email {
  color: var(--text-tertiary);
  font-size: 0.9rem;
  border-bottom: 1px dashed currentColor;
}

@keyframes lhPulse {
  0% { box-shadow: 0 0 0 0 rgba(15, 143, 122, 0.45); }
  100% { box-shadow: 0 0 0 10px rgba(15, 143, 122, 0); }
}

/* RESPONSIVE */
@media (max-width: 1100px) {
  .lh-bento { grid-template-columns: repeat(2, 1fr); }
  .lh-bento__cell--0,
  .lh-bento__cell--1,
  .lh-bento__cell--2,
  .lh-bento__cell--3 { grid-column: span 1; }
  .lh-industries__grid { grid-template-columns: repeat(2, 1fr); }
  .lh-blog__grid { grid-template-columns: 1fr; }
  .lh-invest__inner { grid-template-columns: 1fr; }
  .lh-cta__inner { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .lh-metrics__inner { grid-template-columns: 1fr 1fr; }
  .lh-industries__grid { grid-template-columns: 1fr; }
}
</style>
