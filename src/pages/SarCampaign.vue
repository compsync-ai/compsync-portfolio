<script setup>
// Dedicated ad-campaign landing page (/sar).
// Deliberately minimal: no site nav (keeps paid clicks from leaking away),
// one CTA, UTM capture wired into the form submission for CAC attribution.
import { defineAsyncComponent, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import brandLogo from "../assets/logo-compsync.svg";
import { useTheme } from "../composables/useTheme";
import AlertToSarMock from "../components/platform/AlertToSarMock.vue";

// ParticleNetwork drags three.js with it. Load it lazily after first paint so
// ad clicks see the headline instantly; the particles fade in a beat later.
const ParticleNetwork = defineAsyncComponent(() =>
  import("../components/effects/ParticleNetwork.vue")
);

const { theme } = useTheme();
const showParticles = ref(false);

// Cal.com booking link.
const CAL_LINK = "deepson/30min";

// Captured once on mount so attribution survives scrolling / form focus.
const utm = reactive({
  source: "",
  medium: "",
  campaign: "",
  term: "",
  content: ""
});

// Hero typewriter: second line types in with a blinking cursor.
const HERO_LINE2_FULL = "in minutes, not hours.";
const heroLine2Typed = ref("");
const heroLine2Typing = ref(false);
let timeouts = [];
let alive = true;

// Pipeline steps animation: traveling dot on a rail + sequential card
// highlight (same pattern as the homepage workflow). Starts only once the
// steps scroll up to just above the middle of the viewport.
const activeStep = ref(0);
const stepProgress = ref(0);
const stepsRef = ref(null);
let stepsStarted = false;
let stepsObserver = null;
let stepRafId = null;
let stepLastTs = 0;
const STEP_DURATION = 4200;

function animateSteps(ts) {
  if (!stepLastTs) stepLastTs = ts;
  const delta = ts - stepLastTs;
  stepLastTs = ts;
  const next = stepProgress.value + delta / STEP_DURATION;
  if (next >= 1) {
    stepProgress.value = next % 1;
    activeStep.value = (activeStep.value + 1) % steps.length;
  } else {
    stepProgress.value = next;
  }
  stepRafId = requestAnimationFrame(animateSteps);
}

// Cal.com embed is initialized lazily, only when the visitor nears the
// booking section. This also stops the embed's focus-grab from auto-scrolling
// the page down to the calendar on load.
let calObserver = null;
let calInited = false;

// Booking embed: the plain official Cal embed in a bordered container,
// same as thedrive.ai (verified from their page source). Cal's booker
// handles its own responsive flow natively.
//
// One page-level nicety on mobile: when a date is tapped, the slot list
// renders at the BOTTOM of the (stacked) embed, below the fold — so we
// scroll the page down to it, on EVERY tap. Cross-origin iframes don't
// expose taps, but the focus shift into the iframe (window blur) marks the
// interaction; focus is handed back to the page after each scroll so the
// next tap re-arms the signal. Taps that land while the slot area is
// already in position are skipped, so there is no redundant jolt (and the
// booking-form phase, where the visitor is already positioned, stays calm).
function onCalTap() {
  if (!window.matchMedia("(max-width: 768px)").matches) return;
  const ae = document.activeElement;
  if (!ae || ae.tagName !== "IFRAME" || !ae.closest("#cal-booking")) return;
  // Let the tapped day's slots render, then bring the slot area into view:
  // aligning the card bottom with the viewport bottom shows the slot list
  // (it is the last block in the embed).
  setTimeout(() => {
    const anchor = document.querySelector(".sar-book__alt");
    if (anchor) {
      const miss = anchor.getBoundingClientRect().bottom - window.innerHeight;
      if (Math.abs(miss) > 40) {
        anchor.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
    setTimeout(() => window.focus(), 900);
  }, 550);
}

function calLinkWithUtm() {
  const params = new URLSearchParams();
  if (utm.source) params.set("metadata[utm_source]", utm.source);
  if (utm.medium) params.set("metadata[utm_medium]", utm.medium);
  if (utm.campaign) params.set("metadata[utm_campaign]", utm.campaign);
  if (utm.term) params.set("metadata[utm_term]", utm.term);
  const qs = params.toString();
  return qs ? `${CAL_LINK}?${qs}` : CAL_LINK;
}

onMounted(() => {
  window.addEventListener("blur", onCalTap);
  const params = new URLSearchParams(window.location.search);
  utm.source = params.get("utm_source") || "";
  utm.medium = params.get("utm_medium") || "";
  utm.campaign = params.get("utm_campaign") || "";
  utm.term = params.get("utm_term") || "";
  utm.content = params.get("utm_content") || "";

  // Type the hero's second line.
  const start = setTimeout(() => {
    if (!alive) return;
    heroLine2Typing.value = true;
    let i = 0;
    const typeNext = () => {
      if (!alive) return;
      i += 1;
      heroLine2Typed.value = HERO_LINE2_FULL.slice(0, i);
      if (i < HERO_LINE2_FULL.length) {
        timeouts.push(setTimeout(typeNext, 45));
      } else {
        timeouts.push(setTimeout(() => {
          if (!alive) return;
          heroLine2Typing.value = false;
        }, 900));
      }
    };
    typeNext();
  }, 500);
  timeouts.push(start);

  // Particles after first paint.
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 400));
  idle(() => {
    if (alive) showParticles.value = true;
  });

  // Observers attach 300ms after mount so the first reading happens on the
  // settled layout (a mount-time reading can be taken before styles apply).
  // Inside the callbacks there is deliberately NO position re-check: the
  // observer only fires on band crossings, so a rejected fire would never
  // come back for slow scrollers.
  const attachObservers = setTimeout(() => {
    if (!alive) return;

    // Start the pipeline animation when the steps rise a little above the
    // middle of the viewport (top 55% band).
    if (stepsRef.value) {
      stepsObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting || stepsStarted) return;
            stepsStarted = true;
            stepRafId = requestAnimationFrame(animateSteps);
            stepsObserver.unobserve(e.target);
          });
        },
        { rootMargin: "0px 0px -45% 0px" }
      );
      stepsObserver.observe(stepsRef.value);
    }

    // Init the Cal embed only when the visitor approaches the booking
    // section. Lazy init keeps Cal's iframe focus-grab from auto-scrolling
    // the page down to the calendar on load.
    const bookingEl = document.getElementById("assessment-form");
    if (bookingEl) {
      calObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting || calInited) return;
            calInited = true;
            initCalEmbed();
            calObserver.unobserve(e.target);
          });
        },
        { rootMargin: "400px 0px" }
      );
      calObserver.observe(bookingEl);
    }
  }, 300);
  timeouts.push(attachObservers);
});

// Cal.com inline embed (official loader snippet, adapted).
function initCalEmbed() {
  /* eslint-disable */
  (function (C, A, L) {
    let p = function (a, ar) { a.q.push(ar); };
    let d = C.document;
    C.Cal = C.Cal || function () {
      let cal = C.Cal;
      let ar = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        d.head.appendChild(d.createElement("script")).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api = function () { p(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === "string") {
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar);
          p(cal, ["initNamespace", namespace]);
        } else p(cal, ar);
        return;
      }
      p(cal, ar);
    };
  })(window, "https://app.cal.com/embed/embed.js", "init");
  /* eslint-enable */

  window.Cal("init", { origin: "https://cal.com" });

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  window.Cal("inline", {
    elementOrSelector: "#cal-booking",
    calLink: calLinkWithUtm(),
    ...(isMobile ? {} : { layout: "month_view" })
  });
  window.Cal("ui", {
    theme: theme.value === "dark" ? "dark" : "light",
    cssVarsPerTheme: {
      light: {
        "cal-brand": "#0f8f7a",
        "cal-brand-emphasis": "#0b6b5f",
        "cal-brand-text": "#ffffff"
      },
      dark: {
        "cal-brand": "#2dd4bf",
        "cal-brand-emphasis": "#16a085",
        "cal-brand-text": "#050b0a"
      }
    },
    hideEventTypeDetails: false,
    ...(isMobile ? {} : { layout: "month_view" })
  });
  // Conversion signals (GA4 + LinkedIn) when a booking completes.
  window.Cal("on", {
    action: "bookingSuccessful",
    callback: () => {
      if (typeof window.gtag === "function") {
        window.gtag("event", "generate_lead", { form_id: "sar_assessment_cal" });
      }
      const cfg = window.__ANALYTICS__;
      if (typeof window.lintrk === "function" && cfg && cfg.liConversionId) {
        window.lintrk("track", { conversion_id: cfg.liConversionId });
      }
    }
  });
}

onBeforeUnmount(() => {
  alive = false;
  timeouts.forEach((t) => clearTimeout(t));
  if (stepRafId) cancelAnimationFrame(stepRafId);
  if (stepsObserver) stepsObserver.disconnect();
  if (calObserver) calObserver.disconnect();
  window.removeEventListener("blur", onCalTap);
});

function scrollToForm() {
  const el = document.getElementById("assessment-form");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const painPoints = [
  {
    title: "The 30-day clock never stops",
    body: "Every case starts a FinCEN countdown. Miss it and it's an exam finding with your name on it."
  },
  {
    title: "Each SAR eats hours",
    body: "Triage, investigate, gather evidence, write the narrative. Multiply by your monthly volume."
  },
  {
    title: "Your team is already lean",
    body: "The same obligations as a 50-person bank department. A fraction of the headcount."
  }
];

const steps = [
  {
    step: "01",
    title: "Send us your transactions",
    body: "API or file upload, no heavy integration. We run them through our BSA/AML rulebooks."
  },
  {
    step: "02",
    title: "Detections arrive with evidence",
    body: "Structuring, mule loading, velocity spikes. Each alert carries the transactions, entities, and rule citations behind it."
  },
  {
    step: "03",
    title: "The SAR drafts itself",
    body: "Narrative, amounts, dates, CFR citation. Your officer reviews, signs, files."
  }
];

const trustChips = [
  "FinCEN SAR & CTR ready",
  "BSA/AML rulebooks",
  "Your officer reviews every filing",
  "On-prem option available"
];
</script>

<template>
  <div class="sar-page">
    <!-- Slim header: brand only, no nav. This page has one job. -->
    <header class="sar-header">
      <router-link to="/" class="sar-header__brand">
        <img :src="brandLogo" alt="" width="28" height="28" />
        <span>CompSync</span>
      </router-link>
      <button type="button" class="btn-primary sar-header__cta" @click="scrollToForm">
        Book free assessment
      </button>
    </header>

    <!-- Hero: full-bleed background (particles + grid + mesh), constrained content. -->
    <section class="sar-hero">
      <div class="sar-hero__bg" aria-hidden="true">
        <div class="sar-hero__particles">
          <ParticleNetwork
            v-if="showParticles"
            :variant="theme"
            :particle-count="90"
            :max-connections="2"
            :connection-distance="1.0"
          />
        </div>
        <div class="sar-hero__grid"></div>
        <div class="sar-hero__mesh"></div>
      </div>
      <div class="sar-hero__inner">
        <p class="sar-hero__eyebrow">For lean compliance teams at MSBs, fintechs & credit unions</p>
        <h1 class="sar-hero__title">
          <span class="sar-hero__line">From alert to drafted&nbsp;SAR</span>
          <em class="sar-hero__line sar-hero__line--typed">
            <span class="sar-hero__typedwrap">{{ heroLine2Typed }}<span v-if="heroLine2Typing" class="sar-hero__cursor" aria-hidden="true"></span></span>
          </em>
        </h1>
        <p class="sar-hero__lead">
          CompSync monitors your transactions, flags suspicious activity, and hands your analyst a
          drafted SAR narrative ready to review and file. No more racing 30-day deadlines from a
          blank page.
        </p>
        <div class="sar-hero__actions">
          <button type="button" class="btn-primary btn-lg btn-pulse" @click="scrollToForm">
            Book a free SAR readiness assessment
            <span class="btn-arrow" aria-hidden="true">→</span>
          </button>
          <p class="sar-hero__subnote">30 minutes · No obligation · We map your coverage against our rulebooks</p>
        </div>
        <ul class="sar-trust">
          <li v-for="chip in trustChips" :key="chip">{{ chip }}</li>
        </ul>
      </div>
    </section>

    <!-- Pain -->
    <section class="sar-section">
      <h2 class="sar-section__title">You know this grind.</h2>
      <div class="sar-grid sar-grid--3">
        <article v-for="p in painPoints" :key="p.title" class="sar-card">
          <h3>{{ p.title }}</h3>
          <p>{{ p.body }}</p>
        </article>
      </div>
    </section>

    <!-- How it works -->
    <section class="sar-section sar-section--alt">
      <h2 class="sar-section__title">Detection and filing, one pipeline.</h2>
      <AlertToSarMock class="sar-mock" />
      <div ref="stepsRef" class="sar-flow">
        <div class="sar-flow__rail" aria-hidden="true">
          <svg viewBox="0 0 100 4" preserveAspectRatio="none" class="sar-flow__rail-svg">
            <line x1="0" y1="2" x2="100" y2="2" stroke="var(--border-subtle)" stroke-width="0.4" />
            <line
              x1="0" y1="2" x2="100" y2="2"
              stroke="var(--brand)" stroke-width="0.5" pathLength="100"
              :stroke-dasharray="`${(activeStep + stepProgress) * (100 / steps.length)}, 100`"
            />
          </svg>
          <div
            class="sar-flow__pulse"
            :style="{ left: `${(activeStep + stepProgress) * (100 / steps.length)}%` }"
          ></div>
        </div>
        <div class="sar-grid sar-grid--3">
          <article
            v-for="(s, idx) in steps"
            :key="s.step"
            class="sar-card sar-card--step"
            :class="{ 'sar-card--active': idx === activeStep, 'sar-card--passed': idx < activeStep }"
          >
            <span class="sar-card__node">
              {{ s.step }}
              <span v-if="idx === activeStep" class="sar-card__ring"></span>
            </span>
            <h3>{{ s.title }}</h3>
            <p>{{ s.body }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Booking -->
    <section id="assessment-form" class="sar-section sar-form-section">
      <div class="sar-offer">
        <p class="sar-offer__eyebrow">Book an assessment</p>
        <h2>Schedule a free BSA/AML SAR readiness assessment</h2>
        <p class="sar-offer__sub">
          A 30-minute walkthrough of your monitoring-to-filing workflow.
          You keep the gap list. No strings.
        </p>
      </div>
      <div class="sar-form-wrap">
        <div class="sar-book">
          <div id="cal-booking" class="sar-book__cal"></div>
          <p class="sar-book__alt">
            Prefer email? <a href="mailto:deepson@compsync.us">deepson@compsync.us</a>
          </p>
        </div>
      </div>
    </section>

    <footer class="sar-footer">
      <p>© {{ new Date().getFullYear() }} CompSync, Inc. · BSA/AML transaction monitoring & SAR workflow</p>
      <router-link to="/">Explore the full platform →</router-link>
    </footer>
  </div>
</template>

<style scoped>
.sar-page {
  min-height: 100vh;
  background: var(--bg-canvas);
  color: var(--text-primary);
  font-family: var(--font-sans);
}

/* Header */
.sar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  max-width: 1080px;
  margin: 0 auto;
}
.sar-header__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--text-primary);
  text-decoration: none;
}
.sar-header__cta {
  font-size: 0.9rem;
  white-space: nowrap;
}
@media (max-width: 480px) {
  .sar-header { padding: var(--space-3) var(--space-4); }
  .sar-header__cta { font-size: 0.78rem; padding: 0.5rem 0.9rem; }
}

/* Buttons (self-contained so the page works standalone) */
.btn-primary {
  background: var(--brand);
  color: #fff;
  border: none;
  border-radius: var(--radius-pill);
  padding: 0.65rem 1.4rem;
  font-weight: 600;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: background 0.2s var(--ease-out-quint), transform 0.2s var(--ease-out-quint);
}
.btn-primary:hover { background: var(--brand-deep); transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.7; cursor: default; transform: none; }
.btn-lg { padding: 0.9rem 2rem; font-size: 1.05rem; }

/* Main CTA: gradient, persistent brand shadow, pulsing ring, arrow that
   slides on hover, lift + deeper shadow on hover. */
.btn-pulse {
  background: linear-gradient(180deg, var(--brand-bright), var(--brand));
  animation: sar-cta-pulse 2.4s var(--ease-out-quint) infinite;
  transition: transform 0.25s var(--ease-spring), box-shadow 0.25s var(--ease-out-quint);
}
.btn-pulse:hover {
  background: linear-gradient(180deg, var(--brand), var(--brand-deep));
  transform: translateY(-2px) scale(1.02);
  animation: none;
  box-shadow: 0 14px 34px rgba(15, 143, 122, 0.45);
}
.btn-arrow {
  display: inline-block;
  margin-left: 0.45rem;
  transition: transform 0.25s var(--ease-spring);
}
.btn-pulse:hover .btn-arrow {
  transform: translateX(4px);
}
@keyframes sar-cta-pulse {
  0% { box-shadow: 0 8px 22px rgba(15, 143, 122, 0.32), 0 0 0 0 var(--brand-glow); }
  60% { box-shadow: 0 8px 22px rgba(15, 143, 122, 0.32), 0 0 0 16px rgba(15, 143, 122, 0); }
  100% { box-shadow: 0 8px 22px rgba(15, 143, 122, 0.32), 0 0 0 0 rgba(15, 143, 122, 0); }
}
@media (prefers-reduced-motion: reduce) {
  .btn-pulse { animation: none; }
}

/* Hero: section is full-bleed so the background spans the viewport;
   content is capped by the inner wrapper (same pattern as the homepage). */
.sar-hero {
  position: relative;
  isolation: isolate;
  padding: var(--space-8) var(--space-6) var(--space-7);
  text-align: center;
}
.sar-hero__inner {
  max-width: 1080px;
  margin: 0 auto;
}
.sar-hero__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
}
.sar-hero__particles {
  position: absolute;
  inset: 0;
  opacity: 0.45; /* keep the network subtle behind the copy */
}
.sar-hero__grid {
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(0deg, transparent, transparent 39px, var(--grid-line) 39px, var(--grid-line) 40px),
    repeating-linear-gradient(90deg, transparent, transparent 39px, var(--grid-line) 39px, var(--grid-line) 40px);
  mask-image: radial-gradient(ellipse 80% 90% at 50% 50%, black 35%, transparent 85%);
  -webkit-mask-image: radial-gradient(ellipse 80% 90% at 50% 50%, black 35%, transparent 85%);
}
.sar-hero__mesh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 55% 45% at 18% 28%, var(--mesh-1) 0%, transparent 60%),
    radial-gradient(ellipse 50% 35% at 85% 18%, var(--mesh-2) 0%, transparent 55%),
    radial-gradient(ellipse 70% 50% at 50% 100%, var(--mesh-1) 0%, transparent 70%);
  pointer-events: none;
}
.sar-hero__eyebrow {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--brand);
  margin-bottom: var(--space-4);
}
.sar-hero__title {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  line-height: 1.08;
  margin: 0 0 var(--space-5);
  max-width: none; /* override global h1 { max-width: 16ch } */
}
.sar-hero__line { display: block; }
.sar-hero__line--typed { min-height: 1.1em; }
.sar-hero__title em { color: var(--brand); font-style: italic; }
/* The cursor hangs off the text's right edge without occupying layout
   width, so the centered text doesn't shift when the cursor disappears. */
.sar-hero__typedwrap {
  position: relative;
  display: inline-block;
}
.sar-hero__cursor {
  position: absolute;
  left: calc(100% + 4px);
  top: 55%;
  transform: translateY(-50%);
  width: 0.5em;
  height: 0.85em;
  background: var(--brand);
  animation: sar-cursor-blink 0.85s steps(1) infinite;
}
@keyframes sar-cursor-blink {
  50% { opacity: 0; }
}
.sar-hero__lead {
  font-size: 1.15rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0 auto var(--space-6);
  max-width: 620px;
}
.sar-hero__actions { display: flex; flex-direction: column; align-items: center; gap: var(--space-3); }
.sar-hero__subnote { font-size: 0.85rem; color: var(--text-tertiary); margin: 0; }

.sar-trust {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-3);
  list-style: none;
  padding: 0;
  margin: var(--space-6) 0 0;
}
.sar-trust li {
  font-size: 0.8rem;
  font-family: var(--font-mono);
  color: var(--text-secondary);
  background: var(--bg-elevated);
  border: 1px solid var(--bg-inset);
  border-radius: var(--radius-pill);
  padding: 0.35rem 0.85rem;
  white-space: nowrap;
}
/* All four chips on a single line once there's room. */
@media (min-width: 1000px) {
  .sar-trust { flex-wrap: nowrap; }
}

/* Sections */
.sar-section {
  max-width: 1080px;
  margin: 0 auto;
  padding: var(--space-7) var(--space-6);
}
.sar-section--alt { background: var(--bg-elevated); border-radius: var(--radius-xl); }
.sar-section__title {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.5vw, 2.3rem);
  text-align: center;
  margin: 0 0 var(--space-5);
}
.sar-mock { margin-bottom: var(--space-6); }

.sar-grid { display: grid; gap: var(--space-5); }
.sar-grid--3 { grid-template-columns: repeat(3, 1fr); }

.sar-card {
  background: var(--bg-surface);
  border: 1px solid var(--bg-inset);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}
.sar-card h3 { margin: 0 0 var(--space-3); font-size: 1.05rem; }
.sar-card p { margin: 0; color: var(--text-secondary); line-height: 1.55; font-size: 0.95rem; }

/* Pipeline flow: traveling dot on a rail + sequential card highlight. */
.sar-flow { display: grid; gap: var(--space-6); }
.sar-flow__rail {
  position: relative;
  height: 3px;
}
.sar-flow__rail-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}
.sar-flow__pulse {
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  border-radius: 99px;
  background: var(--brand);
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand) 30%, transparent), 0 0 22px var(--brand);
  transition: left 80ms linear;
}

.sar-card--step {
  transition:
    transform 360ms var(--ease-out-quint),
    border-color 360ms ease,
    box-shadow 360ms ease;
}
.sar-card--active {
  transform: translateY(-3px);
  border-color: var(--brand);
  box-shadow: var(--shadow-glow);
}
.sar-card--passed {
  border-color: var(--border-default);
}

.sar-card__node {
  position: relative;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: var(--bg-elevated);
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 600;
  margin-bottom: var(--space-3);
  transition: background 360ms ease, color 360ms ease;
}
.sar-card--active .sar-card__node,
.sar-card--passed .sar-card__node {
  background: var(--brand);
  color: #fff;
}
.sar-card__ring {
  position: absolute;
  inset: -4px;
  border-radius: 14px;
  border: 2px solid var(--brand);
  opacity: 0.6;
  animation: sar-ring-pulse 1.4s ease-out infinite;
}
@keyframes sar-ring-pulse {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.4); opacity: 0; }
}

/* Booking: centered eyebrow + heading + one-line sub, then the calendar
   card (same pattern as thedrive.ai's "See it in action"). */
.sar-form-section { padding-bottom: var(--space-8); }
.sar-offer {
  text-align: center;
  max-width: 780px;
  margin: 0 auto var(--space-6);
}
.sar-offer__eyebrow {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--brand);
  margin: 0 0 var(--space-4);
}
.sar-offer h2 {
  font-family: var(--font-display);
  font-size: clamp(1.9rem, 4.2vw, 2.9rem);
  line-height: 1.14;
  margin: 0 0 var(--space-4);
}
.sar-offer__sub {
  color: var(--text-secondary);
  font-size: 1.05rem;
  line-height: 1.6;
  margin: 0 auto;
  max-width: 560px;
}
.sar-form-wrap {
  background: var(--bg-surface);
  border: 1px solid var(--bg-inset);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
}

.sar-book__cal {
  min-height: 620px;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* Mobile: same plain container, bordered like thedrive.ai's. Cal's booker
   handles its own responsive layout inside. */
@media (max-width: 768px) {
  .sar-book__cal {
    min-height: 400px;
    border: 1px solid var(--bg-inset);
  }
}
.sar-book__alt {
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-tertiary);
  margin: var(--space-3) 0 0;
}
.sar-book__alt a { color: var(--brand); text-decoration: none; }

/* Footer */
.sar-footer {
  max-width: 1080px;
  margin: 0 auto;
  padding: var(--space-6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-tertiary);
  font-size: 0.85rem;
  border-top: 1px solid var(--bg-inset);
}
.sar-footer a { color: var(--brand); text-decoration: none; }
.sar-footer p { margin: 0; }

/* Responsive */
@media (max-width: 860px) {
  .sar-grid--3 { grid-template-columns: 1fr; }
  .sar-form-wrap { grid-template-columns: 1fr; padding: var(--space-5); }
  .sar-hero { padding-top: var(--space-6); }
  .sar-footer { flex-direction: column; gap: var(--space-2); text-align: center; }
}
</style>
