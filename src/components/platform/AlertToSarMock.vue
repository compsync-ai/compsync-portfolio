<script setup>
// Animated product proof for the /sar campaign page: a structuring alert
// "becomes" a SAR narrative that types itself out, then loops.
import { onBeforeUnmount, onMounted, ref } from "vue";

const NARRATIVE =
  "Between 06/12 and 06/15, Business Wallet 4721 initiated seven cash deposits totaling $48,900, each below the $10,000 CTR threshold. The pattern is consistent with structuring under 31 CFR 1010.314. Supporting transactions, entities, and rule hits are attached.";

const typed = ref("");
const typing = ref(false);
const done = ref(false);
const rootRef = ref(null);

let timeouts = [];
let observer = null;
let started = false;
let alive = true;

function clearTimers() {
  timeouts.forEach((t) => clearTimeout(t));
  timeouts = [];
}

function runCycle() {
  if (!alive) return;
  typed.value = "";
  done.value = false;
  typing.value = true;
  let i = 0;
  const typeNext = () => {
    if (!alive) return;
    i += 1;
    typed.value = NARRATIVE.slice(0, i);
    if (i < NARRATIVE.length) {
      timeouts.push(setTimeout(typeNext, 18));
    } else {
      typing.value = false;
      done.value = true;
      // Hold the finished state, then loop.
      timeouts.push(setTimeout(runCycle, 5200));
    }
  };
  timeouts.push(setTimeout(typeNext, 600));
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) {
          started = true;
          runCycle();
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.35 }
  );
  if (rootRef.value) observer.observe(rootRef.value);
});

onBeforeUnmount(() => {
  alive = false;
  clearTimers();
  if (observer) observer.disconnect();
});
</script>

<template>
  <div ref="rootRef" class="a2s">
    <!-- Alert card -->
    <div class="a2s__alert">
      <div class="a2s__alert-head">
        <span class="a2s__badge">HIGH</span>
        <span class="a2s__rule">STR-004 · Possible structuring</span>
      </div>
      <div class="a2s__alert-body">
        <span>Business Wallet 4721</span>
        <span class="a2s__muted">$48,900 across 7 txns · 3 days</span>
      </div>
    </div>

    <div class="a2s__arrow" aria-hidden="true">
      <span class="a2s__arrow-line"></span>
      <span class="a2s__arrow-label">drafting SAR</span>
      <span class="a2s__arrow-line"></span>
    </div>

    <!-- SAR draft -->
    <div class="a2s__draft">
      <div class="a2s__draft-head">
        <span>SAR narrative · draft</span>
        <!-- Always in the layout (reserves its line on narrow screens);
             only becomes visible when the draft completes. -->
        <span class="a2s__ready" :class="{ 'a2s__ready--shown': done }">✓ Ready for officer review</span>
      </div>
      <div class="a2s__textwrap">
        <!-- Invisible full text reserves the exact final height at any
             width, so the box never grows while the visible copy types. -->
        <p class="a2s__text a2s__sizer" aria-hidden="true">{{ NARRATIVE }}</p>
        <p class="a2s__text a2s__typed">
          {{ typed }}<span v-if="typing" class="a2s__cursor" aria-hidden="true"></span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.a2s {
  max-width: 640px;
  margin: 0 auto;
  font-family: var(--font-mono);
  text-align: left;
}

.a2s__alert {
  background: var(--bg-surface);
  border: 1px solid var(--bg-inset);
  border-left: 3px solid var(--sev-high);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
}
.a2s__alert-head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
}
.a2s__badge {
  background: var(--sev-high);
  color: #fff;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  border-radius: var(--radius-sm);
  padding: 0.15rem 0.5rem;
}
.a2s__rule {
  font-size: 0.8rem;
  color: var(--text-primary);
  font-weight: 600;
}
.a2s__alert-body {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  font-size: 0.78rem;
  color: var(--text-secondary);
  flex-wrap: wrap;
}
.a2s__muted { color: var(--text-tertiary); }

.a2s__arrow {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin: var(--space-3) 0;
}
.a2s__arrow-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--brand), transparent);
}
.a2s__arrow-label {
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--brand);
}

.a2s__draft {
  background: var(--bg-surface);
  border: 1px solid var(--bg-inset);
  border-left: 3px solid var(--brand);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
}
.a2s__draft-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin-bottom: var(--space-2);
  flex-wrap: wrap;
}
.a2s__ready {
  color: var(--sev-ok);
  font-weight: 700;
  text-transform: none;
  letter-spacing: 0;
  visibility: hidden;
}
.a2s__ready--shown { visibility: visible; }
.a2s__textwrap { position: relative; }
.a2s__text {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.65;
  color: var(--text-secondary);
}
.a2s__sizer { visibility: hidden; }
.a2s__typed {
  position: absolute;
  inset: 0;
}
.a2s__cursor {
  display: inline-block;
  width: 0.55em;
  height: 1.05em;
  margin-left: 2px;
  background: var(--brand);
  vertical-align: text-bottom;
  animation: a2s-blink 0.85s steps(1) infinite;
}
@keyframes a2s-blink {
  50% { opacity: 0; }
}

</style>
