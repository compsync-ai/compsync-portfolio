<script setup>
import { onMounted } from "vue";
import AppHeader from "./components/layout/AppHeader.vue";
import AppFooter from "./components/layout/AppFooter.vue";
import { jumpToSection } from "./router";
import {
  alertFeed,
  capabilities,
  heroStats,
  navLinks,
  workflow
} from "./data/project";

onMounted(() => {
  if (window.location.hash) jumpToSection(window.location.hash);
});
</script>

<template>
  <AppHeader :links="navLinks" />

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
        <div class="hero__cta">
          <a href="#contact" class="btn btn--primary">Request a Live Demo</a>
          <a href="#monitoring" class="btn btn--ghost">See Monitoring Flow</a>
        </div>
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
      <div class="workflow-track">
        <article v-for="step in workflow" :key="step.title" class="workflow-step reveal">
          <p class="workflow-step__title">{{ step.title }}</p>
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
        <a href="#contact" class="btn btn--primary">Talk to CompSync</a>
      </div>
    </section>
    
  </main>

  <AppFooter />
</template>
