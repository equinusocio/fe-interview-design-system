# Implementation Plan: Tabs Component

**Branch**: `003-tabs-component` | **Date**: 2026-09-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-tabs-component/spec.md`

## Summary

Ship a composable, APG-compliant Tabs design-system primitive (`Root`, `List`,
`Tab`, `Viewport`, `Panel`) with Root-level `pill` | `underline` variants,
consumer `selected` on Tab for default selection, `addon` ReactNode after the
label, CSS anchor-positioned underline indicator, responsive List/Tab spacing
from Figma node `47-2303` (token pairs recorded in research), Storybook coverage,
and Vitest tests for every public part plus integration. Raw React only; RSC-safe
composition (client boundary at Root without changing the compound tree).

## Technical Context

**Language/Version**: TypeScript (strict) + CSS Modules; Node `>=24`

**Primary Dependencies**: React 19, Vite 8, Storybook 10, Vitest 5, Testing Library,
clsx (existing)

**Storage**: N/A

**Testing**: Vitest + Testing Library + user-event; suites under `test/` for all
five parts + integration

**Target Platform**: Modern evergreen browsers (anchor positioning with static
fallback)

**Project Type**: Single-package React design-system take-home

**Performance Goals**: Selection updates without remounting inactive panels or
the full tree; panels stay mounted+hidden

**Constraints**: Handcrafted CSS; foundation tokens; `@media (width > 48em)`;
APG Tabs; no headless Tabs kits; `authoring-react` / `authoring-css` / `a11y`
skills; automatic activation; silent first-match on bad values

**Scale/Scope**: One `tabs/` folder (compound parts + CSS module + stories) +
`test/tabs*.test.tsx`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Design-System Reusability | PASS | Compound public API; Badge via `addon` |
| II. Accessibility First | PASS | APG tablist/tab/tabpanel + keyboard |
| III. Handcrafted Styles | PASS | CSS module; tokens; no Tailwind |
| IV. Raw React Composition | PASS | Project-owned context + parts |
| V. Verify with Tests and Stories | PASS | `test/` + Storybook |

**Post-design re-check**: PASS — structure stays within constitution stack.

## Project Structure

### Documentation (this feature)

```text
specs/003-tabs-component/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── tabs.md
└── tasks.md
```

### Source Code (repository root)

```text
src/components/tabs/
├── index.ts
├── tabs.tsx                 # namespace assembly + Root
├── tabs-list.tsx
├── tabs-tab.tsx
├── tabs-viewport.tsx
├── tabs-panel.tsx
├── tabs-context.ts
├── tabs.module.css
└── tabs.stories.tsx
test/
├── tabs.test.tsx            # integration + all parts
└── …
```

## Complexity Tracking

| Violation | Why needed | Simpler alternative rejected because |
|-----------|------------|--------------------------------------|
| Compound multi-file API | Spec + RSC composition contract | Single `<Tabs items={…}>` breaks required composition |
| CSS anchor positioning | Spec FR-004 | JS measure/transform adds runtime cost and RSC friction |
