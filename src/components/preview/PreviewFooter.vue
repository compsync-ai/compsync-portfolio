<script setup>
import brandLogo from "../../assets/logo-compsync.svg";
defineProps({ variant: { type: String, default: "light" } });
</script>

<template>
  <footer class="preview-footer">
    <div class="preview-footer__inner">
      <div class="preview-footer__brand">
        <div class="preview-footer__logo">
          <img :src="brandLogo" alt="" width="26" height="26" class="preview-footer__logo-img" />
          <span>CompSync</span>
        </div>
        <p>Compliance infrastructure for banks, fintechs, and payment processors.</p>
      </div>

      <div class="preview-footer__links">
        <div>
          <p class="preview-footer__label">Product</p>
          <ul>
            <li><a href="#platform">Platform</a></li>
            <li><a href="#workflow">Workflow</a></li>
            <li><a href="#industries">Industries</a></li>
          </ul>
        </div>
        <div>
          <p class="preview-footer__label">Resources</p>
          <ul>
            <li><router-link to="/blog">Blog</router-link></li>
            <li><a href="mailto:team@compsync.us">Contact</a></li>
          </ul>
        </div>
        <div>
          <p class="preview-footer__label">Compliance</p>
          <ul>
            <li>
              <a
                href="https://bsaaml.ffiec.gov/manual"
                target="_blank"
                rel="noopener noreferrer"
                class="preview-footer__ext"
              >
                FFIEC BSA/AML Manual
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true">
                  <path d="M7 17L17 7M9 7h8v8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </a>
            </li>
            <li>
              <a
                href="https://www.fincen.gov/resources/statutes-regulations"
                target="_blank"
                rel="noopener noreferrer"
                class="preview-footer__ext"
              >
                FinCEN Regulations
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true">
                  <path d="M7 17L17 7M9 7h8v8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </a>
            </li>
            <li>
              <a
                href="https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html"
                target="_blank"
                rel="noopener noreferrer"
                class="preview-footer__ext"
              >
                FATF Recommendations
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true">
                  <path d="M7 17L17 7M9 7h8v8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="preview-footer__base">
      <p>© 2026 CompSync, Inc.</p>
      <p>Built for compliance teams who'd rather investigate than tune dashboards.</p>
    </div>
  </footer>
</template>

<style scoped>
.preview-footer {
  border-top: 1px solid var(--border-subtle);
  background: var(--bg-surface);
  margin-top: var(--space-9);
}
.preview-footer__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--space-7) var(--space-5) var(--space-5);
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: var(--space-7);
}
.preview-footer__brand p {
  margin-top: var(--space-3);
  color: var(--text-secondary);
  font-size: 0.92rem;
  max-width: 32ch;
  line-height: 1.6;
}
.preview-footer__logo {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--text-primary);
}
.preview-footer__logo-img {
  display: block;
  border-radius: 7px;
}
.preview-footer__links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
}
.preview-footer__label {
  margin: 0 0 var(--space-3);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  font-weight: 700;
}
.preview-footer ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--space-2);
  color: var(--text-secondary);
  font-size: 0.92rem;
}
.preview-footer a {
  color: inherit;
  transition: color 180ms ease;
}
.preview-footer a:hover { color: var(--brand); }
.preview-footer__ext {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}
.preview-footer__ext svg {
  opacity: 0.55;
  transition: opacity 180ms ease, transform 180ms var(--ease-out-quint);
}
.preview-footer__ext:hover svg {
  opacity: 1;
  transform: translate(1px, -1px);
}
.preview-footer__base {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--space-4) var(--space-5);
  border-top: 1px solid var(--border-subtle);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  font-size: 0.84rem;
  color: var(--text-tertiary);
}
@media (max-width: 880px) {
  .preview-footer__inner { grid-template-columns: 1fr; }
  .preview-footer__links { grid-template-columns: 1fr 1fr; }
  .preview-footer__base { flex-direction: column; align-items: flex-start; }
}
</style>
