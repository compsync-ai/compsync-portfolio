# Adding A New BSA/AML Rule Entry

This site is static. To add another rule, a developer manually updates the shared rule data file and, only if needed, the navigation text.

## Primary file

- Rule content lives in `src/data/bsaAmlDocumentation.js`
- Documentation page layout lives in `src/pages/DocumentationPage.vue`
- Documentation page styling lives in `src/assets/styles/documentation.css`

## Current structure

The page reads from the exported `ruleSections` array in `src/data/bsaAmlDocumentation.js`.

The UI has two accordion levels:

- A section is the outer accordion container.
- A rule is the inner accordion container inside a section.
- When a section is opened, its first rule opens automatically.

Each section object uses this shape:

```js
{
  id: "cash-and-structuring",
  title: "Cash And Structuring Monitors",
  summary: "Short section introduction.",
  rules: [/* rule objects */]
}
```

Each rule object uses this shape:

```js
{
  id: "cash-transaction-monitor",
  title: "Cash Transaction Monitor",
  coverage: "What behavior is covered.",
  implementation: "How CompSync would implement the rule.",
  thresholdLabel: "Common threshold",
  thresholdValue: "Single cash transaction > $10,000",
  thresholds: [
    "Threshold example 1",
    "Threshold example 2"
  ]
}
```

## Steps to add a rule

1. Open `src/data/bsaAmlDocumentation.js`.
2. Find the section where the new rule belongs.
3. Add a new rule object inside that section's `rules` array.
4. Give the rule a unique `id`. This becomes the HTML anchor for the section.
5. Keep all fields populated so the page layout remains visually consistent.
6. If the rule belongs in a new section, add a new section object using the same structure shown above.
7. Keep the first rule in a new section as the strongest or most representative example, because it will auto-open when the section is expanded.
8. Run the build to confirm there are no syntax issues.

## Content writing guidance

- Keep `coverage` concise. It should explain what the monitor covers in plain language.
- Keep `implementation` focused on how the rule is expected to work in the platform.
- Use `thresholdValue` for the most visible threshold summary.
- Use `thresholds` for the alert logic, numeric examples, and review windows.
- Keep list items short enough to scan quickly on the page.
- Prefer putting the clearest threshold number or time window in `thresholdValue`.
- Use `thresholds` for more detailed examples, conditional logic, and dynamic threshold notes.

## When to update `src/pages/DocumentationPage.vue`

Normally, you do not need to change `src/App.vue` when adding a rule. `src/App.vue` only decides whether to show the landing page or the documentation page based on the URL path.

Only update `src/pages/DocumentationPage.vue` if:

- the page needs a new section type
- the visual layout of every rule entry needs to change
- a new field should be rendered for every rule

If you add a new field to every rule object, update both:

- `src/data/bsaAmlDocumentation.js`
- the matching render block in `src/pages/DocumentationPage.vue`

## How the page renders today

- The section summary is always visible when the section is expanded.
- A closed rule shows only the rule title and short coverage description.
- An open rule shows:
  - `Implementation`
  - `Threshold Logic`
  - the threshold chip on the right side of the threshold logic area
- The threshold chip is hidden when the rule is collapsed.

## Adding a new section

Use a new section only when the rules belong to a clearly different monitoring theme.

Examples:

- `Cash And Structuring Monitors`
- `Movement And Behavioral Monitors`

When adding a new section:

1. Add a new section object to `ruleSections`.
2. Add at least one rule inside `rules`.
3. Make sure the section `id` is unique.
4. Keep the section title short enough to scan in the accordion header.

## Recommended developer checklist

- New rule `id` is unique
- The rule is placed in the correct section
- New section `id` is unique if a new section was added
- All arrays contain at least one item
- Copy is written in the same tone as the existing documentation
- `npm run build` passes
