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
