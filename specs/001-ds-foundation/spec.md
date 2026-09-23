# Feature Specification: Design System Foundation Tokens

**Feature Branch**: `001-ds-foundation`

**Created**: 2026-09-23

**Status**: Draft

**Input**: User description: "Creiamo la foundation semplice del design system, i design tokens li mettiamo in src/index.css dentro :root. Spacing scale (--space-*) da Figma (px → rem base 16). Colori semantici globali (--global-*) e highlight (--highlight-*). Typography (--font-*) con Inter come body font. Test Vite/Vitest per verificare disponibilità token."

## Clarifications

### Session 2026-09-23

- Q: How should Inter be delivered to the page? → A: Google Fonts CDN (preconnect + stylesheet, `display=swap`); document in code that CDN usage is only for this technical take-home test.
- Q: Should this feature also apply foundation tokens to the base page styles, or only publish the tokens? → A: Tokens on `:root` plus base wiring: `body` uses `color: var(--global-foreground)`, `background-color: var(--global-background)`, and `font-family: var(--font-family-body)` with a sans-serif fallback; universal `*:focus-visible { outline: var(--global-primary); }`.
- Q: How should automated tests verify rem-based token values (spacing and font scales)? → A: Presence only — tests assert required CSS custom properties exist on `:root`; they MUST NOT assert token values.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Publish core design tokens (Priority: P1)

A product builder (or future Tabs/Badge author) opens the design system stylesheet and finds a complete, named set of foundation tokens for spacing, semantic colors, highlight colors, and typography so they can style components without hardcoding raw values.

**Why this priority**: Without a shared token foundation, every component invents its own values and drifts from the Figma design system.

**Independent Test**: Inspect the published token set on the document root; every required token name resolves to the expected value. No component UI required.

**Acceptance Scenarios**:

1. **Given** the design system styles are loaded, **When** a consumer reads spacing tokens `--space-0` through `--space-2xl`, **Then** each matches the Figma spacing scale converted to rem (base 16).
2. **Given** the design system styles are loaded, **When** a consumer reads `--global-foreground`, `--global-background`, `--global-primary`, and `--global-contrast`, **Then** values are `#1B2134`, `#FFFFFF`, `#1B2134`, and `#C4C5CF` respectively.
3. **Given** the design system styles are loaded, **When** a consumer reads `--highlight-green` and `--highlight-red`, **Then** values are `#B1FFC7` and `#FFBFB1` respectively.
4. **Given** the design system styles are loaded, **When** a consumer reads typography tokens, **Then** `--font-scale-m` is `0.875rem` (14px), `--font-scale-s` is `0.75rem` (12px), `--font-lh` is `1.5`, and `--font-family-body` includes Inter.

---

### User Story 2 - Base page chrome uses foundation tokens (Priority: P2)

A reviewer opens the app and sees page chrome driven by foundation tokens: Inter body type, global foreground/background colors, and a primary-colored focus-visible outline — with Inter loaded without unnecessarily blocking first paint.

**Why this priority**: Tokens alone are invisible; wiring `body` and focus styles proves the foundation works and removes placeholder styles.

**Independent Test**: Load the entry page; body color/background/font resolve through the global and font tokens; a focused control shows outline using `--global-primary`; Inter loads via the agreed CDN pattern.

**Acceptance Scenarios**:

1. **Given** the application entry is loaded, **When** body text is rendered, **Then** `body` uses `color: var(--global-foreground)`, `background-color: var(--global-background)`, and `font-family: var(--font-family-body)` (Inter plus a sans-serif fallback), and the effective typeface includes Inter from [Google Fonts — Inter](https://fonts.google.com/specimen/Inter).
2. **Given** a cold load of the entry page, **When** fonts are requested, **Then** Inter loads from the Google Fonts CDN with preconnect and non-blocking text rendering (`display=swap` or equivalent), and the load path is marked in code as take-home-only.
3. **Given** a focusable control receives keyboard focus, **When** the `:focus-visible` state applies, **Then** its outline uses `var(--global-primary)`.

---

### User Story 3 - Automated guard that tokens stay available (Priority: P1)

A maintainer runs the project test suite and gets a failing result if any required foundation token is missing from `:root`, so token deletions cannot silently ship.

**Why this priority**: Constitution requires Vitest coverage for contracts; tokens are the foundation for all later components.

**Independent Test**: Run the automated test suite; presence checks pass when all required custom properties exist on `:root` and fail when any required name is absent. Values are not asserted by tests.

**Acceptance Scenarios**:

1. **Given** all required foundation tokens are defined on `:root`, **When** the test suite runs, **Then** token presence checks pass.
2. **Given** a required token custom property is missing from `:root`, **When** the test suite runs, **Then** the presence check fails with a clear indication of which token name is missing.

---

### Edge Cases

- Spacing token `0` MUST still be published (`--space-0: 0`) so consumers can zero out spacing intentionally.
- Only semantic globals (`--global-*`) and highlights (`--highlight-*`) are in scope for color — no extra primitive/palette color layers in this feature.
- Existing placeholder root variables (`--background`, `--content`) MUST NOT remain as competing sources of truth; foundation tokens replace them for DS use.
- Font loading MUST degrade gracefully (system sans fallback remains readable if Inter is slow or blocked).
- Focus outline styling applies via `:focus-visible` only (not plain `:focus`), using `--global-primary`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST publish foundation design tokens as CSS custom properties on `:root` in the global entry stylesheet (`src/index.css`).
- **FR-002**: System MUST publish the full Figma spacing scale as `--space-*` tokens, with pixel values converted to rem using root base 16:

  | Token | Figma name | Source (px) | Published value |
  |-------|------------|-------------|-----------------|
  | `--space-0` | 0 | 0 | `0` |
  | `--space-4xs` | 4XS | 2 | `0.125rem` |
  | `--space-3xs` | 3XS | 4 | `0.25rem` |
  | `--space-2xs` | 2XS | 8 | `0.5rem` |
  | `--space-xs` | XS | 12 | `0.75rem` |
  | `--space-s` | S | 16 | `1rem` |
  | `--space-m` | M | 20 | `1.25rem` |
  | `--space-l` | L | 24 | `1.5rem` |
  | `--space-xl` | XL | 32 | `2rem` |
  | `--space-2xl` | 2XL | 48 | `3rem` |

  Source: [Figma Spacings](https://www.figma.com/design/OclakAGLSXDoMKLFvwLNMP/%F0%9F%92%BB-Design-System-Home-Test---Tabs-Component?node-id=49-2852&m=dev).

- **FR-003**: System MUST publish semantic global colors only (no non-semantic color primitives in this feature):
  - `--global-foreground: #1B2134`
  - `--global-background: #FFFFFF`
  - `--global-primary: #1B2134`
  - `--global-contrast: #C4C5CF`
- **FR-004**: System MUST publish highlight colors:
  - `--highlight-green: #B1FFC7`
  - `--highlight-red: #FFBFB1`
- **FR-005**: System MUST publish typography tokens:
  - `--font-scale-m: 0.875rem` (from 14px)
  - `--font-scale-s: 0.75rem` (from 12px)
  - `--font-lh: 1.5`
  - `--font-family-body` set to the Inter family name (sans-serif fallback applied on `body`, not inside the token value)
- **FR-006**: System MUST load Inter for page body text via the Google Fonts CDN using preconnect plus a stylesheet with `display=swap` (or equivalent non-blocking text rendering). An adjacent code comment MUST state that CDN hosting is acceptable only for this technical take-home test (not a production pattern to copy blindly).
- **FR-007**: Automated tests (Vitest) MUST assert that every required foundation token from FR-002–FR-005 is present as a CSS custom property on `:root` after styles load. Tests MUST NOT assert token values (correct values remain a source/spec review concern).
- **FR-008**: Foundation work MUST stay within handcrafted CSS (no Tailwind or CSS utility frameworks), per project constitution.
- **FR-009**: System MUST apply foundation tokens on the base page:
  - `body` MUST set `color: var(--global-foreground)`, `background-color: var(--global-background)`, and `font-family: var(--font-family-body), <sans-serif fallback>`
  - Universal rule `*:focus-visible { outline: var(--global-primary); }` MUST be present so keyboard focus uses the primary semantic color

### Key Entities

- **Design token**: Named CSS custom property on `:root` with a fixed contract value (spacing, color, or typography).
- **Spacing scale**: Ordered set of `--space-*` steps sourced from Figma Spacings.
- **Semantic global color**: `--global-*` role mapped to a hex value for foreground/background/primary/contrast.
- **Highlight color**: `--highlight-*` accent used for status/emphasis (green/red).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of required tokens (10 spacing + 4 global + 2 highlight + 4 typography = 20) are available to consumers after styles load.
- **SC-002**: Spacing and font-size tokens use rem (not px) for all non-zero length values derived from the Figma px sources.
- **SC-003**: A reviewer can confirm Inter as the body typeface on the entry experience without installing fonts manually, with body foreground/background driven by `--global-*` tokens.
- **SC-004**: The automated test suite fails within one run if any required token name is missing from `:root` (value correctness is out of scope for automated checks).
- **SC-005**: No non-semantic color token families beyond `--global-*` and `--highlight-*` are introduced by this feature.
- **SC-006**: Keyboard focus on interactive elements shows an outline colored with the primary global token (`--global-primary`).

## Assumptions

- Rem conversion uses a 16px root base (`px / 16`), as specified by the requester.
- Token naming uses lowercase kebab suffixes matching Figma step names (`4xs`, `3xs`, `2xs`, `xs`, `s`, `m`, `l`, `xl`, `2xl`).
- Color scope is intentionally limited to semantic globals + highlights; primitive palettes and component-specific tokens are out of scope.
- Tabs/Badge components are out of scope for this feature; they will consume these tokens in later work.
- “Test Vite” means Vitest tests in the existing Vite-based project (constitution stack), not a separate Vite plugin.
- Inter is loaded from the Google Fonts CDN (preconnect + `display=swap`), with an explicit comment that this CDN choice is only for this technical take-home test.
- Automated token tests check presence of required custom properties on `:root` only; they do not lock hex/rem/unitless values.
- Placeholder `:root` variables currently in `src/index.css` (`--background`, `--content`) are superseded by the foundation token set for design-system styling.
- Base page chrome in this feature is limited to token-backed `body` color/background/font-family and the shared `:focus-visible` outline; other layout rules (grid centering, large demo `font-size`, etc.) may be simplified or removed as needed so placeholders do not fight the foundation.
