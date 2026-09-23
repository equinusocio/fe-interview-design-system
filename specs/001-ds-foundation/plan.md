# Implementation Plan: Design System Foundation Tokens

**Branch**: `001-ds-foundation` | **Date**: 2026-09-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-ds-foundation/spec.md`

## Summary

Publish foundation design tokens (spacing, semantic globals, highlights, typography)
as CSS custom properties on `:root` in `src/index.css`, wire base `body` +
`:focus-visible` chrome to those tokens, load Inter via Google Fonts CDN
(take-home-only comment), and add Vitest presence checks for all required
custom properties on `:root`.

## Technical Context

**Language/Version**: TypeScript (strict) + CSS; Node `>=24`

**Primary Dependencies**: React 19, Vite 8, Vitest 5, jsdom (existing boilerplate)

**Storage**: N/A (static CSS tokens)

**Testing**: Vitest + Testing Library + jest-dom; token presence tests under
`src/**/*.test.{ts,tsx}`

**Target Platform**: Modern evergreen browsers (Storybook + Vite app)

**Project Type**: Single-package React design-system take-home (frontend library/app)

**Performance Goals**: Non-blocking Inter load (`display=swap` + preconnect)

**Constraints**: Handcrafted CSS only (no Tailwind); tokens on `:root` in
`src/index.css`; rem base 16; tests assert presence only (not values); CDN
Inter only for this technical test (commented)

**Scale/Scope**: 20 foundation tokens + base chrome + one presence test file

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Design-System Reusability | PASS | Tokens are reusable DS building blocks for later Tabs/Badge |
| II. Accessibility First | PASS | `:focus-visible` outline uses `--global-primary` |
| III. Handcrafted Styles | PASS | Plain CSS custom properties; no utility frameworks |
| IV. Raw React Composition | PASS | No UI kits; entry remains raw React |
| V. Verify with Tests and Stories | PASS | Vitest presence tests required; Storybook not required for this token-only feature |

**Post-design re-check**: PASS — design stays within CSS tokens + Vitest; no stack violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-ds-foundation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── tokens.md
└── tasks.md
```

### Source Code (repository root)

```text
index.html                 # Google Fonts preconnect + stylesheet (+ take-home comment)
src/
├── index.css              # :root tokens + body + *:focus-visible
├── index.tsx              # imports index.css (unchanged entry pattern)
├── setupTests.ts
└── tokens.test.ts         # presence checks for required custom properties
```

**Structure Decision**: Keep tokens in the existing global entry stylesheet
(`src/index.css`) per spec FR-001. Font CDN links live in `index.html` for
performant preconnect. Tests colocated under `src/` per Vitest/`constitution`
convention (`src/**/*.test.{ts,tsx}`).

## Complexity Tracking

> No constitution violations requiring justification.
