<script setup>
import { computed, ref } from "vue";
import brandLogo from "../assets/logo-compsync.svg";
import {
  documentationMeta,
  quickFacts,
  ruleSections
} from "../data/bsaAmlDocumentation";

const totalRules = computed(() =>
  ruleSections.reduce((count, section) => count + section.rules.length, 0)
);

const defaultOpenSectionId = ruleSections[0]?.id ?? null;
const defaultOpenRuleId = ruleSections[0]?.rules[0]?.id ?? null;
const openSectionIds = ref(defaultOpenSectionId ? [defaultOpenSectionId] : []);
const openRuleIds = ref(defaultOpenRuleId ? [defaultOpenRuleId] : []);

function toggleSection(sectionId) {
  if (openSectionIds.value.includes(sectionId)) {
    openSectionIds.value = openSectionIds.value.filter((id) => id !== sectionId);
    return;
  }

  openSectionIds.value = [...openSectionIds.value, sectionId];

  const section = ruleSections.find((item) => item.id === sectionId);
  const firstRuleId = section?.rules[0]?.id;

  if (firstRuleId && !openRuleIds.value.includes(firstRuleId)) {
    openRuleIds.value = [...openRuleIds.value, firstRuleId];
  }
}

function isSectionOpen(sectionId) {
  return openSectionIds.value.includes(sectionId);
}

function toggleRule(ruleId) {
  openRuleIds.value = openRuleIds.value.includes(ruleId)
    ? openRuleIds.value.filter((id) => id !== ruleId)
    : [...openRuleIds.value, ruleId];
}

function isRuleOpen(ruleId) {
  return openRuleIds.value.includes(ruleId);
}
</script>

<template>
  <div class="documentation-page">
    <header class="docs-header">
      <div class="docs-container docs-header__inner">
        <a href="/" class="docs-brand" aria-label="Back to CompSync home">
          <img :src="brandLogo" alt="CompSync logo" class="docs-brand__logo" />
        </a>

        <nav class="docs-topnav" aria-label="Documentation navigation">
          <a href="/" class="docs-back-button">Back to Site</a>
        </nav>
      </div>
    </header>

    <main class="docs-shell">
      <section id="overview" class="docs-hero docs-container">
        <div class="docs-hero__copy">
          <p class="eyebrow">{{ documentationMeta.eyebrow }}</p>
          <h1>{{ documentationMeta.title }}</h1>
          <p class="docs-hero__lead">{{ documentationMeta.description }}</p>
        </div>

        <div class="docs-hero__stats">
          <article class="docs-stat docs-stat--primary">
            <p class="docs-stat__value">{{ totalRules }}</p>
            <p class="docs-stat__label">Rules covered in this sample</p>
          </article>
          <article v-for="fact in quickFacts" :key="fact.label" class="docs-stat">
            <p class="docs-stat__value">{{ fact.value }}</p>
            <p class="docs-stat__label">{{ fact.label }}</p>
          </article>
        </div>
      </section>

      <section id="rules" class="docs-container docs-rules">
        <div class="section-heading section-heading--compact">
          <p class="eyebrow">Rules</p>
          <h2>Sample monitoring rules and thresholds</h2>
          <p>
            The thresholds below are common starting points. They can be adjusted for each
            institution based on policy, customer base, transaction volume, and risk appetite.
          </p>
        </div>

        <section
          v-for="section in ruleSections"
          :id="section.id"
          :key="section.id"
          class="rule-section"
          :class="{ 'rule-section--open': isSectionOpen(section.id) }"
        >
          <button
            type="button"
            class="rule-section__toggle"
            :aria-expanded="isSectionOpen(section.id)"
            @click="toggleSection(section.id)"
          >
            <div class="rule-section__head">
              <div>
                <h3>{{ section.title }}</h3>
                <p>{{ section.summary }}</p>
              </div>
              <span class="rule-section__icon" aria-hidden="true">⌄</span>
            </div>
          </button>

          <div v-if="isSectionOpen(section.id)" class="rule-section__content">
            <article
              v-for="rule in section.rules"
              :id="rule.id"
              :key="rule.id"
              class="rule-entry"
              :class="{ 'rule-entry--open': isRuleOpen(rule.id) }"
            >
              <button
                type="button"
                class="rule-entry__toggle"
                :aria-expanded="isRuleOpen(rule.id)"
                @click="toggleRule(rule.id)"
              >
                <div class="rule-entry__top">
                  <div>
                    <h4>{{ rule.title }}</h4>
                    <p class="rule-entry__coverage">{{ rule.coverage }}</p>
                  </div>
                  <span class="rule-entry__icon" aria-hidden="true">⌄</span>
                </div>
              </button>

              <div v-if="isRuleOpen(rule.id)" class="rule-entry__details">
                <div>
                  <p class="rule-entry__label">Implementation</p>
                  <p>{{ rule.implementation }}</p>
                </div>

                <div class="rule-entry__threshold-row">
                  <div>
                    <p class="rule-entry__label">Threshold Logic</p>
                    <ul class="rule-list">
                      <li v-for="item in rule.thresholds" :key="item">{{ item }}</li>
                    </ul>
                  </div>

                  <div class="threshold-chip">
                    <span>{{ rule.thresholdLabel }}</span>
                    <strong>{{ rule.thresholdValue }}</strong>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
      </section>
    </main>

    <footer class="docs-footer">
      <div class="docs-container docs-footer__inner">
        <div>
          <p class="docs-footer__brand">CompSync, Inc.</p>
          <p class="docs-footer__text">
            Sample documentation for discussing monitoring coverage and configurable thresholds with clients.
          </p>
        </div>
        <p class="docs-footer__note">
          Thresholds shown here are examples and can be customized to match each institution's policies.
        </p>
      </div>
    </footer>
  </div>
</template>

<style src="../assets/styles/documentation.css"></style>
