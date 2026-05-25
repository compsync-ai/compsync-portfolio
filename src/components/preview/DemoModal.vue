<script setup>
import { onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";

const props = defineProps({ open: Boolean });
const emit = defineEmits(["close"]);

const state = ref("idle");
const feedback = ref("");
const feedbackType = ref("success");
const form = reactive({ fullName: "", companyName: "", email: "", message: "" });
let resetTimer = null;

async function submit() {
  if (state.value === "loading") return;
  const startedAt = Date.now();
  state.value = "loading";
  feedback.value = "";
  feedbackType.value = "success";
  try {
    const res = await fetch("https://formsubmit.co/ajax/deepson@compsync.us", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: "New CompSync Demo Request",
        full_name: form.fullName,
        company_name: form.companyName,
        email: form.email,
        message: form.message
      })
    });
    if (!res.ok) throw new Error("Submit failed");
    const minLoading = 1800;
    const elapsed = Date.now() - startedAt;
    if (elapsed < minLoading) await new Promise(r => setTimeout(r, minLoading - elapsed));
    state.value = "success";
    feedback.value = "Thanks — we'll reach out within one business day.";
    form.fullName = ""; form.companyName = ""; form.email = ""; form.message = "";
    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = setTimeout(() => { state.value = "idle"; }, 3200);
  } catch {
    state.value = "idle";
    feedbackType.value = "error";
    feedback.value = "Something went wrong, please try again.";
  }
}

function onEsc(e) {
  if (e.key === "Escape" && props.open) emit("close");
}

watch(() => props.open, (open) => {
  document.body.style.overflow = open ? "hidden" : "";
});

onMounted(() => { window.addEventListener("keydown", onEsc); });
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onEsc);
  if (resetTimer) clearTimeout(resetTimer);
  document.body.style.overflow = "";
});
</script>

<template>
  <Transition name="demo-fade">
    <div v-if="open" class="demo-overlay" role="presentation" @click.self="$emit('close')">
      <section class="demo-modal" role="dialog" aria-modal="true" aria-labelledby="demo-title">
        <header class="demo-modal__head">
          <div>
            <p class="demo-modal__eyebrow">Book a demo</p>
            <h3 id="demo-title">Tell us about your compliance program.</h3>
          </div>
          <button type="button" class="demo-modal__close" aria-label="Close" @click="$emit('close')">×</button>
        </header>

        <p class="demo-modal__intro">
          We'll set up a discovery call to map your rules, current workflow, and rollout path — typically 30 minutes.
        </p>

        <form class="demo-form" @submit.prevent="submit">
          <label>
            Full name
            <input v-model.trim="form.fullName" type="text" required />
          </label>
          <label>
            Company
            <input v-model.trim="form.companyName" type="text" required />
          </label>
          <label class="demo-form__full">
            Work email
            <input v-model.trim="form.email" type="email" required />
          </label>
          <label class="demo-form__full">
            What are you evaluating?
            <textarea v-model.trim="form.message" rows="4" required></textarea>
          </label>
          <div class="demo-form__actions">
            <button type="submit" class="btn-primary" :disabled="state === 'loading'">
              <span v-if="state === 'idle'">Request demo</span>
              <span v-else-if="state === 'loading'" class="demo-spinner" aria-hidden="true"></span>
              <span v-else>Sent ✓</span>
            </button>
            <button type="button" class="btn-ghost" @click="$emit('close')">Cancel</button>
          </div>
          <p v-if="feedback" class="demo-form__feedback" :class="feedbackType === 'error' ? 'demo-form__feedback--err' : 'demo-form__feedback--ok'">
            {{ feedback }}
          </p>
        </form>
      </section>
    </div>
  </Transition>
</template>

<style scoped>
.demo-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  background: var(--bg-overlay);
  backdrop-filter: blur(10px);
}
.demo-modal {
  width: min(620px, 100%);
  border-radius: var(--radius-xl);
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  padding: 1.8rem;
  box-shadow: var(--shadow-lg);
}
.demo-modal__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}
.demo-modal__eyebrow {
  margin: 0 0 0.4rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.74rem;
  color: var(--brand);
  font-weight: 700;
}
.demo-modal__head h3 {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 1.6rem;
  letter-spacing: -0.01em;
  line-height: 1.18;
  color: var(--text-primary);
}
.demo-modal__close {
  width: 2rem;
  height: 2rem;
  border-radius: 99px;
  background: var(--bg-elevated);
  color: var(--text-secondary);
  border: 0;
  font-size: 1.3rem;
  cursor: pointer;
  line-height: 1;
}
.demo-modal__intro {
  margin: 0.6rem 0 1.5rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
}
.demo-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}
.demo-form__full { grid-column: 1 / -1; }
.demo-form label {
  display: grid;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
}
.demo-form input,
.demo-form textarea {
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 0.7rem 0.85rem;
  background: var(--bg-elevated);
  font: inherit;
  font-weight: 400;
  color: var(--text-primary);
  transition: border-color 180ms ease, box-shadow 180ms ease;
}
.demo-form input:focus,
.demo-form textarea:focus {
  outline: none;
  border-color: var(--brand);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand) 18%, transparent);
}
.demo-form textarea {
  resize: vertical;
  min-height: 100px;
}
.demo-form__actions {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 0.4rem;
}
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--brand);
  color: white;
  border: 0;
  padding: 0.75rem 1.25rem;
  font-size: 0.92rem;
  font-weight: 600;
  border-radius: var(--radius-pill);
  box-shadow: 0 8px 22px var(--brand-glow);
  cursor: pointer;
  min-width: 9rem;
  min-height: 2.7rem;
  transition: transform 180ms ease, background 180ms ease;
}
.btn-primary:hover { background: var(--brand-bright); transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.85; cursor: wait; }
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
  padding: 0.75rem 1.1rem;
  border-radius: var(--radius-pill);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 2.7rem;
}
.btn-ghost:hover {
  color: var(--text-primary);
  border-color: var(--border-strong);
}
.demo-spinner {
  width: 1.05rem;
  height: 1.05rem;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: white;
  border-radius: 99px;
  animation: spin 700ms linear infinite;
}
.demo-form__feedback {
  grid-column: 1 / -1;
  margin: 0.4rem 0 0;
  font-size: 0.9rem;
}
.demo-form__feedback--ok { color: #047857; }
.demo-form__feedback--err { color: #b42318; }

@keyframes spin { to { transform: rotate(360deg); } }

.demo-fade-enter-active, .demo-fade-leave-active {
  transition: opacity 220ms ease;
}
.demo-fade-enter-from, .demo-fade-leave-to { opacity: 0; }
.demo-fade-enter-active .demo-modal,
.demo-fade-leave-active .demo-modal {
  transition: transform 280ms var(--ease-spring), opacity 280ms ease;
}
.demo-fade-enter-from .demo-modal,
.demo-fade-leave-to .demo-modal {
  opacity: 0;
  transform: translateY(20px) scale(0.97);
}

@media (max-width: 580px) {
  .demo-form { grid-template-columns: 1fr; }
}
</style>
