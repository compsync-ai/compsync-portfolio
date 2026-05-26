export const navLinks = [
  { label: "Platform", href: "#platform" },
  { label: "Monitoring", href: "#monitoring" },
  { label: "Intelligence", href: "#intelligence" },
  { label: "Contact", href: "#contact" }
];

export const heroStats = [
  { value: "Early Access", label: "Product stage" },
  { value: "< 45s", label: "Average case triage time" },
  { value: "30+", label: "Regulatory rule packs" }
];

export const capabilities = [
  {
    title: "Real-Time Transaction Monitoring",
    description:
      "Stream card, wire, and wallet activity through configurable risk rules and behavior-based anomaly detection.",
    icon: "pulse"
  },
  {
    title: "Structuring + Pattern Detection",
    description:
      "Identify smurfing, layering, rapid movement chains, and amount fragmentation before suspicious activity escalates.",
    icon: "pattern"
  },
  {
    title: "Case Management + Audit Trail",
    description:
      "Convert alerts into explainable cases with analyst actions, evidence logs, and export-ready records for exams.",
    icon: "audit"
  },
  {
    title: "Multi-Jurisdiction Policy Engine",
    description:
      "Map controls to FATF, AML/CFT, and local obligations so policy checks align across every market you operate in.",
    icon: "shield"
  }
];

export const workflow = [
  {
    title: "Ingest",
    text: "Normalize transaction, customer, and device signals from core banking systems and payment rails."
  },
  {
    title: "Score",
    text: "Run configurable risk models combining static rules, thresholds, and behavior graph indicators."
  },
  {
    title: "Escalate",
    text: "Auto-route high-confidence events to analysts with pre-attached context and policy references."
  },
  {
    title: "Report",
    text: "Generate exam-ready logs and reporting exports with immutable event history."
  }
];

export const alertFeed = [
  {
    label: "Possible Structuring",
    customer: "Business Wallet 4721",
    risk: "High",
    amount: "$48,900 over 7 txns"
  },
  {
    label: "Unusual Geo Pattern",
    customer: "Retail Account 9038",
    risk: "Medium",
    amount: "$12,200 cross-border"
  },
  {
    label: "Rapid Velocity Spike",
    customer: "Merchant Profile 118",
    risk: "High",
    amount: "39 txns in 14 minutes"
  }
];

export const industries = [
  {
    key: "banks",
    title: "Banks & Credit Unions",
    summary:
      "BSA/AML programs with full audit trails, FinCEN-ready exports, and examiner-grade reporting.",
    needs: ["Examiner-ready reports", "FFIEC alignment", "Multi-jurisdiction policy"]
  },
  {
    key: "fintechs",
    title: "Fintechs & Neo-banks",
    summary:
      "Move fast on product without losing oversight. Programmable rules, behavior models, and case workflows your ops team can actually use.",
    needs: ["Configurable rule engine", "API-first ingestion", "Velocity & ATO detection"]
  },
  {
    key: "payments",
    title: "Payment Processors",
    summary:
      "Real-time monitoring across wires, ACH, P2P, and card with low false-positive triage built in.",
    needs: ["Cross-rail correlation", "Real-time scoring", "Merchant risk profiles"]
  },
  {
    key: "crypto",
    title: "Crypto & Digital Asset",
    summary:
      "Travel rule, sanctions screening, and wallet-graph analysis as primary signals, not bolt-ons.",
    needs: ["Travel rule workflow", "Wallet attribution", "OFAC / FATF screening"]
  }
];

export const platformPillars = [
  {
    tag: "Real-time",
    title: "Stream every event through the rule engine.",
    body:
      "Ingest wires, ACH, P2P, card, and wallet activity through a single schema. Score in milliseconds against deployed rules and behavior models.",
    metric: "<45s avg case triage"
  },
  {
    tag: "Behavior",
    title: "Detect what static thresholds miss.",
    body:
      "Velocity spikes, structuring, layering, account takeover, and unusual geographic patterns. Surfaced as explainable risk scores with the underlying signals attached.",
    metric: "30+ rule packs ready"
  },
  {
    tag: "Casework",
    title: "Investigate without the swivel-chair.",
    body:
      "Cases auto-assemble with entity history, KYC artifacts, OFAC/FinCEN checks, and AI-suggested next steps. Every action lands on the audit trail.",
    metric: "Examiner-ready by default"
  },
  {
    tag: "Reporting",
    title: "Program health you can hand to your board.",
    body:
      "SAR conversion funnel, alert aging, false-positive rates, training completion. All mapped to FFIEC examiner findings and regulator-ready exports.",
    metric: "FinCEN, FATF, AML/CFT"
  }
];

export const workflowNarrative = [
  {
    step: "01",
    title: "Ingest",
    body: "Normalize transactions, customers, devices, and KYC artifacts from core banking and payment rails.",
    sublines: ["wires · ACH · P2P · cards · wallets", "schema-validated · 50MB+ batches"]
  },
  {
    step: "02",
    title: "Score",
    body: "Run rules, behavior models, and graph indicators in real-time. Every score is explainable.",
    sublines: ["dynamic models · shadow rules", "static thresholds · velocity graphs"]
  },
  {
    step: "03",
    title: "Investigate",
    body: "Auto-routed cases arrive with entity history, AI recommendations, and a guided checklist.",
    sublines: ["OFAC / FATF screening", "guided checklist · evidence log"]
  },
  {
    step: "04",
    title: "Report",
    body: "FinCEN SAR/CTR filings, program-health metrics, examiner-ready audit trail.",
    sublines: ["FinCEN SAR · CTR · 314(a)", "BPI benchmarking · FFIEC alignment"]
  }
];

export const blogTeasers = [
  {
    slug: "occ-cfsb-consent-order",
    title: "What the OCC just told every sponsor bank, and what CompSync was built to fix",
    excerpt:
      "The OCC's April 24 consent order against Community Federal Savings Bank is a clean map of the failure modes that take down sponsor-bank programs, and a checklist of what CompSync was built to prevent.",
    excerptHtml:
      "The OCC's April 24 consent order against <strong>Community Federal Savings Bank</strong> is a clean map of the failure modes that take down sponsor-bank programs, and a checklist of what CompSync was built to prevent.",
    tag: "Regulatory",
    readMinutes: 6,
    publishedAt: "2026-05-22"
  }
];

export const founderNote = {
  quote:
    "Compliance teams shouldn't choose between speed and audit trail. CompSync is the operating system we wished we had when we ran compliance ourselves.",
  attribution: "The CompSync founding team"
};

export const heroHeadline = {
  eyebrow: "Compliance infrastructure for modern finance",
  title: "Real-time transaction monitoring with audit trails examiners trust.",
  lead:
    "Stream every transaction through configurable rules and behavior models, investigate alerts as fully-assembled cases, and ship FinCEN-ready filings. All on one platform."
};

export const trustBar = [
  "Built for FFIEC examiner-readiness",
  "FinCEN SAR & CTR ready",
  "FATF / AML-CFT aligned",
  "SOC 2 architecture"
];
