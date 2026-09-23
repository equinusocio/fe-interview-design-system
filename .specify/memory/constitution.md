<!--
Sync Impact Report
- Version change: 1.0.0 → 1.1.0
- Modified principles:
  - V. Verify with Tests and Stories (test path: `test/**/*.test.*`)
- Added sections:
  - Technology Stack & Constraints → Viewport breakpoint (mobile / desktop)
- Removed sections: none
- Follow-up TODOs: none
-->

# FE Interview Design System Constitution

## Core Principles

### I. Design-System Reusability

Tabs (and related primitives such as Badge) MUST be built as reusable Design
System building blocks, not one-off page widgets. Public APIs MUST expose
variants and composition hooks that match the Figma brief: Tabs variants,
optional Badge on a Tab via Tab API, and selectable Badge variants. Components
MUST be independently importable, typed, and free of app-specific coupling so
they can grow into a larger system.

Rationale: Take-home goal is a DS-ready Tabs component; acceptance stories are
API and variant contracts, not a demo page alone.

### II. Accessibility First (NON-NEGOTIABLE)

Interactive components MUST follow WAI-ARIA Authoring Practices for their
pattern (Tabs: tablist / tab / tabpanel, keyboard activation, focus management,
selected/disabled states). Semantics MUST prefer correct native roles and
relationships over decorative markup. Visual designs from Figma MUST NOT
sacrifice operable keyboard or screen-reader behavior. Accessibility regressions
MUST be treated as blocking defects.

Rationale: Brief explicitly requires accessible, best-practice front-end work;
a11y is part of the product contract, not a polish pass.

### III. Handcrafted Styles

Styling MUST be authored from scratch. Tailwind and other CSS utility/framework
libraries MUST NOT be introduced. Allowed approaches: plain CSS, SCSS/Sass
(already in the toolchain), or CSS-in-JS written for this project. Design tokens
SHOULD use CSS custom properties for color, spacing, and typography so variants
stay consistent. Visual fidelity MUST track the Figma Design System Tabs file.

Rationale: Interview restriction forbids CSS frameworks; Sass is preinstalled
and is the preferred preprocessor when CSS modules or component sheets need
nesting.

### IV. Raw React Composition

React UI MUST be a raw implementation: no headless UI kits, component libraries,
or Tabs primitives that own behavior (e.g. Radix Tabs, Reach, MUI). React and
React DOM from the project dependencies are the only UI runtime. State,
keyboard handling, and ARIA wiring MUST live in project-owned code. TypeScript
strict mode MUST remain on; public props MUST be explicitly typed.

Rationale: Brief requires a raw React implementation to demonstrate ownership of
behavior and API design.

### V. Verify with Tests and Stories

Behavior and accessibility contracts MUST be covered by Vitest + Testing Library
tests under `test/**/*.test.{ts,tsx}`. Storybook MUST showcase variants, Badge
integration, and key states so reviewers can evaluate without reading only
source. Stories live under `src/**/*.stories.*` per existing Storybook config.
Tests and stories MUST stay aligned with the public component API.

Rationale: Boilerplate ships Vitest, Testing Library, and Storybook; delivery is
a public repo that shows features clearly for review and pair programming.
Suites live in a dedicated `test/` directory.

## Technology Stack & Constraints

The constitution binds work to this boilerplate unless Governance amends it:

- **Package manager / runtime**: `pnpm` (declared `packageManager`); Node `>=24`
- **App shell**: Vite 8 + `@vitejs/plugin-react-swc`; entry `src/index.tsx`
- **UI**: React 19 + React DOM; TypeScript strict (`tsc -b`)
- **Styles**: handcrafted CSS/SCSS (Sass available); no Tailwind/CSS frameworks
- **Docs / showcase**: Storybook 10 (`@storybook/react-vite`, addon-docs)
- **Tests**: Vitest (`jsdom`, `src/setupTests.ts` + jest-dom), Testing Library;
  test files under `test/`
- **Lint / format**: Biome (`pnpm check` / `pnpm check:fix`)
- **Design source of truth**:
  [Figma — Design System Home Test — Tabs](https://www.figma.com/design/OclakAGLSXDoMKLFvwLNMP/%F0%9F%92%BB-Design-System-Home-Test---Tabs-Component?node-id=0-1)
- **Out of scope for stack**: forking the upstream interview template as the
  delivery artifact; delivery MUST be an original public repository link

### Viewport breakpoint (mobile / desktop)

Responsive layout MUST be **mobile-first**. The single project breakpoint:

| Name | Condition | Source |
|------|-----------|--------|
| Desktop | `@media (width > 48em)` | 768px ÷ 16 |

- **48em** is the canonical desktop threshold (768px at a 16px root).
- Components and feature styles MUST reuse this exact condition when a
  mobile/desktop split is required — do not invent alternate pixel/em cutoffs.
- MUST NOT publish a `--breakpoint-*` (or similar) CSS custom property for this
  value: `var()` is invalid in `@media` and `@container` size conditions, so a
  token cannot drive the query.
- MUST NOT rely on `html { container: root / normal }` for viewport switching:
  `normal` does not enable size queries; even with `inline-size` / `size`, the
  condition still cannot use `var()`.
- The global foundation sheet (`src/index.css`) MUST NOT own empty/global
  breakpoint scaffolding; apply `@media (width > 48em)` only where a component
  or feature actually needs desktop overrides.

Scripts used as quality entrypoints: `pnpm dev`, `pnpm storybook`,
`pnpm test`, `pnpm tsc`, `pnpm check`, `pnpm build-storybook`.

## Delivery & Quality Gates

Before considering the take-home complete:

1. Acceptance user stories MUST be demonstrable (Tabs variants; Badge via Tab
   API; Badge variants via Tab API).
2. `pnpm test`, `pnpm tsc`, and `pnpm check` MUST pass.
3. Storybook MUST document primary variants and Badge compositions.
4. README (or Storybook intro) MUST explain API usage and how to run the project.
5. Delivery MUST be a public GitHub repository URL containing the full solution
   (do not submit a fork of the starter as the sole artifact).

Complexity beyond the brief MUST be justified; prefer a clear Tabs + Badge API
over speculative Design System expansion.

## Governance

This constitution supersedes informal practice for this repository. Spec Kit
artifacts (`spec.md`, `plan.md`, `tasks.md`) and implementation MUST comply; on
conflict, amend this document first.

**Amendments**: document the change, bump `CONSTITUTION_VERSION` using semver
(MAJOR: principle removal/redefinition; MINOR: new principle or material
guidance; PATCH: clarification), set **Last Amended** to the amendment date
(ISO `YYYY-MM-DD`), and record impact in the Sync Impact Report comment.

**Compliance**: reviews and Spec Kit analyze/implement passes MUST verify
principles I–V and stack constraints. Unjustified use of CSS frameworks,
non-raw Tabs libraries, or inaccessible patterns MUST be rejected.

**Guidance**: follow project agent skills for a11y, React authoring, and CSS
authoring when present under `.agents/skills` / `.claude/skills`; they refine
practice but MUST NOT contradict this constitution.

**Version**: 1.1.0 | **Ratified**: 2026-09-23 | **Last Amended**: 2026-09-23
