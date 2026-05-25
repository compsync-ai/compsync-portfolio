<script setup>
defineProps({ variant: { type: String, default: "light" } });
</script>

<template>
  <article class="drawer" :class="`drawer--${variant}`" aria-hidden="true">
    <header class="drawer__head">
      <div class="drawer__head-row">
        <span class="drawer__id">ALT-5001</span>
        <span class="drawer__pill drawer__pill--open">Open</span>
        <span class="drawer__risk">86.2</span>
        <span class="drawer__head-actions">
          <button>Open Case</button>
        </span>
      </div>
      <h4>WIRE-003: High-Value International Wire, High-Risk Jurisdiction</h4>
    </header>

    <div class="drawer__row">
      <div>
        <p class="drawer__label">Entity</p>
        <p class="drawer__value">Marcus Johnson</p>
      </div>
      <div>
        <p class="drawer__label">Amount</p>
        <p class="drawer__value">$67,500.00</p>
      </div>
      <div>
        <p class="drawer__label">Deadline</p>
        <p class="drawer__value drawer__value--accent">10 days</p>
      </div>
    </div>

    <section>
      <p class="drawer__section-label">Flagged activity</p>
      <p class="drawer__body">
        Marcus Johnson initiated a high-value international wire transfer of $67,500.00 to a financial institution in a jurisdiction identified as high-risk by FATF or applicable regulatory advisories.
      </p>
    </section>

    <section class="drawer__score">
      <div class="drawer__score-num">86.2</div>
      <div>
        <p class="drawer__score-tag">High risk. Immediate review required</p>
        <p class="drawer__score-body">Rule <strong>WIRE-003</strong> triggered on Apr 10, 2:34 PM. Threshold breach detected based on transaction velocity and entity risk profile.</p>
      </div>
    </section>

    <section>
      <p class="drawer__section-label">Triggered transaction</p>
      <div class="drawer__txn">
        <div>
          <p class="drawer__txn-id">TXN-10012</p>
          <p class="drawer__txn-meta">Apr 10, 2:33 PM</p>
        </div>
        <span class="drawer__pill drawer__pill--wire">Wire Out</span>
        <span class="drawer__txn-route">Marcus Johnson → Adeyemi Holdings Ltd</span>
      </div>
    </section>

    <section>
      <p class="drawer__section-label">AI recommendations for further investigation</p>
      <ol class="drawer__rec">
        <li><span>1</span> Verify the entity's documented business relationship with the receiving institution and destination jurisdiction.</li>
        <li><span>2</span> Request signed supporting documentation for the wire transfer purpose, including beneficiary identity confirmation.</li>
        <li><span>3</span> Screen the recipient against current OFAC SDN and FinCEN advisories.</li>
      </ol>
    </section>
  </article>
</template>

<style scoped>
.drawer {
  width: 100%;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 1.25rem 1.35rem 1.4rem;
  display: grid;
  gap: 1rem;
  font-family: var(--font-sans);
  font-size: 12.5px;
  color: var(--text-primary);
}

.drawer__head-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.55rem;
}
.drawer__id {
  font-family: var(--font-mono);
  font-size: 0.74rem;
  color: var(--brand);
  font-weight: 600;
}
.drawer__pill {
  font-size: 0.68rem;
  padding: 0.16rem 0.5rem;
  border-radius: 99px;
  font-weight: 600;
}
.drawer__pill--open {
  background: rgba(15, 143, 122, 0.14);
  color: var(--brand);
}
.drawer__pill--wire {
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
}
.drawer__risk {
  background: rgba(245, 158, 11, 0.18);
  color: #d97706;
  font-size: 0.68rem;
  padding: 0.16rem 0.5rem;
  border-radius: 99px;
  font-weight: 700;
}
.drawer__head-actions { margin-left: auto; }
.drawer__head-actions button {
  background: var(--bg-elevated);
  color: var(--brand);
  border: 1px solid var(--border-subtle);
  padding: 0.3rem 0.6rem;
  border-radius: 99px;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
}
.drawer__head h4 {
  margin: 0;
  font-size: 0.96rem;
  line-height: 1.32;
  font-weight: 700;
  color: var(--text-primary);
}

.drawer__row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8rem;
  padding: 0.7rem 0;
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
}
.drawer__label {
  margin: 0;
  font-size: 0.66rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  font-weight: 600;
}
.drawer__value {
  margin: 0.18rem 0 0;
  font-size: 0.92rem;
  font-weight: 600;
}
.drawer__value--accent { color: #f59e0b; }

.drawer__section-label {
  margin: 0 0 0.35rem;
  font-size: 0.66rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  font-weight: 700;
}
.drawer__body {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.84rem;
  line-height: 1.55;
}
.drawer__score {
  display: grid;
  grid-template-columns: 56px 1fr;
  align-items: center;
  gap: 0.9rem;
  padding: 0.8rem;
  background: var(--bg-elevated);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
}
.drawer__score-num {
  width: 56px;
  height: 56px;
  border-radius: 99px;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: white;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 1rem;
}
.drawer__score-tag {
  margin: 0;
  color: #b91c1c;
  font-weight: 600;
  font-size: 0.82rem;
}
.drawer__score-body {
  margin: 0.25rem 0 0;
  color: var(--text-secondary);
  font-size: 0.78rem;
  line-height: 1.5;
}

.drawer__txn {
  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: 0.7rem;
  align-items: center;
  padding: 0.55rem 0.7rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
  font-size: 0.78rem;
}
.drawer__txn-id { margin: 0; font-family: var(--font-mono); font-weight: 600; }
.drawer__txn-meta { margin: 0.1rem 0 0; color: var(--text-tertiary); font-size: 0.7rem; }
.drawer__txn-route { color: var(--text-secondary); font-size: 0.78rem; }

.drawer__rec {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.5rem;
}
.drawer__rec li {
  display: grid;
  grid-template-columns: 20px 1fr;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.5;
}
.drawer__rec li span {
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--brand);
  font-size: 0.78rem;
  padding-top: 0.05rem;
}
</style>
