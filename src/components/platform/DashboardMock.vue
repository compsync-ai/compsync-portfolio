<script setup>
import { onMounted, ref } from "vue";

const props = defineProps({
  variant: { type: String, default: "light" }
});

const linePath = ref("");
const lineFillPath = ref("");
const donutOffset = ref(0);

// Coordinates for the alert-volume line (matches the platform's curve roughly)
const points = [
  [0, 60], [40, 50], [80, 56], [120, 30], [160, 70], [200, 38],
  [240, 50], [280, 18], [320, 32], [360, 26], [400, 28], [440, 60], [480, 62]
];

function smoothLine(pts) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1];
    const [x2, y2] = pts[i];
    const cx = (x1 + x2) / 2;
    d += ` Q ${cx} ${y1}, ${cx} ${(y1 + y2) / 2} T ${x2} ${y2}`;
  }
  return d;
}

onMounted(() => {
  linePath.value = smoothLine(points);
  const closed = `${linePath.value} L ${points[points.length - 1][0]} 100 L 0 100 Z`;
  lineFillPath.value = closed;

  // Animate the donut stroke offset on mount
  setTimeout(() => {
    donutOffset.value = 1;
  }, 200);
});
</script>

<template>
  <article class="dash" :class="`dash--${variant}`" aria-hidden="true">
    <header class="dash__topbar">
      <div class="dash__brand">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
          <path d="M4 12L9 17L20 6" />
        </svg>
        <span>CompSync</span>
      </div>
      <div class="dash__search">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span>Search alerts, cases, entities…</span>
      </div>
      <div class="dash__user">
        <span class="dash__bell">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <em>5</em>
        </span>
        <div class="dash__avatar">JD</div>
      </div>
    </header>

    <div class="dash__body">
      <aside class="dash__nav">
        <p class="dash__nav-label">MONITOR</p>
        <ul>
          <li class="active"><span class="dot"></span>Dashboard</li>
          <li>Alerts</li>
          <li>Cases</li>
          <li>Transactions</li>
        </ul>
        <p class="dash__nav-label">INVESTIGATE</p>
        <ul>
          <li>Rules</li>
        </ul>
        <p class="dash__nav-label">OPERATIONS</p>
        <ul>
          <li>Ingestion</li>
          <li>Filings</li>
          <li>Reports</li>
        </ul>
      </aside>

      <section class="dash__main">
        <div class="dash__title">
          <h3>Welcome back, John</h3>
          <p>Here's your compliance monitoring overview for today.</p>
        </div>

        <div class="dash__kpis">
          <div class="kpi kpi--alerts">
            <p class="kpi__label">Open Alerts</p>
            <p class="kpi__value">14</p>
            <p class="kpi__delta kpi__delta--up">↗ +12% vs last month</p>
            <span class="kpi__icon">⚠</span>
          </div>
          <div class="kpi kpi--cases">
            <p class="kpi__label">Active Cases</p>
            <p class="kpi__value">2</p>
            <p class="kpi__delta kpi__delta--down">↘ −5% vs last month</p>
            <span class="kpi__icon">📋</span>
          </div>
          <div class="kpi kpi--rules">
            <p class="kpi__label">Rules Deployed</p>
            <p class="kpi__value">12</p>
            <p class="kpi__delta kpi__delta--up">↗ +2 vs last month</p>
            <span class="kpi__icon">⚖</span>
          </div>
          <div class="kpi kpi--flagged">
            <p class="kpi__label">Flagged This Month</p>
            <p class="kpi__value">$1.3M</p>
            <p class="kpi__delta kpi__delta--up">↗ +18% vs last month</p>
            <span class="kpi__icon">$</span>
          </div>
        </div>

        <div class="dash__charts">
          <div class="chart chart--volume">
            <header>
              <h4>Alert Volume</h4>
              <p>Daily counts · last 14 days</p>
            </header>
            <div class="chart__plot">
              <svg viewBox="0 0 480 100" preserveAspectRatio="none" class="chart__svg">
                <defs>
                  <linearGradient id="dashFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stop-color="var(--brand)" stop-opacity="0.4" />
                    <stop offset="1" stop-color="var(--brand)" stop-opacity="0" />
                  </linearGradient>
                </defs>
                <path :d="lineFillPath" fill="url(#dashFill)" />
                <path :d="linePath" fill="none" stroke="var(--brand)" stroke-width="2" stroke-linecap="round" />
                <g class="chart__dots">
                  <circle v-for="(pt, idx) in points" :key="idx" :cx="pt[0]" :cy="pt[1]" r="2.6" fill="var(--brand)" />
                </g>
              </svg>
              <div class="chart__axis">
                <span>Apr 3</span><span>Apr 7</span><span>Apr 11</span><span>Apr 15</span>
              </div>
            </div>
          </div>

          <div class="chart chart--distribution">
            <header>
              <h4>Alert Distribution</h4>
              <p>By status · all queues</p>
            </header>
            <div class="donut">
              <svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="44" fill="none" stroke="var(--bg-elevated)" stroke-width="14" />
                <circle
                  cx="60" cy="60" r="44" fill="none"
                  stroke="var(--brand)" stroke-width="14"
                  stroke-dasharray="276.46"
                  :stroke-dashoffset="276.46 - 156 * donutOffset"
                  transform="rotate(-90 60 60)"
                  stroke-linecap="butt"
                />
                <circle
                  cx="60" cy="60" r="44" fill="none"
                  stroke="#f59e0b" stroke-width="14"
                  stroke-dasharray="276.46"
                  :stroke-dashoffset="276.46 - 48 * donutOffset"
                  transform="rotate(67 60 60)"
                  stroke-linecap="butt"
                />
                <circle
                  cx="60" cy="60" r="44" fill="none"
                  stroke="#dc2626" stroke-width="14"
                  stroke-dasharray="276.46"
                  :stroke-dashoffset="276.46 - 24 * donutOffset"
                  transform="rotate(130 60 60)"
                  stroke-linecap="butt"
                />
                <circle
                  cx="60" cy="60" r="44" fill="none"
                  stroke="var(--text-tertiary)" stroke-width="14"
                  stroke-dasharray="276.46"
                  :stroke-dashoffset="276.46 - 48 * donutOffset"
                  transform="rotate(160 60 60)"
                  stroke-linecap="butt"
                />
                <text x="60" y="58" text-anchor="middle" class="donut__num">20</text>
                <text x="60" y="72" text-anchor="middle" class="donut__label">Total</text>
              </svg>
              <ul class="donut__legend">
                <li><span class="dot dot--brand"></span>Open</li>
                <li><span class="dot dot--warn"></span>In Review</li>
                <li><span class="dot dot--danger"></span>Escalated</li>
                <li><span class="dot dot--mute"></span>Closed</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="dash__recent">
          <header>
            <h4>Recent Alerts <span class="badge">5</span></h4>
            <span class="dash__recent-link">View all ›</span>
          </header>
          <table>
            <thead>
              <tr>
                <th>DATE</th><th>RULE</th><th>ENTITY</th><th>RISK</th><th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Apr 10, 2:34 PM</td>
                <td><strong>WIRE-003</strong><br /><span class="muted">ALT-5001</span></td>
                <td>Marcus Johnson</td>
                <td><span class="risk risk--high">86.2</span></td>
                <td><span class="pill pill--open">Open</span></td>
              </tr>
              <tr>
                <td>Apr 10, 2:34 PM</td>
                <td><strong>GEO-006</strong><br /><span class="muted">ALT-5002</span></td>
                <td>Marcus Johnson</td>
                <td><span class="risk risk--critical">94.5</span></td>
                <td><span class="pill pill--open">Open</span></td>
              </tr>
              <tr>
                <td>Apr 10, 2:35 PM</td>
                <td><strong>SAR-002</strong><br /><span class="muted">ALT-5003</span></td>
                <td>Marcus Johnson</td>
                <td><span class="risk risk--high">82.7</span></td>
                <td><span class="pill pill--open">Open</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </article>
</template>

<style scoped>
.dash {
  width: 100%;
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-lg);
  font-family: var(--font-sans);
  overflow: hidden;
  font-size: 12px;
  line-height: 1.4;
  color: var(--text-primary);
}

.dash__topbar {
  display: grid;
  grid-template-columns: 200px 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 10px 14px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-subtle);
}

.dash__brand {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  font-size: 13px;
  color: var(--brand);
}

.dash--dark .dash__brand {
  color: #2dd4bf;
}

.dash__search {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 28px;
  padding: 0 12px;
  border-radius: var(--radius-pill);
  background: var(--bg-elevated);
  color: var(--text-tertiary);
  font-size: 11px;
  max-width: 360px;
}

.dash__user {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary);
}

.dash__bell {
  position: relative;
}
.dash__bell em {
  position: absolute;
  top: -4px;
  right: -6px;
  width: 12px;
  height: 12px;
  border-radius: 99px;
  background: #ef4444;
  color: white;
  font-style: normal;
  font-size: 8px;
  display: grid;
  place-items: center;
}

.dash__avatar {
  width: 22px;
  height: 22px;
  border-radius: 99px;
  background: linear-gradient(180deg, var(--brand), var(--brand-deep));
  color: white;
  display: grid;
  place-items: center;
  font-size: 9px;
  font-weight: 700;
}

.dash__body {
  display: grid;
  grid-template-columns: 200px 1fr;
}

.dash__nav {
  background: var(--bg-surface);
  border-right: 1px solid var(--border-subtle);
  padding: 14px 10px;
}

.dash--dark .dash__nav {
  background: linear-gradient(180deg, #0a1814 0%, #051210 100%);
  border-right-color: rgba(159, 224, 212, 0.06);
}

.dash__nav-label {
  text-transform: uppercase;
  font-size: 9px;
  letter-spacing: 0.12em;
  color: var(--text-tertiary);
  margin: 10px 6px 6px;
}
.dash__nav-label:first-child { margin-top: 4px; }

.dash__nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 2px;
}
.dash__nav li {
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 500;
}
.dash__nav li.active {
  background: var(--brand-soft);
  color: var(--brand-deep);
  font-weight: 600;
}
.dash--dark .dash__nav li {
  color: #9bb1ad;
}
.dash--dark .dash__nav li.active {
  background: rgba(15, 143, 122, 0.18);
  color: #2dd4bf;
}
.dash__nav li.active .dot {
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 99px;
  background: var(--brand);
  margin-right: 8px;
  vertical-align: middle;
}
.dash--dark .dash__nav li.active .dot { background: #2dd4bf; }

.dash__main {
  padding: 16px;
  background: var(--bg-elevated);
  display: grid;
  gap: 14px;
}
.dash--dark .dash__main {
  background: #050b0a;
}

.dash__title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.dash__title p {
  margin: 4px 0 0;
  color: var(--text-tertiary);
  font-size: 11px;
}

.dash__kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.kpi {
  position: relative;
  padding: 10px 12px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--brand);
  overflow: hidden;
}
.kpi--alerts { border-left-color: #f59e0b; }
.kpi--cases  { border-left-color: #2dd4bf; }
.kpi--rules  { border-left-color: #8b5cf6; }
.kpi--flagged { border-left-color: #ef4444; }

.kpi__label {
  margin: 0;
  font-size: 10px;
  color: var(--text-tertiary);
  letter-spacing: 0.02em;
}
.kpi__value {
  margin: 2px 0 4px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.kpi__delta {
  margin: 0;
  font-size: 9px;
  color: var(--text-tertiary);
}
.kpi__delta--up { color: #10b981; }
.kpi__delta--down { color: #dc2626; }
.kpi__icon {
  position: absolute;
  top: 10px;
  right: 12px;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: var(--bg-elevated);
  display: grid;
  place-items: center;
  font-size: 12px;
  opacity: 0.7;
}

.dash__charts {
  display: grid;
  grid-template-columns: 1.7fr 1fr;
  gap: 10px;
}
.chart {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 12px;
  display: grid;
  gap: 8px;
}
.chart header h4 {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
}
.chart header p {
  margin: 2px 0 0;
  color: var(--text-tertiary);
  font-size: 9px;
}
.chart__plot {
  position: relative;
  height: 120px;
}
.chart__svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}
.chart__axis {
  display: flex;
  justify-content: space-between;
  font-size: 8px;
  color: var(--text-tertiary);
  padding-top: 4px;
}
.donut {
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  gap: 10px;
}
.donut svg {
  width: 100%;
  height: auto;
}
.donut__num {
  font-size: 16px;
  font-weight: 700;
  fill: var(--text-primary);
}
.donut__label {
  font-size: 7px;
  fill: var(--text-tertiary);
}
.donut__legend {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 4px;
  font-size: 9px;
  color: var(--text-secondary);
}
.donut__legend li {
  display: flex;
  align-items: center;
  gap: 6px;
}
.dot {
  width: 7px;
  height: 7px;
  border-radius: 99px;
  display: inline-block;
}
.dot--brand { background: var(--brand); }
.dot--warn { background: #f59e0b; }
.dot--danger { background: #dc2626; }
.dot--mute { background: var(--text-tertiary); }

.dash__recent {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 12px;
}
.dash__recent header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.dash__recent h4 {
  margin: 0;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.badge {
  background: var(--bg-elevated);
  padding: 1px 6px;
  border-radius: 99px;
  font-size: 9px;
  font-weight: 500;
  color: var(--text-tertiary);
}
.dash__recent-link {
  font-size: 10px;
  color: var(--brand);
  font-weight: 600;
}
.dash__recent table {
  width: 100%;
  border-collapse: collapse;
  font-size: 10px;
}
.dash__recent th {
  text-align: left;
  font-weight: 600;
  font-size: 9px;
  color: var(--text-tertiary);
  letter-spacing: 0.04em;
  padding: 4px 6px;
  border-bottom: 1px solid var(--border-subtle);
}
.dash__recent td {
  padding: 8px 6px;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-primary);
  vertical-align: top;
}
.dash__recent tr:last-child td { border-bottom: 0; }
.muted {
  color: var(--text-tertiary);
  font-size: 9px;
}
.risk {
  font-weight: 600;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 6px;
}
.risk--high { background: rgba(245, 158, 11, 0.14); color: #f59e0b; }
.risk--critical { background: rgba(239, 68, 68, 0.16); color: #ef4444; }
.pill {
  font-size: 9px;
  padding: 2px 7px;
  border-radius: 99px;
  font-weight: 600;
}
.pill--open {
  background: rgba(15, 143, 122, 0.12);
  color: var(--brand);
}
</style>
