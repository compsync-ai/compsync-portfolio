---
title: Explainable rules, how we ship dynamic models without losing examiner trust
excerpt: A practical look at how CompSync structures risk scoring so every alert can be unwound back to a rule, a signal, and a threshold.
tag: Engineering
readMinutes: 8
publishedAt: 2026-04-08
---

When we set out to build CompSync's rule engine, we had one non-negotiable: every alert had to be defensible. Not "explainable" in the soft sense. *Defensible*, with a rule ID, an underlying signal, and a numeric threshold you could point at during a regulator walkthrough.

This is harder than it sounds the moment you start mixing behavior models with static rules.

## The two kinds of rules

CompSync runs two classes of rule:

- **Static rules.** Classic threshold-based detections (e.g. "more than $10,000 in cumulative cash deposits in 24h"). These are obvious to read, easy to defend, and produce a lot of false positives.
- **Dynamic models.** Behavior-aware scoring that adjusts thresholds based on an entity's transaction baseline, velocity profile, and graph relationships.

Most teams want both. The trick is keeping them inside the same audit envelope.

## What we do differently

The CompSync approach is built on three commitments:

### 1. Every signal has a name

Inside the model, signals like `velocity_z_score_24h`, `geo_distance_to_baseline`, or `recipient_first_seen_days` are first-class. They have human-readable definitions, version numbers, and changelogs. When an alert references a signal, the case detail page shows the signal's value, its name, and what it means.

### 2. Every rule has a shadow period

New rules, static or dynamic, run in **Shadow** mode for a configurable period (default 14 days) before they can be promoted to **Live**. During shadow, the rule fires against real traffic but doesn't open alerts. You see exactly how many alerts it *would* have created and against which entities.

This isn't novel. What's slightly novel is that we keep the shadow data forever, so when you tune a rule six months later, the historical shadow comparison is still there.

### 3. AI suggestions never bypass the audit trail

When the system surfaces "AI recommendations for further investigation" on an alert, those recommendations are model output, but they're recorded in the case log with the model version and a numeric confidence score. An analyst can accept, reject, or ignore them, and that action is itself logged.

## Why this matters

The first question a sharp examiner asks is some version of: "How would I reproduce this alert if I needed to?"

If the answer requires opening Jupyter, the program isn't defensible. If the answer is one URL pointing at one case with one rule ID and one signal stack, the program is defensible. The rest of the conversation becomes about *priorities*, not *trust*.

That's the conversation we want compliance teams to be having. So that's the system we built.
