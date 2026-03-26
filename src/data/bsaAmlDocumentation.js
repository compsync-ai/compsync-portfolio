export const documentationMeta = {
  eyebrow: "CompSync Documentation",
  title: "BSA/AML Monitoring Coverage",
  description:
    "A client-facing summary of the monitoring rules we can cover, the implementation approach, and the threshold ranges commonly used for alerting.",
  navLinks: [
    { label: "Overview", href: "#overview" },
    { label: "Coverage", href: "#coverage" },
    { label: "Rules", href: "#rules" }
  ]
};

export const quickFacts = [
  { label: "Sample Rules", value: "4" },
  { label: "Threshold Model", value: "Configurable" },
  { label: "Market", value: "United States" }
];

export const ruleSections = [
  {
    id: "cash-and-structuring",
    title: "Cash And Structuring Monitors",
    summary:
      "These rules focus on reportable cash activity and suspicious attempts to break larger activity into smaller transactions to avoid thresholds.",
    rules: [
      {
        id: "cash-transaction-monitor",
        title: "Cash Transaction Monitor",
        coverage:
          "Monitors large cash activity that may require currency reporting and highlights transactions that cross common reporting thresholds.",
        implementation:
          "When a single cash transaction exceeds the reporting limit, the system routes the event to case management so the compliance team can review and file CTR where required.",
        thresholdLabel: "Common threshold",
        thresholdValue: "Single cash transaction > $10,000",
        thresholds: [
          "Single cash transaction above $10,000 should be reviewed for CTR filing.",
          "Aggregation logic can also be applied across same-day activity when required by institution policy."
        ]
      },
      {
        id: "transaction-structuring-detection",
        title: "Transaction Structuring Detection",
        coverage:
          "Detects customers breaking a larger amount into multiple smaller transactions across several days or within a repeating monthly pattern.",
        implementation:
          "Transaction Monitoring should watch a rolling window for fragmented cash or transfer activity, link the related transactions, and raise a suspicious activity alert for compliance review.",
        thresholdLabel: "Common threshold window",
        thresholdValue: "7 to 10 day rolling review",
        thresholds: [
          "Example pattern: $15,000 split into $6,000 on day 1, $4,000 on day 3, and $5,000 on day 4.",
          "TMT should monitor 7 to 10 days of activity to detect this behavior.",
          "Monthly repetition should also be reviewed if similar patterns happen one or two times over a monthly period."
        ]
      },
      {
        id: "multi-person-structuring",
        title: "Multi-Person Structuring",
        coverage:
          "Flags activity where multiple people break one larger transaction into separate smaller transactions to stay below a known threshold.",
        implementation:
          "The rule should connect related senders, recipients, timestamps, and transaction values to identify coordinated threshold avoidance behavior.",
        thresholdLabel: "Common example",
        thresholdValue: "$3,000 recordkeeping threshold",
        thresholds: [
          "Example: one person wants to send $5,000 but instead sends $2,500 and has another person send $2,500.",
          "This should be reviewed as potential structuring around the $3,000 funds transfer recordkeeping threshold."
        ]
      }
    ]
  },
  {
    id: "movement-and-behavior",
    title: "Movement And Behavioral Monitors",
    summary:
      "These rules focus on unusual movement of funds and abrupt behavioral change that may indicate layering, mule activity, or account misuse.",
    rules: [
      {
        id: "rapid-movement-of-funds",
        title: "Rapid Movement Of Funds",
        coverage:
          "Detects inbound funds that are quickly withdrawn, transferred, or moved onward to another customer within a short time period.",
        implementation:
          "The rule should track the age of the account, inbound transaction volume, and whether outgoing movement happens within 24 to 48 hours after funds are received.",
        thresholdLabel: "Common thresholds",
        thresholdValue: "24 to 48 hour movement window",
        thresholds: [
          "Example: Customer A sends a $20,000 wire to Customer B and Customer B cashes out or sends funds to Customer C within 24 to 48 hours.",
          "If account age is 24 hours or less and inbound total in 24 hours is at least $5,000 with one or more outbound transactions, risk can be set to Medium.",
          "If account age is 24 hours or less and inbound total in 24 hours is at least $9,000 with one or more outbound transactions, risk can be set to High."
        ]
      },
      {
        id: "dormant-account-activity",
        title: "Dormant Account Reactivation",
        coverage:
          "Highlights accounts that were inactive for an extended period and then suddenly show large or unusual transaction activity.",
        implementation:
          "The monitor should compare current activity to the historical inactivity period and alert when a reactivated account receives or sends materially larger transactions than expected.",
        thresholdLabel: "Common threshold approach",
        thresholdValue: "Dormancy period plus large-value trigger",
        thresholds: [
          "Example condition: no meaningful activity for multiple months followed by a large incoming or outgoing transaction.",
          "Institutions usually define both the dormancy period and the large-transaction amount based on their own account base."
        ]
      }
    ]
  }
];
