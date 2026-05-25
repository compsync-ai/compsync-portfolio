<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { workflowNarrative } from "../../data/project";

const props = defineProps({
  variant: { type: String, default: "light" }
});

const activeStep = ref(0);
const progress = ref(0);
let rafId = null;
let lastTs = 0;
const stepDuration = 4200;

function animate(ts) {
  if (!lastTs) lastTs = ts;
  const delta = ts - lastTs;
  lastTs = ts;
  const next = progress.value + delta / stepDuration;
  if (next >= 1) {
    progress.value = next % 1;
    activeStep.value = (activeStep.value + 1) % workflowNarrative.length;
  } else {
    progress.value = next;
  }
  rafId = requestAnimationFrame(animate);
}

onMounted(() => {
  rafId = requestAnimationFrame(animate);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId);
});
</script>

<template>
  <div class="dataflow" :class="`dataflow--${variant}`">
    <div class="dataflow__rail">
      <svg viewBox="0 0 100 4" preserveAspectRatio="none" class="dataflow__rail-svg">
        <line x1="0" y1="2" x2="100" y2="2" stroke="var(--border-subtle)" stroke-width="0.4" />
        <line x1="0" y1="2" x2="100" y2="2" stroke="var(--brand)" stroke-width="0.5" pathLength="100" :stroke-dasharray="`${(activeStep + progress) * 25}, 100`" />
      </svg>
      <div class="dataflow__pulse" :style="{ left: `${(activeStep + progress) * 25}%` }"></div>
    </div>

    <div class="dataflow__steps">
      <article
        v-for="(s, idx) in workflowNarrative"
        :key="s.step"
        class="dataflow-step"
        :class="{ 'dataflow-step--active': idx === activeStep, 'dataflow-step--passed': idx < activeStep }"
      >
        <div class="dataflow-step__node">
          <span class="dataflow-step__num">{{ s.step }}</span>
          <span class="dataflow-step__ring" v-if="idx === activeStep"></span>
        </div>
        <div class="dataflow-step__body">
          <h4>{{ s.title }}</h4>
          <p>{{ s.body }}</p>
          <ul>
            <li v-for="line in s.sublines" :key="line">{{ line }}</li>
          </ul>
        </div>
        <svg v-if="idx < workflowNarrative.length - 1" class="dataflow-step__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </article>
    </div>
  </div>
</template>

<style scoped>
.dataflow {
  --node: 44px;
  display: grid;
  gap: 2rem;
}

.dataflow__rail {
  position: relative;
  height: 3px;
}
.dataflow__rail-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}
.dataflow__pulse {
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

.dataflow__steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.dataflow-step {
  position: relative;
  padding: 1.2rem 1.1rem 1.4rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
  display: grid;
  gap: 0.85rem;
  transition:
    transform 360ms var(--ease-out-quint),
    border-color 360ms ease,
    background 360ms ease,
    box-shadow 360ms ease;
}
.dataflow-step--active {
  transform: translateY(-3px);
  border-color: var(--brand);
  box-shadow: var(--shadow-glow);
}
.dataflow-step--passed {
  border-color: var(--border-default);
}

.dataflow-step__node {
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
  transition: background 360ms ease, color 360ms ease;
}
.dataflow-step--active .dataflow-step__node,
.dataflow-step--passed .dataflow-step__node {
  background: var(--brand);
  color: white;
}
.dataflow-step__num {
  position: relative;
  z-index: 2;
}
.dataflow-step__ring {
  position: absolute;
  inset: -4px;
  border-radius: 14px;
  border: 2px solid var(--brand);
  opacity: 0.6;
  animation: rangePulse 1.4s ease-out infinite;
}

.dataflow-step__body h4 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: -0.005em;
  color: var(--text-primary);
}
.dataflow-step__body p {
  margin: 0.45rem 0 0.7rem;
  color: var(--text-secondary);
  font-size: 0.92rem;
  line-height: 1.55;
}
.dataflow-step__body ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.3rem;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  color: var(--text-tertiary);
}
.dataflow-step__body li::before {
  content: "›";
  color: var(--brand);
  margin-right: 0.4rem;
}

.dataflow-step__arrow {
  position: absolute;
  top: 50%;
  right: -0.9rem;
  width: 18px;
  height: 18px;
  color: var(--text-tertiary);
  transform: translateY(-50%);
  background: var(--bg-canvas);
  border-radius: 99px;
  z-index: 3;
}

@keyframes rangePulse {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.4); opacity: 0; }
}

@media (max-width: 980px) {
  .dataflow__steps { grid-template-columns: repeat(2, 1fr); }
  .dataflow-step__arrow { display: none; }
}
@media (max-width: 600px) {
  .dataflow__steps { grid-template-columns: 1fr; }
}
</style>
