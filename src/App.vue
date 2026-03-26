<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import AppHeader from "./components/layout/AppHeader.vue";
import AppFooter from "./components/layout/AppFooter.vue";
import NotFoundPage from "./components/NotFoundPage.vue";
import { jumpToSection } from "./router";
import {
  alertFeed,
  capabilities,
  heroStats,
  navLinks,
  workflow
} from "./data/project";

const isDemoModalOpen = ref(false);
const submitState = ref("idle");
const submitFeedback = ref("");
const submitFeedbackType = ref("success");
const activeWorkflowStep = ref(0);
const workflowStepProgress = ref(0);
const demoForm = reactive({
  fullName: "",
  companyName: "",
  email: "",
  message: ""
});
let successResetTimer = null;
let workflowRafId = null;
let workflowLastTs = 0;
const workflowStepDurationMs = 4600;

const workflowSliderPercent = computed(() => {
  if (!workflow.length) return 0;
  return ((activeWorkflowStep.value + workflowStepProgress.value) / workflow.length) * 100;
});
const currentPath = computed(() => window.location.pathname.replace(/\/+$/, "") || "/");
const isHomeRoute = computed(() => currentPath.value === "/");

function openDemoModal() {
  submitFeedback.value = "";
  submitFeedbackType.value = "success";
  isDemoModalOpen.value = true;
}

function closeDemoModal() {
  isDemoModalOpen.value = false;
  if (successResetTimer) clearTimeout(successResetTimer);
  submitState.value = "idle";
}

async function submitDemoForm() {
  if (submitState.value === "loading") return;

  const submitStartedAt = Date.now();
  submitState.value = "loading";
  submitFeedback.value = "";
  submitFeedbackType.value = "success";

  try {
    const response = await fetch("https://formsubmit.co/ajax/deepson@compsync.us", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        _subject: "New CompSync Demo Request",
        full_name: demoForm.fullName,
        company_name: demoForm.companyName,
        email: demoForm.email,
        message: demoForm.message
      })
    });

    if (!response.ok) {
      throw new Error("Unable to submit request");
    }

    // Keep the loader visible a bit longer for better perceived feedback.
    const minLoadingTimeMs = 2000;
    const elapsed = Date.now() - submitStartedAt;
    if (elapsed < minLoadingTimeMs) {
      await new Promise((resolve) => setTimeout(resolve, minLoadingTimeMs - elapsed));
    }

    submitState.value = "success";
    submitFeedbackType.value = "success";
    submitFeedback.value = "Thanks, your request was sent successfully.";
    demoForm.fullName = "";
    demoForm.companyName = "";
    demoForm.email = "";
    demoForm.message = "";

    if (successResetTimer) clearTimeout(successResetTimer);
    successResetTimer = setTimeout(() => {
      submitState.value = "idle";
    }, 3200);
  } catch {
    submitState.value = "idle";
    submitFeedbackType.value = "error";
    submitFeedback.value = "Something went wrong, please try again.";
  }
}

function onEsc(event) {
  if (event.key === "Escape" && isDemoModalOpen.value) closeDemoModal();
}

onMounted(() => {
  if (window.location.hash) jumpToSection(window.location.hash);
  window.addEventListener("keydown", onEsc);

  const animateWorkflow = (ts) => {
    if (!workflow.length) return;
    if (!workflowLastTs) workflowLastTs = ts;
    const delta = ts - workflowLastTs;
    workflowLastTs = ts;

    const nextProgress = workflowStepProgress.value + delta / workflowStepDurationMs;
    if (nextProgress >= 1) {
      workflowStepProgress.value = nextProgress % 1;
      activeWorkflowStep.value = (activeWorkflowStep.value + 1) % workflow.length;
    } else {
      workflowStepProgress.value = nextProgress;
    }

    workflowRafId = window.requestAnimationFrame(animateWorkflow);
  };

  workflowRafId = window.requestAnimationFrame(animateWorkflow);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onEsc);
  if (successResetTimer) clearTimeout(successResetTimer);
  if (workflowRafId) window.cancelAnimationFrame(workflowRafId);
});

watch(isDemoModalOpen, (open) => {
  document.body.style.overflow = open ? "hidden" : "";
});
</script>

<template>
  <template v-if="isHomeRoute">
    <AppHeader :links="navLinks" @open-demo="openDemoModal" />

    <main class="page-shell">
      <section id="platform" class="hero container">
        <div class="hero__copy">
          <p class="eyebrow">Compliance Infrastructure for Modern Finance</p>
          <h1>Stop suspicious activity before it becomes regulatory exposure.</h1>
          <p class="hero__lead">
            CompSync helps financial institutions monitor transactions in real-time,
            detect unusual patterns like structuring and velocity spikes, and keep
            audit-ready trails across jurisdictions.
          </p>
          <div class="hero__stats">
            <article v-for="stat in heroStats" :key="stat.label" class="metric">
              <p class="metric__value">{{ stat.value }}</p>
              <p class="metric__label">{{ stat.label }}</p>
            </article>
          </div>
        </div>

        <div class="hero-widget reveal">
          <div class="hero-widget__top">
            <p>Live Risk Console</p>
            <span>Streaming</span>
          </div>
          <div class="hero-widget__graph">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <ul class="hero-widget__list">
            <li v-for="item in alertFeed" :key="item.customer">
              <div>
                <p>{{ item.label }}</p>
                <small>{{ item.customer }}</small>
              </div>
              <strong>{{ item.risk }}</strong>
            </li>
          </ul>
        </div>
      </section>

      <section class="partner-bar container">
        <p>Designed for banks, fintechs, payment processors, and neo-banks.</p>
      </section>

      <section id="monitoring" class="capabilities container">
        <div class="section-heading reveal">
          <p class="eyebrow">Transaction Monitoring</p>
          <h2>One compliance layer for signal detection, analyst action, and reporting.</h2>
        </div>
        <div class="capability-grid">
          <article v-for="item in capabilities" :key="item.title" class="capability-card reveal">
            <div class="capability-card__icon" :data-icon="item.icon"></div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </article>
        </div>
      </section>

      <section id="intelligence" class="workflow container">
        <div class="section-heading reveal">
          <p class="eyebrow">How CompSync Works</p>
          <h2>From raw transactions to investigation-ready cases in minutes.</h2>
        </div>

        <div class="workflow-slider reveal" aria-hidden="true">
          <div class="workflow-slider__track">
            <div class="workflow-slider__fill" :style="{ width: `${workflowSliderPercent}%` }"></div>
            <span class="workflow-slider__thumb" :style="{ left: `${workflowSliderPercent}%` }"></span>
          </div>
        </div>

        <div class="workflow-track">
          <article
            v-for="(step, index) in workflow"
            :key="step.title"
            class="workflow-step reveal"
            :class="{ 'workflow-step--active': activeWorkflowStep === index }"
            :style="{ '--step-index': index }"
          >
            <div class="workflow-step__head">
              <span class="workflow-step__node">{{ index + 1 }}</span>
              <p class="workflow-step__title">{{ step.title }}</p>
            </div>
            <p>{{ step.text }}</p>
          </article>
        </div>
      </section>

      <section id="contact" class="contact-section container reveal">
        <div class="section-heading">
          <p class="eyebrow">Contact CompSync</p>
          <h2>Collaborate with our team on transaction monitoring and compliance automation.</h2>
        </div>
        <p class="contact-intro">
          We are pre-client and building with early adopters. If you are evaluating
          a modern AML/compliance stack, we can map your policies, current workflow,
          and rollout path in a focused discovery call.
        </p>
        <div class="cta-band reveal">
          <div>
            <p class="eyebrow">Regulatory confidence, without bloated operations</p>
            <h2>Scale faster with an intelligent compliance operating system.</h2>
          </div>
          <button type="button" class="btn btn--primary" @click="openDemoModal">
            Connect with CompSync
          </button>
        </div>
      </section>
    </main>

    <Transition name="demo-modal-fade">
      <div
        v-if="isDemoModalOpen"
        class="modal-overlay"
        role="presentation"
        @click.self="closeDemoModal"
      >
        <section class="demo-modal" role="dialog" aria-modal="true" aria-labelledby="demo-modal-title">
          <div class="demo-modal__header">
            <h3 id="demo-modal-title">Book a Demo</h3>
            <button
              type="button"
              class="demo-modal__close"
              aria-label="Close demo form"
              @click="closeDemoModal"
            >
              ×
            </button>
          </div>

          <p class="demo-modal__intro">
            Share your details and our team will reach out within one business day.
          </p>

          <form class="demo-form" @submit.prevent="submitDemoForm">
            <label>
              Full Name
              <input v-model.trim="demoForm.fullName" type="text" name="fullName" required />
            </label>

            <label>
              Company Name
              <input v-model.trim="demoForm.companyName" type="text" name="companyName" required />
            </label>

            <label>
              Email
              <input v-model.trim="demoForm.email" type="email" name="email" required />
            </label>

            <label>
              Message
              <textarea v-model.trim="demoForm.message" name="message" rows="4" required></textarea>
            </label>

            <div class="demo-form__actions">
              <button type="submit" class="btn btn--primary demo-submit-btn" :disabled="submitState === 'loading'">
                <span v-if="submitState === 'idle'">Submit</span>
                <span v-else-if="submitState === 'loading'" class="demo-submit-btn__spinner" aria-hidden="true"></span>
                <span v-else class="demo-submit-btn__tick" aria-hidden="true"></span>
              </button>
              <button type="button" class="btn btn--ghost demo-cancel-btn" @click="closeDemoModal">
                Close
              </button>
            </div>
            <p v-if="submitFeedback" :class="submitFeedbackType === 'success' ? 'demo-form__success' : 'demo-form__error'">
              <span v-if="submitFeedbackType === 'success'" class="demo-feedback__thumb-illustration" aria-hidden="true">
                <svg viewBox="0 0 64 64" class="thumb-svg" role="presentation">
                  <circle cx="32" cy="32" r="28" class="thumb-svg__bg" />
                  <path
                    class="thumb-svg__hand"
                    d="M26 29h-7a3 3 0 0 0-3 3v16a3 3 0 0 0 3 3h7c1.7 0 3-1.3 3-3V32c0-1.7-1.3-3-3-3Zm21.7 4.6c-.7-.9-1.8-1.5-3-1.5H38l1.3-8.7c.4-2.5-1.4-4.8-3.9-5.2-.3 0-.5 0-.8 0-1.2 0-2.3.6-2.9 1.7L27 29.5V49h14.3c1.9 0 3.5-1.2 4-3l3.3-11.5c.3-1.1 0-2.2-.6-2.9Z"
                  />
                  <path class="thumb-svg__wrist" d="M19 29h7v22h-7z" />
                  <path class="thumb-svg__ray thumb-svg__ray--one" d="M44 16l3-5" />
                  <path class="thumb-svg__ray thumb-svg__ray--two" d="M50 22l6-2" />
                  <path class="thumb-svg__ray thumb-svg__ray--three" d="M49 30h6" />
                </svg>
              </span>
              {{ submitFeedback }}
            </p>
          </form>
        </section>
      </div>
    </Transition>

    <AppFooter />
  </template>

  <NotFoundPage v-else />
</template>
