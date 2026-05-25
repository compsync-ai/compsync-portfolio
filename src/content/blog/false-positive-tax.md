---
title: The false positive tax, and a five-question audit you can run today
excerpt: Most BSA teams accept 60-80% false positive rates as normal. They shouldn't. Here's how to actually measure (and reduce) yours.
tag: Operations
readMinutes: 5
publishedAt: 2026-03-19
---

If you're running a BSA/AML program at a mid-sized bank or fintech, your false positive rate is almost certainly higher than 60%. At most programs we've audited, the true figure is closer to 80%.

The reason isn't bad analysts. The reason isn't even bad rules. It's that nobody is measuring the right denominator.

## What "false positive" actually means

Most platforms report false positives as `alerts closed without escalation / total alerts`. This is fine until you realize "closed without escalation" covers two very different decisions:

- The activity was reviewed and judged non-suspicious.
- The activity was *never reviewable*. The alert was generated against incomplete data, or the rule misfired against a known-good entity.

The second category is the actual false positive. The first is just compliance doing its job. Conflating them produces a number that's both alarming and useless.

## A five-question audit

Run this against your current platform:

1. **Can you tag every alert disposition with a structured reason?** ("Resolved, known good," "Resolved, incomplete data," "Resolved, rule misfired," "Escalated.") If your reasons are free-text, your false positive rate is unknowable.
2. **Can you slice the disposition reasons by rule?** A program-wide false positive rate is too coarse to act on. Per-rule rates are the unit of action.
3. **Can you see disposition reasons over time?** A rule that was 30% useful six months ago and is 5% useful today is your top tuning candidate.
4. **Do you have shadow runs for proposed tunings?** Tuning a live rule blind is malpractice. Shadow the tuning against the same window first.
5. **Is the tuning history itself auditable?** Every rule change should appear in your audit log with the analyst, the date, the parameters before, and the parameters after.

## The takeaway

If you can answer "yes" to all five, you're in the top 20% of programs we see. If you can't, the false positive tax is real, and it's mostly invisible because nobody is measuring the right thing.

The good news: every one of these is a deliberate platform choice, not a fundamental constraint. We made these choices in CompSync for a reason.
