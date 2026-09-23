# Implementation Plan: Badge Component

**Branch**: `002-badge-component` | **Date**: 2026-09-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-badge-component/spec.md`

## Summary

Ship a reusable presentational `Badge` React component with `children` and
`variant` (`neutral` | `positive` | `negative`, default `neutral`), styled from
foundation tokens to match Figma node `47-677`, including mobile/desktop padding,
radius, rounded max-height, and no text wrap. Add Storybook stories for all
variants and Vitest + Testing Library contract tests under `test/`.

## Technical Context

**Language/Version**: TypeScript (strict) + CSS; Node `>=24`

**Primary Dependencies**: React 19, Vite 8, Storybook 10, Vitest 5, Testing Library
(existing boilerplate)

**Storage**: N/A

**Testing**: Vitest + Testing Library + jest-dom; Badge contract tests under
`test/**/*.test.{ts,tsx}`

**Target Platform**: Modern evergreen browsers (Storybook + Vite app)

**Project Type**: Single-package React design-system take-home

**Performance Goals**: Negligible; static presentational primitive

**Constraints**: Handcrafted CSS only (no Tailwind); foundation tokens only for
spacing/color/typography; mobile-first `@media (width > 48em)`; CSS `round()` on
max-height; `authoring-css` + `authoring-react` skills; raw React (no UI kits)

**Scale/Scope**: One component folder + CSS module + stories + one test file

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Design-System Reusability | PASS | Independently importable Badge with typed variants |
| II. Accessibility First | PASS | Presentational label; no fake button role; inherits focus only if children focusable |
| III. Handcrafted Styles | PASS | Co-located CSS module; token-backed; no utility frameworks |
| IV. Raw React Composition | PASS | Project-owned `React.FC` component; no headless kits |
| V. Verify with Tests and Stories | PASS | `test/badge.test.tsx` + `src/**/*.stories.*` |

**Post-design re-check**: PASS — structure stays within constitution stack and skills.

## Project Structure

### Documentation (this feature)

```text
specs/002-badge-component/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── badge.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── index.css                          # foundation tokens (dependency)
├── components/
│   └── badge/
│       ├── index.ts                   # public exports
│       ├── badge.tsx                  # Badge component
│       ├── badge.module.css           # token-backed styles + responsive recipe
│       └── badge.stories.tsx          # Storybook variants
.storybook/
└── preview.ts                         # import foundation CSS for stories
test/
└── badge.test.tsx                     # children + variant contract
```

**Structure Decision**: Follow `authoring-react` filesystem (kebab folder,
`index.ts`, co-located module CSS + stories). Tests under `test/` per
constitution. Storybook preview loads `src/index.css` so tokens resolve in
stories.

## Complexity Tracking

> No constitution violations requiring justification.
